# eLearny — Architecture Document (architecture.md)

> Status: **v1.2 — living document, active migration from `elearny_v0`.**
> Derived from `prd.md` v1.3 — every module here exists to
> serve a committed feature using modern, active, non-deprecated package standards
> per `migration.md` §4 (Java 21 LTS, Spring Boot 3.5.8, Next.js 16.3.x, Expo SDK 57).
> eLearny is architected as a full-scale, production-grade platform — **high-level and large-scale by design, not a demo or MVP**.
> All architectural modules and API flows synchronize directly with [`processflows.md`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/docs/processflows.md) (Flows 01–18) and [`pages.md`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/docs/pages.md).
> AI tools must double-check all implementation details to ensure maximum content density, zero deprecation warnings, and 100% Web & Mobile feature parity.
>
> **Note (2026-09-22):** as of this version, this document describes the
> **target** architecture for an active migration from `elearny_v0` (a
> prior, mostly-complete codebase), not a from-scratch build — see
> `migration.md` for the full migration plan and `memory.md` for live
> state. §2.2/§2.2a/§2.2b, §3, and §4–§7 below were all revised this pass
> to reflect the migration's confirmed flow amendments (Course Agent role,
> admin course-takedown authority, simplified monorepo structure) — see
> §8's change log for the itemized list. `phases.md` remains the source of
> truth for feature *sequencing*.

---

## 1. High-Level Architecture

```
                    ┌─────────────────┐      ┌──────────────────────┐
                    │   Next.js Web    │      │  React Native (Expo)  │
                    │  (desktop/tablet │      │      mobile app        │
                    │   /mobile web)   │      │   (phone, dev-only)    │
                    └────────┬─────────┘      └───────────┬───────────┘
                             │                             │
                             │        REST (JSON, JWT)     │
                             └──────────────┬──────────────┘
                                            │
                                 ┌──────────▼───────────┐
                                 │   Spring Boot API     │
                                 │  (Java 21, Spring 3.3│
                                 │   REST-only API)     │
                                 └──────────┬────────────┘
                                            │
        ┌────────────┬────────────┬────────┼────────────┬─────────────┬──────────────┐
        ▼            ▼            ▼        ▼            ▼             ▼              ▼
   ┌─────────┐  ┌──────────┐ ┌────────┐ ┌───────┐  ┌──────────┐ ┌───────────┐ ┌─────────────┐
   │Postgres │  │Cloudflare│ │Razorpay│ │ Gmail │  │  Judge0   │ │Gemini/Groq│ │  PDFBox      │
   │(primary │  │   R2     │ │(payments)│ SMTP  │  │ (self-    │ │ (chatbot  │ │ (certificate │
   │  DB)    │  │(video/   │ │        │ │(email)│  │  hosted   │ │  LLM API, │ │  generation, │
   │         │  │ files)   │ │        │ │       │  │ code exec)│ │ free tier)│ │  in-process) │
   └─────────┘  └──────────┘ └────────┘ └───────┘  └──────────┘ └───────────━ └─────────────┘
```

**Core principle:** the Spring Boot API is the single source of truth and
the only thing that talks to Postgres, R2, Razorpay, Judge0, or the LLM
provider. Neither frontend ever calls a third-party service directly —
this is what keeps API keys server-side and keeps web/mobile logic
identical (both just call our own REST API). All libraries across Node and
Java use modern, non-deprecated stable package releases without deprecation warnings.

---

## 2. App Flows

These flows exist to pin down request/response shape before we write a
single controller — the API contract falls out of these, not the other
way around.

### 2.1 Auth Flow (JWT + TOTP 2FA)
1. `POST /api/v1/auth/register` → creates user with role `STUDENT` by default
2. `GET /api/v1/auth/check-username?username=x` → real-time availability
   check, called by the frontend on debounced keystroke (per `pages.md`'s
   Register page spec) — returns `{available, message, suggestions[]}`,
   never a raw boolean alone, so the frontend can show a helpful message
3. `POST /api/v1/auth/login` (email + password) → if 2FA is enabled, returns a
   short-lived `pending2FA` token instead of a session; otherwise issues
   access + refresh JWT pair. After repeated failed attempts, returns 403
   with an `ACCOUNT_LOCKED` error code rather than the generic
   invalid-credentials message (per `prd.md` §3.18) — the frontend routes
   this to the Account Locked page from `pages.md`
