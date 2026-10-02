# eLearny — Product Requirements Document (prd.md)

> Status: **v1.3 — living document, active migration from `elearny_v0`.**
> As of this version, this is **not** a from-scratch build — see
> `migration.md` for the full migration plan and `memory.md` for the live
> state. Every feature listed below remains **committed scope** for
> eLearny's **All-in-One Flagship LMS Platform** (combining B2C Marketplace
> + Enterprise LMS + Code Execution Sandbox + Gamification + AI Platform)
> using modern, active, non-deprecated package standards — pinned per
> `migration.md` §4: Java 21 LTS, Spring Boot 3.5.8, Next.js 16.3.x, Expo
> SDK 57.
> **Features are tagged `[V1]` or `[V2]` — see §0.** Nothing has been
> cut; V2 features are committed, sequenced-later scope, not "maybe."
> All features explicitly map to process flows in [`processflows.md`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/docs/processflows.md) (Flows 01–18) and UI screen specs in [`pages.md`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/docs/pages.md).
> One explicit, user-requested exception, deferred alongside the Teaching
> Assistant role (§3.17): §3.22 Live Session Office Hours — see its entry
> for why. This document does
> not decide *when* something gets built (that's `phases.md`'s job); it
> only decides *what* eLearny includes. New features still get added here
> explicitly, with a version bump — nothing gets silently dropped either.

---

## 0. Delivery Tiers — V1 vs V2

Everything in this document is committed. The split below is about **sequencing
and honesty**, not scope-cutting: V1 is the platform that must exist, fully working,
before anything else is touched. V2 is real, planned, and documented — just not
required for the platform to be considered a complete, demoable LMS.

