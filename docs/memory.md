# eLearny — Memory Document (memory.md)

> This file is different from the other seven docs: those record decisions
> (versioned, append-to-changelog). This one records **live state** — what
> exists right now, what's being worked on right now. eLearny is high-level and large-scale by design — **not a demo or MVP**.
> AI tools MUST double-check all implementation progress to enforce 100% Web & Mobile Parity, zero deprecation warning policy, and high content density.
>
> **Update this file every session, before ending it.** If a session ends
> without this file being updated, the next session starts blind.

---

## Current State
*(Overwrite this section every session — it should always reflect right now, not history)*

- **Active phase:** Phase 0 — Foundation (Fresh Start Initialized)
- **Currently working on:** Preparing for Phase 0 Unit 1 implementation (Monorepo setup, Spring Boot 3.3.x backend, Next.js 14.2+ web, Expo SDK 51 mobile, and `@elearny/*` workspace packages).
- **Last updated:** 2026-09-11
- **Blockers:** None. Codebase reset to clean state with project backup preserved in `backup/elearny-lms-backup.zip`. All completion checklist items are unmarked `[ ]`. All documentation files in `docs/` audited and restored with explicit anti-MVP framing, zero deprecation warnings policy, and AI double-check development rules.
- **Folder structure reminder:** `frontend/web` (Next.js), `frontend/mobile`
  (Expo), `backend/` (Spring Boot), `packages/*` (shared) — all siblings
  under the repo root except `web`/`mobile` which nest under `frontend/`.
- **Workspace Customization Skills (`.agents/skills/`)**:
  - [`taste-design-system`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/taste-design-system/SKILL.md) — Terracotta Orange (`#D96B43`) token hierarchy & visual taste standards.
  - [`mobile-app-uiux-benchmarks`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/mobile-app-uiux-benchmarks/SKILL.md) — Zomato, Swiggy, Instagram, DigiLocker, Duolingo, Airbnb UI architectures.
  - [`gsap-animation-uiux`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/gsap-animation-uiux/SKILL.md) — GSAP 3 web animations for Next.js App Router (`useGSAP`, `ScrollTrigger`).
  - [`reanimated-mobile-gestures`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/reanimated-mobile-gestures/SKILL.md) — React Native Reanimated 3 mobile gestures for Expo SDK.
  - [`21st-dev-components`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/21st-dev-components/SKILL.md) — 21st.dev component sourcing & MCP server integration.
  - [`shadcn-ui-components`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/shadcn-ui-components/SKILL.md) — Shadcn UI primitives & MCP server integration.
- **Live deployment:** `https://elearny-web.vercel.app` (Vercel) +
  Render backend + Supabase (session-mode pooler connection).
- **Doc versions:** `prd.md` v0.9, `architecture.md` v1.2, `rules.md`
  v1.1, `design.md` v0.7, `pages.md` v1.0, `processflows.md` v1.0, `phases.md` v0.8, `deployment.md` v0.8, `wireframes.md` v1.0. If any of these numbers don't match what's actually in
  the file when you read this, something changed since this entry was
  written — check that doc's own changelog for what happened.

---

