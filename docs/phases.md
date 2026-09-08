# eLearny — Phases Document (phases.md)

> Status: **v0.5.** This document decides *order*, not *scope* — every
> feature in `prd.md` v0.5 is committed and appears somewhere below. A
> phase number means "this is what it depends on existing first," never
> "this is optional" or "maybe later." Living document: phases can be
> re-sequenced as real dependencies get discovered mid-build, with a
> version bump and a note on what moved and why.

**How to read this doc:** each phase lists Backend / Web / Mobile scope
together, since they're built in parallel per `architecture.md`. "Depends
on" points to the phase(s) that must exist first — not a suggestion, a
hard technical dependency (e.g. you cannot build enrollment before courses
exist to enroll in). A rough size tag (S/M/L/XL) flags where a phase is
genuinely large — called out honestly per the PRD's own complexity notes,
not softened.

---

## Phase 0 — Foundation (Size: M)
*Depends on: nothing*

- Monorepo scaffold: Turborepo, `frontend/web`, `frontend/mobile`, `packages/*` (per `architecture.md` §3)
- Spring Boot project init: base package structure, `pom.xml`, common module (exception handling, base entities)
- Flyway wired up, first empty migration
- Docker Compose: Postgres + backend containers running locally
- Design tokens applied: `globals.css` token file (`design.md` §2) wired into Tailwind config
- Health-check endpoint (`GET /api/v1/health`) to confirm the whole chain works end to end before real features start

## Phase 1 — Auth & Roles (Size: M)
*Depends on: Phase 0*

- Backend: `auth` + `user` domains — registration, login, JWT issue/refresh, TOTP 2FA, RBAC role model (`STUDENT`/`INSTRUCTOR`/`ADMIN`)
- Web: login/register pages, role-gated route group shells (empty dashboards, just proving the auth-gate structure works)
- Mobile: same, login/register screens, role-gated route groups
- This phase deliberately produces no real "features" yet — it's the gate everything else builds behind

## Phase 2 — Instructor Approval & Course Authoring (Size: L)
*Depends on: Phase 1*

- Backend: `instructor` (application/approval workflow), `course` (course/section/lesson CRUD, draft→published states, versioning, drip content), `media` (R2 upload, signed URLs)
- Web: instructor course-creation flow, admin instructor-approval screen (first real admin panel screen)
- Mobile: full instructor course-creation flow — same capability as web, not view-only (decided 2026-09-08)
- PRD refs: §3.1, §2.2

## Phase 3 — Enrollment, Payments & Learning Experience (Size: L)
*Depends on: Phase 2*

- Backend: `payment` (Razorpay orders, webhook, signature verification, coupons), `enrollment` (progress tracking, bookmarks/notes)
- Web + Mobile: course purchase flow, video player (signed URL, progressive streaming, resume position, playback speed), student dashboard (enrolled courses, progress %)
- PRD refs: §3.2, §3.6 (minus refunds — see Phase 7), architecture.md §2.3/§2.4

## Phase 4 — Discovery, Reviews & Bundling (Size: M)
*Depends on: Phase 3 (needs real courses + enrollment to be meaningful)*

- Backend: `discovery` (search, filters, categories, rule-based recommendations), `review`, `bundle` (wishlist, learning paths/bundles)
- Web + Mobile: search/filter UI, course detail reviews, wishlist, bundle pages
- PRD refs: §3.3, §3.11
- Note: the rule-based recommendation engine built here is reused directly by the chatbot's Tier A in Phase 11 — no rework needed later

## Phase 5 — Assessment & Certification (Size: XL)
*Depends on: Phase 3*

- Backend: `exam` (quiz/exam engine, question types, timed attempts, randomization, server-side grading, browser-level violation logging), `certificate` (PDF generation via PDFBox, verification endpoint)
- Web + Mobile: quiz-taking UI, full-screen enforcement + tab-switch detection, results screen, certificate view/download, public verification page
- **Sub-phase 5b — Camera-based exam integrity (Size: XL on its own):** webcam identity check, gaze tracking, multi-person detection. This is a separate media pipeline (consent flow, video capture, storage, review tooling) — genuinely its own project inside this phase, called out explicitly per `prd.md` §3.4's own honesty note, not shrunk to fit a bullet point
- PRD refs: §3.4, §3.5

## Phase 6 — Notifications & Community (Size: M)
*Depends on: Phase 3*

- Backend: `notification` (in-app table + delivery, Gmail SMTP transactional emails), `community` (per-course discussion/Q&A, instructor announcements)
- Web + Mobile: notification center, per-course discussion/Q&A threads, instructor announcements
- PRD refs: §3.8, §3.9

## Phase 7 — Admin Panel & Revenue (Size: M)
*Depends on: Phase 2, Phase 3*

- Backend: `admin` (moderation, category management, platform-wide analytics), `revenue` (instructor dashboard, payout status), refund flow in `payment`
- Web + Mobile: full admin panel (per your earlier correction — admin is committed on mobile too, matching route groups), instructor revenue dashboard
- PRD refs: §3.7, §3.6 (refunds)

## Phase 8 — Gamification & Motion (Size: M)
*Depends on: Phase 3 (progress data), Phase 5 (quiz/certificate moments to animate)*

- Backend: `gamification` (badges, streaks, points, leaderboard)
- Web + Mobile: animated micro-interactions (`motion` / `react-native-reanimated`) on lesson completion, quiz pass, certificate issuance; leaderboard UI
- PRD refs: §3.10

