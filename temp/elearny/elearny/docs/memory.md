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

- **ACTIVE MIGRATION from `elearny_v0`** — this is no longer a from-scratch
  build. `migration.md` is the authoritative plan; its own **M0–M8** phases
  (distinct from `phases.md`'s Phase 0–10/V2-A–G feature-sequencing phases)
  now govern what "next" means. This checklist below mirrors `migration.md`
  §10's phases, not `phases.md`'s — `phases.md` still governs feature
  *content and sequencing* once the migration's structural phases (M1–M4)
  are done, per `migration.md` §1.
- **Active phase: M1 — Monorepo Skeleton, not started.** M0 (Docs &
  Decisions) is done — see the M0 checklist below.
- **What M0 actually did (2026-09-22):** folded the confirmed
  instructor/Course-Agent/admin flow (`migration.md` §2) into `prd.md`
  (now v1.3) and `architecture.md` (now v1.2); folded the v0-only feature
  audit (`migration.md` §9.1) into `prd.md` and `phases.md` (now v1.2);
  resolved `migration.md` §12's four open questions (Q-A/B/C/F) with
  explicit, flagged-as-changeable defaults — 15-day reapplication cooldown,
  Course Agent onboarding via Admin-triggered activation link,
  `Course.instructor` reused for Course-Agent-owned platform courses rather
  than a second FK, and Admin-gated course-reactivation after a
  "request re-review." Nothing here is final in the "can never change"
  sense — each default is a one-line change if reconsidered, just no
  longer *undecided*.
- **Scope changes made in this pass** (all now reflected in `prd.md`
  v1.3/`architecture.md` v1.2/`phases.md` v1.2, not just here): added a
  sixth role, **Course Agent** (Admin-provisioned, no public application,
  produces `PLATFORM`-type courses); corrected Admin from monitoring-only
  to also holding **course-catalog takedown authority** (unlist, never
  delete, reason required, owner notified); generalized revenue payout and
  leave/calendar from Instructor-exclusive to **both Instructor and Course
  Agent**; **deferred Live Session Office Hours alongside the
  already-deferred Teaching Assistant role** (both fully built in
  `elearny_v0`, ported as-is, not wired into any route until reactivated
  later); fully redesigned instructor onboarding around real document/video
  uploads, an OTP-verified public application with a trackable Application
  ID, and explicit reapplication-cooldown rules.
- **Simplified monorepo structure** (per `migration.md` §3 / user
  preference — supersedes the old Turborepo-based structure entirely):
  `backend/src/{main,test}` (Maven, standalone), `frontend/{web,mobile}`
  (each with its own `package.json`, standalone), `packages/{types,api-client}`
  only (no `packages/ui`, no `packages/config`), wired together with plain
  npm workspaces — no Turborepo, no root build orchestration.
- **Version pins** (per `migration.md` §4, verified current as of
  2026-09-22, not just carried over from when the docs were first written):
  Java 21 LTS, Spring Boot 3.5.8, Next.js 16.3.x, Expo SDK 57, PostgreSQL 17,
  Node 24 LTS.
- **Next deliverable, per the user's stated sequence:** (1) this M0 doc
  update — done; (2) the mobile UI-generation prompts doc (flow-based,
  avoids the old v0 doc's per-screen nav-duplication problem) — not started;
  (3) backend build for the V1-gap features (`migration.md` §9.2) — not
  started, comes after the mobile prompts doc, not before.
- **Last updated:** 2026-09-22
- **Blockers:** None — M0's exit criteria (all `migration.md` §12 questions
  resolved or explicitly deferred with a default) is met.
- **Live deployment:** none currently — nothing has been migrated/deployed
  yet, this session was docs-only, no code touched.
- **Doc versions:** `prd.md` v1.3, `architecture.md` v1.2, `rules.md`
  v1.1, `design.md` v0.7, `pages.md` v1.0, `processflows.md` v1.0,
  `phases.md` v1.2, `deployment.md` v0.8, `wireframes.md` v1.0,
  `migration.md` v1.1. If any of these numbers don't match what's actually
  in the file when you read this, something changed since this entry was
  written — check that doc's own changelog for what happened.

---

## Completion Checklist
*(Mirrors `migration.md` §10's M0–M8 phases — this is a different axis from
`phases.md`'s Phase 0–10/V2-A–G, which resumes governing feature content
once M1–M4 are structurally done, per `migration.md` §1. One line per
concrete numbered step within each phase, not one line per whole phase.
Check items off only once actually done and demonstrated — a checked box
means it works and has been shown (test output/log/screenshot), not just
claimed, per `rules.md` §13a.)*

#### Phase M0 -- Docs & Decisions -- **DONE 2026-09-22**
- [x] Resolved `migration.md` §12's open questions (Q-A/B/C/F) with explicit defaults
- [x] Folded `migration.md` §2 (confirmed instructor/Course-Agent/admin flows) into `prd.md` (now v1.3) and `architecture.md` (now v1.2)
- [x] Folded `migration.md` §9.1 (v0-only feature audit) into `prd.md` and `phases.md` (now v1.2)

#### Phase M1 -- Monorepo Skeleton -- NOT STARTED
- [ ] Create the simplified folder structure: empty `backend/`, `frontend/web/`, `frontend/mobile/`, `packages/types/`, `packages/api-client/`
- [ ] Move v0's `pom.xml` + `src/main` into `backend/`, unchanged (pure relocation, old flat package layout still)
- [ ] Move v0's `frontend/` (Vite app) into `frontend/web-legacy/`, kept running standalone
- [ ] Root `package.json` with npm `"workspaces"` field, nothing else in it
- [ ] `docker-compose.yml` (Postgres 17 service)

#### Phase M2 -- Backend Domain Restructuring -- NOT STARTED
- [ ] Move `auth/` + `user/` (first, everything else depends on them)
- [ ] Move `course/` next
- [ ] Move every remaining v0 domain per `migration.md` §5's table, one at a time
- [ ] Postgres + Flyway migration (`migration.md` §6) — generate baseline from Hibernate's real schema, don't hand-reconstruct
- [ ] Manual smoke test: login, course-browse, enrollment against real Postgres

#### Phase M3 -- Test Infrastructure -- NOT STARTED
- [ ] Auth + account-lockout tests
- [ ] Payment webhook signature-verification tests
- [ ] Course ownership/publish-validation tests
- [ ] Remaining domains, one at a time, in `migration.md` §5's order

#### Phase M4 -- Frontend Next.js Port -- NOT STARTED
- [ ] Scaffold `frontend/web` proper
- [ ] Port routes per `migration.md` §8's table (public/auth → student → instructor/courseagent → admin)
- [ ] Retire `frontend/web-legacy/` once every route confirmed working

#### Phase M5 -- New Instructor/Course-Agent/Admin Flow -- NOT STARTED
- [ ] `InstructorApplication` entity + migration
- [ ] Apply-with-OTP + application-ID status-check endpoints
- [ ] Reapplication-cooldown logic (15-day default)
- [ ] Admin approve/reject + activation-link flow
- [ ] `COURSE_AGENT` role + `Course.courseType` + Admin provisioning
- [ ] Course-owner-scoped revenue/payout and leave/calendar generalization
- [ ] Admin course-takedown flow (`Course.active` reuse + reason/timestamp fields)
- [ ] Tests for all of the above, written alongside each step

#### Phase M6 -- Mobile UI-Generation Prompts Doc + Mobile Scaffold -- NOT STARTED
- [ ] Flow-based, nav-duplication-free prompt doc (next deliverable per Current State above)
- [ ] Scaffold `frontend/mobile` (Expo SDK 57)
- [ ] Generate screens against the now-stable API (post M2-M5)
- [ ] Core flows click-through against real backend

#### Phase M7 -- Fill Remaining V1 Gaps -- NOT STARTED
*(mirrors `migration.md` §9.2, one line per gap, built one at a time)*
- [ ] Student email-OTP verification
- [ ] Course draft/submitted/published + versioning + drip content
- [ ] Exam integrity (timed attempts, randomization, violation logging)
- [ ] Certificate public verification hardening
- [ ] `SUPER_ADMIN` role
- [ ] Gamification engine
- [ ] Learning paths/bundles + instructor public profile
- [ ] AI chatbot

#### Phase M8 -- Hardening & Deployment -- NOT STARTED
- [ ] Production Docker hardening
- [ ] Render/Vercel/Supabase stand-up
- [ ] Security/load-testing pass, rate-limiting audit
- [ ] **MIGRATION COMPLETE -- this line only gets checked when every box above it is checked and demonstrated. `memory.md` then resumes tracking `phases.md`'s Phase 0-10/V2-A-G feature content directly, and `migration.md` retires to `docs/legacy/`.**


## Decisions & Open Questions Log
*(Settled facts, not progress. Append new entries with a date. Resolved
items get their resolution noted, not deleted.)*

- **2026-09-22 — DECIDED (Phase M0 of `migration.md` complete):** eLearny
  is now an active migration from `elearny_v0`, not a from-scratch build.
  `prd.md` (v1.3), `architecture.md` (v1.2), and `phases.md` (v1.2) were
  all updated in this pass to reflect: a sixth role (Course Agent,
  Admin-provisioned, produces `PLATFORM`-type courses); Admin
  course-catalog takedown authority (unlist via existing `Course.active`
  field, reason required, never deleted); revenue payout and leave/calendar
  generalized from Instructor-exclusive to both Instructor and Course
  Agent; Live Session Office Hours deferred alongside the already-deferred
  Teaching Assistant role (both fully built in v0, ported, unwired); a
  fully redesigned instructor-application flow (real document/video
  uploads, OTP-verified public application with a trackable Application
  ID, explicit reapplication-cooldown rules); and several v0-only features
  folded in that had no prior doc coverage (login history, account
  anonymization, platform-wide coupon eligibility, course
  prerequisite/cohort/seat-limit fields). `migration.md` §12's four open
  questions were resolved with explicit defaults rather than left
  blocking: 15-day reapplication cooldown, Course Agent onboarding via
  Admin-triggered activation link (reusing the instructor mechanism),
  `Course.instructor` reused for Course-Agent-owned courses (no second FK),
  Admin-gated reactivation after a course takedown. Monorepo structure
  simplified per user preference: `backend/src/{main,test}`,
  `frontend/{web,mobile}`, `packages/{types,api-client}` only, plain npm
  workspaces, no Turborepo. Full detail in `migration.md`, which is now the
  authoritative migration plan; `phases.md` resumes governing feature
  content once `migration.md`'s M1–M4 structural phases are done.
- **2026-09-22 — DECIDED:** At explicit user request, this file's progress
  status is reset to zero: Current State and the entire Completion Checklist
  now reflect nothing done, regardless of any earlier claim (including the
  2026-09-13 fresh-start entries, which themselves had reset only some of an
  even earlier "all phases complete" false-completion incident). The
  session-log entries below are kept for historical/debugging reference only
  — none of them should be read as current status. This is a scope/tier
  decision, not a code change: `prd.md`, `phases.md`, and the other planning
  docs are untouched by this reset.
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
- **2026-09-13** — Phase 3 UI/UX Overhaul, Live Regex Validation & Master Process Flows Documentation Synchronization:
  - Web & Mobile Auth: Enforced strict field regex validation (`/^[a-zA-Z0-9]{3,20}$/` username, RFC email regex, password checklist) with live in-line red error feedback. Added toast & Alert acknowledgments.
  - Mobile App Navigation: Built bottom tab bar (`(tabs)/_layout.tsx`) and routed login directly to `/(tabs)/dashboard`.
  - Documentation Suite: Updated `wireframes.md` (v1.1) & `processflows.md` (v1.1) with Master Flow 01 (Student Journey) and Master Flow 02 (Instructor Journey). Updated `deployment.md` with logging engine details, Postgres 16 schema permissions, Hibernate 6.5 dialect auto-detection, Unsplash image configuration, and EAS OTA command.
- **2026-09-13 (later same day)** — **Phase 0 build attempt, real code written.** Scaffolded `frontend/web` (Next.js 16.3.5 + Tailwind v4 + design tokens from design.md §2 + corrected fonts to Inter/Space Grotesk), `frontend/mobile` (Expo SDK 57 + NativeWind v4, same tokens as hex approximations), and `backend` (Spring Boot 3.3.5 pom.xml, BaseEntity, global exception handling, health controller, Flyway baseline migration, application.yml/application-dev.yml, Dockerfile, smoke test). **Verified with real command output:** web `npm run build` — clean, TypeScript passed, static pages generated. Mobile `npx tsc --noEmit` — clean, zero errors. Mobile `npx expo-doctor` — 19/21 checks passed (2 failures are sandbox network-allowlist issues, not project issues). **NOT verified — needs to be run outside this sandbox:** `mvn compile`/`mvn test` for the backend failed with a real `403 Forbidden` from Maven Central, since this build environment's network allowlist doesn't include Maven's repo host. Backend code is believed correct but is explicitly NOT marked done until someone runs `mvn clean install && mvn test` with real internet access and reports the actual output. Packaged as `elearny-phase0-code.zip` with its own README documenting exactly this per-component status. Also logged two minor honest caveats: mobile's NativeWind color tokens are hex approximations of design.md's HSL values (not pixel-verified against web), and mobile has 10 moderate `npm audit` findings inside Expo's own toolchain (not runtime code, left as-is rather than forcing a downgrade fix).
- **2026-09-13** — **Fresh-start restructure, explicit user request.** Treated the project as starting from zero code (regardless of any earlier "completed" claims for Phases 0–3 in prior versions of this file — those are not trusted going forward). Introduced a V1/V2 delivery-tier split: `prd.md` bumped to v1.0 (new §0, every §3 feature tagged `[V1]`/`[V2]`), `phases.md` bumped to v0.9 (restructured from one flat 14-phase list into a V1 track of Phases 0–10 and a V2 track of Phases V2-A–V2-G). At explicit user request, the Duolingo Gamification Engine and the 2-Tier AI Chatbot (general Q&A + rule-based suggestions) were pulled into V1 as new Phase 6 and Phase 7, ahead of TA/office-hours, Judge0 sandbox, localization, Excel export, and AI-authoring (all V2). Rewrote this file's Completion Checklist to mirror the new phase structure with every box reset to unchecked, and added an explicit "V1 launch verified" gate line — no V2 phase may start until it's checked. Next step: begin Phase 0 (Foundation) for real, with actual demonstrated evidence per unit before checking a box.
- **2026-09-13 (Phase 0 execution)** — Built and verified Phase 0 for real: web (Next.js 16.3.5 + design tokens) and mobile (Expo SDK 57 + NativeWind v4) both verified clean in a sandboxed build environment; backend (Spring Boot 3.3.5) written but uncompilable in that sandbox (Maven Central blocked). User then ran it on their own machine against a native local PostgreSQL 17 install (not Docker) — two independent real logs (`mvn clean install` and standalone `mvn test`) both show BUILD SUCCESS, Tests run 1/1 passing, Flyway migration applied and confirmed idempotent. Phase 0 formally CLOSED. Renamed `BackendApplication`→`ElearnyApplication` per user request. Found and fixed a real bug in `scripts/run-logged.ps1` (PowerShell silently collapses a single-element array slice to a scalar string, and splatting a string explodes it character-by-character — caused `mvn test` to be received as `mvn t`).
- **2026-09-13 (Phase 1, slice 1: registration)** — Wrote User/Role/ConsentRecord entities, the 5-role RBAC schema, and `POST /api/v1/auth/register` + `GET /api/v1/auth/check-username`, then expanded it after checking the actual `pages.md` §1.1 spec, which required more fields (first/last name, optional phone, terms-consent) than initially built. Since `V2__auth.sql` was already applied to the user's real database, added `V3__auth_profile_fields.sql` instead of editing V2 — migrations are append-only once run. Also caught and fixed a real doc contradiction: `pages.md` §1.1 had a "Role Selection Toggle (STUDENT/INSTRUCTOR)" on the register form that directly conflicted with `processflows.md`/`wireframes.md`'s explicit "No separate instructor registration toggle" — removed the toggle from `pages.md` (bumped to v1.2) since self-selecting Instructor status with no vetting is a real trust/security gap for a marketplace, and two other docs already agreed on the safer design. Backend code for this expanded scope is written with a 5-case integration test but NOT yet run by the user — unverified. Next: user runs `mvn test`, then the Web Register page gets built to match `pages.md` §1.1 exactly (live per-field regex, debounced username check, password requirement checklist, terms checkbox), before moving on to slice 2 (login/JWT/2FA/lockout).
- **2026-09-13 (JDK 23 / Lombok fix)** — User's `mvn test` failed with "cannot find symbol" on every Lombok-generated getter/setter (17 compile errors). Root cause: user's local JDK is 23.0.1 (confirmed via an earlier test log), and starting with JDK 23, javac no longer auto-discovers annotation processors (like Lombok) on the classpath by default — a real Java behavior change, not a code bug. Fixed properly: pinned an explicit `lombok.version` (1.18.36) and added an explicit `annotationProcessorPaths` block to the `maven-compiler-plugin` config in `pom.xml`, rather than papering over it. Not yet re-verified by the user — next `mvn test` run should confirm this actually fixes it.
- **2026-09-13 (verified + hydration fix)** — User re-ran `mvn test`: BUILD SUCCESS, Tests run 6/6, confirming the Lombok/JDK 23 fix actually worked. User also confirmed the Phase 0 web placeholder renders correctly in their real browser (screenshot). Phase 1 slice 1 formally CLOSED. Separately, user's browser showed a Next.js hydration-mismatch warning — root cause was the Grammarly browser extension injecting `data-gr-ext-installed`/`data-new-gr-c-s-check-loaded` attributes into `<body>` before React hydrated, not a real code bug. Fixed with `suppressHydrationWarning` on the `<body>` tag in `layout.tsx`, which is Next.js's own documented fix for exactly this scenario. Next: Web Register page (slice matching `pages.md` §1.1 exactly), then backend slice 2 (login/JWT/2FA/lockout).
- **2026-09-14 (OTP verification, first real test run)** — User's `mvn test` showed real, partial progress: `AuthControllerTest`'s new 8 cases (register + OTP verify/resend, `EmailService` mocked via `@MockBean`) all passed — the OTP flow itself works. But the plain `ElearnyApplicationTests` context-load test failed with `Could not resolve placeholder 'GMAIL_SMTP_USERNAME'`, because `elearny.mail.from-address: ${GMAIL_SMTP_USERNAME}` in `application-dev.yml` was missing the same safe-empty-default (`:`) already applied to `spring.mail.username`/`password` — an oversight, not a design flaw. Fixed by adding the same `:` default. Not yet re-verified by the user.
- **2026-09-14 (phone removed, prior codebase reviewed, scope additions)** — Removed the Phone field from registration entirely at user request (`RegisterRequest`, `AuthService`, `AuthControllerTest`, Register page, `pages.md` §1.1 all updated) — DB column stays for a future profile-completion feature. User then shared a prior, discarded eLearny codebase (React+Vite+MySQL/H2, the one behind the false "all 13 phases complete" claim logged 2026-09-08) for reference. Reviewed real files rather than assuming quality either way: confirmed the old `RegisterRequest.java` let users self-select their role at signup — validating the earlier pages.md role-toggle fix was correct — but also found real mismatches (MySQL/H2 vs. our Postgres/Supabase decision, layer-based vs. our domain-based package structure) that rule out wholesale code reuse. Decision: use it as a reference library per-feature when we reach that phase, not a source of truth to copy from. Confirmed 2FA/admin-reports/quizzes were already V1 scope (no change needed). Added two genuine gaps found via the review as new V1 scope: `prd.md` §3.4a Assignments (instructor-graded submissions, distinct from auto-graded quizzes — new Phase 5 scope) and enriched §3.9 Community from a flat discussion tab into a real per-course Forum (threads/replies/accepted-answer — Phase 8). `pages.md` gained §2.7a, §3.5a, and an enriched §2.5 Forum tab. All doc-only changes this round — no code written yet for Assignments/Forum, since we're still on Phase 1 and those are Phase 5/8 features; they'll be built when their phase starts, per `phases.md`'s own sequencing rule.
- **2026-09-14 (real device testing, font bug + missing button fixed)** — User ran Mobile on a real Android phone (first physical-device test of this project) and reported two bugs via screenshot: (1) wrong/cursive font rendering — root cause: mobile never had font loading wired up at all (unlike web's next/font), silently falling back to the phone's own system default font; (2) the "Go to Register" button/link was completely absent, not just unstyled. Fixed both properly rather than patching around them: (1) discovered Inter is now variable-font-only in Google's canonical repo (no static per-weight files), so used `fonttools`'s instancer to extract real static weight TTFs (Regular/Medium/SemiBold/Bold for Inter, Medium/Bold for Space Grotesk) from the official variable-font sources — these are now bundled locally in both `frontend/web/app/fonts/` and `frontend/mobile/assets/fonts/`, so both platforms render pixel-identical type from the same physical files, zero network dependency. Web's `layout.tsx` switched from `next/font/google` to `next/font/local` (the user separately reported the web font also looked wrong — most likely the Google-fetch failing or being degraded on their network; local files remove that dependency entirely and this is now verified with a genuinely complete `npm run build`, no font-related sandbox workaround needed anymore, unlike every previous frontend verification in this project). Mobile's `app/_layout.tsx` now loads fonts via `expo-font`'s `useFonts` with local `require()`d TTFs, holds the splash screen until they resolve, and applies a global default font via `Text.defaultProps` (documented RN pattern, since RN has no CSS-style font cascade) so every screen gets Inter without individually touching each file; `tailwind.config.js` gained `font-heading` (Space Grotesk) for screen titles. (2) The missing button was fixed by switching from a bare `<Link>` wrapping styled children to the documented `<Link asChild><Pressable>...</Pressable></Link>` pattern — more reliable for a styled link-as-button. All changes verified with real `tsc --noEmit` (clean) and `expo-doctor` (19/21, same 2 sandbox-only baseline failures) on mobile, and a genuinely complete `npm run build` on web. **Not yet re-verified by the user on their actual device** — that's the real remaining test.
- **2026-09-14 (font fix incomplete + Metro bundling error)** — User confirmed web still didn't visually show distinct fonts, and mobile's `npm start` failed entirely with `Cannot find module 'react-native-reanimated/plugin'`. Found two separate real bugs: (1) Web — Space Grotesk had been mapped to the `--font-mono` CSS variable (leftover naming from the original create-next-app template), which only affects Tailwind's `font-mono` utility; nothing on any page used that class, so Space Grotesk was never actually applied anywhere, on any heading, this whole time — renamed to `--font-heading` and applied that class to every actual `<h1>` across all 5 web pages. Verified for real this time by grepping the compiled `.next` output CSS for the generated `.font-heading{font-family:...}` rule, not just a successful build. (2) Mobile — `react-native-reanimated` wasn't installed at all, but `expo-router`'s newer native-tabs support (via `@expo/ui`) unconditionally expects its Babel plugin to exist; installed it for real (`--legacy-peer-deps`, v4.6.0), confirmed the previously-missing `plugin/` directory now exists. `tsc --noEmit` still clean after. **Not yet re-verified by the user actually running the app** — a clean install/typecheck doesn't prove Metro bundles and runs correctly end-to-end, which is the actual remaining test for both platforms.
- **2026-09-14 (Reanimated whack-a-mole, and a likely non-code web font issue)** — User's next `npm start` hit a DIFFERENT missing module: `react-native-worklets/plugin`. Real cause: Reanimated v4 restructured to delegate its Babel plugin to a separate `react-native-worklets` package, which wasn't installed. Installed it (`--legacy-peer-deps`), confirmed the plugin file exists, and proactively grepped both `react-native-reanimated/plugin` and `react-native-worklets/plugin`'s own source for any further `require()` calls to catch the next potential missing-module issue before it happens — found none; remaining requires are `@babel/*` and Node builtins, all already present. Separately, re-examined the user's web screenshots at that point: the rendered font looked visually identical to the very first Phase 0 screenshot from weeks ago, before any custom font code existed. Hypothesized this was a browser-level override (a font/accessibility extension, given Grammarly was already known active in this browser profile) and asked the user to check Incognito mode — **this hypothesis turned out to be wrong, see the next entry**.
- **2026-09-14 (real font bug found, fonts swapped to Anton/Poppins)** — User's Incognito test (ruling out extensions) and mobile screenshot (a native app, no browser involved at all) both showed the SAME pattern: heading font correct, body text falling back to OS default. This definitively disproved the earlier "browser extension" theory and confirmed a real bug: the assumption that Tailwind v4 (web) and a global `Text.defaultProps` mutation (mobile) would apply a body font by default, with no explicit class needed, was WRONG on both platforms — only explicitly-classed text (headings using `font-heading`) ever actually got a custom font. Fixed properly rather than re-guessing: **Web** — added `font-sans` explicitly to `<body>` in `layout.tsx`; verified this time by grepping the actual compiled output (`.next/server/app/index.html` really contains `class="...font-sans"`, and the compiled CSS really defines distinct `.font-sans`/`.font-heading` rules), not just a successful build. **Mobile** — removed the unreliable global `Text.defaultProps` hack entirely; created `components/AppText.tsx`, a `Text` wrapper that applies `font-sans` explicitly and reliably, and replaced every `<Text>` usage across all mobile screens/components with it (also added `font-sans` to `TextInput`s, which had no font applied either). Also swapped fonts at user's request: **Inter/Space Grotesk → Poppins/Anton** (both genuinely open Google Fonts, real static files downloaded directly this time, no `fonttools` instancing needed). User's other suggestions — Adobe Caslon (proprietary, Adobe-licensed, can't legally bundle) and Mazzard (not in Google's open-font repo, no verified license source) — declined for now with reasoning given; can be added later if the user sources a properly-licensed copy themselves. Verified: real `npm run build` (web) + compiled-output grep, `tsc --noEmit` clean + `expo-doctor` 19/21 baseline (mobile). **Not yet seen by the user on an actual device/browser** — that's the real remaining test.
- **2026-09-14 (Anton still not applying on mobile)** — User confirmed web now shows both fonts correctly, and mobile's Poppins (body) now works, but Anton (headings) still doesn't apply at all. Real finding: `AppText`'s `"font-sans {className}"` pattern assumed a later class in the same string (e.g. combining "font-sans" with a passed-in "font-heading") would win, the way it would in a plain browser CSS cascade — that assumption was wrong for NativeWind specifically; Poppins applied but Anton silently didn't on any element combining both classes. Rather than dig further into NativeWind's exact same-property conflict resolution, sidestepped the question entirely: created `components/AppHeading.tsx`, which only ever sets `font-heading` alone, never combined with `font-sans` on the same element. Replaced all 4 heading usages (`register.tsx`, `login.tsx`, `verify-email.tsx`, `index.tsx`) from `<AppText className="... font-heading ...">` to `<AppHeading className="...">`. `tsc --noEmit` clean after. **Not yet re-verified by the user on their device** — that's the real test for whether this actually resolves it.
- **2026-09-14 (dependency conflict)** — User's plain `npm install` in `frontend/mobile` failed with a real ERESOLVE error: `react-dom@19.3.0` (pulled in only as an optional peer of Expo SDK 57's own internal devtools package, `@expo/devtools` — not something the app actually uses when running on a phone/emulator) wants `react@^19.3.0`, conflicting with the pinned `react@19.2.3`. Verified the actual fix with a from-scratch `rm -rf node_modules package-lock.json && npm install --legacy-peer-deps` — 648 packages, clean, `tsc --noEmit` still passes after. Documented in the root README that `frontend/mobile` (only) always needs `--legacy-peer-deps`.
- **2026-09-15 (backend slice 2a: login/JWT/refresh/lockout)** — User asked to move on from font debugging and continue development. Built login + JWT + account lockout: `JwtService` (HMAC-signed access/refresh tokens distinguished by a "type" claim; secret via `JWT_SECRET` env var with a clearly-labeled dev-only fallback), `JwtAuthenticationFilter` (validates Bearer tokens, populates Spring Security's context), updated `SecurityConfig` to actually protect everything except health/auth endpoints (previously nothing was protected since no JWT filter existed), `AccountLockoutService` (locks after 5 failed attempts, configurable, deliberately no unlock mechanism yet — that's Phase 9's job), `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`. New `AuthLoginTest` with 9 cases covering success, unverified-email rejection, wrong password, unknown user, 5-strikes lockout (asserts a 6th attempt is rejected even with the CORRECT password), valid refresh, refresh-token-type confusion (an access token submitted where a refresh token is required must be rejected, not silently accepted), and a garbage token. TOTP 2FA is explicitly NOT wired in yet (slice 2b) — noted in code comments so it isn't mistaken for done. **Written but NOT run** — Maven Central is still blocked in this sandbox; needs a real `mvn test` from the user before any of this is checked off.
- **2026-09-15 (Phase 2 backend, entire thing, per user request)** — User asked to build all of Phase 2 before testing, rather than the usual small-slice pattern. Flagged the real trade-off (batching this much unverified code together is the same pattern that caused the original 2026-09-08 reset) but proceeded per the user's explicit choice, compiling/reasoning through everything as carefully as possible given I can't run `mvn test` myself. Delivered the full backend: instructor application/approval/invite-and-activate (reusing the existing OTP infrastructure with a new INSTRUCTOR_SETUP purpose, plus a separate single-use expiring token — both required together, neither alone sufficient), full Course/Section/Lesson CRUD with ownership enforcement and publish validation, R2 pre-signed media uploads (gracefully degrades without real credentials), method-level role security (`@PreAuthorize`), and a dev-default admin bootstrap (otherwise there'd be no way to reach any admin endpoint at all — a real chicken-and-egg problem this project hadn't hit yet). 39 new source files, 2 new test files (10 test cases total) covering the full apply→approve→setup→login loop and course ownership/publish-validation. **Explicitly NOT done yet: any Web or Mobile screens for Phase 2** — backend-only this round, by necessity given the scope; frontend is next. Nothing in this entry is verified by an actual test run — that's the user's next step.
- **2026-09-15 (Phase 2 web frontend)** — Continued building the rest of Phase 2 per the user's "build it all, I'll test after" request. Discovered and fixed a real blocking gap first: the Login page was still Phase 1's placeholder stub (never actually built), which would have made every single Phase 2 page untestable — built the real one (calls `/auth/login`, stores tokens, role-based landing redirect) before anything else. Then built all 6 Phase 2 web pages: Instructor Dashboard, Application form, Setup Account (OTP + username availability check + password), Admin Approval Queue (approve/reject with reason), Course Creator, and the Curriculum Builder (add sections, add lessons with per-type fields, publish button surfacing the backend's validation errors directly). Added `lib/auth.ts`, `hooks/useRequireAuth.ts`, and extended `api.ts` with auto-refresh-on-401. **Verified with a real, complete `npm run build`** — 12/12 routes compile clean, zero errors — the strongest verification available without a running backend to click through against. Mobile screens for Phase 2 are next.
- **2026-09-15 (Phase 2 mobile — Phase 2 fully complete across all three layers)** — Finished Phase 2 by building all 6 mobile screens, matching web exactly: Apply, Setup Account, Dashboard, Course Creator, Curriculum Builder, Admin Approval Queue, plus the real Login screen (Phase 1's mobile Login was also still a placeholder). Added `expo-secure-store` for token storage (matches phases.md's original spec — mobile uses SecureStore, web uses localStorage, both wrapped behind the same-shaped `lib/auth.ts` API) and the same auto-refresh-on-401 pattern in `api.ts` as web. Verified: `tsc --noEmit` clean, `expo-doctor` 19/21 (same baseline as always, no new issues). **This closes out Phase 2 end to end — backend (39 files, 10 tests), web (7 pages including the real Login), and mobile (7 screens including the real Login) — none of it run/clicked-through by the user yet.** Everything in this entry and the prior two Phase 2 entries needs real verification: `mvn test` for the backend, and actually using both frontends against a running backend. That's the user's next step, as they explicitly asked for the whole phase before testing.
- **2026-09-19 (real mvn test run, 2 real bugs found and fixed)** — User's plain `mvn test` failed with 13 compile errors on test files ("package does not exist" for classes that main compiled fine) — diagnosed as stale incremental build state (very plausible given the huge number of changes accumulated across this whole session without ever running `mvn clean`) rather than a code bug, and asked the user to try `mvn clean test` instead. That worked: compile errors gone entirely, confirming the diagnosis. Real test run then surfaced exactly 2 genuine bugs (24/27 passed): (1) **Real production bug**: `@PreAuthorize`-thrown `AccessDeniedException` had no handler in `GlobalExceptionHandler`, so it fell through to the generic `Exception.class` handler and returned 500 instead of 403 — meaning any actual non-admin/non-instructor hitting a protected endpoint in real use would see a raw server error instead of a clean "forbidden" response. Fixed by adding an explicit `AccessDeniedException` handler. Caught by `CourseControllerTest.studentCannotCreateCourse` and `InstructorApplicationTest.nonAdminCannotListApplications`. (2) **Test-only bug**: `CourseControllerTest`'s `registerAsInstructorAndLogin` helper used a rigid `verify(emailService).sendOtpEmail(...)` (implicit "exactly once"), which broke when `instructorCannotAccessAnotherInstructorsCourse` called the helper twice in one test (Mockito counts total invocations across the whole method, not since the last verify call) — fixed with `atLeastOnce()`, which still correctly captures the most recent OTP via `ArgumentCaptor.getValue()`. Not yet re-verified — user needs to run `mvn clean test` again to confirm both fixes actually resolve it.

---

> **2026-09-22 — PROGRESS RESET.** Everything above this line is historical
> record only — kept for debugging context (what was tried, what bugs were
> found and how) but **not trusted as current status**. At explicit user
> request, Current State and the Completion Checklist above now reflect zero
> progress: nothing is built, nothing is verified, Phase 0 has not started.
> The next session log entry should begin fresh from here, once real work
> resumes.
- **2026-09-19 (OneDrive confirmed as root cause; navigation, credentials, real resume upload)** — User moved the project out of `Downloads` (OneDrive-synced) to a local-only drive; `mvn clean test` then ran successfully, confirming the earlier diagnosis. User then gave broad UX feedback after actually clicking through Phase 1/2 for the first time: no way to navigate except typing URLs, no feedback after a Student logs in (redirects to a page that looked identical to logged-out), and the Instructor Application's "Resume URL" should be a real file upload (referenced their own eRecyclo project's KYC-document-upload pattern as an example of the shape they wanted — cloned it for reference, found real file uploads with an admin document-preview pattern, informed the fix below without copying eRecyclo's actual KYC fields, which don't fit an instructor-application context). Fixed on web: added a real `NavBar` component (role-aware links, shown on every page via root layout), extended `lib/auth.ts` to store the full user object (not just tokens) so the nav/home page can show who's logged in, rewrote the home page to show a real "Welcome back" state with role-based CTAs instead of the static Phase-0 placeholder regardless of login state, and wired the Instructor Application's resume field to the existing R2 presigned-upload endpoint for a real file picker + upload (falls back to a clear "not configured yet" message without real R2 credentials, rather than silently failing). Mirrored the essential parts on mobile (user object storage, home screen feedback) but **mobile does not yet have a persistent nav header matching web's `NavBar`** — flagged honestly as remaining, not silently skipped. Also seeded a convenience test Student account (`teststudent` / `TestStudent1!`, pre-verified) alongside the existing admin bootstrap, at user's request — deliberately did NOT seed a test Instructor, since the user wants to exercise the real apply-then-approve flow themselves. **UI/UX honesty note**: the user correctly flagged that pages are still plain functional forms, not visually polished — this round's fixes address navigation/consistency/feedback (structural UX), not visual design craft (spacing rhythm, richer states, illustration, animation) — that's still open work, not done, and was explicitly not claimed as done. Verified: web `npm run build` real and clean (13/13 routes), mobile `tsc --noEmit` clean.

---

- **2026-09-22 (Migration Phase M0 — docs-only session, no code)** — User
  shared `elearny_v0`, a prior, mostly-complete codebase (295 files, flat
  Spring Boot + Vite/React, zero tests, MySQL, OpenPDF, local-disk storage)
  to migrate from rather than rebuilding this project from scratch.
  Extracted and audited it in full against the existing docs, producing
  `migration.md` (v1.0, then revised to v1.1 after structure/flow
  corrections). Through discussion, designed: a redesigned instructor
  onboarding flow (real document/video uploads, OTP-verified public
  application with a trackable Application ID, admin approval triggers a
  single-use activation link only — no second OTP — with explicit
  reapplication-cooldown rules); a new Course Agent role (Admin-provisioned,
  produces `PLATFORM`-type courses, shares the Instructor authoring UI);
  corrected Admin from monitoring-only to also holding course-catalog
  takedown authority (unlist, never delete, reason required); generalized
  revenue payout and leave/calendar from Instructor-exclusive to both
  Instructor and Course Agent; deferred Live Session Office Hours alongside
  the already-deferred TA role; and a simplified monorepo structure
  (`backend/src/{main,test}`, `frontend/{web,mobile}`,
  `packages/{types,api-client}` only, plain npm workspaces, no Turborepo)
  after the user pushed back on the first, more elaborate proposal. Then
  executed Phase M0 itself: folded all of the above into `prd.md` (v1.2 →
  v1.3), `architecture.md` (v1.1 → v1.2), and `phases.md` (v1.1 → v1.2) as
  tracked, versioned edits — not just recorded here — and resolved
  `migration.md` §12's four open questions (exact cooldown length, Course
  Agent onboarding mechanism, `Course.instructor` FK reuse vs. a second FK,
  course-reactivation authority) with explicit, flagged-as-changeable
  defaults rather than leaving them blocking. No code was touched this
  session — this was entirely a planning/documentation pass, consistent
  with `migration.md`'s Phase M0 being explicitly "no code." Next up, per
  the user's stated sequence: the mobile UI-generation prompts doc (M6),
  then Phase M1 (Monorepo Skeleton) once that's done.







