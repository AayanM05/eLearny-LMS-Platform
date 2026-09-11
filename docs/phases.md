# eLearny — Phases Document (phases.md)

> Status: **v0.8 — living document.** Decides execution order for all features in `prd.md` v0.9 across 14 phases (Phases 0–13).
> eLearny is high-level and large-scale by design — **not a demo or MVP**.
> Enforces **100% Web & Mobile Feature & Content Parity**, High Content Density (§12), Zero Deprecation Warning Policy (§15), and explicit cross-references to [`processflows.md`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/docs/processflows.md) and [`pages.md`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/docs/pages.md). AI tools MUST double-check every phase delivery across Web, Mobile, and Backend before marking a unit finished.

**How to read this doc:** each phase lists Backend / Web / Mobile scope together, since they're built in parallel per `architecture.md`. "Depends on" points to the phase(s) that must exist first — a hard technical dependency. Every phase explicitly references its corresponding process flow in `processflows.md` and UI screens in `pages.md`.

---

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

- Backend: `auth` + `user` domains — registration (debounced username check `GET /api/v1/auth/check-username`), login, JWT issue/refresh, TOTP 2FA (`dev.samstevens.totp`), account lockout (`AccountLockoutService`), 5-role RBAC model (`STUDENT`, `INSTRUCTOR`, `TEACHING_ASSISTANT`, `ADMIN`, `SUPER_ADMIN`), GDPR terms consent recording (`ConsentRecord`)
- Web: Register (`/auth/register`), Login (`/auth/login`), 2FA Setup/Challenge (`/auth/2fa-setup`, `/auth/2fa-challenge`), Account Locked (`/auth/account-locked`), Session Expired modal (`/auth/session-expired`), Terms & Privacy (`/legal/terms-privacy`)
- Mobile: Matching screens with native input handling & Expo `SecureStore` JWT storage
- **Docs & Flow refs**: `processflows.md` Flow 01, Flow 15; `pages.md` §1; `prd.md` §2, §3.18, §3.25

## Phase 2 — Instructor Approval, Course Authoring & Academic Controls (Size: L)
*Depends on: Phase 1*

- Backend: `instructor` (application/approval workflow), `course` (course/section/lesson CRUD, draft→published states, versioning, drip content `drip_delay_days`), `media` (R2 pre-signed upload URLs), `InstructorLeave` (leave window scheduling), `LiveSessionSlot` / `LiveSessionBooking` / `WaitlistEntry` (Office Hours & waitlists), `TAInvitation` / `TAAssignment` (Teaching Assistant scope)
- Web: Instructor Dashboard (`/instructor/dashboard`), Instructor Application (`/instructor/apply`), Admin Approval Queue (`/admin/instructor-applications`), Course Creator Wizard (`/instructor/courses/create`), Curriculum Builder (`/instructor/courses/[id]/builder`), Office Hours Scheduler (`/instructor/office-hours`), Instructor Leave Manager (`/instructor/leave`), TA Management (`/instructor/ta-management`)
- Mobile: Full instructor authoring, office hours, leave manager, and TA management screens — 100% parity with web
- **Docs & Flow refs**: `processflows.md` Flow 02, Flow 03, Flow 11, Flow 12; `pages.md` §3, §4, §5.2; `prd.md` §3.1, §3.17, §3.21, §3.22

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

## Phase 5 — Assessment, Integrity Proctoring & Certification (Size: XL)
*Depends on: Phase 3*

- Backend: `exam` (quiz/exam engine, question types, timed attempts, question/option randomization, server-side grading, browser violation logging), `certificate` (Apache PDFBox PDF generation, R2 upload, unique verification code)
- Web + Mobile: Quiz Builder (`/instructor/courses/[id]/quizzes`), Exam Player (`/exams/[id]/attempt`), full-screen enforcement + tab-switch detection, results view, My Certificates (`/certificates`), Public Certificate Verification QR Page (`/certificates/verify/[code]`)
- **Sub-phase 5b — Camera-Based Exam Integrity (Size: XL sub-project)**: WebRTC camera proctoring stream, gaze tracking, multi-person detection, snapshot logging to R2
- **Docs & Flow refs**: `processflows.md` Flow 07, Flow 08; `pages.md` §2.7, §2.8, §3.5; `prd.md` §3.4, §3.5

## Phase 6 — Multi-Channel Notifications & Community (Size: M)
*Depends on: Phase 3*

- Backend: `notification` (in-app notification table, Gmail SMTP emails, Twilio SMS alerts, `expo-notifications` push, `CommunicationLog`), `community` (per-course discussion/Q&A, instructor announcements)
- Web + Mobile: In-App Notification Center (`/notifications`), Course Player Discussion Tab (`/my-courses/[id]`), Instructor Announcements, TA Scoped Discussion Moderation (`/ta/moderation`)
- **Docs & Flow refs**: `processflows.md` Flow 06, Flow 11, Flow 13; `pages.md` §2.10, §4.3, §5.8; `prd.md` §3.8, §3.9, §3.24

## Phase 7 — Admin Governance, Revenue Splits & Excel Data Export Engine (Size: M)
*Depends on: Phase 2, Phase 3*

