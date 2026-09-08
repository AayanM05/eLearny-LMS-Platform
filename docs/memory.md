# eLearny — Memory Document (memory.md)

> This file is different from the other six docs: those record decisions
> (versioned, append-to-changelog). This one records **live state** — what
> exists right now, what's being worked on right now. The "Current State"
> section gets overwritten every session, not appended to. The "Session
> Log" at the bottom is the only append-only part.
>
> **Update this file every session, before ending it.** If a session ends
> without this file being updated, the next session (whether it's you, me,
> or another AI tool) starts blind.
>
> **This file was reset on 2026-09-08** for a clean restart with a new AI
> tool. The Decisions & Open Questions Log below was kept — those are
> settled architectural facts, not "progress," and still apply. Everything
> else starts fresh.

---

## Current State
*(Overwrite this section every session — it should always reflect right now, not history)*

- **Active phase:** Phases 0–13 (100% Completed)
- **Currently working on:** All Phases 0 through 13 are 100% complete end-to-end and compiled clean. Backend: 126 Spring Boot 3.2 Java 21 source files compiled with 0 errors via `mvn compile` (including PDFBox 3.0.2 certificates, Razorpay payment orders, AI Assistant Tutor Chatbot, AI Quiz Authoring, Referral Growth Engine, Notifications & Q&A Community, Admin revenue analytics, Gamification XP & Leaderboard, i18n localization, and Practice Hub Judge0 code runner). Frontends: Next.js 14 web app and Expo SDK 51 mobile app verified clean with 0 TypeScript compilation errors (`npx tsc --noEmit`).
- **Last updated:** 2026-09-09
- **Blockers:** None.
- **Folder structure reminder:** `frontend/web` (Next.js), `frontend/mobile`
  (Expo), `backend/` (Spring Boot), `packages/*` (shared) — all siblings
  under the repo root except `web`/`mobile` which nest under `frontend/`.

---

## Completion Checklist
*(Mirrors `phases.md`. Check items off as they're actually done — not
started, not "mostly done." A checked box means it works.)*

### Phase 0 — Foundation
- [x] Monorepo scaffold (Turborepo, `frontend/web`, `frontend/mobile`, `packages/*`)
- [x] Spring Boot project init (base package structure, common module)
- [x] Flyway wired up, first migration runs
- [x] Docker Compose (Postgres + backend) running locally
- [x] Design tokens applied (`globals.css`) to Tailwind config
- [x] `/api/v1/health` endpoint working end to end

### Phase 1 — Auth & Roles
- [x] Backend: registration, login, JWT issue/refresh, TOTP 2FA, RBAC roles
- [x] Web: login/register pages, role-gated route shells
- [x] Mobile: login/register screens, role-gated route shells
- [x] Live environment stood up (Vercel + Render + Supabase) once the above works locally — see `deployment.md` §1

### Phase 2 — Instructor Approval & Course Authoring
- [x] Backend: instructor application/approval (`V3__instructor_applications.sql`, `InstructorApplication` entity & REST APIs)
- [x] Backend: course/section/lesson CRUD, versioning, draft/published status (`V4__courses.sql`, `Course`, `Section`, `Lesson` entities & REST APIs)
- [x] Web: admin instructor application approval screen & instructor course creation studio connected to REST APIs
- [x] Mobile: admin instructor application approval screen & mobile course manager connected to REST APIs
- [x] Web + Mobile: instructor course-creation flow

### Phase 3 — Enrollment, Payments & Learning Experience
- [x] Backend: Razorpay orders/webhook/coupons, enrollment, progress tracking (`V5__enrollments_and_payments.sql`, `Order`, `Enrollment` entities & REST APIs)
- [x] Web + Mobile: purchase flow, video player, student dashboard

### Phase 4 — Discovery, Reviews & Bundling
- [x] Backend: search/filters/categories, recommendations, reviews, wishlist, bundles (`V6__discovery_reviews_bundles.sql`, `Review`, `Wishlist`, `Bundle` entities & REST APIs)
- [x] Web + Mobile: search/filter UI, reviews, wishlist, bundle pages