4. `POST /api/v1/auth/2fa/verify` (TOTP code + `pending2FA` token) → issues
   access + refresh JWT pair
5. `POST /api/v1/auth/refresh` → rotates access token using refresh token
6. `POST /api/v1/auth/forgot-password` (email) → always returns a generic
   success response regardless of whether the email exists (never confirm
   or deny account existence); sends a reset email if it does
7. `POST /api/v1/auth/reset-password` (reset token + new password) →
   validates the token, updates the password; token is single-use and
   time-limited
8. Every protected endpoint reads role + user ID from the JWT claims; RBAC
   is enforced at the controller/service layer via Spring Security method
   annotations, not by trusting the frontend's UI state

### 2.2 Instructor Application & Onboarding Flow — full redesign, see `migration.md` §2.3
**No `User` account exists at any point before step 6.** Unlike a typical
"apply then get promoted" pattern, there is nothing to promote — Instructor
is never a role a `STUDENT` account transitions into.
1. `POST /api/v1/instructor/applications` (public, no auth) — name, bio,
   professional details, file uploads (ID proof, certifications ×N, sample
   teaching video via `media/`'s R2 pre-signed upload), Portfolio/LinkedIn
   URL, applicant email. Rejected (400) if the email already belongs to any
   existing `User`, any role.
2. `POST /api/v1/instructor/applications/verify-email` (OTP sent on step 1)
   → on success, `InstructorApplication` created, status `PENDING`, an
   8–10 char alphanumeric `applicationId` returned.
3. `GET /api/v1/instructor/applications/status` (public, no auth) — takes
   `applicationId` + email, requires a fresh OTP verification, returns
   current status. Reapplication/cooldown rules (§12 Q-A in `migration.md`
   for the exact cooldown length) are enforced at submission time
   (step 1), not at status-check time.
4. Admin: `GET /api/v1/admin/instructor-applications` (filterable by
   status) → `POST /api/v1/admin/instructor-applications/{id}/approve` or
   `/reject` (reject requires a reason, sets `cooldownEndsAt`)
5. Approve → single-use, time-limited activation token generated, emailed
   as a link (**no second OTP** — email was already verified at step 2)
6. `POST /api/v1/instructor/activate` (token + chosen username + password)
   → **this is where the `User` record is actually created**, role
   `INSTRUCTOR`, tied to the application's email. Every instructor-only
   endpoint checks role `INSTRUCTOR` — there is no separate "approved"
   flag to also check, since an `INSTRUCTOR` account can't exist unapproved

### 2.2a Course Agent Provisioning Flow (new role, see `migration.md` §2.4)
1. Admin: `POST /api/v1/admin/course-agents` (no public application exists
   for this role — internal/employee provisioning only) — creates the
   `User` record directly, role `COURSE_AGENT`
2. Same single-use activation-link mechanism as §2.2 step 5/6, reused
   rather than duplicated, just Admin-triggered instead of
   approval-triggered
3. Course Agents use the identical course-authoring endpoints as
   Instructors — no parallel API surface. Courses they create are tagged
   `courseType = PLATFORM` (vs. `INSTRUCTOR`) at creation time; `Course.instructor`
   is reused to point at the Course Agent's own account rather than adding
   a second FK (`migration.md` §12 Q-C)

### 2.2b Admin Course-Catalog Takedown Flow
1. `POST /api/v1/admin/courses/{id}/suspend` (reason required) — sets
   `Course.active = false` (reusing the existing field, not a new status
   enum) plus new `suspensionReason`/`suspendedAt` fields
2. Course is immediately excluded from all catalog/browse/search queries
   that already filter on `active = true` — no query changes needed
   elsewhere, this is additive
3. Triggers a notification (via `notification/`) to the owning Instructor
   or Course Agent with the reason
4. Nothing is deleted — enrollments, payments, reviews, and the course
   record itself are untouched. The owner gets a "Request re-review"
   action that notifies Admin but does not auto-reactivate — Admin
   reactivates manually after confirming the issue is fixed
   (`migration.md` §12 Q-F)

### 2.3 Course Purchase & Enrollment Flow
1. Student browses/searches courses (public endpoints, no auth required for read)
2. `POST /api/v1/orders` (course ID or bundle ID, optional coupon code) → backend
   validates price + coupon, creates a Razorpay order, returns Razorpay
   order ID to the client
3. Client completes payment via Razorpay Checkout (client-side SDK)
4. Razorpay sends a signed webhook to `POST /api/v1/webhooks/razorpay` → backend
   verifies signature, marks the order `PAID`, creates the `Enrollment`
   record — **enrollment is only ever granted from the verified webhook,
   never from a client-side "payment succeeded" callback**, to prevent
   payment spoofing
5. Enrollment triggers: in-app notification, receipt email, dashboard update

### 2.4 Learning Progress Flow
1. Student opens a lesson → `GET /api/v1/courses/{id}/lessons/{lessonId}/video-url`
   returns a short-lived signed R2 URL (not the raw file path)
2. Client reports progress periodically (`POST /api/v1/progress` — lesson ID,
   watched-seconds) → backend marks lesson complete once a watch-through
   threshold is met
3. Course-level progress % is derived from completed lessons ÷ total lessons

### 2.5 Exam & Certificate Flow
1. Student starts final exam → `POST /api/v1/exams/{id}/attempts` creates an
   attempt record, returns randomized questions/options, starts server-side
   timer (never trust a client-reported time limit)
2. Client enters full-screen; frontend reports violations
   (`POST /api/v1/exams/attempts/{id}/violations` — type: tab-switch, fullscreen-exit,
   etc.) as they happen, timestamped server-side on receipt
3. `POST /api/v1/exams/attempts/{id}/submit` → backend grades server-side, never
   trusts client-submitted scores
4. If the attempt passes and it's the course's final requirement →
   certificate auto-generated (PDF via PDFBox), stored in R2, a
   `Certificate` record created with a unique verification code
5. Public: `GET /api/v1/certificates/verify/{code}` — no auth required, returns
   certificate validity + summary for third-party verification

### 2.6 Chatbot Flow
1. `POST /api/v1/chatbot/message` (free text) → backend first checks: does this
   look like a course-suggestion query (keyword/intent match)? If so,
   answer from the rule-based recommendation engine (3.3/3.15 in PRD) —
   **no LLM call, no cost**
2. Otherwise, backend applies per-user rate limiting (checked before
   calling the LLM, not after), then calls Gemini Flash / Groq server-side
   with a scoped system prompt (platform FAQs + catalog context only)
3. If the daily/per-minute quota is exhausted, backend returns a graceful
   fallback message — the frontend never sees a raw provider error

---

## 3. Repository & Monorepo Structure

**Simplified as of `migration.md` v1.1** — deliberately less machinery than
a typical Turborepo setup. "Monorepo" here means exactly what the word
says: one repository holding independent projects (backend, web, mobile),
nothing more. No Turborepo, no build-orchestration layer, no root scripts
that run all three at once — each app builds and runs independently
(`cd backend && mvn ...`, `cd frontend/web && npm run dev`,
`cd frontend/mobile && npx expo start`).

```
elearny/
├── backend/                     # Spring Boot 3.5.8 (Java 21) — Maven, standalone
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       ├── main/java/com/elearny/     # see section 4
│       └── test/java/com/elearny/     # mirrors main/, see section 4
├── frontend/
│   ├── web/                     # Next.js — own package.json, runs standalone
│   └── mobile/                  # Expo — own package.json, runs standalone
├── packages/                    # ONLY what genuinely gets duplicated/drifts if hand-copied twice
│   ├── types/                   # Shared TS types (mirrors backend DTOs)
│   └── api-client/              # Shared typed fetch functions, used by both frontends
├── docs/                        # prd.md, architecture.md, rules.md, phases.md, design.md, memory.md, deployment.md, migration.md
├── package.json                 # ROOT — sole purpose: npm workspaces, so packages/*
│                                 # are importable as @elearny/* from both frontends.
│                                 # No build orchestration lives here.
└── docker-compose.yml           # Wires backend + Postgres together locally
```

Deliberately **not** included: `packages/ui` (web renders Tailwind/DOM
components, mobile renders NativeWind/React Native components — these
aren't drop-in compatible, so a shared UI package would be mostly empty)
and `packages/config` (shared eslint/tsconfig config — low payoff for the
added indirection at this project's size). `types/` and `api-client/` are
the two things worth sharing because they genuinely drift if each frontend
hand-maintains its own copy of "what does a `CourseResponse` look like."

`frontend/` is a grouping folder holding both frontend surfaces side by
side, distinct from `backend/`, which stays a flat top-level folder.

### 3.1 Workspace Customization Skills Integration

Both `frontend/web` and `frontend/mobile` actively consume the 6 project workspace skills in `.agents/skills/`:

- **[`taste-design-system`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/taste-design-system/SKILL.md)**: Governs visual excellence, Terracotta Orange (`#D96B43`) color tokens, and font pairing (`Inter`, `Space Grotesk`, `Anton`).
- **[`mobile-app-uiux-benchmarks`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/mobile-app-uiux-benchmarks/SKILL.md)**: Governs Zomato, Swiggy, Instagram, DigiLocker, Duolingo, and Airbnb mobile layout architectures (Floating Docks, Collapsible Headers, Verified Document Badges, 3D Tactile Buttons).
- **[`gsap-animation-uiux`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/gsap-animation-uiux/SKILL.md)**: Governs GSAP 3 web animations for `frontend/web` (`useGSAP`, `ScrollTrigger`).
- **[`reanimated-mobile-gestures`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/reanimated-mobile-gestures/SKILL.md)**: Governs React Native Reanimated 3 60fps gestures for `frontend/mobile`.
- **[`21st-dev-components`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/21st-dev-components/SKILL.md)**: Sourcing React component blocks via the `21st-dev` MCP server.
- **[`shadcn-ui-components`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/shadcn-ui-components/SKILL.md)**: Extending Shadcn UI primitives via the `shadcn` MCP server.

---

## 4. Backend Structure (Spring Boot, Java 21)

**Organized by feature/domain, not by technical layer** — a `courses`
package contains its own controller/service/repository/dto/entity, rather
than one giant `controllers` package for the whole app. This keeps each
domain self-contained and lines up directly with the PRD's feature
sections, so "where does exam integrity live" has an obvious answer.

```
backend/
├── pom.xml
├── Dockerfile
├── src/
│   ├── main/
│   │   ├── java/com/elearny/
│   │   │   ├── ElearnyApplication.java
│   │   │   ├── common/                      # Shared: base entities, exception handling, API response wrappers
│   │   │   │   ├── exception/                 # Global exception handler, custom exceptions
│   │   │   │   ├── security/                  # JWT filter, Spring Security config, RBAC annotations
│   │   │   │   └── util/
│   │   │   ├── auth/                         # 2.1 — register, login, TOTP 2FA, JWT issuing/refresh, login history
│   │   │   ├── user/                         # User entity/profile, role management
│   │   │   ├── instructor/                   # 2.2 — instructor application, OTP verification, status-check, activation
│   │   │   ├── courseagent/                  # 2.2a — Admin-provisioned internal course-creator role (new)
│   │   │   ├── course/                       # 3.1/3.1a — course/section/lesson CRUD, versioning, drip content, draft/publish states, courseType (INSTRUCTOR/PLATFORM)
│   │   │   ├── media/                        # 3.1/3.2 — R2 upload, signed URL generation for video/resources
│   │   │   ├── enrollment/                   # 2.3/2.4/3.2 — enrollment records, progress tracking, bookmarks/notes
│   │   │   ├── discovery/                    # 3.3 — search, filters, categories, rule-based recommendations
│   │   │   ├── review/                       # 3.3 — course reviews & ratings
│   │   │   ├── exam/                         # 3.4/2.5 — quizzes, exams, attempts, violations, grading
│   │   │   ├── certificate/                  # 3.5/2.5 — PDF generation, verification endpoint
│   │   │   ├── payment/                      # 3.6/2.3 — Razorpay orders, webhooks, coupons, refunds
│   │   │   ├── revenue/                      # 3.6 — course-owner (Instructor OR Course Agent) payout dashboard/ledger
│   │   │   ├── leave/                        # 3.21 — course-owner leave/availability, both Instructor and Course Agent
│   │   │   ├── admin/                        # 3.7/2.2b — moderation, course-catalog takedown, platform analytics, category management
│   │   │   ├── notification/                 # 3.8 — in-app notifications table, email dispatch (Gmail SMTP)
│   │   │   ├── community/                    # 3.9 — per-course discussion/Q&A threads, instructor announcements
│   │   │   ├── gamification/                 # 3.10 — badges, streaks, points, leaderboard
│   │   │   ├── bundle/                       # 3.11 — learning paths / course bundles, wishlist
│   │   │   ├── localization/                 # 3.12 — supported languages, translation storage
│   │   │   ├── practicehub/                  # 3.13 — public articles, practice problems, Judge0 integration for code execution — NOTE: article authorship role (instructor vs. admin vs. dedicated content role) is not yet decided, see memory.md open questions
│   │   │   ├── growth/                       # 3.14 — referral codes, affiliate tracking
│   │   │   ├── chatbot/                      # 2.6/3.15/3.16 — LLM provider client, rate limiting, prompt scoping
│   │   │   ├── ta/                           # 3.17 — DEFERRED: ported from elearny_v0, kept, not wired into any route
│   │   │   └── livesession/                  # 3.22 — DEFERRED: ported from elearny_v0 (slots, bookings, waitlist), kept, not wired into any route
│   │   └── resources/
│   │       ├── application.yml                # Base config (shared defaults)
│   │       ├── application-dev.yml            # Local/dev profile (Docker Compose Postgres, etc.)
│   │       ├── application-prod.yml           # Hosted profile (Render env-driven — see deployment.md)
│   │       └── db/migration/                  # Flyway migrations — V1__init.sql, V2__..., etc.
│   │                                          # Schema changes are committed, versioned files —
│   │                                          # never hand-edited directly against a live DB
│   └── test/
│       └── java/com/elearny/                  # Mirrors main/java structure — one test package per domain
│           ├── auth/
│           ├── course/
│           ├── exam/
│           └── ...                            # (one folder per domain package above)
```

Each domain package under `main/java/com/elearny/` follows the same internal shape:
```
course/
├── CourseController.java
├── CourseService.java
├── CourseRepository.java
├── dto/                 # Request/response DTOs — never expose JPA entities directly over the API
├── entity/
└── mapper/               # Entity <-> DTO mapping
```

---

## 5. Frontend Structure (Next.js, App Router)

```
frontend/web/
├── app/
│   ├── (public)/                # No auth required
│   │   ├── courses/[slug]/        # Public course detail page
│   │   ├── articles/[slug]/       # 3.13 — Practice & Content Hub public pages
│   │   ├── certificates/verify/[code]/
│   │   └── page.tsx               # Landing page
│   │   ├── instructor/apply/          # 2.2 step 1 — public application form
│   │   └── instructor/apply/status/   # 2.2 step 3 — public status-check page
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (student)/                # Role-gated layout
│   │   ├── dashboard/
│   │   ├── my-courses/[id]/       # Player + progress + notes
│   │   ├── wishlist/
│   │   └── certificates/
│   ├── (instructor)/              # Role-gated layout
│   │   ├── courses/[id]/edit/
│   │   ├── analytics/
│   │   ├── revenue/                # 3.6 — payout dashboard (shared shape with courseagent)
│   │   └── leave/                  # 3.21 — leave/calendar (shared shape with courseagent)
│   ├── (courseagent)/             # Role-gated layout — mirrors (instructor)'s authoring routes
│   │   ├── courses/[id]/edit/      # same components as (instructor), courseType=PLATFORM
│   │   ├── revenue/
│   │   └── leave/
│   └── (admin)/                   # Role-gated layout
│       ├── instructor-applications/
│       ├── course-agents/          # 2.2a — provision new Course Agent accounts
│       ├── course-moderation/       # includes takedown action, 2.2b
│       └── analytics/
├── components/                    # App-specific components (not shared with mobile)
├── lib/                           # Uses packages/api-client under the hood
└── styles/
```

Role-gated route groups `(student)`, `(instructor)`, `(courseagent)`,
`(admin)` each carry their own layout that checks the JWT role claim
server-side (middleware) before rendering — this is the "role-based
navigation" from the PRD implemented structurally, not just as conditional
UI. `(instructor)` and `(courseagent)` intentionally share the same
underlying authoring components (Course Creator, Curriculum Builder,
revenue/leave views) — two route groups, not two separate UIs, per
`migration.md` §2.4. `(teachingassistant)`/live-session routes are deferred
along with their backend domains (§4) — not scaffolded in this pass. The
same role groups exist on mobile (section 6) — admin functionality is not
web-exclusive.

---

## 6. Mobile Structure (Expo, React Native)

```
frontend/mobile/
├── app/                    # Expo Router (file-based, mirrors frontend/web's route grouping conceptually)
│   ├── (public)/
│   │   ├── articles/[slug]/    # Practice & Content Hub — read/practice on mobile
│   │   ├── certificates/verify/[code]/
│   │   ├── instructor/apply/    # 2.2 step 1 — same as web
│   │   └── instructor/apply/status/
│   ├── (auth)/
│   ├── (student)/
│   │   ├── dashboard/
│   │   ├── my-courses/[id]/     # Player + progress + notes
│   │   ├── wishlist/
│   │   └── certificates/
│   ├── (instructor)/
│   │   ├── courses/[id]/edit/     # Full course-authoring flow — same capability as web (decided; see phases.md Phase 2)
│   │   ├── analytics/
│   │   ├── revenue/
│   │   └── leave/
│   ├── (courseagent)/         # mirrors (instructor)'s authoring screens — see web notes, section 5
│   │   ├── courses/[id]/edit/
│   │   ├── revenue/
│   │   └── leave/
│   └── (admin)/              # Admin functionality on mobile — approvals, course-agent provisioning, takedown, moderation, analytics
├── components/
└── lib/                     # Uses packages/api-client — same typed client as frontend
```

The Practice & Content Hub's embedded code playground (PRD §3.13) is committed
as full parity on mobile too — same editing capability as frontend, not read-only
(see `phases.md` Phase 10). This lives inside `(public)/articles/[slug]/` and
`(student)/my-courses/[id]/` wherever a lesson embeds a coding exercise, using
a touch-friendly code editor component (not the same library as frontend's — see
`phases.md` Phase 10 for the input-method note on phone keyboards).

Admin-on-mobile is committed scope: instructor approvals, course moderation,
and platform analytics all need to be reachable from the same role-gated
`(admin)` route group pattern used on frontend, backed by the same API endpoints
— no separate "mobile admin API," since the backend is platform-agnostic by
design (section 1).

Note: there is no shared `packages/ui` (§3) — React Native and web DOM
components aren't drop-in compatible, so web-specific components live in
`frontend/web/components` and native-specific ones in
`frontend/mobile/components`, each maintained independently. Only
non-visual logic (types, API-client functions) is shared, via
`packages/types` and `packages/api-client`.

---

## 7. Technology Stack (consolidated)

| Layer | Choice |
|---|---|
| Web frontend | Next.js 16.3.x, Tailwind CSS |
| Mobile app | React Native + Expo SDK 57 |
| Backend | Spring Boot 3.5.8, Java 21, REST API |
| Monorepo tooling | Plain npm workspaces only — no Turborepo, no root build orchestration (see §3) |
| Database | PostgreSQL 17 |
| Auth | JWT + TOTP 2FA |
| Payments | Razorpay |
| Media storage | Cloudflare R2 |
| Video delivery | Signed URLs + HTML5/native range requests (progressive) |
| Code execution (Practice Hub) | Judge0 (self-hosted) |
| Chatbot LLM | Google Gemini Flash or Groq (free tier) |
| Email | Gmail SMTP via `spring-boot-starter-mail` |
| In-app notifications | `notifications` table |
| Certificate generation | Apache PDFBox |
| Deployment (dev) | Docker Compose |
| Deployment (hosted backend) | Render (free tier — see `deployment.md` for spin-down caveat) |
| Deployment (hosted web) | Vercel (free Hobby tier — see `deployment.md` for commercial-use restriction) |
| Deployment (hosted database) | Supabase (permanent free Postgres tier — NOT Render's own Postgres, which expires after 30 days; note: free Supabase projects auto-pause after 7 days idle, resumable) |
| Mobile builds & OTA updates | EAS Build + EAS Update (see `deployment.md` §4.5 and §6) |

---

## 8. Change Log
- **v0.1** — Initial architecture drafted from PRD v0.5: high-level diagram,
  six core app flows, monorepo structure with explicit Turborepo/Java
  boundary, feature-based backend module layout, and frontend/mobile
  route structure.
- **v0.2** — Fixed backend structure to reflect a real Spring Boot project
  layout: added `src/main/resources` (application profiles, Flyway
  migrations under `db/migration`), `src/test/java` mirroring the domain
  packages, and a `Dockerfile`. Reversed the earlier "admin is web-only"
  decision — admin functionality (approvals, moderation, analytics) is now
  committed on mobile too, via a matching `(admin)` route group backed by
  the same platform-agnostic API.
- **v0.3** — Cross-doc consistency pass: resolved "iText/PDFBox" to
  PDFBox-only in three places to match `rules.md`'s licensing decision;
  added the `/api/v1` prefix to every app-flow endpoint in section 2 to
  match `rules.md` §8's API versioning rule (they previously contradicted
  each other); expanded the mobile folder structure to actually show full
  course-authoring and full code-playground routes, matching the parity
  decisions logged in `memory.md`; flagged an open gap — Practice & Content
  Hub article authorship (who writes them) was never decided.
- **v0.4** — Resolved the deployment-hosting row from a vague "Railway or
  Render" into concrete decisions, detailed in new doc `deployment.md`:
  Render for backend, Vercel for web, Neon for database (explicitly not
  Render's own Postgres, which expires after 30 days), EAS Build/Update
  for mobile.
- **v0.5** — Flattened `apps/web` → `frontend/` and `apps/mobile` →
  `mobile/` throughout (matching `backend/` already being top-level, and
  removing the confusing overlap with Next.js's own internal `app/`
  router folder). Switched the database hosting decision from Neon to
  Supabase (see `deployment.md` for reasoning and the auto-pause caveat).
- **v0.6** — Corrected v0.5's flattening: `frontend/` is now a grouping
  folder containing both `frontend/web` (Next.js) and `frontend/mobile`
  (Expo), not two separate top-level folders. This is what was actually
  requested — one place for all frontend surfaces, cleanly separated
  underneath it — not full flattening to match `backend/`.
- **v0.7** — Full feature-coverage audit against `prd.md`: found and fixed
  a real gap — PRD §3.9 (Community & Engagement: discussion/Q&A,
  announcements) had no backend package anywhere in this document, even
  though the frontend structure already promised that UI. Added a
  `community/` package. Also tagged the previously-untagged `review/`
  package with §3.3, added missing §3.1/§3.2 tags to `media/` and
  `enrollment/`, and removed a stale "Railway/Render" reference in the
  resources config comment (the decision has been Render-only since
  `deployment.md` was written).
- **v0.8** — Added the missing endpoints implied by `pages.md`'s expanded
  Register/Forgot-Password/Reset-Password specs to the Auth Flow (§2.1):
  `GET /auth/check-username` (live availability check), account-lockout
  behavior on `/auth/login` (§3.18), and explicit
  `/auth/forgot-password` + `/auth/reset-password` endpoints — these
  existed as pages in `pages.md` and as a feature in `prd.md` §3.8/§3.18
  but were never reflected in the actual API flow. Also fixed a stale
  "Derived from prd.md v0.5" reference in the status header (prd.md has
  been v0.6 since the TA role addition).
- **v0.9** — Derived from `prd.md` v0.7 — enforced modern non-deprecated dependency standards (Java 21 LTS, Spring Boot 3.3.x, Next.js 14.2+, Expo SDK 51).
- **v1.0** — Derived from `prd.md` v0.8 — incorporated combined entities from `temp_elearny`: `InstructorLeave`, `LiveSessionSlot`, `LiveSessionBooking`, `WaitlistEntry`, `CommunicationLog`, `AuditLog`, `ConsentRecord`, and Apache POI Excel Data Export Service.
- **v1.1** — Derived from `prd.md` v0.9 — added architectural specifications for Judge0 Sandbox Code Execution Queue Flow (multi-language execution, test cases, memory/time limits, async webhook status) and Duolingo Gamification Engine Flow (streak evaluation, loss aversion streak freeze protection, XP economy, leaderboard ranking).
- **v1.2 — Migration-driven amendment (Phase M0 of `migration.md`), derived from `prd.md` v1.3.** Rewrote §2.2 Instructor Approval Flow into the full application/OTP/activation redesign (§2.2), added §2.2a Course Agent Provisioning and §2.2b Admin Course-Catalog Takedown as new flows. Simplified §3's monorepo structure — dropped Turborepo, `packages/ui`, `packages/config`; kept `packages/types` + `packages/api-client` via plain npm workspaces only (see `migration.md` §3). Updated §4's backend domain list: added `courseagent/` (new), `leave/` (new — generalized from Instructor-only to course-owner scope), retagged `revenue/` and `admin/` for the same generalization, and added `ta/`/`livesession/` as explicitly deferred-but-ported domains. Added `(courseagent)` route groups and instructor-apply/status public routes to both §5 (web) and §6 (mobile). Updated §7's version pins to the currently-verified stable releases (Spring Boot 3.5.8, Next.js 16.3.x, Expo SDK 57, PostgreSQL 17) per `migration.md` §4, and removed the now-inaccurate Turborepo row.

