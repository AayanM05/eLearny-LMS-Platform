# eLearny — Phases Document (phases.md)

> Status: **v1.2 — living document, active migration from `elearny_v0`.**
> This is no longer a from-scratch build — see `migration.md` for the
> migration plan (its own M0–M8 phases govern *this* migration specifically)
> and `memory.md` for live state. This document's V1/V2 track below still
> governs feature *sequencing* once the migration's structural phases
> (`migration.md` M1–M4) are done. Decides execution order for all features in `prd.md` v1.3
> across a **V1 track (Phases 0–10, ships first, is the demo)** and a **V2 track
> (Phases V2-A–V2-G, committed but sequenced after V1)** — see `prd.md` §0 for what's
> in each tier. eLearny is high-level and large-scale by design — **not a demo or MVP**.
> Enforces **100% Web & Mobile Feature & Content Parity within each phase's own tier**,
> High Content Density (§12 in `rules.md`), Zero Deprecation Warning Policy (§15), and
> explicit cross-references to [`processflows.md`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/docs/processflows.md)
> and [`pages.md`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/docs/pages.md).
> AI tools MUST double-check every phase delivery across Web, Mobile, and Backend
> before marking a unit finished — checked means demonstrated (test output/log
> attached in `memory.md`), not claimed.

**How to read this doc:** each phase lists Backend / Web / Mobile scope together,
since they're built in parallel per `architecture.md`. "Depends on" points to the
phase(s) that must exist first — a hard technical dependency. Every phase explicitly
references its corresponding process flow in `processflows.md` and UI screens in
`pages.md`. **V1 phases are numbered 0–10 and must all be complete, demonstrated,
and deployed before V2 work starts.** V2 phases are lettered (V2-A, V2-B, ...) and
have no fixed internal order beyond their own "Depends on" lines.

---

# V1 Track — ships first, is the demo

## Phase 0 — Foundation (Size: M)
*Depends on: nothing*

- Monorepo scaffold: Turborepo, `frontend/web`, `frontend/mobile`, `packages/*` (per `architecture.md` §3)
- Spring Boot project init: base package structure, `pom.xml`, common module (exception handling, base entities)
- Flyway wired up, baseline database migration (`V1__init.sql`)
- Docker Compose: Postgres + backend containers running locally
- Design tokens applied: `globals.css` token file (`design.md` §2) wired into Tailwind config & NativeWind v4
- Health-check endpoint (`GET /api/v1/health`) confirming end-to-end connectivity
- **Docs & Flow refs**: `architecture.md` §3, `rules.md` §14

## Phase 1 — Auth, Roles & Identity Security (Size: M)
*Depends on: Phase 0*