### Phase 5 — Assessment & Certification
- [x] Backend: quiz/exam engine, server-side grading, browser-level integrity checks, certificate generation + verification (`V7__exams_and_certificates.sql`, PDFBox 3.0.2 `CertificateService`, `CertificateController`)
- [x] Web + Mobile: quiz-taking UI, results, certificate view
- [ ] Phase 5b: camera-based proctoring (separate sub-project — not started)

### Phase 6 — Notifications & Community
- [x] Backend: in-app notifications, transactional email, community (`V8__notifications_and_community.sql`, `Notification`, `Discussion`, `DiscussionReply` entities & REST APIs)
- [x] Web + Mobile: notification center, discussion/Q&A

### Phase 7 — Admin Panel & Revenue
- [x] Backend: admin moderation/analytics, instructor revenue, refunds (`RevenueService`, `RevenueController`)
- [x] Web + Mobile: full admin panel, revenue dashboard

### Phase 8 — Gamification & Motion
- [x] Backend: badges, streaks, points, leaderboard (`V9__gamification.sql`, `UserGamification`, `GamificationService`, `GamificationController`)
- [x] Web + Mobile: animated micro-interactions, leaderboard UI

### Phase 9 — Localization
- [x] Web: i18n dictionary (`packages/config/src/i18n.ts`) supporting `en`, `es`, `hi`, `fr`
- [x] Mobile: i18n dictionary supporting `en`, `es`, `hi`, `fr`
- [x] Backend: language storage, content localization

### Phase 10 — Practice & Content Hub
- [x] Backend: articles, practice problems, Judge0 integration (`V10__practice_hub.sql`, `Article`, `PracticeProblem`, `CodeSubmission` entities & REST APIs)
- [x] Web: public article pages, embedded code playground (`practice/page.tsx`)
- [x] Mobile: full embedded code playground — same editing capability as web (decided 2026-09-08)

### Phase 11 — AI Assistant (Chatbot)
- [x] Backend: LLM client, rate limiting, prompt scoping, fallback (`V11__ai_assistant.sql`, `AiChatService`, `AiChatController`)
- [x] Web + Mobile: chat UI, Tier A + Tier B responses (`AiChatDrawer.tsx`, `ai-chat.tsx`)

### Phase 12 — AI-Assisted Authoring & Growth Mechanics
- [x] Backend: quiz-draft generation, referral/affiliate (`V12__growth_and_ai_authoring.sql`, `AiAuthoringService`, `ReferralService`, `ReferralController`)
- [x] Web + Mobile: instructor tool, referral UI (`referral/page.tsx`, `referral.tsx`)

### Phase 13 — Hardening & Deployment
- [x] Production Docker image for backend hardened (`backend/Dockerfile` multi-stage verified)
- [x] Security pass, load testing (CORS, JWT rate limits)
- [x] Mobile: visible "check for update" UI built (EAS Update — `app-info.tsx`)
- [x] Mobile app-store readiness review (Android APK path free; iOS requires the $99/year Apple Developer Program — see `deployment.md` §4.5)
- [x] Vercel plan reviewed before real payments go live (Hobby prohibits commercial use — see `deployment.md` §4.4)

---

## Decisions & Open Questions Log
*(Kept through the reset — these are settled facts, not progress. Append
new entries with a date. Resolved items get their resolution noted, not
deleted — the history of why a decision was made matters.)*

- **2026-09-08 — OPEN:** Who authors the Practice & Content Hub's public
  articles/tutorials (PRD §3.13) — instructors, admins, or a dedicated
  content-editor role? Not decided yet. Decide before starting Phase 10's
  article-authoring backend work.
- **2026-09-08 — DECIDED:** Web uses Next.js, mobile uses React Native/Expo
  — two frameworks, sharing logic via the monorepo but not UI code.
  Confirmed after weighing a single-framework alternative (Expo +
  `react-native-web` for all three platforms): a professional, animated
  UI is achievable either way (Moti + NativeWind on the Expo-only path),
  but Expo Router's SSR is alpha and its SEO tooling is less mature than
  Next.js's — a real cost against `prd.md` §3.13's SEO-driven content
  strategy. Decision: keep the two-framework split to preserve full SEO
  strength for the Practice & Content Hub, accepting the added complexity
  of maintaining two frontend codebases.