- Backend: `admin` (course moderation, user role management, category tree editor), `revenue` (instructor earnings split ledger, payout status), refund processing flow, `ExcelExportService` (Apache POI `.xlsx` report generator)
- Web + Mobile: Operations Dashboard (`/admin/dashboard`), Course Moderation Queue (`/admin/course-moderation`), User Role Manager (`/admin/users`), Category Taxonomy Editor (`/admin/categories`), Refund Review Queue (`/admin/refunds`), Instructor Revenue Dashboard (`/instructor/revenue`), Apache POI Excel Export buttons (`/instructor/reports` & `/admin/reports`)
- **Docs & Flow refs**: `processflows.md` Flow 03, Flow 14; `pages.md` §3.11, §3.12, §5.1–§5.7; `prd.md` §3.6, §3.7, §3.23

## Phase 8 — Duolingo Gamification Engine & Motion (Size: M)
*Depends on: Phase 3, Phase 5*

- Backend: `gamification` (daily streak evaluator, loss-aversion streak freeze power-ups, XP economy, milestone badges, top-3 podium leaderboard calculation)
- Web + Mobile: Animated micro-interactions (`motion` / `react-native-reanimated`) on lesson completion, quiz pass, badge unlock; Top-3 Podium Leaderboard UI (`/leaderboard`)
- **Docs & Flow refs**: `processflows.md` Flow 10; `pages.md` §2.19; `prd.md` §3.10

## Phase 9 — Localization & Multi-Language Support (Size: M, ongoing)
*Depends on: Phase 1*

- Web: `next-intl` wired across all pages
- Mobile: `i18n-js` wired across all native screens
- Backend: `localization` domain (supported languages, translation storage), course subtitle/caption upload
- **Docs & Flow refs**: `pages.md`; `prd.md` §3.12

## Phase 10 — Judge0 Code Execution Practice Sandbox (Size: XL)
*Depends on: Phase 2, Phase 4*

- Backend: `practicehub` (public articles, practice problems, difficulty levels, Problem of the Day), self-hosted Judge0 REST API integration, code submission execution queue & webhook callback
- Web: Public SEO article list (`/articles`), Article Detail (`/articles/[slug]`), Practice Problems (`/practice`), Code Sandbox Editor (`/practice/[id]`) with Monaco editor
- Mobile: Full embedded code playground (`/practice/[id]`) with touch-friendly syntax toolbar (`{`, `}`, `;`, `(`, `)`) — 100% feature parity with web
- **Docs & Flow refs**: `processflows.md` Flow 09; `pages.md` §2.14–§2.17; `prd.md` §3.13

## Phase 11 — 2-Tier AI Assistant Chatbot (Size: M)
*Depends on: Phase 4*

- Backend: `chatbot` (LLM provider client via `WebClient`, per-user rate-limiting before LLM call, Gemini Flash / Groq integration, prompt scoping, quota exhaustion fallback response, logging)
- Web + Mobile: Conversational Chatbot UI widget (`/chatbot`), Tier A rule-based course recommendations (zero cost), Tier B LLM Q&A assistant
- **Docs & Flow refs**: `processflows.md` Flow 16; `pages.md` §2.18; `prd.md` §3.15

## Phase 12 — AI-Assisted Authoring & Growth Mechanics (Size: M)
*Depends on: Phase 2, Phase 11*

- Backend: AI-generated quiz question drafts (Gemini content parsing), syllabus draft generator, `growth` (student referral links, instructor affiliate link tracking)
- Web + Mobile: AI Quiz Draft Generator UI (`/instructor/courses/[id]/quizzes/ai-generate`), Referral & Rewards Manager (`/referrals`)
- **Docs & Flow refs**: `processflows.md` Flow 17, Flow 18; `pages.md` §2.20, §3.6; `prd.md` §3.14, §3.16

## Phase 13 — Hardening, Compliance, GDPR & Live Deployment (Size: M, ongoing)
*Depends on: All prior phases*

- Backend: Production Docker hardening, Render deployment, Supabase connection pooler, administrative `AuditLog` inspection (`/admin/audit-logs`), GDPR consent tracking & account erasure (`ConsentRecord`), global system settings override (`/admin/system-settings`)
- Security & Load Testing: Endpoint rate-limiting audit, dependency vulnerability check, webhook signature security pass
- Mobile: EAS Build + EAS Update OTA workflow verification (`/deployment.md` §6)
- **Docs & Flow refs**: `processflows.md` Flow 13, Flow 15; `pages.md` §2.12, §6.1, §6.2; `deployment.md`, `prd.md` §3.19, §3.25

---

## Notes on Sequencing Logic

- **Auth (Phase 1) gates everything** — user identity & RBAC model must exist first.
- **Courses (Phase 2) gate commerce, discovery, assessment, and practice hub** — core curriculum tree forms the foundation for all subsequent modules.
- **Phases 5b (Camera Proctoring) and 10 (Judge0 Sandbox) are XL sub-projects** — given their infrastructure complexity (WebRTC media pipeline and containerized execution sandbox), they are sequenced with dedicated scope.
- **Continuous Deployment**: Continuous deployment to Vercel + Render + Supabase begins after Phase 1 and continues across every phase delivery.

---

## Change Log
- **v0.1–v0.6** — Initial phase breakdowns and path updates.
- **v0.7** — Enforced 100% Web & Mobile parity, High Content Density, and non-deprecated package standards.
- **v0.8** — Supercharged all 14 phases to incorporate all combined features: §3.21 Instructor Leave, §3.22 Office Hours & Waitlists, §3.23 Apache POI Excel Exporters, §3.24 Multi-Channel Audit Logs, §3.25 GDPR Consent, Super Admin Governance, 2-Tier AI Chatbot & Authoring, Judge0 Code Sandbox, and Duolingo Gamification Engine. Every phase explicitly cross-references `processflows.md` (Flows 01–18) and `pages.md` (§1–§7).
