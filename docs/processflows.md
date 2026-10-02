# eLearny — Process Flows & User Journeys (processflows.md)

> Status: **v1.3 — living document, fresh-start reset.** Governs end-to-end user
> journeys, system workflows, state transitions, API endpoint sequences, and
> cross-page navigation links across all 5 user roles (`Student`, `Instructor`,
> `Teaching Assistant`, `Admin`, `Super Admin`).
> eLearny is high-level and large-scale by design — **not a demo or MVP**.
> All flows enforce **100% Web & Mobile Feature Parity within their own tier**,
> High Content Density, Zero Deprecation Warning Policy, and AI Development
> Double-Check Guardrails.
> **Flows are now tagged `[V1]` or `[V2]` per `prd.md` §0 / `phases.md` v0.9.**
> No code exists yet — see `memory.md` for live state. These flows are the
> target behavior, not something already built.

---

## 1. Master End-to-End User Journeys

> ⚠️ **Note**: These master process flows define the core operational foundation
> of the eLearny LMS Platform. They are living, expandable architectures that
> encompass the complete lifecycle for Students, Instructors, and Admins.
> **The steps below are V1 only** — V2 additions (Judge0 practice sandbox,
> TA-scoped workflows, office hours, camera proctoring) are described in
> §2 with their own tags, not folded into the master journeys until they ship.

### 🎓 Master Flow 01: Complete Student End-to-End Journey `[V1]`
```
[1. Registration] ──► [1b. Email OTP Verification] ──► [2. Login] ──► [3. Explore Catalog] ──► [4. Checkout & Payment]
       │
       ▼
[5. Interactive Player] ──► [6. Quizzes & Timed Exams] ──► [7. Completion & Verified Certificate]
```
1. **Student Registration (`/auth/register`)**:
   - Enforces strict live regex validation:
     - **Username**: `/^[a-zA-Z0-9]{3,20}$/` (alphanumeric only, 3-20 chars). Red error message rendered when regex fails.
     - **Email**: Standard RFC email regex (`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`). Red error text rendered when invalid.
     - **Password**: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character (`!@#$%^&*`). Live requirement checklist.
   - `POST /api/v1/auth/register` creates `User` (role `STUDENT`, `emailVerified=false`) and triggers a 6-digit OTP email via Gmail SMTP.
1b. **Email OTP Verification (`/auth/verify-email`)** -- new in v1.3, per `prd.md` SS3.26:
   - `POST /api/v1/auth/verify-email` checks the entered 6-digit code against the stored (hashed) OTP and its expiry (10 min). On success, sets `emailVerified=true`. Wrong code shows an inline error without revealing whether the email itself was wrong (avoids account enumeration). Expired code shows an explicit "request a new one" message. `POST /api/v1/auth/resend-otp` is rate-limited (60s cooldown) to prevent email-bombing.
   - **Login is blocked until this step completes** -- this is the actual enforcement mechanism, not just a UI suggestion.
2. **Student Authentication (`/auth/login`)**:
   - `POST /api/v1/auth/login` verifies credentials, issues Access + Refresh JWT tokens, displays feedback toast, and routes directly to the **Student Dashboard** (`/dashboard` on Web, `/(tabs)/dashboard` on Mobile).
3. **Course Exploration & Taxonomy (`/courses`)**:
   - Search & filter by category, difficulty level, rating, and price.
4. **Course Purchase & Dual-Mode Checkout (`/checkout/[id]`)**:
   - Coupon validation (`ELEARNY20` for $10 off), Dual-Mode payment gateway (eLearny Sandbox 1-click test checkout OR Razorpay Test Mode API), signed webhook signature verification (`/api/v1/webhooks/razorpay`), and instant enrollment creation.
5. **Interactive Course Player (`/my-courses/[id]`)**:
   - Cloudflare R2 presigned video streaming, collapsible section/lesson curriculum drawer, lesson completion checkmarks, and student private notes drawer.
6. **Quizzes & Timed Exams (`/exams/[id]/attempt`)**:
   - Timed quiz/exam attempts, question/option randomization, browser-level violation logging (full-screen exit, tab-switch, copy/paste), and server-side automated grading. **Corrected in v1.2**: this step previously referenced Judge0 code-execution submissions here — that belongs to the separate Practice & Content Hub (`prd.md` §3.13), which is **V2** (Phase V2-B), not part of the V1 exam flow. Removed to avoid implying Judge0 is a V1 dependency.
7. **Course Completion & Verified Certificate (`/certificates`)**:
   - Recalculates overall course progress to 100%. Generates verified PDF certificate with unique credential ID and verification page/QR code.

---

### 📖 Master Flow 02: Complete Instructor & Admin Authoring/Governance Journey `[V1]`
```
[1. Instructor Application] ──► [2. Admin Approval] ──► [2b. Invite-and-Activate] ──► [3. Course Creator Wizard]
       │
       ▼
[4. Curriculum & Drip Builder] ──► [5. Publication & Catalog] ──► [6. Grading & Student Remarks]
```
1. **Instructor Application (`/instructor/apply`)**:
   - Prospective teachers submit bio, years of experience, primary expertise tags, portfolio URL, and resume PDF link. (No separate instructor registration toggle).
2. **Admin Review Queue (`/admin/instructor-applications`)**:
   - Admin inspects applications. 1-Click **"Approve"** creates the `User` account (role `INSTRUCTOR`) with **no password set yet** -- see step 2b. **Corrected in v1.3**: this step previously said approval "provisions their teaching credentials automatically," which implied instant, unverified access. It doesn't -- see prd.md SS3.26.