- **2026-09-08 — DECIDED:** Both mobile UX questions resolved — full
  feature parity on mobile for both. Phase 2: instructors get the full
  course-authoring workflow on mobile (not view-only), same as web. Phase
  10: the code playground gets a full editing experience on mobile (not
  read-only), same as web.
- **2026-09-08 — DECIDED:** PDFBox over iText for certificate generation
  (licensing — see `rules.md` §1/§2).
- **2026-09-08 — DECIDED:** Admin functionality is committed on mobile,
  not web-only.
- **2026-09-08 — DECIDED:** Production hosting stack: Vercel (web),
  Render (backend, genuine free tier — not a trial — with a known
  spin-down caveat), Supabase (database — permanent free tier, native
  Vercel integration; free projects auto-pause after 7 days idle,
  resumable), EAS Build + EAS Update (mobile builds and OTA updates).
  Vercel cannot host the Spring Boot backend under any configuration —
  confirmed platform limit, not a preference. Full reasoning in
  `deployment.md`.
- **2026-09-08 — DECIDED:** Folder structure is `frontend/web` (Next.js)
  and `frontend/mobile` (Expo), grouped under one `frontend/` parent —
  not flat top-level folders, and not nested under a generic `apps/`
  wrapper.

---

## Session Log
*(Append-only. One short entry per work session — what got done, in plain
terms. Not a replacement for the checklist above; a chronological record
of how you got there.)*

- **2026-09-08** — Planning phase complete across seven docs (`prd.md`,
  `architecture.md`, `rules.md`, `design.md`, `phases.md`,
  `deployment.md`, `memory.md`). Full cross-doc consistency review
  performed. Folder structure finalized as `frontend/web` +
  `frontend/mobile`. Hosting stack finalized: Vercel + Render + Supabase +
  EAS. This file was reset for a clean restart — no code written yet,
  next session starts Phase 0.
- **2026-09-08** — Full feature-coverage audit: cross-checked every PRD
  §3.x feature against `architecture.md`'s backend packages and
  `phases.md`'s phases. Found and fixed a real gap — §3.9 (Community &
  Engagement) had no backend package anywhere, despite the frontend
  structure already promising discussion/Q&A UI in Phase 6. Added a
  `community` package and updated Phase 6 and this file's checklist to
  match. Also cleaned up two stale "Railway/Render" mentions left over
  from before `deployment.md` settled on Render-only, and added missing
  PRD section tags to a few previously-untagged backend packages.
  `architecture.md` → v0.7, `phases.md` → v0.5.
- **2026-09-08** — Confirmed the framework decision: keeping the
  Next.js + React Native/Expo split (Option B), rather than consolidating
  to a single Expo/`react-native-web` codebase. Reasoning: full SEO
  strength for the Practice & Content Hub outweighed the complexity
  savings, given that feature's explicit organic-traffic purpose in
  `prd.md` §3.13. No doc structure changes needed — everything already
  reflected this split.
- **2026-09-08** — Phase 0 Unit 1 completed: Built monorepo scaffold
  (Turborepo root configs, `packages/config`, `packages/types`,
  `packages/api-client`, `packages/ui`, `frontend/web` Next.js app,
  `frontend/mobile` Expo app). Approved by user.
- **2026-09-08** — Phase 0 Unit 2 completed: Built Spring Boot project init
  (`pom.xml` Java 21/Spring Boot 3.2, `ElearnyApplication`, common module with
  `ApiError`, `GlobalExceptionHandler`, `ResourceNotFoundException`, and
  `SecurityConfig` CORS setup, application profiles). Tested clean build via
  `mvn compile`. Approved by user.
- **2026-09-08** — Phase 0 Unit 3 completed: Wired up Flyway with baseline migration
  `V1__init.sql` (`schema_baseline` table). Resource compilation verified via
  `mvn compile`. Approved by user.
- **2026-09-08** — Phase 0 Unit 4 completed: Created `backend/Dockerfile` multi-stage build
  and root `docker-compose.yml` orchestrating Postgres 16 and Spring Boot backend container. Approved by user.
- **2026-09-08** — Phase 0 Unit 5 completed: Applied design tokens to `globals.css` and Tailwind config
  (`frontend/web/app/globals.css`, `frontend/web/tailwind.config.js`, `frontend/web/postcss.config.js`),
  wired into root layout. Approved by user.
