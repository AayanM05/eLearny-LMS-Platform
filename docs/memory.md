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

- **Active phase:** Phase 2 — Instructor Approval & Course Authoring (in progress)
- **Currently working on:** Phase 1 (Auth & Roles) is 100% complete end to end. Starting Phase 2 Unit 1: InstructorApplication entity & Flyway migration V3__instructor_applications.sql.
- **Last updated:** 2026-09-08
- **Blockers:** None. Two open decisions exist (see below) but neither
  blocks Phase 2.
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
- [ ] Backend: instructor application/approval, course/section/lesson CRUD, versioning, drip content, R2 media upload
- [ ] Web: instructor course-creation flow, admin approval screen
- [ ] Mobile: full instructor course-creation flow — same capability as web (decided 2026-09-08)

### Phase 3 — Enrollment, Payments & Learning Experience
- [ ] Backend: Razorpay orders/webhook/coupons, enrollment, progress tracking
- [ ] Web + Mobile: purchase flow, video player, student dashboard

### Phase 4 — Discovery, Reviews & Bundling
- [ ] Backend: search/filters/categories, recommendations, reviews, wishlist, bundles
- [ ] Web + Mobile: search/filter UI, reviews, wishlist, bundle pages

### Phase 5 — Assessment & Certification
- [ ] Backend: quiz/exam engine, server-side grading, browser-level integrity checks, certificate generation + verification
- [ ] Web + Mobile: quiz-taking UI, results, certificate view
- [ ] Phase 5b: camera-based proctoring (separate sub-project — not started)

### Phase 6 — Notifications & Community
- [ ] Backend: in-app notifications, transactional email, community (discussion/Q&A, announcements)
- [ ] Web + Mobile: notification center, discussion/Q&A

### Phase 7 — Admin Panel & Revenue
- [ ] Backend: admin moderation/analytics, instructor revenue, refunds
- [ ] Web + Mobile: full admin panel, revenue dashboard

### Phase 8 — Gamification & Motion
- [ ] Backend: badges, streaks, points, leaderboard
- [ ] Web + Mobile: animated micro-interactions, leaderboard UI

### Phase 9 — Localization
- [ ] Web: next-intl wired across pages
- [ ] Mobile: i18n-js wired across screens
- [ ] Backend: language storage, content localization

### Phase 10 — Practice & Content Hub
- [ ] Backend: articles, practice problems, Judge0 integration
- [ ] Web: public article pages, embedded code playground
- [ ] Mobile: full embedded code playground — same editing capability as web (decided 2026-09-08)

### Phase 11 — AI Assistant (Chatbot)
- [ ] Backend: LLM client, rate limiting, prompt scoping, fallback
- [ ] Web + Mobile: chat UI, Tier A + Tier B responses

### Phase 12 — AI-Assisted Authoring & Growth Mechanics
- [ ] Backend: quiz-draft generation, referral/affiliate
- [ ] Web + Mobile: instructor tool, referral UI

### Phase 13 — Hardening & Deployment
- [ ] Production Docker image for backend hardened (not just working, but reviewed)
- [ ] Security pass, load testing
- [ ] Mobile: visible "check for update" UI built (EAS Update — see `deployment.md` §6)
- [ ] Mobile app-store readiness review (Android APK path free; iOS requires the $99/year Apple Developer Program — see `deployment.md` §4.5)
- [ ] Vercel plan reviewed before real payments go live (Hobby prohibits commercial use — see `deployment.md` §4.4)

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