## Phase 9 — Localization (Size: M, ongoing)
*Depends on: Phase 1 (needs the full UI to exist to translate it)*

- Web: `next-intl` wired across existing pages
- Mobile: `i18n-js` wired across existing screens
- Backend: `localization` domain (supported languages, translation storage), course content localization (subtitle/alt-language upload)
- PRD refs: §3.12
- Note: this phase is naturally ongoing — every new page built after this phase needs its translations added as part of that page's own work, not as a one-time retrofit

## Phase 10 — Practice & Content Hub (Size: XL)
*Depends on: Phase 2 (course structure), Phase 4 (discovery/search patterns to reuse)*

- Backend: `practicehub` (public articles, practice problems, difficulty levels, Problem of the Day), Judge0 self-hosted deployment + integration for code execution
- Web: public article/tutorial pages (SEO-friendly, no auth), embedded code playground inside lessons
- Mobile: full embedded code playground — same editing capability as web, not read-only (decided 2026-09-08). Note: this needs a mobile-appropriate code editor component (e.g. a touch-friendly editor with a supplemental symbol/syntax toolbar, since phone keyboards make typing `{`, `;`, `(` awkward) and should be tested with an external/Bluetooth keyboard as a supported input method, not just the on-screen keyboard
- PRD refs: §3.13 — called out in the PRD itself as needing its own infra module; this phase is that module

## Phase 11 — AI Assistant (Chatbot) (Size: M)
*Depends on: Phase 4 (Tier A reuses the recommendation engine)*

- Backend: `chatbot` (LLM client via WebClient, per-user rate limiting, prompt scoping, quota-exhaustion fallback, logging)
- Web + Mobile: chat UI, course-suggestion responses (Tier A, no LLM), free-text Q&A (Tier B, LLM-backed)
- PRD refs: §3.15

## Phase 12 — AI-Assisted Authoring & Growth Mechanics (Size: M)
*Depends on: Phase 11 (shares the LLM client/rate-limiting infra), Phase 2 (courses to generate quiz drafts from)*

- Backend: AI-generated quiz question drafts (instructor-assist), personalization beyond rule-based matching, `growth` (referral codes, affiliate tracking)
- Web + Mobile: instructor-facing "generate quiz draft" tool, referral/affiliate UI
- PRD refs: §3.14, §3.16

## Phase 13 — Hardening & Deployment (Size: M, ongoing)
*Depends on: all prior phases reaching a stable state*

- Production Docker images, Render deployment, Supabase connection, environment secret management
- Security pass: rate limiting review across all endpoints, dependency audit, webhook idempotency verification
- Load-testing basics on the highest-traffic paths (course browsing, video streaming, chatbot)
- Mobile: app-store readiness review (not submission — per `prd.md` §1, store deployment is a future phase beyond this document's current scope)

---

## Notes on Sequencing Logic

- **Auth (Phase 1) gates everything** — no feature phase after it can start without it, structurally
- **Courses (Phase 2) gate commerce, assessment, discovery, and the content hub** — almost every later phase depends on a course existing to attach to
- **Phases 5b and 10 are the two "this is secretly a sub-project" phases**, flagged consistently since `prd.md` v0.5 — sequencing them honestly here rather than pretending they're the same size as everything else is the whole point of writing this document truthfully
- **Localization (9) and Hardening (13) are "ongoing" phases**, not one-and-done — they get revisited every time new UI or endpoints are added after their initial pass
- **Deployment does not wait for Phase 13.** Per `deployment.md` §1, the
  "Live" environment (Vercel + Render + Supabase + EAS) should be stood up as
  soon as Phase 1 works locally, and every phase after that gets pushed
  to it as it lands. Phase 13 is about *hardening* an already-running
  deployment (security pass, load testing), not standing one up for the
  first time.

---

## Change Log
- **v0.1** — Initial phase breakdown from `prd.md` v0.5, `architecture.md`
  v0.2, `rules.md` v0.2, and `design.md` v0.1. 14 phases (0–13), each with
  explicit dependencies, PRD traceability, and honest size flags —
  including two phases (5b camera proctoring, 10 practice hub/code
  sandbox) explicitly called out as XL sub-projects rather than shrunk to
  fit the pattern of the surrounding phases.
- **v0.2** — Resolved the two open mobile-scope questions: Phase 2
  instructor course-authoring and Phase 10's code playground are both full
  feature parity on mobile (not view-only/read-only). Added an
  implementation note on Phase 10 flagging the real UX challenge (typing
  code on a phone keyboard) rather than treating "full parity" as
  removing that difficulty.
- **v0.3** — Added a sequencing note (deployment starts after Phase 1, not
  Phase 13) after drafting `deployment.md`, which recommends deploying
  continuously from early in the build rather than only at the end.
- **v0.4** — Path fix: monorepo scaffold now correctly references
  `frontend/web` and `frontend/mobile` (grouped under one `frontend/`
  folder), matching `architecture.md` v0.6.
- **v0.5** — Fixed a real gap found during a full feature-coverage audit:
  Phase 6's backend line was missing the `community` package for §3.9
  (discussion/Q&A, announcements), even though its own frontend line
  already promised that UI — added. Also removed a stale "Railway/Render"
  mention in Phase 13 (decision has been Render + Supabase since
  `deployment.md` was written).