## Completion Checklist
*(Mirrors `phases.md` v0.8 across Backend, Web, and Mobile. Check items off as they're actually done — not started, not "mostly done." A checked box means it works and has been demonstrated, not just claimed.)*

### Phase 0 — Foundation
- [ ] Monorepo scaffold (Turborepo, `frontend/web`, `frontend/mobile`, `packages/*`)
- [ ] Spring Boot project init (base package structure, common module, `application-dev.yml`)
- [ ] Flyway wired up, baseline migration (`V1__init.sql`) runs cleanly
- [ ] Docker Compose (Postgres + backend) running locally
- [ ] Design tokens applied (`globals.css`) to Tailwind config & NativeWind v4
- [ ] `/api/v1/health` endpoint working end to end

### Phase 1 — Auth, Roles & Identity Security
- [ ] Backend: registration, debounced username check (`/check-username`), login, JWT access/refresh rotation, TOTP 2FA (`dev.samstevens.totp`), account lockout, 5-role RBAC, GDPR terms consent recording (`ConsentRecord`) — Flow 01, Flow 15
- [ ] Web: Register (`/auth/register`), Login (`/auth/login`), 2FA Setup/Challenge (`/auth/2fa-setup`, `/auth/2fa-challenge`), Account Locked (`/auth/account-locked`), Session Expired modal (`/auth/session-expired`), Terms & Privacy (`/legal/terms-privacy`) — `pages.md` §1
- [ ] Mobile: Matching native auth screens with Expo `SecureStore` JWT storage — `pages.md` §1
- [ ] Live environment stood up (Vercel + Render + Supabase), registration verified end to end — `deployment.md` §1

### Phase 2 — Instructor Approval, Course Authoring & Academic Controls
- [ ] Backend: instructor application/approval, course/section/lesson CRUD, versioning, drip delay (`drip_delay_days`), R2 pre-signed media upload, `InstructorLeave` scheduling, `LiveSessionSlot`/`LiveSessionBooking`/`WaitlistEntry` (Office Hours & waitlists), `TAInvitation`/`TAAssignment` — Flow 02, Flow 03, Flow 11, Flow 12
- [ ] Web: Instructor Dashboard (`/instructor/dashboard`), Application (`/instructor/apply`), Admin Review (`/admin/instructor-applications`), Course Creator (`/instructor/courses/create`), Curriculum Builder (`/instructor/courses/[id]/builder`), Office Hours Scheduler (`/instructor/office-hours`), Leave Manager (`/instructor/leave`), TA Management (`/instructor/ta-management`) — `pages.md` §3, §4, §5.2
- [ ] Mobile: Full instructor authoring, office hours, leave manager, and TA management screens with 100% parity — `pages.md` §3, §4

### Phase 3 — Enrollment, Payments & Learning Experience
- [ ] Backend: Razorpay order creation, signed webhook signature verification (`POST /api/v1/webhooks/razorpay`), coupon validation, enrollment progress tracking & private notes — Flow 05, Flow 06
- [ ] Web: Course purchase flow (`/checkout/[id]`), signed R2 video player, Student Dashboard (`/dashboard`), Course Player (`/my-courses/[id]`) — `pages.md` §2.1, §2.3, §2.5
- [ ] Mobile: Course purchase flow, native video player, Student Dashboard, Course Player with 100% parity — `pages.md` §2.1, §2.3, §2.5

### Phase 4 — Discovery, Reviews, Wishlist & Bundling
- [ ] Backend: search/filters/categories taxonomy tree, rule-based recommendation engine, reviews, wishlist, course bundles / specializations — Flow 04
- [ ] Web: Browse & search (`/courses`), Category Taxonomy pages, Course Detail Reviews (`/courses/[slug]`), Wishlist (`/wishlist`), Bundle Detail (`/bundles/[id]`) — `pages.md` §2.2, §2.4, §2.6
- [ ] Mobile: Browse & search, Category pages, Reviews, Wishlist, Bundle Detail — `pages.md` §2.2, §2.4, §2.6

### Phase 5 — Assessment, Integrity Proctoring & Certification
- [ ] Backend: quiz/exam engine, timed attempts, server-side grading, browser violation logging, Apache PDFBox PDF generation, R2 upload, unique verification code — Flow 07, Flow 08
- [ ] Web: Quiz Builder (`/instructor/courses/[id]/quizzes`), Exam Player (`/exams/[id]/attempt`), full-screen enforcement + tab-switch detection, My Certificates (`/certificates`), Public Certificate Verification QR Page (`/certificates/verify/[code]`) — `pages.md` §2.7, §2.8, §3.5
- [ ] Mobile: Quiz Builder, Exam Player, My Certificates, Verification Page — `pages.md` §2.7, §2.8, §3.5
- [ ] Phase 5b: Camera-based WebRTC proctoring stream, gaze tracking, snapshot logging to R2 (separate sub-project)

### Phase 6 — Multi-Channel Notifications & Community
- [ ] Backend: in-app notifications, Gmail SMTP email dispatch, Twilio SMS alerts, `expo-notifications` push, `CommunicationLog`, per-course Q&A discussion, instructor announcements — Flow 06, Flow 11, Flow 13
- [ ] Web: Notification Center (`/notifications`), Course Player Discussion Tab (`/my-courses/[id]`), Instructor Announcements, TA Scoped Moderation (`/ta/moderation`) — `pages.md` §2.10, §4.3, §5.8
- [ ] Mobile: Notification Center, Course Player Discussion Tab, Announcements, TA Moderation — `pages.md` §2.10, §4.3, §5.8

### Phase 7 — Admin Governance, Revenue Splits & Excel Data Export Engine
- [ ] Backend: admin course moderation, user role manager, category tree editor, instructor revenue split ledger, refund processing, `ExcelExportService` (Apache POI `.xlsx` report generator) — Flow 03, Flow 14
- [ ] Web: Operations Dashboard (`/admin/dashboard`), Course Moderation Queue (`/admin/course-moderation`), User Role Manager (`/admin/users`), Category Taxonomy Editor (`/admin/categories`), Refund Review Queue (`/admin/refunds`), Instructor Revenue Dashboard (`/instructor/revenue`), Apache POI Excel Exporter buttons (`/instructor/reports` & `/admin/reports`) — `pages.md` §3.11, §3.12, §5.1–§5.7
- [ ] Mobile: Full admin panel screens, instructor revenue dashboard, Excel report triggers with 100% parity — `pages.md` §3.11, §3.12, §5.1–§5.7

### Phase 8 — Duolingo Gamification Engine & Motion
- [ ] Backend: daily streak calculation, loss-aversion streak freeze power-ups, XP economy, milestone badges, top-3 podium leaderboard calculation — Flow 10
- [ ] Web: animated micro-interactions (`motion`), badge unlock modals, Top-3 Podium Leaderboard UI (`/leaderboard`) — `pages.md` §2.19
- [ ] Mobile: animated micro-interactions (`react-native-reanimated`), Top-3 Podium Leaderboard screen — `pages.md` §2.19

### Phase 9 — Localization & Multi-Language Support
- [ ] Web: `next-intl` wired across all pages — `pages.md`
- [ ] Mobile: `i18n-js` wired across all native screens — `pages.md`
- [ ] Backend: `localization` domain (language storage, translation endpoints), course subtitle/caption upload — `prd.md` §3.12

### Phase 10 — Judge0 Code Execution Practice Sandbox
- [ ] Backend: `practicehub` (public articles, practice problems, difficulty levels, Problem of the Day), self-hosted Judge0 REST API integration, code submission execution queue & webhook callback — Flow 09
- [ ] Web: Public SEO article list (`/articles`), Article Detail (`/articles/[slug]`), Practice Problems (`/practice`), Code Sandbox Editor (`/practice/[id]`) with Monaco editor — `pages.md` §2.14–§2.17
- [ ] Mobile: Public SEO articles, Practice Problems, Code Sandbox Editor (`/practice/[id]`) with touch-friendly syntax toolbar (`{`, `}`, `;`, `(`, `)`) — `pages.md` §2.14–§2.17

### Phase 11 — 2-Tier AI Assistant Chatbot
- [ ] Backend: `chatbot` (LLM provider client via `WebClient`, per-user rate-limiting before LLM call, Gemini Flash / Groq integration, prompt scoping, quota exhaustion fallback response, logging) — Flow 16
- [ ] Web: Conversational Chatbot UI widget (`/chatbot`), Tier A rule-based course recommendations (zero cost), Tier B LLM Q&A assistant — `pages.md` §2.18
- [ ] Mobile: Conversational Chatbot screen with Tier A + Tier B responses — `pages.md` §2.18

### Phase 12 — AI-Assisted Authoring & Growth Mechanics
- [ ] Backend: AI-generated quiz question drafts (Gemini content parsing), syllabus draft generator, `growth` (student referral links, instructor affiliate link tracking) — Flow 17, Flow 18
- [ ] Web: AI Quiz Draft Generator UI (`/instructor/courses/[id]/quizzes/ai-generate`), Referral & Rewards Manager (`/referrals`) — `pages.md` §2.20, §3.6
- [ ] Mobile: AI Quiz Draft Generator screen, Referral & Rewards screen — `pages.md` §2.20, §3.6

### Phase 13 — Hardening, Compliance, GDPR & Live Deployment
- [ ] Backend: Production Docker hardening, Render deployment, Supabase connection pooler, administrative `AuditLog` inspection (`/admin/audit-logs`), GDPR consent tracking & account erasure (`ConsentRecord`), global system settings override (`/admin/system-settings`) — Flow 13, Flow 15
- [ ] Security & Load Testing: Endpoint rate-limiting audit, dependency vulnerability check, webhook signature security pass
- [ ] Mobile: Visible "check for update" UI built (EAS Update — see `deployment.md` §6), app-store readiness review
- [ ] Hosting Review: Vercel plan reviewed before real payments go live (Hobby prohibits commercial use — see `deployment.md` §4.4)

---

## Decisions & Open Questions Log
*(Settled facts, not progress. Append new entries with a date. Resolved
items get their resolution noted, not deleted.)*

- **2026-09-08 — OPEN:** Who authors the Practice & Content Hub's public
  articles/tutorials (`prd.md` §3.13) — instructors, admins, or a
  dedicated content-editor role? Decide before Phase 10's backend work.
- **2026-09-08 — DECIDED:** Web uses Next.js, mobile uses React
  Native/Expo — two frameworks, sharing logic via the monorepo. Kept the
  split over a single-framework Expo-only alternative to preserve full
  SEO strength for the Practice & Content Hub (`prd.md` §3.13).
- **2026-09-08 — DECIDED:** Full mobile feature parity: Phase 2 course
  authoring and Phase 10's code playground both get full editing
  capability on mobile, not view-only/read-only.
- **2026-09-08 — DECIDED:** PDFBox over iText for certificate generation
  (licensing — `rules.md` §1/§2).
- **2026-09-08 — DECIDED:** Admin functionality is committed on mobile,
  not web-only.
- **2026-09-08 — DECIDED:** Production hosting stack: Vercel (web),
  Render (backend, genuine free tier, known spin-down caveat), Supabase
  (database, session-mode pooler connection required — Render doesn't
  support IPv6 and Supabase's direct connection is IPv6-only), EAS
  Build + EAS Update (mobile). Vercel cannot host the Spring Boot backend
  under any configuration. Full reasoning in `deployment.md`.
- **2026-09-08 — DECIDED:** Folder structure is `frontend/web` (Next.js)
  and `frontend/mobile` (Expo), grouped under one `frontend/` parent.
- **2026-09-08 — DECIDED:** Added a fourth role, Teaching Assistant —
  invited per-course by an Instructor, narrower permissions (grading +
  discussion moderation on assigned courses only, no course creation, no
  revenue access). Full spec in `prd.md` §3.17 and `pages.md` §4.
- **2026-09-08 — DECIDED (explicit user exception):** Live Sessions
  (real-time video) is deferred, not committed — the one deliberate
  exception to the "nothing deferred" policy, made by explicit user
  request after reviewing the real infrastructure cost (self-hosted
  WebRTC SFU or per-minute-billed managed API, neither free-tier
  friendly). See `prd.md` §3.20.
- **2026-09-08 — CRITICAL:** A claim was made that all of Phases 0–13
  were complete. A live-site review found fabricated marketing stats, a
  fake support phone number, and thin/broken pages. This claim also
  directly contradicts this file's own last real state (Phase 2 Unit 1
  just starting) with no session-log evidence bridging the gap. Treat
  Phases 2–13 as entirely unverified — Phase 0 and Phase 1 are exempt
  from this distrust, since they have detailed session-log evidence and
  an independent live-site check backing them up specifically.
- **2026-09-08 — DECIDED:** Added `rules.md` §12, "Build the Complete
  Page, Not the Minimum Literal Reading" — the standing rule that any
  page/feature description in `pages.md` or `prd.md` is scope
  confirmation, not an exhaustive spec; filling in real production-grade
  depth (extra standard fields, live validation, proper edge-case
  handling) is expected initiative, not scope creep, as long as it stays
  within an already-committed page rather than inventing new ones. Demoed
  concretely in `pages.md`'s Register row using a real reference
  (a prior project's actual register/dashboard implementation:
  debounced username availability checks, live password-requirement
  checklists, a custom-themed date picker, multi-widget dashboards).

---

## Session Log
*(Append-only. One short entry per work session.)*

- **2026-09-08** — Planning phase complete across the original six docs.
  Full cross-doc consistency review performed. Folder structure and
  hosting stack finalized.
- **2026-09-08** — Full feature-coverage audit against `architecture.md`
  and `phases.md`. Found and fixed a gap: §3.9 (Community & Engagement)
  had no backend package. Added `community` package.
- **2026-09-08** — Confirmed keeping the Next.js + React Native/Expo
  split over a single-framework alternative.
- **2026-09-08** — Phase 0 Units 1–6 completed and approved: monorepo
  scaffold, Spring Boot init, Flyway baseline migration, Dockerfile +
  docker-compose, design tokens wired into Tailwind, `HealthController`
  + test. Phase 0 100% complete end to end.
- **2026-09-08** — Phase 1 Units 1–7 completed and approved: `User`
  entity/migration, `JwtProvider` + filter, `TotpService`, full auth
  DTOs/service/controller, Next.js web auth infrastructure + pages, Expo
  mobile auth infrastructure + screens, production deployment blueprints
  (`render.yaml`, `vercel.json`, `eas.json`). Phase 1 100% complete.
- **2026-09-08** — Live production deployment verified end to end:
  Supabase (session-mode pooler connection — required, since Render
  doesn't support IPv6 and Supabase's direct connection is IPv6-only),
  Render backend (`/api/v1/health` passing), Vercel web frontend (CORS
  configured against the Vercel domain). Registered a real test user
  through the live site and confirmed it worked.
- **2026-09-08** — A "Full UI/UX Overhaul" was reported (Porto-template
  architecture, Google Fonts, redesigned web and mobile), followed by a
  claim that all of Phases 0–13 were complete. Independently checked the
  live site: found fabricated stats ("15,000+ students," a fake support
  number) and thin/broken pages — meaning the "all complete" claim is
  false and the checkpoint discipline was not actually followed during
  that stretch of work.
- **2026-09-08** — Response to the above: added a fourth role, Teaching
  Assistant (`prd.md` §3.17), plus smaller committed features (§3.18
  account security, §3.19 trust/support/governance pages). Deferred Live
  Sessions (§3.20) as an explicit user-requested exception. Built
  `pages.md` — full page-by-page spec for web and mobile across all five
  roles plus system pages, cross-checked against every committed PRD
  feature. Extended `design.md` (v0.2) with a UI/UX reference section
  (Zomato/Swiggy mobile polish, Hostinger/Dreamhost web polish — flagging
  their rounded aesthetic as a real conflict with this project's
  sharp-corner decision, resolved by borrowing interaction quality only),
  a full-screen layout rule, and a hard rule against fabricated content.
  Corrected this file: it had drifted back to its original "nothing
  started" template during those edits and needed rebuilding from the
  user's actual uploaded progress. Next step: re-verify Phases 2–13 one
  at a time, with actual demonstration, before trusting or rebuilding
  anything.
- **2026-09-08** — Added `rules.md` §12 ("Build the Complete Page, Not
  the Minimum Literal Reading") and `architecture.md` v0.8 (missing Auth
  Flow endpoints for username-check/forgot-password/reset-password that
  `pages.md` had already required but the API contract never reflected).
- **2026-09-08** — Reset every checkbox in the Completion Checklist to
  unchecked, at explicit user request — including Phase 0 and Phase 1,
  which had previously been left checked on the strength of session-log
  evidence and an independent live-site check. That evidence is
  preserved in this log and remains a reasonable basis for a quick
  re-confirmation pass, but nothing is trusted by default anymore.
  Starting point for the next session: re-verify from Phase 0.
- **2026-09-08** — Fixed two real problems reported: (1) features
  existing on mobile with no web equivalent (or vice versa) — added
  `rules.md` §13, "Full Parity Is Mandatory," and split every checklist
  item above from combined "Web + Mobile" boxes into separate Web/Mobile
  boxes so partial-platform completion can't hide inside one checkbox
  again. (2) Fonts being hand-fixed per-file on mobile — root cause was
  that no styling solution or font-loading mechanism was ever defined
  for mobile at all (`design.md`'s token system is CSS-variable-based,
  web-only). Added NativeWind as mobile's styling solution and a
  mandatory global-font-loading pattern to `rules.md` §14, and updated
  `design.md` §3 to describe both platforms' font mechanisms explicitly.
- **2026-09-10** — Phase 2 (Instructor Approval & Course Authoring) completed across Backend, Web, and Mobile with 100% full parity:
  - Backend: Presigned media upload URL endpoint (`POST /api/v1/media/upload-url`), drip scheduling (`drip_delay_days`), Flyway V14 migration, full section/lesson CRUD endpoints, verified `mvn test` (7/7 pass).
  - Web: Admin approval queue (`/instructor-applications`), course creator (`/courses/create`), curriculum builder (`/courses/[id]/builder`) with drip & preview toggles. Verified with `npx tsc --noEmit` (0 errors).
  - Mobile: Apply instructor screen (`apply-instructor.tsx`), Admin review screen (`applications.tsx`), Instructor courses list (`courses.tsx`), Course creator (`create-course.tsx`), Curriculum builder (`course-builder.tsx`). Verified with `npx tsc --noEmit` (0 errors).
- **2026-09-10** — User requested a fresh start. Created full zip backup in `backup/elearny-lms-backup.zip` (1.0MB). Removed existing `backend/` and `frontend/` folders. Reset completion checklist to Phase 0 — Foundation.
- **2026-09-11** — Expanded `rules.md` to **v1.0**: Updated §12 ("Build High-Density, Production-Grade Pages — No Thin / Minimal Output") to strictly forbid minimal 2-field screens, requiring rich multi-widget card grids, status badges, live field requirements, and multi-state rendering. Updated §13 ("Strict 100% Web & Mobile Feature & Content Parity") to mandate that every feature, input, and creation workflow on Web is 100% available on Mobile.
- **2026-09-11** — Supercharged documentation suite (`prd.md` v0.9, `architecture.md` v1.1, `rules.md` v1.0, `design.md` v0.5, `phases.md` v0.7, `deployment.md` v0.8, `pages.md` v0.5). Integrated architectural research for Judge0 Sandbox Code Execution Queue, Duolingo Gamification Engine (Loss Aversion Streaks, Freeze, XP Podium), Canvas LMS 5-Role Academic Control (Student, Instructor, TA, Admin, Super Admin), and AI Assistant/Authoring layer.
- **2026-09-11** — Created `processflows.md` **v1.0** (18 exhaustive process flows covering Auth, Instructor Elevation, Authoring/Drip Release, Razorpay Webhook Checkout, Judge0 Sandbox Execution Queue, Duolingo Gamification, TA Scoped Operations, Office Hours/Waitlists, Audit Logging, and 2-Tier AI) and expanded `pages.md` to **v1.0** (40+ detailed screen specifications across 5 roles with component trees, navigation links, empty-state CTAs, and Web/Mobile layout rules).






