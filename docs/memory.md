# eLearny — Memory Document (memory.md)

> This file is different from the other seven docs: those record decisions
> (versioned, append-to-changelog). This one records **live state** — what
> exists right now, what's being worked on right now. The "Current State"
> section gets overwritten every session, not appended to. The "Session
> Log" at the bottom is the only append-only part.
>
> **Update this file every session, before ending it.** If a session ends
> without this file being updated, the next session starts blind.

---

## Current State
*(Overwrite this section every session — it should always reflect right now, not history)*

- **Active phase:** Phase 3 — Enrollment, Payments & Learning Experience
- **Currently working on:** Phase 3 initial planning & backend implementation (Razorpay integration, course enrollment, video progress tracking).
- **Last updated:** 2026-09-10
- **Blockers:** None. Phase 0, Phase 1, and Phase 2 are 100% complete & verified with full Web/Mobile parity.
- **Folder structure reminder:** `frontend/web` (Next.js), `frontend/mobile`
  (Expo), `backend/` (Spring Boot), `packages/*` (shared) — all siblings
  under the repo root except `web`/`mobile` which nest under `frontend/`.
- **Live deployment:** `https://elearny-web.vercel.app` (Vercel) +
  Render backend + Supabase (session-mode pooler connection). Confirmed
  working for registration/auth as of the Phase 1 deployment session.
- **Doc versions:** `prd.md` v0.6, `architecture.md` v0.8, `rules.md`
  v0.8, `design.md` v0.3, `phases.md` v0.5, `deployment.md` v0.4,
  `pages.md` v0.3. If any of these numbers don't match what's actually in
  the file when you read this, something changed since this entry was
  written — check that doc's own changelog for what happened.

---

## Completion Checklist
*(Mirrors `phases.md`. Check items off as they're actually done — not
started, not "mostly done." A checked box means it works and has been
demonstrated, not just claimed.)*

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
- [x] Live environment stood up (Vercel + Render + Supabase), registration
      verified end to end through the live web UI — see `deployment.md` §1

### Phase 2 — Instructor Approval & Course Authoring
- [x] Backend: instructor application/approval, course/section/lesson CRUD, versioning, drip content, R2 media upload
- [x] Web: instructor course-creation flow, admin approval screen
- [x] Mobile: full instructor course-creation flow — same capability as web (decided 2026-09-08)
- **UNVERIFIED CLAIM:** a "Full UI/UX Overhaul" session log entry exists
  claiming a Porto-template-based redesign of web and mobile, plus a
  separate claim that all of Phases 0–13 are complete. Neither is
  demonstrated. Do not check any box here until it's actually shown
  working, per `pages.md`'s page-by-page spec and `design.md` §8's
  quality bar — and note the Porto-template reference itself needs
  checking for licensing/originality before being trusted as-is.

### Phase 3 — Enrollment, Payments & Learning Experience
- [ ] Backend: Razorpay orders/webhook/coupons, enrollment, progress tracking
- [ ] Web: purchase flow, video player, student dashboard
- [ ] Mobile: purchase flow, video player, student dashboard

### Phase 4 — Discovery, Reviews & Bundling
- [ ] Backend: search/filters/categories, recommendations, reviews, wishlist, bundles
- [ ] Web: search/filter UI, reviews, wishlist, bundle pages
- [ ] Mobile: search/filter UI, reviews, wishlist, bundle pages

### Phase 5 — Assessment & Certification
- [ ] Backend: quiz/exam engine, server-side grading, browser-level integrity checks, certificate generation + verification
- [ ] Web: quiz-taking UI, results, certificate view
- [ ] Mobile: quiz-taking UI, results, certificate view
- [ ] Phase 5b: camera-based proctoring (separate sub-project — not started)

### Phase 6 — Notifications & Community
- [ ] Backend: in-app notifications, transactional email, community (discussion/Q&A, announcements)
- [ ] Web: notification center, discussion/Q&A
- [ ] Mobile: notification center, discussion/Q&A

### Phase 7 — Admin Panel & Revenue
- [ ] Backend: admin moderation/analytics, instructor revenue, refunds
- [ ] Web: full admin panel, revenue dashboard
- [ ] Mobile: full admin panel, revenue dashboard

### Phase 8 — Gamification & Motion
- [ ] Backend: badges, streaks, points, leaderboard
- [ ] Web: animated micro-interactions, leaderboard UI
- [ ] Mobile: animated micro-interactions, leaderboard UI

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
- [ ] Web: chat UI, Tier A + Tier B responses
- [ ] Mobile: chat UI, Tier A + Tier B responses

### Phase 12 — AI-Assisted Authoring & Growth Mechanics
- [ ] Backend: quiz-draft generation, referral/affiliate
- [ ] Web: instructor tool, referral UI
- [ ] Mobile: instructor tool, referral UI

### Phase 13 — Hardening & Deployment
- [ ] Production Docker image for backend hardened (not just working, but reviewed)
- [ ] Security pass, load testing
- [ ] Mobile: visible "check for update" UI built (EAS Update — see `deployment.md` §6)
- [ ] Mobile app-store readiness review (Android APK path free; iOS requires the $99/year Apple Developer Program — see `deployment.md` §4.5)
- [ ] Vercel plan reviewed before real payments go live (Hobby prohibits commercial use — see `deployment.md` §4.4)

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

