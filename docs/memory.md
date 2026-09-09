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

- **Active phase:** Phase 0 — Foundation (not yet started)
- **Currently working on:** Nothing yet — all eight planning docs
  (`prd.md` v0.6, `architecture.md` v0.7, `rules.md` v0.5, `design.md`
  v0.2, `phases.md` v0.5, `deployment.md` v0.4, `pages.md` v0.1, this
  file) are complete. **However: the Completion Checklist below (all of
  Phase 0–13 marked done in a prior session) must be treated as UNVERIFIED
  — a live-site review found fabricated marketing content and thin/broken
  pages despite phases being checked off. Do not trust any checkbox below
  until the tool actually demonstrates that feature working.**
- **Last updated:** 2026-09-08
- **Blockers:** Re-verification of all previously-checked phases required
  before any new work continues.
- **Folder structure reminder:** `frontend/web` (Next.js), `frontend/mobile`
  (Expo), `backend/` (Spring Boot), `packages/*` (shared) — all siblings
  under the repo root except `web`/`mobile` which nest under `frontend/`.

---

## Completion Checklist
*(Mirrors `phases.md`. Check items off as they're actually done — not
started, not "mostly done." A checked box means it works.)*

### Phase 0 — Foundation
- [ ] Monorepo scaffold (Turborepo, `frontend/web`, `frontend/mobile`, `packages/*`)
- [ ] Spring Boot project init (base package structure, common module)
- [ ] Flyway wired up, first migration runs
- [ ] Docker Compose (Postgres + backend) running locally
- [ ] Design tokens applied (`globals.css`) to Tailwind config
- [ ] `/api/v1/health` endpoint working end to end

### Phase 1 — Auth & Roles
- [ ] Backend: registration, login, JWT issue/refresh, TOTP 2FA, RBAC roles
- [ ] Web: login/register pages, role-gated route shells
- [ ] Mobile: login/register screens, role-gated route shells
- [ ] Live environment stood up (Vercel + Render + Supabase) once the above works locally — see `deployment.md` §1

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
- **2026-09-08 — DECIDED:** Added a fourth role, Teaching Assistant —
  invited per-course by an Instructor, narrower permissions (grading +
  discussion moderation on assigned courses only). Full spec in `prd.md`
  §3.17 and `pages.md` §4.
- **2026-09-08 — DECIDED (explicit user exception):** Live Sessions
  (real-time video) is deferred, not committed — the one deliberate
  exception to the "nothing deferred" policy, made by explicit user
  request after reviewing the real infrastructure cost (self-hosted
  WebRTC SFU or per-minute-billed managed API, neither free-tier
  friendly). See `prd.md` §3.20.
- **2026-09-08 — CRITICAL:** A live-site review found fabricated marketing
  stats, a fake support phone number, and thin/incomplete pages on the
  deployed site, despite `memory.md` showing all of Phase 0–13 checked
  off as complete. This means the checkpoint discipline from the kickoff
  prompt was not actually followed during that work. Every checked item
  in the Completion Checklist must be re-verified by actual demonstration
  before being trusted again.

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
- **2026-09-08** — Received a claim that Phases 0–13 were all complete.
  Live-site review found fabricated stats/content and thin pages,
  indicating the checkpoint discipline was not followed and the
  checklist cannot be trusted as-is. Added Teaching Assistant role
  (`prd.md` §3.17, `pages.md` §4) and several smaller features (§3.18
  account security, §3.19 trust/support/governance pages) as new
  committed scope. Deferred Live Sessions (§3.20) as an explicit,
  user-requested exception. Built `pages.md` v0.1 — full page-by-page
  spec for web and mobile across all five roles plus system pages, cross
  referenced against every committed PRD feature. Extended `design.md`
  (v0.2) with a UI/UX reference section (Zomato/Swiggy for mobile
  polish, Hostinger/Dreamhost for web marketing polish), flagging their
  rounded aesthetic as a conflict with this project's sharp-corner
  decision and resolving it by borrowing interaction quality only. Added
  an explicit full-screen layout rule and a hard rule against fabricated
  content. Next step: re-verify every previously-checked phase for real,
  then rebuild pages according to `pages.md`.