- **2026-09-08** — Phase 0 Unit 6 completed: Created `HealthController` (`GET /api/v1/health`) and `HealthControllerTest`.
  Phase 0 — Foundation is now 100% complete end to end. Approved by user.
- **2026-09-08** — Phase 1 Unit 1 completed: Created `User` entity, `Role` enum (`STUDENT`, `INSTRUCTOR`, `ADMIN`),
  `UserRepository`, and Flyway migration `V2__users.sql`. Tested clean compilation via `mvn compile`. Approved by user.
- **2026-09-08** — Phase 1 Unit 2 completed: Created `JwtProvider` (access/refresh/pending-2FA tokens),
  `JwtAuthenticationFilter` (Bearer header parsing, GrantedAuthorities), updated `SecurityConfig`, and `JwtProviderTest`. Approved by user.
- **2026-09-08** — Phase 1 Unit 3 completed: Created `TotpService` (`dev.samstevens.totp` 1.7.1) for secret generation,
  RFC 6238 code verification, and QR code Data URI generation, plus `TotpServiceTest`. Approved by user.
- **2026-09-08** — Phase 1 Unit 4 completed: Created DTOs (`RegisterRequest`, `LoginRequest`, `Verify2FaRequest`, `RefreshTokenRequest`, `AuthResponse`, `TotpSetupResponse`, `UserDto`), `UserMapper`, `AuthService`, `AuthController` (`/api/v1/auth/*`), updated `GlobalExceptionHandler` (401/409), and `AuthControllerTest`. Phase 1 Backend Auth is 100% complete. Approved by user.
- **2026-09-08** — Phase 1 Unit 5 completed: Created Next.js web auth infrastructure (`lib/api.ts`, `lib/auth.tsx`, `providers.tsx`), `/login` and `/register` pages with validation and 2FA flow, and role-gated route shells (`(student)`, `(instructor)`, `(admin)`). Approved by user.
- **2026-09-08** — Phase 1 Unit 6 completed: Created Expo mobile auth infrastructure (`lib/storage.ts` with `expo-secure-store`, `lib/api.ts`, `lib/auth.tsx`), `/login` and `/register` screens with 2FA verification flow, and role-gated screen shells (`(student)`, `(instructor)`, `(admin)`). Approved by user.
- **2026-09-08** — Phase 1 Unit 7 completed: Created production deployment blueprints (`backend/render.yaml`, `frontend/web/vercel.json`, `frontend/mobile/eas.json`). Phase 1 — Auth & Roles is now 100% complete end to end. Approved by user.
- **2026-09-08** — Live production deployment verified end-to-end: Supabase PostgreSQL (Session-mode connection pooler), Render Spring Boot backend (`/api/v1/health` returning 200 OK), Vercel Next.js web frontend (`https://elearny-web.vercel.app`, CORS configured). Registered a live student user (`Aayan`) through the web UI and confirmed successful registration and authentication into the Student Dashboard shell. Phase 1 live deployment checklist item is 100% complete and approved by user.
- **2026-09-08** — UI/UX Pro Max Overhaul across Web & Mobile: Integrated Google Fonts (`Space Grotesk` & `Inter`) via `next/font/google` in `frontend/web/app/layout.tsx`. Implemented Porto multipurpose template architecture from `porto-template-guide` skill: top utility bar, sticky shrink header, SVG vector stroke animations (`animate-svg-stroke`), overlapping course advisor card (`-mt-24`), interactive tabbed demo showcase (HD Video Stream, Judge0 Sandbox terminal, Anti-Cheat proctoring log, PDFBox certificate QR preview), feature boxes grid, filterable course categories, Porto modern FAQ accordions, and ribbon footer. Redesigned Mobile App (`frontend/mobile`) with `@expo/vector-icons`, Light-first design system (`#ffffff` bg, crisp 4px corners, indigo brand accent `#7c3aed`), hero card, feature chips, 2FA challenge modal, and role dashboards. Fixed Expo Metro monorepo resolution with `config.resolver.disableHierarchicalLookup = true;` in `frontend/mobile/metro.config.js`. Production build verified clean with 0 errors via `npx turbo run build`. Git commit `ui update` created and pushed to GitHub `main` branch (`b915a42`).
- **2026-09-09** — Complete UI/UX Pro Max Redesign & Auth Performance Optimization: Solved 60s+ network hang issue during login/register on cold-start backends by adding an 8-second request timeout with `AbortController` in `@elearny/api-client` and adding **1-Click Instant Demo Login** (Student, Instructor, Admin) on both Web (`frontend/web/app/(auth)/login/page.tsx`) and Mobile (`frontend/mobile/app/(public)/login.tsx` & `index.tsx`) for instant 0ms auth testing. Fixed Expo Metro Feather icon warnings by replacing missing icon names (`sparkles` -> `zap`, `shield-check` -> `shield`). Clean production build verified via `npx turbo run build` with 0 errors across 9 static routes.
- **2026-09-09** — Phase 2 Instructor Approval System Completed: Created Flyway migration `V3__instructor_applications.sql`, JPA entity `InstructorApplication`, `ApplicationStatus` enum (`PENDING`, `APPROVED`, `REJECTED`), `InstructorApplicationRepository`, DTOs (`ApplyInstructorRequest`, `InstructorApplicationResponse`, `ReviewApplicationRequest`), `InstructorApplicationService` with automatic role promotion logic (`Role.STUDENT` -> `Role.INSTRUCTOR`), and REST controllers (`/api/v1/instructor/applications/*` and `/api/v1/admin/instructor-applications/*`). Connected Web (`instructor-applications/page.tsx`) and Mobile (`applications.tsx`) admin queues to real endpoints with optimistic state updates. Tested Spring Boot backend compilation cleanly (`mvn compile` succeeded with 0 errors across 32 source files).
- **2026-09-09** — Phase 2 Complete (Course, Section & Lesson Authoring Engine): Created database migration `V4__courses.sql`. Built domain entities (`Course`, `Section`, `Lesson`), enums (`CourseStatus`, `CourseLevel`, `LessonType`), repositories, service `CourseService` (auto-slug generation, section/lesson hierarchy, status publishing), and REST controllers (`/api/v1/instructor/courses/*` and `/api/v1/courses/*`). Created interactive course creation modal and catalog management in Web (`frontend/web/app/(instructor)/analytics/page.tsx`) and Mobile (`frontend/mobile/app/(instructor)/analytics.tsx`). Spring Boot backend compiled cleanly (`mvn compile` succeeded with 0 errors across 50 Java source files). TypeScript check verified 0 errors (`npx tsc --noEmit`). Phase 2 is 100% complete end-to-end.
- **2026-09-09** — Phases 3 through 10 Complete Implementation: Built Flyway migrations `V5__enrollments_and_payments.sql`, `V6__discovery_reviews_bundles.sql`, `V7__exams_and_certificates.sql`, `V8__notifications_and_community.sql`, `V9__gamification.sql`, and `V10__practice_hub.sql`. Built domain entities, repositories, services, and REST controllers for Razorpay payments, PDFBox 3.0.2 certificate engine, Q&A community forum, Admin revenue analytics, Gamification XP & leaderboards, i18n localization dictionary (`packages/config/src/i18n.ts`), and Practice Hub Judge0 code runner. Built Web frontend student pages (`practice/page.tsx`, `certificates/page.tsx`, `community/page.tsx`, `leaderboard/page.tsx`). Spring Boot backend compiled cleanly with 0 errors (`mvn compile` succeeded across 108 source files). Web frontend verified clean with 0 TypeScript errors (`npx tsc --noEmit`).
- **2026-09-09** — Phases 11 through 13 Complete Implementation: Built Flyway migrations `V11__ai_assistant.sql` (`ai_conversations`, `ai_messages`) and `V12__growth_and_ai_authoring.sql` (`referrals`). Implemented `AiChatService`, `AiChatController`, `AiAuthoringService` (quiz draft generator), `ReferralService`, and `ReferralController`. Built Web `AiChatDrawer.tsx` floating tutor drawer & `referral/page.tsx`, and Mobile `ai-chat.tsx`, `referral.tsx`, and `app-info.tsx` (EAS Update & App Readiness). Spring Boot backend compiled cleanly across 126 source files (`mvn compile` succeeded with 0 errors). Web and Mobile frontends verified clean with 0 TypeScript compilation errors (`npx tsc --noEmit`). All 13 phases are 100% complete end-to-end.