**V1 — ships first, is the demo:**
Auth/RBAC (§3 role model, now 6 roles including Course Agent — §2), Course
Authoring core (§3.1, plus platform/Course-Agent courses — §3.1a),
Learning Experience (§3.2), Discovery core (§3.3), Assessment (§3.4, browser-level
integrity only — camera-based proctoring is V2), Certification (§3.5), Commerce
(§3.6), core Governance & Admin including course-catalog moderation/takedown
(§3.7), core Communication — in-app + email only
(§3.8), Community & Engagement (§3.9), **Gamification (§3.10)**, Course Bundling &
Discovery Extensions (§3.11), **Course-Owner Leave & Calendar Management (§3.21 —
promoted from V2; applies to both Instructor and Course Agent, decoupled from Live
Sessions, see §3.21's own note)**, Account Security Hardening (§3.18), core
Trust/Support pages (§3.19), and **AI Assistant Chatbot — both tiers, rule-based
suggestions and LLM-backed general Q&A (§3.15)**.

**V2 — committed, sequenced after V1 ships:**
Localization (§3.12), the Practice & Content Hub / Judge0 sandbox (§3.13), Growth
Mechanics / referral & affiliate (§3.14), AI-Assisted Authoring — quiz/syllabus
generation (§3.16), the Teaching Assistant role and its workflows (§3.17, deferred),
Live Session Office Hours & Waitlists (§3.22, deferred alongside TA),
Excel Reporting (§3.23 — already implemented in the prior codebase, carried forward
via migration, not net-new build work), Multi-Channel Communication beyond
email/in-app — SMS/push (§3.24 — audit-log portion already implemented, carried
forward), advanced GDPR privacy-preference management (§3.25 beyond basic consent
recording and account anonymization, both of which stay V1), and camera-based exam
proctoring (the §3.4 sub-module).

**Mobile parity note for V1:** the "100% web/mobile parity" rule (§13 in `rules.md`)
still applies to V1 features listed above. Admin-only tooling that is itself V2
(Excel export, audit-log inspection UI, TA management) does not need a V1 mobile
build simply because it's admin-facing — its own tier governs it.

---

## 1. What to Build

eLearny is a full-scale, production-grade **Learning Management System (LMS)**
— high-level and large-scale by design, **not a demo or MVP**. It combines a Udemy-style multi-instructor course marketplace, Coursera-style bundled learning paths and certification rigor, a GeeksforGeeks-style free article/practice hub for organic reach, a LeetCode-style code execution sandbox, a Duolingo-style gamification engine, and an AI-assisted layer for discovery, authoring, and support.

Specifically, eLearny combines:
1. **Udemy/Coursera B2C Marketplace**: Multi-instructor course marketplace, bundled learning paths, certificate rigor, coupon engine, Razorpay payments, tiered revenue splits.
2. **Enterprise LMS & Academic Control**: 6 Role RBAC (`Student`, `Instructor`, `Teaching Assistant`, `Course Agent`, `Admin`, `Super Admin`), an application-and-approval onboarding gate for Instructors, Course-Owner Leave & availability scheduling (Instructor and Course Agent both), Live Office Hours slot bookings with automatic waitlist promotion (deferred, §3.22), Multi-channel audit logs, Apache POI Excel exports.
3. **LeetCode/GeeksforGeeks Practice Sandbox**: Public SEO-optimized technical article hub, interactive coding problem sandbox powered by self-hosted **Judge0 API**, multi-language code execution, test cases evaluation, execution memory/time analytics.
4. **Duolingo/Brilliant Gamification Engine**: Daily learning streaks, loss-aversion streak freeze power-ups, XP points economy, milestone badge achievements, real-time top-3 podium leaderboards.
5. **Modern AI Assistant & Authoring Layer**: 2-Tier AI assistant (Rule-based course recommender + LLM-backed Gemini/Groq contextual chatbot), rate-limiting before LLM calls, AI quiz & course syllabus generator.

The platform is architected **API-first**: a single Spring Boot backend
serves a Next.js responsive web app and a React Native (Expo) mobile app
from day one with 100% full feature and content parity (every feature, input, form, and capability on Web MUST exist on Mobile), so no future frontend (tablet-native, desktop app, etc.)
requires backend rework.

**Mandatory AI Tool Development Guardrail:** AI assistants and developers building eLearny MUST double-check all implementation steps to ensure zero deprecated package warnings (strictly using modern stable releases per `migration.md` §4: Java 21 LTS, Spring Boot 3.5.8, Next.js 16.3.x, Expo SDK 57), maximum content density (no thin 2-field screens or placeholder pages), multi-state rendering (loading, empty, error, populated), and strict Web & Mobile functional parity before declaring any task complete.

Note on sequencing: a system this size cannot be built in one motion —
some pieces genuinely depend on others existing first (auth before
role-based dashboards, course schema before payments, payments before
revenue analytics). That ordering is `phases.md`'s responsibility. This
document's job is to make sure nothing on this list gets quietly cut or
forgotten because of that ordering.

---

## 2. Targeted Users

**Six roles**:

| Role | Description |
|---|---|
| **Student** | Browses, purchases/enrolls in courses & bundles, tracks progress, takes quizzes, runs code in Practice Hub, earns certificates, leaves reviews, tracks streaks & XP. Office-hours booking is part of Live Sessions, currently deferred (§3.22). |
| **Instructor** | **Never self-registered.** Onboards via a public application (§3.1a/§3.26) reviewed and approved by Admin; only after approval does an account exist. Creates and manages courses, sections, lessons, quizzes, assignments, and pricing/coupons. Views revenue/payout status (§3.6), schedules leave/availability (§3.21), invites Teaching Assistants (§3.17, deferred). |
| **Course Agent** *(new)* | eLearny's own internal course-creator role — provisioned directly by Admin, no public application. Uses the same course-authoring interface as Instructor (Course Creator, Curriculum Builder, quiz/assignment tools). Produces `PLATFORM`-type courses (§3.1a) — eLearny's official/premium catalog, distinct from instructor-owned courses. Also receives revenue payout and has leave/calendar access, same mechanism as Instructor (§3.6/§3.21). |
| **Teaching Assistant** *(deferred, §3.17)* | Invited by an Instructor to specific assigned courses. Accepts/declines invitation. Grades assignments, moderates Q&A forums. Cannot create courses or access revenue. Code exists, kept, not wired into any active flow until reactivated as its own later phase. |
| **Admin** | Platform-wide management and monitoring: reviews and approves/rejects Instructor applications (§3.1a/§3.26), provisions Course Agent accounts, content moderation **including the authority to remove a published course from the live, student-visible catalog** if it falls short of standard (§3.7 — the course record, its enrollments/payments/reviews are never deleted, only unlisted, and the owner is notified with a reason), category taxonomy, user role management, coupon oversight, revenue reports. |
| **Super Admin / Compliance** | System-wide governance: security audit log inspection, system settings override, global revenue splits, multi-channel communication logs. |

**Out of scope (a deliberate design boundary, not a deferral):**
organizational/team accounts (bulk seats, org-level admins, assigned
learning paths for employees). This is a genuinely different data model
(a purchaser who isn't the learner), not a smaller version of the B2C
model — so it's excluded on purpose. The schema should still avoid
hardcoding "the buyer is always the learner" so this could be added later
without a rewrite, but it is not part of eLearny's committed feature set.

---

## 3. Features

All features below are committed. None are "maybe later." Where a feature
has real infrastructure or cost implications, that's noted so it's an
informed commitment — not a reason to cut it.

### 3.1 Course Authoring & Content Management (Instructor & Course Agent) [V1]
- Course creation with hierarchical structure: Course → Sections/Modules → Lessons
- Lesson content types: video, article/text, downloadable resource/attachment
- Drip content / scheduled release of modules (per course)
- Draft → Submitted → Published course states, with admin review gate
- Course versioning: instructor can update a published course without breaking active learners' progress
- Bulk resource upload (slides, code files, PDFs) per lesson
- Every course has a `courseType` of `INSTRUCTOR` or `PLATFORM` (§3.1a) — the authoring UI is identical either way, the type just governs ownership and catalog badging
- Course prerequisite chaining: a course can name another course as a prerequisite (added at explicit user request, from a prior codebase's feature review)
- Cohort-based courses with a configurable seat limit — capacity-limited enrollment, not just unlimited self-paced access (same origin as above)
- Admin can remove a published course from the live catalog for quality reasons — see §3.7; the owner is notified with the reason and the course is unlisted, not deleted

### 3.1a Course Agent & Platform Courses [V1 — new]
- **Course Agent** is eLearny's own internal course-creation role — think "in-house content team," not a marketplace instructor. Provisioned directly by Admin (no public application, no approval queue — this is an internal account, not a marketplace onboarding).
- Course Agents get the identical authoring interface Instructors use — Course Creator, Curriculum Builder, quiz/assignment tools — reused wholesale, not a separate build.
- Courses a Course Agent creates are `courseType = PLATFORM` — eLearny's official/premium catalog, visually distinguished from instructor-owned (`INSTRUCTOR`-type) courses in Discovery/Browse (e.g. an "eLearny Official" badge).
- Course Agents also receive revenue payout (§3.6) and have leave/calendar access (§3.21) — same mechanism as Instructor, not a separate system.
- For `PLATFORM` courses, `Course.instructor` points at the Course Agent's own account (a Course Agent is still a `User` row, just role `COURSE_AGENT`) rather than a separate ownership field — see `migration.md` §12 Q-C for the reasoning.
- This role and its courses are net-new relative to the prior codebase (`elearny_v0`) — see `migration.md` §2.4 for the full design and open implementation questions.

### 3.2 Learning Experience (Student) [V1]
- Progressive video streaming via signed URLs, HTML5/native range requests
- Playback controls: speed adjustment, resume-from-last-position, captions/subtitles
- Student dashboard: enrolled courses, % progress per course, continue-learning shortcut, activity history
- Lesson completion tracking (auto on video watch-through + manual mark-complete for articles)
- Bookmarks / notes on lessons (student-private)

### 3.3 Discovery [V1]
- Search (title, instructor, tags, category)
- Filtering: category, level (beginner/intermediate/advanced), price, rating, language
- Course categorization / taxonomy management (admin-controlled categories & subcategories)
- Course reviews and star ratings (student, post-enrollment only, one review per student per course)
- Recommended/related courses: rule-based matching (category/tag/history) — this is also the engine behind the chatbot's course-suggestion capability (3.15)

### 3.4 Assessment & Exams [V1 — browser-level integrity; camera-based proctoring is V2]
- Quizzes/assessments per module and per course (final exam)
- Question types: MCQ (single/multi-answer), true/false, short-answer
- Timed exams with configurable time limits
- Randomized question order and randomized answer-option order per attempt
- Configurable pass/fail threshold and retry limits per quiz

### 3.4a Assignments (Instructor-Graded Coursework) [V1]
- New in V1 at explicit user request, after reviewing a prior codebase that had this as a first-class feature the current docs were missing.
- Distinct from §3.4's auto-graded quizzes: assignments are text and/or file submissions (per course/module) that a human — the instructor — reviews and grades, not the exam engine.
- Instructor defines: prompt/instructions, submission format (text, file upload, or both), due date, max score.
- Student submits once per assignment (resubmission policy: instructor can explicitly reopen a submission for revision, not open-ended).
- Instructor grading view: per-submission score entry + written feedback, filterable by "ungraded" so nothing silently sits unreviewed.
- Late-submission handling: submissions after the due date are flagged, not blocked — the instructor decides whether to grade them, matching real classroom practice better than a hard cutoff.
- **Exam integrity, browser-level:** full-screen enforcement (exiting logs a violation and can auto-flag/auto-submit), tab-switch/window-blur detection with timestamps, copy/paste and right-click disabled, back-button/navigation blocked during an attempt, violation log visible to the instructor per attempt
- **Exam integrity, camera-based:** webcam identity check, gaze tracking, multi-person detection. This is a separate, heavier build (media pipeline, storage, explicit student consent flow for camera access) than the browser-level checks — real infra, not a toggle — but it is committed scope, to be built as its own module in `phases.md` once the media pipeline exists.

### 3.5 Certification [V1]
- Auto-generated PDF certificate on course completion (all lessons + passing final exam if present)
- Unique certificate ID + verification page/QR code so a certificate can be validated by a third party (employer) without logging in
- Certificate includes: student name, course title, instructor name, completion date, unique verification code

### 3.6 Commerce [V1]
- Payments via Razorpay (one-time course purchase)
- Coupons: percentage/flat discount, expiry date, usage limits
- Per-course-owner (Instructor **or** Course Agent, §3.1a) revenue dashboard: sales, revenue over time, payout status — one payout mechanism scoped to "whoever owns the course," not an Instructor-exclusive feature. Platform takes a cut of every enrollment; the remainder is payable to the owning Instructor or Course Agent.
- Admin-grantable platform-wide coupon eligibility: a specific Instructor can be granted permission to create coupons usable beyond their own courses (added at explicit user request, from a prior codebase's feature review) — off by default, Admin-toggled per instructor
- Refund handling (policy + admin-triggered refund flow, plus student-initiated requests — §3.19)

### 3.7 Governance & Admin [V1]
- Admin approval gate for instructor applications — no Instructor account exists at all until approved (§3.1a/§3.26); Course Agent accounts are Admin-provisioned directly, no approval queue
- Admin course-approval workflow before a course goes live (moderation)
- **Admin course-catalog takedown authority**: Admin can unlist a published course from the live, student-visible catalog for quality reasons — reuses the course's existing active/inactive flag rather than deleting anything; enrollments, payments, and reviews on that course are unaffected and preserved. A reason is required and the owning Instructor or Course Agent is notified. Whether the owner can request re-review/reactivation, versus reactivation being Admin-initiated only, is an open implementation question — see `migration.md` §12 Q-F.
- Admin panel: user management, instructor application review, Course Agent provisioning, category management, reported-content review, platform-wide analytics
- Role-based access control (RBAC) and role-based navigation (Student / Instructor / Course Agent / Admin)

### 3.8 Communication [V1 — in-app + email only; SMS/push are V2, see §3.24]
- Notifications: in-app (`notifications` table) for enrollment, course updates, quiz results, certificate issuance
- Transactional email (Gmail SMTP): welcome, purchase receipt, course completion, password reset

### 3.9 Community & Engagement [V1]
- **Per-course forum, not just a flat "discussion tab"**: enriched at explicit user request after reviewing a prior codebase's fuller forum model. Students/instructors create threads (with a title, not just a message), reply within a thread, and either party can mark a reply as the accepted answer on a question-type thread. Threads are scoped to one course — this is not a platform-wide general forum (no cross-course discovery in V1).
- Instructor announcements per course (one-way, not a discussion thread — students can't reply to an announcement, only to regular forum threads)

### 3.10 Gamification & Interaction Design [V1]
- Completion badges/achievements, daily streaks, points, and an opt-in leaderboard (privacy-respecting — no forced public ranking)
- Animated transitions, progress feedback, and micro-interactions across the product — web via `motion`/Framer Motion, mobile via `react-native-reanimated` (described here by behavior, implemented per-platform, since the two frameworks are not interchangeable)
- Animated feedback moments specifically on: lesson completion, quiz pass, certificate issuance

### 3.11 Course Bundling & Discovery Extensions [V1]
- **Wishlist / save-for-later** — student can bookmark a course without purchasing
- **Learning paths / course bundles** — instructor or admin groups related courses into a sequential path with its own completion certificate (Coursera's "Specialization" model)
- **Instructor public profile page** — bio, total students, average rating, all published courses

### 3.12 Localization & Multi-Language Support [V2]
Two independent layers, per standard i18n practice — a platform can localize
its interface without every course being translated, and the two are built
and shipped separately:
- **Platform UI localization** — interface text (menus, dashboards, buttons, notifications) via `next-intl`/i18next (web) and `i18n-js` (Expo mobile)
- **Course content localization** — instructor-provided subtitles/captions or alternate-language versions of a course. Higher cost per language (storage, instructor workload) — committed, but the specific language list is a business decision to make closer to build time, not a reason to exclude the capability itself

### 3.13 Practice & Content Hub [V2]
Inspired by GeeksforGeeks: free long-form articles/tutorials alongside paid
courses, for learner value and organic search traffic that funnels into
course sales.
- Public tutorial/article pages per topic (SEO-friendly, free to read, no login required) — a distinct content type from paid video courses
- Topic-wise practice problems with difficulty levels (easy/medium/hard) and a "Problem of the Day" habit loop
- Embedded code playground inside lessons — in-browser code editor + execution sandbox for programming courses, built on an open-source, self-hostable execution engine (e.g. Judge0) rather than a paid SaaS API
- This is real infrastructure (isolated execution, resource limits, security hardening against malicious/adversarial code submissions) — committed, and specifically called out in `phases.md` as its own build module rather than a quick add-on, because pretending it's small would be dishonest about the work involved

### 3.14 Growth Mechanics [V2]
- Referral program: student refers a friend, both get a discount/credit
- Instructor affiliate program: commission for referring new students

### 3.15 AI Assistant (Chatbot) [V1]
Two capabilities, both committed, with different infra profiles:

**Course Suggestion (rule-based, no LLM)**
- Recommends courses via category/tag matching, browse history, and enrolled-course similarity — reuses the Discovery recommendation engine (3.3), exposed through the chat UI

**Conversational Q&A (LLM-backed)**
- Answers free-text student questions — platform FAQs, "what should I learn to become a backend developer," course-related questions
- Backed by a genuinely free LLM API tier (no credit card required): Google Gemini Flash or Groq (Llama 3.3 70B) — both viable at eLearny's traffic scale today
- Required engineering: LLM API key stays server-side (Spring Boot calls the provider — key never reaches web/mobile clients); per-user rate limiting in our own backend so one student can't exhaust the platform's shared quota; a graceful fallback response when quota is hit, instead of a broken chat; the bot's scope kept to the platform (FAQs, catalog) rather than open-ended general chat, to keep prompts short and cheap
- Honest note, not a reason to cut it: this is the first feature depending on a third-party service outside our control. As traffic genuinely grows past what any free tier offers, this specific feature is the one most likely to need a paid upgrade — that's a scaling reality, not a scoping choice, and it'll be flagged again when we're closer to that point.

### 3.16 AI-Assisted Authoring & Personalization [V2]
- AI-generated quiz question drafts from course content (instructor-assist tool, instructor reviews before publishing)
- AI-driven personalization of recommendations beyond rule-based matching, once there's enough usage data for it to outperform rule-based matching
- Same free-tier LLM dependency and honest cost note as 3.15

### 3.17 Teaching Assistant Role [V2]
- Instructors can invite a Teaching Assistant (by email) to one or more of their own specific courses — not platform-wide, not self-registered
- TA accepts/declines the invitation before gaining any access
- TA permissions (per assigned course only): grade assignments, moderate discussion/Q&A (3.9)
- TA cannot: create courses, set pricing, access revenue data, or act on courses they weren't invited to
- Reuses the existing RBAC/role infrastructure from §2 — a fourth role, not a parallel permission system

### 3.18 Account Security Hardening [V1]
- Account lockout after repeated failed login attempts, with a clear unlock path (time-based or admin-assisted)
- Session-expiry handling: a clear, non-jarring re-authentication prompt when a JWT expires mid-use, not a silent failure
- Login history: a user-facing record of recent login activity, viewable in account security settings (added at explicit user request, from a prior codebase's feature review)

### 3.19 Trust, Support & Governance Pages [V1]
- Student-initiated refund requests (student submits a request; admin reviews it — extends the existing refund flow in §3.6, which was previously admin-initiated only)
- Admin-facing communication log (record of transactional emails/notifications actually sent, for support/debugging)
- Admin-facing audit log (record of admin actions — approvals, moderation, refunds — for accountability)
- Public legal pages: Terms of Use, Privacy Policy
- Help & Support page, and a "What's New" release-notes page

### 3.21 Course-Owner Leave & Calendar Management [V1 — promoted from V2]
- **Applies to both Instructor and Course Agent** — one leave/availability mechanism scoped to "course-owning role," not an Instructor-exclusive feature (mirrors the revenue-payout generalization in §3.6). Promoted out of pure-V2 status because it's part of the same onboarding/role-system work as §3.1a and §3.26.
- Course owners can schedule leave dates and unavailability windows (`LeaveStatus`)
- Displays leave notices on the owner's public profile (§3.11)
- **Decoupled from Live Sessions**: the previous version of this section tied leave to pausing office-hour bookings and notifying Teaching Assistants — both Live Sessions (§3.22) and the TA role (§3.17) are currently deferred, so this section stands on its own; the office-hour-pausing behavior returns as part of reactivating §3.22, not before

### 3.22 Live Session Office Hours & Slot Bookings [V2 — deferred alongside §3.17 Teaching Assistant]
- **Explicitly deferred during the `elearny_v0` migration**, at the user's direction — already fully built in the prior codebase (slot scheduling, bookings, waitlist), code is kept and ported as-is, just not wired into any active route until reactivated as its own later phase (`migration.md` §2.6).
- 1-on-1 and small group Office Hour slot scheduling (`LiveSessionSlot`, `LiveSessionBooking`, `BookingStatus`)
- Waitlist management (`WaitlistEntry`, `WaitlistStatus`): automatically notifies students when a booked slot opens up
- Integrates with Google Calendar / iCal download links for booked slots

### 3.23 Excel Reporting & Data Export Engine [V2 — already implemented in `elearny_v0`]
- **Already built and working in the prior codebase** (`ReportExportService`, Apache POI) — carried forward via migration, not net-new work; verify and re-test after the domain-package restructuring, don't rebuild.
- Admin & Instructor data export in `.xlsx` format (powered by Apache POI)
- Financial reports, student enrollment rosters, quiz score analytics, and instructor payout statements exportable with one click

### 3.24 Multi-Channel Communication & Audit Trail [V2 — audit trail already implemented in `elearny_v0`]
- Multi-channel notification dispatch: Email (SMTP), SMS alerts (`com.twilio.sdk`, already implemented), and push notifications (`expo-notifications`, net-new — no mobile app existed in the prior codebase)
- Full audit logging (`CommunicationLog`, `CommunicationChannel`, `CommunicationStatus`) for delivery tracking and troubleshooting — **already built**, carried forward via migration
- Platform-wide administrative audit trail (`AuditLog`) tracking all admin actions (approvals, role changes, refund approvals, moderation, course takedowns per §3.7) for compliance — **already built**, carried forward via migration

### 3.25 GDPR Consent & Privacy Management [V1 basic consent recording + account anonymization; advanced privacy-preference UI is V2]
- Immutable user consent recording (`ConsentRecord`) tracking exact terms/privacy policy versions agreed to at registration and upon legal updates
- Student privacy preferences management in user profile settings
- **Account anonymization / right-to-erasure**: a user can request account deletion; the platform anonymizes the account rather than hard-deleting it (preserving referential integrity for enrollments/payments/reviews tied to it) — already built in the prior codebase (`DataPrivacyService`, `DeletionRequestDecision`, `User.anonymized`), added here explicitly since it wasn't previously documented as concrete scope

### 3.26 Identity Verification & Instructor Onboarding [V1]
- **Student registration requires email OTP verification before the account is usable.** Registering creates the account in an unverified state; a 6-digit OTP is emailed (Gmail SMTP) and must be entered on a dedicated verification screen before login is possible. OTPs expire (10 minutes) and can be resent with a cooldown, to balance security against a frustrating UX.
- **Instructors are never self-registered.** The only path to becoming an Instructor is the public application flow below, reviewed by Admin. A student cannot upgrade their existing account to Instructor under any circumstance — a different email is required, by design, even if that means one person holds two separate accounts.

**Instructor Application Flow** *(full redesign — supersedes all prior wording in this section; see `migration.md` §2.3 for the complete design)*:
1. **Apply** (public `/instructor/apply` page): name, bio, professional details; **real file uploads** (not link fields) for ID proof, certifications (multiple files), and a sample teaching video; a Portfolio/LinkedIn URL field (a link is legitimately just a link, no upload needed). The application email is rejected at submit time if it already belongs to any existing User account, any role.
2. **Verify** at application time: a 6-digit OTP is sent to the application's email and must be verified before the application is accepted. This means the email is already confirmed real by the time Admin reviews it — no second OTP is needed later in the flow.
3. On successful verification, an `InstructorApplication` is created with status `PENDING` and an **8–10 character alphanumeric Application ID** is generated and shown to the applicant to save.
4. **Check status**: a public "Already applied? Check status" page/link — enter Application ID + email, verify via a fresh OTP to that email, see the current status (`PENDING` / `APPROVED` / `REJECTED`, with a reason if rejected).
5. **Admin review**: Admin sees a filterable list (Pending/Approved/Rejected) with the uploaded docs, video, and info, and approves or rejects (rejection requires a reason).
6. **Approve → activation**: a single-use, time-limited activation link is emailed (no second OTP — the email was already verified at application time). Visiting the link allows username + password setup **only** — this is when the `User` account is actually created, role `INSTRUCTOR`, tied to the application's email. No login is possible before this point; there is no account to log into.
7. **Reject → cooldown**: rejection sets a **15-day** cooldown period by default (config value, not hardcoded — `migration.md` §12 Q-A). Reapplication rules:
   - A `PENDING` application for that email blocks a new submission — "an application is already under review, track its status above."
   - A `REJECTED` application still inside its cooldown blocks a new submission — "your application is on a cooldown period until \<date\>."
   - A `REJECTED` application past its cooldown **allows** a new submission, same email, with **no** "already applied" error of any kind. Once the new application is submitted, the old rejected one becomes unqueryable via the public status-check (by design — it's a UX simplification, not a data-retention decision); nothing is deleted, and Admin can still see the full application history for that email.

**Course Agent provisioning** *(new role — see §3.1a for the role itself)*: no public application exists for this role. Admin creates the account directly and sends a single-use activation link, reusing the same activation mechanism as instructor approval (step 6 above) rather than building a second one.

- This is real infrastructure, not a formality: it requires transactional email (SMTP) and real file-upload/object-storage handling to exist starting Phase 1 (student OTP) / early in the migration (instructor application), rather than waiting for Phase 8's broader notification system — Phase 8 remains the home for the full notification center, in-app alerts, and course announcements; this section only covers identity-verification and account-activation emails and uploads.

---

## 4. Change Log
- **v0.1** — Initial baseline PRD drafted from prerequisite scope discussion.
- **v0.2** — Expanded feature list after researching LMS-checklist standards,
  Coursera, and exam anti-cheating practices. Added: content versioning/drip
  content, playback/bookmark features, exam integrity (browser-level +
  camera-based), certificate verification (unique ID/QR), refund handling,
  per-course discussion/Q&A.
- **v0.3** — Added after researching gamification standards, i18n practice,
  and GeeksforGeeks-style content platforms. Added: wishlist, course
  bundles/learning paths, instructor public profiles, gamification
  (badges/streaks/points/leaderboard), platform + content localization, a
  Practice & Content Hub (free articles + practice problems + embedded code
  playground), referral/affiliate growth mechanics, and an AI-features
  section with free-tier cost flags.
- **v0.4** — Formalized the AI chatbot request into a two-part design:
  rule-based course-suggestion engine + LLM-backed Q&A bot (Gemini Flash or
  Groq free tier), with required app-level rate limiting and fallback
  handling called out explicitly.
- **v0.5** — Removed all "deferred / placeholder / v2 / v3 / TBD" framing.
  Every feature in this document is now committed scope. Build order (what
  gets built in what sequence) moves entirely to `phases.md`; this document
  no longer mixes scope decisions with sequencing decisions.
- **v0.6** — Added a fourth role, Teaching Assistant (§2, §3.17), invited
  per-course by an Instructor with narrower permissions than Instructor.
  Added Account Security Hardening (§3.18: lockout, session-expiry
  handling), Trust/Support/Governance pages (§3.19: student-initiated
  refund requests, communication log, audit log, legal pages, help/support,
  what's-new). Added Live Sessions (§3.20) as a **deliberate, user-requested
  exception** to this doc's "nothing deferred" policy — real-time video
  needs infrastructure (self-hosted WebRTC SFU or per-minute-billed managed
  API) that doesn't fit the free-tier constraint yet; explicitly deferred
  rather than committed, at the user's direction, not shrunk silently.
- **v0.7** — Enforced modern non-deprecated dependency standards across Java 21,
  Spring Boot 3.3.x, Next.js 14.2+, and Expo SDK 51.
- **v0.8** — Incorporated combined features from `temp_elearny`: §3.21 Instructor Leave Management, §3.22 Live Session Office Hours & Slot Bookings with Waitlists, §3.23 Excel Data Export Engine (Apache POI), §3.24 Multi-Channel Communication & Audit Trail (Twilio SMS, Email, Push, AuditLog), §3.25 GDPR Consent & Privacy Management.
- **v0.9** — Expanded targeted users to 5 Roles (adding Super Admin / Compliance Officer). Supercharged scope into an All-in-One Flagship LMS Platform combining B2C Marketplace, Enterprise Academic Controls, Judge0 Code Execution Practice Sandbox, Duolingo Gamification Engine (Streaks/Loss Aversion/Freeze/XP Podium), and AI Assistant/Authoring layer with 100% Web & Mobile Parity.
- **v1.0** — **Fresh-start reset: no code exists as of this version** (prior backend/frontend removed per `memory.md`'s 2026-09-10 entry). Introduced §0, a V1/V2 delivery-tier split, at explicit user request, so scope stays honest about sequencing without cutting anything. Every §3 feature is now tagged `[V1]` or `[V2]`. At the user's explicit request, **Gamification (§3.10) and the AI Assistant Chatbot — both the rule-based and LLM-backed tiers (§3.15) — are pulled into V1**, ahead of where they'd otherwise land in a strict dependency order; `phases.md` v0.9 reflects this by resequencing them into the V1 phase track. V2 (localization, Judge0 sandbox, growth mechanics, AI-assisted authoring, TA role, instructor leave, office hours, Excel export, SMS/push, advanced privacy prefs, camera proctoring, live sessions) remains committed, just sequenced after V1 ships.
- **v1.1** — Added §3.26, Identity Verification & Instructor Onboarding, at explicit user request during Phase 1 build: student registration now requires email OTP verification before login is possible; Instructor accounts are activated via an Admin-approval-triggered invite email (single-use expiring link + OTP) rather than any self-registration path. Pulls basic transactional email (SMTP) infrastructure into Phase 1, ahead of Phase 8's broader notification system.
- **v1.2** — After the user shared a prior (discarded) codebase for reference, added §3.4a Assignments (instructor-graded text/file submissions, distinct from auto-graded quizzes) as new V1 scope, and enriched §3.9 Community & Engagement from a flat discussion tab into a real per-course forum (threads, replies, accepted-answer marking). Confirmed — no changes needed — that 2FA (§3.18), admin reports (§3.7/§3.12/§5.7), and quizzes (§3.4) were already committed V1 scope.
- **v1.3 — Migration-driven amendment (Phase M0 of `migration.md`).** This document no longer describes a from-scratch build — as of this version, eLearny is being migrated from a prior, mostly-complete codebase (`elearny_v0`), not built from zero; see `migration.md` for the full plan. Changes made in this pass: (1) added a sixth role, **Course Agent** (§2, §3.1a) — eLearny's internal course-creation role, Admin-provisioned with no public application, producing `PLATFORM`-type courses distinct from instructor-owned `INSTRUCTOR`-type courses; (2) corrected Admin from a purely monitoring/approval role to one that also holds **course-catalog takedown authority** (§3.7) — courses can be unlisted (never deleted) for quality reasons, with a required reason and owner notification; (3) generalized revenue payout (§3.6) and leave/calendar management (§3.21, promoted from V2 to V1) from Instructor-exclusive to **both Instructor and Course Agent**; (4) fully redesigned the instructor onboarding flow (§3.26) around real document/video uploads, OTP-verified applications with a public Application ID, a public status-check page, and explicit reapplication-cooldown rules; (5) deferred **Live Session Office Hours (§3.22)** alongside the already-deferred Teaching Assistant role (§3.17) — both are fully built in `elearny_v0` and carried forward as ported-but-unwired code, reactivated as a later phase, not part of this migration; (6) folded in several v0-only features that had no prior documentation: login history (§3.18), account anonymization/right-to-erasure (§3.25), platform-wide coupon eligibility and course prerequisite/cohort/seat-limit fields (§3.6/§3.1), and flagged Excel reporting (§3.23) and the audit-log portion of §3.24 as already built in `elearny_v0` rather than net-new V2 work.