2b. **Instructor Invite-and-Activate (`/instructor/setup-account?token=...`)** -- new in v1.3, per `prd.md` SS3.26:
   - Approval generates a single-use, time-limited setup token and a 6-digit OTP, both emailed to the applicant's address via Gmail SMTP. The instructor must open the link AND enter the correct OTP before choosing a username and setting a password -- the link alone does not grant access, so a forwarded/leaked email can't hijack the account. Only after this completes can the instructor log in and reach the Course Creator Wizard.
3. **Course Creation Wizard (`/instructor/courses/create`)**:
   - Step 1 course metadata wizard: Title, tagline, category, difficulty level, USD price, thumbnail URL, and promo video.
4. **Curriculum & Drip Release Builder (`/instructor/courses/[id]/builder`)**:
   - Step 2 module manager: Sections, HD video stream uploads, PDF documents, timed quizzes, and drip release delays (`drip_delay_days`).
5. **Course Publication & Catalog Listing**:
   - Course submitted to admin quality check. Upon approval, status updates to `PUBLISHED` and lists in public catalog.
6. **Enrolled Student Management & Feedback Remarks (`/instructor/students`)**:
   - Instructors inspect enrolled student progress, review submitted exam attempts, grade responses, and provide personalized written feedback and performance remarks.

---

### 🔥 Master Flow 03: Gamification Loop `[V1 — new in v1.2, added to match Phase 6]`
```
[1. Lesson/Quiz Completion] ──► [2. Streak Evaluation] ──► [3. XP Award] ──► [4. Badge/Leaderboard Update]
```
1. Student completes a lesson or passes a quiz → progress event fires.
2. Backend evaluates the daily streak: extends it, or — if a streak-freeze
   power-up is active — protects it from breaking instead of resetting to zero.
3. XP is awarded per the economy's point rules; milestone badges unlock at
   XP/streak thresholds.
4. Top-3 podium leaderboard (`/leaderboard`) recalculates; an opt-in setting
   controls whether the student appears on it (never forced public ranking).

### 🤖 Master Flow 04: AI Chatbot Q&A `[V1 — new in v1.2, added to match Phase 7]`
```
[1. Student Message] ──► [2. Intent Check] ──► [3a. Rule-Based Suggestion] or [3b. LLM Q&A] ──► [4. Response]
```
1. Student sends free text via the chatbot widget (`/chatbot`).
2. Backend checks intent: does this look like a course-suggestion query?
3a. If yes → answered from the rule-based recommendation engine (Phase 4's
   discovery engine), zero LLM cost.
3b. If no → per-user rate limit checked first, then Gemini Flash / Groq called
   server-side with a scoped system prompt (platform FAQs + catalog context
   only, not open-ended general knowledge).
4. If quota is exhausted, a graceful fallback message is returned — the
   frontend never sees a raw provider error.

---

## 2. V2 Flows (sequenced after V1 launch)

These flows are real and specified, but depend on V2 modules that don't exist
until after `phases.md` Phase 10 (V1 launch) is verified. Listed here as a
placeholder index rather than expanded in full, so this doc doesn't imply
they're buildable before their V1 dependencies exist:

- **TA Invitation & Scoped Grading** `[V2-A]` — depends on Course Authoring (V1) + Phase V2-A
- **Instructor Leave & Office Hours Booking / Waitlist Promotion** `[V2-A]`
- **Judge0 Code Submission & Execution Queue** `[V2-B]` — depends on Discovery (V1) + Phase V2-B
- **Localization Content Delivery** `[V2-C]`
- **Excel Export Generation** `[V2-D]`
- **Multi-Channel Notification Dispatch (SMS/push)** `[V2-D]`
- **AI-Assisted Quiz/Syllabus Draft Generation** `[V2-E]` — depends on AI Chatbot (V1) + Phase V2-E
- **Referral & Affiliate Attribution** `[V2-E]`
- **Camera-Based Exam Proctoring Session** `[V2-F]`
- **Live Session / Office Hours Video Call** `[V2-G]`

Full step-by-step detail for these gets written when their phase starts, per
`phases.md`'s "no V2 phase begins before Phase 10 is verified" rule — writing
exhaustive flows for unbuilt V2 modules now risks the same drift `architecture.md`
and `pages.md` already have to reconcile against.

---

## Change Log
- **v1.0** — Initial 18 exhaustive process flows covering Auth, Instructor
  Elevation, Authoring/Drip Release, Razorpay Webhook Checkout, Judge0 Sandbox
  Execution Queue, Duolingo Gamification, TA Scoped Operations, Office
  Hours/Waitlists, Audit Logging, and 2-Tier AI.
- **v1.1** — Added Master Flow 01 (Student Journey) and Master Flow 02
  (Instructor Journey) as consolidated end-to-end summaries of the 18 detailed flows.
- **v1.2** — **Fresh-start reset, aligned to `prd.md` v1.0 / `phases.md` v0.9's
  V1/V2 split.** Tagged every flow `[V1]` or `[V2]`. Fixed a real inconsistency:
  Master Flow 01 step 6 referenced Judge0 code-execution submissions inside the
  V1 exam flow, but Judge0/Practice Hub is V2 (Phase V2-B) — removed that
  reference from the V1 flow. Added two new V1 master flows (03: Gamification
  Loop, 04: AI Chatbot Q&A) to match `phases.md`'s new Phase 6/Phase 7, since
  those didn't have consolidated master-flow summaries before. Collapsed the
  previous 18 numbered flows into a V1 section (fully detailed) and a V2 index
  (placeholder only, not expanded) — full V2 flow detail gets written when each
  V2 phase actually starts, not speculatively now.
- **v1.3** — Added email OTP verification as step 1b of Master Flow 01 (registration no longer implies immediate login) and instructor invite-and-activate as step 2b of Master Flow 02 (Admin approval no longer implies instant credential provisioning) per `prd.md` §3.26.