- Backend: `auth` + `user` domains — registration (debounced username check `GET /api/v1/auth/check-username`), **email OTP verification (`GET/POST /api/v1/auth/verify-email`, `/api/v1/auth/resend-otp`) required before login — see prd.md §3.26**, login, JWT issue/refresh, TOTP 2FA (`dev.samstevens.totp`), account lockout (`AccountLockoutService`), login history, 6-role RBAC model (`STUDENT`, `INSTRUCTOR`, `TEACHING_ASSISTANT`, `COURSE_AGENT`, `ADMIN`, `SUPER_ADMIN` — schema supports all 6 from day one so later TA/Super-Admin/Course-Agent workflows don't need a data-model rework), GDPR terms consent recording (`ConsentRecord`), **transactional email via Gmail SMTP (`EmailService`) — pulled forward from Phase 8 since student OTP delivery can't wait for the broader notification system**
- Web: Register (`/auth/register`), **Verify Email OTP (`/auth/verify-email`)**, Login (`/auth/login`), 2FA Setup/Challenge (`/auth/2fa-setup`, `/auth/2fa-challenge`), Account Locked (`/auth/account-locked`), Session Expired modal (`/auth/session-expired`), Terms & Privacy (`/legal/terms-privacy`)
- Mobile: Matching screens with native input handling & Expo `SecureStore` JWT storage
- **Docs & Flow refs**: `processflows.md` Flow 01, Flow 15; `pages.md` §1; `prd.md` §2, §3.18, §3.25, §3.26

## Phase 2 — Instructor/Course-Agent Onboarding & Course Authoring (Size: L)
*Depends on: Phase 1*
*(Full redesign per `prd.md` §3.26/§3.1a and `architecture.md` §2.2/§2.2a — supersedes the previous "invite-and-activate" wording below)*

- Backend: `instructor` (public application endpoint with real file uploads — ID proof, certifications ×N, sample video, via `media`'s R2 pre-signed upload — OTP verification at application time, 8–10 char alphanumeric `applicationId`, public status-check endpoint, Admin approve/reject with reason + cooldown, **single-use activation link only on approval — no second OTP, since the email was already verified at application time**), `courseagent` (Admin-direct provisioning, reuses the same activation-link mechanism as `instructor`), `course` (course/section/lesson CRUD, draft→published states, versioning, drip content `drip_delay_days`, `courseType` field distinguishing `INSTRUCTOR` vs `PLATFORM` courses), `media` (R2 pre-signed upload URLs)
- Web: Instructor Dashboard (`/instructor/dashboard`), Course Agent Dashboard (`/courseagent/dashboard` — shares components with Instructor Dashboard), **Instructor Application (`/instructor/apply`) with document/video upload fields**, **Application Status Check (`/instructor/apply/status`)**, Admin Approval Queue (`/admin/instructor-applications`), Admin Course-Agent Provisioning (`/admin/course-agents`), **Account Activation (`/instructor/activate?token=...` and `/courseagent/activate?token=...`) — username + password only, no OTP field, reached only via the approval/provisioning email**, Course Creator Wizard (`/instructor/courses/create` and `/courseagent/courses/create` — same component, gated by role), Curriculum Builder (`/instructor/courses/[id]/builder`, same for course agent)
- Mobile: Full instructor and course-agent authoring screens — 100% parity with web
- Note: `LiveSessionSlot`/`Booking`/`WaitlistEntry` and `TAInvitation`/`TAAssignment` stay in **Phase V2-A**, explicitly deferred per `migration.md` §2.6 — both are already fully built in `elearny_v0` and are ported as-is, kept, just not wired into any active route until reactivated as their own later phase. **Course-owner Leave & Calendar management moved out of V2-A and into Phase 9** (see that phase's note) — it no longer depends on the TA/office-hours workflow, per `prd.md` §3.21's promotion to V1
- **Docs & Flow refs**: `processflows.md` Flow 02, Flow 03; `pages.md` §3, §4; `prd.md` §3.1, §3.1a, §3.26; `migration.md` §2.3, §2.4

## Phase 3 — Enrollment, Payments & Learning Experience (Size: L)
*Depends on: Phase 2*

- Backend: `payment` (Razorpay order creation, signed webhook signature verification `POST /api/v1/webhooks/razorpay`, coupons), `enrollment` (progress tracking, private notes, lesson completion thresholds)
- Web + Mobile: Course purchase flow (`/checkout/[id]`), signed R2 video player (progressive range requests, speed control, resume position, captions), Student Dashboard (`/dashboard`), Course Player (`/my-courses/[id]`)
- **Docs & Flow refs**: `processflows.md` Flow 05, Flow 06; `pages.md` §2.1, §2.3, §2.5; `prd.md` §3.2, §3.6

## Phase 4 — Discovery, Reviews, Wishlist & Bundling (Size: M)
*Depends on: Phase 3*

- Backend: `discovery` (multi-criteria search, filters, category taxonomy, rule-based recommendation engine), `review` (course ratings), `bundle` (wishlist, learning paths / course bundles)
- Web + Mobile: Course Search & Browse (`/courses`), Category Taxonomy pages, Course Detail Reviews (`/courses/[slug]`), Wishlist (`/wishlist`), Bundle Detail (`/bundles/[id]`)
- **Docs & Flow refs**: `processflows.md` Flow 04; `pages.md` §2.2, §2.4, §2.6; `prd.md` §3.3, §3.11

## Phase 5 — Assessment, Assignments & Certification (Size: L)
*Depends on: Phase 3*

- Backend: `exam` (quiz/exam engine, question types, timed attempts, question/option randomization, server-side grading, browser-level violation logging only — full-screen enforcement, tab-switch/blur detection, copy/paste block), `assignment` (instructor-graded text/file submissions per prd.md §3.4a — added at explicit user request), `certificate` (Apache PDFBox PDF generation, R2 upload, unique verification code)
- Web + Mobile: Quiz Builder (`/instructor/courses/[id]/quizzes`), Exam Player (`/exams/[id]/attempt`), Assignment Submission (student) and Assignment Grading Panel (instructor), results view, My Certificates (`/certificates`), Public Certificate Verification QR Page (`/certificates/verify/[code]`)
- Note: **Camera-based proctoring (WebRTC identity check, gaze tracking, multi-person detection) is Phase V2-F** — it's a separate media-pipeline build, not a V1 requirement
- **Docs & Flow refs**: `processflows.md` Flow 07, Flow 08; `pages.md` §2.7, §2.7a, §2.8, §3.5, §3.5a; `prd.md` §3.4, §3.4a, §3.5

## Phase 6 — Duolingo Gamification Engine & Motion (Size: M)
*Depends on: Phase 3, Phase 5*
*(Pulled forward into V1 at explicit user request — see `prd.md` v1.0 changelog)*

- Backend: `gamification` (daily streak evaluator, loss-aversion streak freeze power-ups, XP economy, milestone badges, top-3 podium leaderboard calculation)
- Web + Mobile: Animated micro-interactions (`motion` / `react-native-reanimated`) on lesson completion, quiz pass, badge unlock; Top-3 Podium Leaderboard UI (`/leaderboard`)
- **Docs & Flow refs**: `processflows.md` Flow 10; `pages.md` §2.19; `prd.md` §3.10

## Phase 7 — 2-Tier AI Assistant Chatbot (Size: M)
*Depends on: Phase 4*
*(Pulled forward into V1 at explicit user request — see `prd.md` v1.0 changelog; scope is general Q&A + course suggestions only, not authoring — see Phase V2-E)*

- Backend: `chatbot` (LLM provider client via `WebClient`, per-user rate-limiting before LLM call, Gemini Flash / Groq integration, prompt scoping to platform FAQs + catalog, quota exhaustion fallback response, logging)
- Web + Mobile: Conversational Chatbot UI widget (`/chatbot`), Tier A rule-based course recommendations (zero cost, reuses Phase 4's recommendation engine), Tier B LLM general Q&A assistant
- **Docs & Flow refs**: `processflows.md` Flow 16; `pages.md` §2.18; `prd.md` §3.15

## Phase 8 — Notifications & Community (Size: M)
*Depends on: Phase 3*

- Backend: `notification` (in-app notification table, Gmail SMTP emails only — Twilio SMS and `expo-notifications` push move to Phase V2-D), `community` (per-course forum — threads with titles, replies, accepted-answer marking, per prd.md §3.9's enriched scope — plus instructor announcements)
- Web + Mobile: In-App Notification Center (`/notifications`), Course Player Forum Tab (`/my-courses/[id]`) — thread list, thread detail with replies, Instructor Announcements
- **Docs & Flow refs**: `processflows.md` Flow 06, Flow 13; `pages.md` §2.10, §4.3; `prd.md` §3.8, §3.9

## Phase 9 — Admin Governance, Revenue & Course-Owner Leave (Size: M)
*Depends on: Phase 2, Phase 3*

- Backend: `admin` (course moderation, **course-catalog takedown — reuses `Course.active`, adds `suspensionReason`/`suspendedAt`, notifies the owner, never deletes**, user role management, category tree editor), `revenue` (**course-owner — Instructor OR Course Agent — earnings split ledger, payout status**, per `prd.md` §3.6's generalization), `leave` (**course-owner leave/availability scheduling, moved here from Phase V2-A per `prd.md` §3.21's promotion to V1 — applies to both Instructor and Course Agent, no dependency on the still-deferred office-hours/TA workflow**), refund processing flow
- Web + Mobile: Operations Dashboard (`/admin/dashboard`), Course Moderation Queue with takedown action (`/admin/course-moderation`), User Role Manager (`/admin/users`), Category Taxonomy Editor (`/admin/categories`), Refund Review Queue (`/admin/refunds`), Course-Owner Revenue Dashboard (`/instructor/revenue` and `/courseagent/revenue` — shared component), Course-Owner Leave/Calendar Manager (`/instructor/leave` and `/courseagent/leave` — shared component)
- Note: **Apache POI Excel export (`ExcelExportService`) moves to Phase V2-D** — reporting UI ships first with on-screen tables; one-click `.xlsx` export is a V2 add-on, not required for the dashboards to be useful. **Unlike most V2-D items, this one is already built and working in `elearny_v0`** — Phase V2-D's job for it is verification after the domain-package restructuring, not fresh implementation.
- **Docs & Flow refs**: `processflows.md` Flow 03, Flow 14; `pages.md` §3.11, §3.12, §5.1–§5.7; `prd.md` §3.6, §3.7, §3.21

## Phase 10 — Hardening, Compliance & V1 Launch (Size: M)
*Depends on: All prior V1 phases*

- Backend: Production Docker hardening, Render deployment, Supabase connection pooler, basic GDPR consent tracking (`ConsentRecord` from Phase 1) confirmed end-to-end
- Security & Load Testing: Endpoint rate-limiting audit, dependency vulnerability check, webhook signature security pass
- Mobile: EAS Build + EAS Update OTA workflow verification (`deployment.md` §6)
- **This phase is the V1 finish line** — when it's done, eLearny is a complete, demoable, deployed LMS. V2 phases start only after this is verified, not in parallel.
- **Docs & Flow refs**: `processflows.md` Flow 13, Flow 15; `pages.md` §2.12, §6.1, §6.2; `deployment.md`, `prd.md` §3.19, §3.25

---

# V2 Track — committed, sequenced after V1 ships

## Phase V2-A — Teaching Assistant Role & Live Session Office Hours (Size: M)
*Depends on: Phase 2 (V1), Phase 10 (V1) complete*
*(Instructor Leave Management moved to Phase 9 — see that phase's note; this
phase is now only the two items still explicitly deferred per `migration.md`
§2.6: TA and Live Sessions/Office Hours, both already fully built in
`elearny_v0` and ported as-is, just not wired into any route yet)*

- Backend: `livesession` — `LiveSessionSlot`/`LiveSessionBooking`/`WaitlistEntry` (Office Hours & waitlists, Google Calendar/iCal integration), `ta` — `TAInvitation`/`TAAssignment` (Teaching Assistant scope)
- Web + Mobile: Office Hours Scheduler (`/instructor/office-hours`), TA Management (`/instructor/ta-management`), TA Scoped Discussion Moderation (`/ta/moderation`)
- **Docs & Flow refs**: `processflows.md` Flow 11, Flow 12; `pages.md` §5.2; `prd.md` §3.17, §3.22

## Phase V2-B — Judge0 Code Execution Practice Sandbox (Size: XL)
*Depends on: Phase 4 (V1), Phase 10 (V1) complete*

- Backend: `practicehub` (public articles, practice problems, difficulty levels, Problem of the Day), self-hosted Judge0 REST API integration, code submission execution queue & webhook callback
- Web: Public SEO article list (`/articles`), Article Detail (`/articles/[slug]`), Practice Problems (`/practice`), Code Sandbox Editor (`/practice/[id]`) with Monaco editor
- Mobile: Full embedded code playground (`/practice/[id]`) with touch-friendly syntax toolbar
- **Docs & Flow refs**: `processflows.md` Flow 09; `pages.md` §2.14–§2.17; `prd.md` §3.13

## Phase V2-C — Localization & Multi-Language Support (Size: M, ongoing)
*Depends on: Phase 1 (V1), Phase 10 (V1) complete*

- Web: `next-intl` wired across all pages
- Mobile: `i18n-js` wired across all native screens
- Backend: `localization` domain (supported languages, translation storage), course subtitle/caption upload
- **Docs & Flow refs**: `pages.md`; `prd.md` §3.12

## Phase V2-D — Excel Export & Multi-Channel Communication (Size: M)
*Depends on: Phase 9 (V1), Phase 8 (V1), Phase 10 (V1) complete*
*(`ExcelExportService`, Twilio SMS, `CommunicationLog`, and `AuditLog` are all
already built and working in `elearny_v0` — this phase's job for those pieces
is verification against the restructured/tested backend, not fresh build.
`expo-notifications` push is genuinely new — no mobile app existed in
`elearny_v0`.)*

- Backend: `ExcelExportService` (Apache POI `.xlsx` report generator — already built, carried forward), Twilio SMS alerts (already built, carried forward), `expo-notifications` push (new), `CommunicationLog` (already built, carried forward), platform-wide `AuditLog` inspection UI (already built, carried forward)
- Web + Mobile: Apache POI Excel Export buttons (`/instructor/reports`, `/courseagent/reports` & `/admin/reports`), admin `/admin/audit-logs`
- **Docs & Flow refs**: `pages.md` §3.11; `prd.md` §3.23, §3.24

## Phase V2-E — AI-Assisted Authoring & Growth Mechanics (Size: M)
*Depends on: Phase 2 (V1), Phase 7 (V1), Phase 10 (V1) complete*

- Backend: AI-generated quiz question drafts (Gemini content parsing), syllabus draft generator, `growth` (student referral links, instructor affiliate link tracking)
- Web + Mobile: AI Quiz Draft Generator UI (`/instructor/courses/[id]/quizzes/ai-generate`), Referral & Rewards Manager (`/referrals`)
- **Docs & Flow refs**: `processflows.md` Flow 17, Flow 18; `pages.md` §2.20, §3.6; `prd.md` §3.14, §3.16

## Phase V2-F — Camera-Based Exam Integrity (Size: XL sub-project)
*Depends on: Phase 5 (V1), Phase 10 (V1) complete*

- WebRTC camera proctoring stream, gaze tracking, multi-person detection, snapshot logging to R2, explicit student consent flow for camera access
- **Docs & Flow refs**: `processflows.md` Flow 08; `pages.md` §2.8; `prd.md` §3.4

## Phase V2-G — Live Sessions (Size: XL, deferred pending infra decision)
*Depends on: Phase 10 (V1) complete*

- Real-time video infrastructure (self-hosted WebRTC SFU or per-minute-billed managed API) — deferred since v0.6 of `prd.md` at explicit user request, not sized in detail until an infra choice is made
- **Docs & Flow refs**: `prd.md` §3.20

---

## Notes on Sequencing Logic

- **Auth (Phase 1) gates everything** — user identity & RBAC model must exist first.
- **Courses (Phase 2) gate commerce, discovery, assessment, gamification, and the chatbot** — core curriculum tree forms the foundation for all subsequent V1 modules.
- **Gamification (Phase 6) and the AI Chatbot (Phase 7) are V1 by explicit user decision**, not by their original dependency-based position in the old single-track plan — they still respect their real technical dependencies (Phase 3/5 for gamification triggers, Phase 4 for chatbot course-suggestion data), they're just no longer waiting behind Judge0, TA, or office-hours work that doesn't gate them.
- **No V2 phase starts before Phase 10 (V1 launch) is verified** — this is the fix for the "all phases complete" false-completion incident logged in `memory.md`: V1 has one clear, checkable finish line before anything else begins.
- **V2-B (Judge0 Sandbox) and V2-F (Camera Proctoring) are XL sub-projects** — given their infrastructure complexity (containerized execution sandbox and WebRTC media pipeline), they are sequenced with dedicated scope and are not assumed to be quick.
- **Continuous Deployment**: Continuous deployment to Vercel + Render + Supabase begins after Phase 1 and continues across every phase delivery, V1 and V2 alike.

---

## Change Log
- **v0.1–v0.6** — Initial phase breakdowns and path updates.
- **v0.7** — Enforced 100% Web & Mobile parity, High Content Density, and non-deprecated package standards.
- **v0.8** — Supercharged all 14 phases to incorporate all combined features: §3.21 Instructor Leave, §3.22 Office Hours & Waitlists, §3.23 Apache POI Excel Exporters, §3.24 Multi-Channel Audit Logs, §3.25 GDPR Consent, Super Admin Governance, 2-Tier AI Chatbot & Authoring, Judge0 Code Sandbox, and Duolingo Gamification Engine. Every phase explicitly cross-references `processflows.md` (Flows 01–18) and `pages.md` (§1–§7).
- **v0.9** — **Fresh-start reset, restructured around `prd.md` v1.0's V1/V2 tiers.** Split the old single 14-phase sequence into a V1 track (Phases 0–10: foundation through launch) and a V2 track (Phases V2-A–V2-G: TA/office-hours, Judge0 sandbox, localization, Excel/multi-channel, AI authoring/growth, camera proctoring, live sessions). At explicit user request, pulled the Duolingo Gamification Engine and the 2-Tier AI Chatbot forward into the V1 track (new Phase 6 and Phase 7) instead of their prior position after office hours/TA work. Added an explicit rule that no V2 phase begins before V1's launch phase (Phase 10) is verified — a direct fix for the false "all 13 phases complete" claim logged in `memory.md`.
- **v1.0** — Added email OTP verification to Phase 1 (student registration is unverified until OTP confirmed) and the instructor invite-and-activate flow to Phase 2 (Admin approval emails a single-use setup token + OTP instead of the instructor ever self-registering), per `prd.md` §3.26. Pulled basic transactional email (Gmail SMTP) into Phase 1 ahead of Phase 8.
- **v1.1** — After the user shared a prior (discarded) codebase for reference: added Assignments (instructor-graded submissions) to Phase 5 alongside quizzes, per `prd.md` §3.4a; enriched Phase 8's Community scope from a flat discussion tab into a real per-course forum (threads/replies/accepted-answer), per `prd.md` §3.9.
- **v1.2 — Migration-driven amendment (Phase M0 of `migration.md`), derived from `prd.md` v1.3.** This document now governs feature *sequencing within* an active migration from `elearny_v0`, not a from-scratch build — see `migration.md` for the migration's own M0–M8 structural phases. Changes: Phase 1's role model is now 6 roles (added `COURSE_AGENT`) plus login history. Phase 2 fully redesigned around the new instructor-application flow (real document/video uploads, OTP-at-application, public Application ID/status-check, activation-link-only on approval) and added Course Agent provisioning, sharing the authoring UI with Instructor. Phase 9 gained the `admin` course-catalog-takedown capability, generalized `revenue` from Instructor-only to course-owner scope (Instructor or Course Agent), and absorbed Course-Owner Leave & Calendar management (moved out of V2-A, since `prd.md` §3.21 promoted it to V1 and decoupled it from the still-deferred office-hours workflow). Phase V2-A narrowed to just TA and Live Session Office Hours (both explicitly deferred per `migration.md` §2.6, already fully built in `elearny_v0`, ported as-is). Flagged Excel export, Twilio SMS, communication log, and audit log (Phase 9 note / Phase V2-D) as already implemented in `elearny_v0` and carried forward via migration, not net-new build work.
