# eLearny — Architecture Document (architecture.md)

> Status: **v0.9.** Derived from `prd.md` v0.7 — every module here exists to
> serve a committed feature using modern, stable, non-deprecated dependency standards
> (Java 21 LTS, Spring Boot 3.3.x, Next.js 14.2+, Expo SDK 51 / React Native 0.74+).
> Living document: update when a structural decision changes, with a version bump.

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

### 2.2 Instructor Approval Flow
1. User registers normally as a `STUDENT`
2. `POST /api/v1/instructor/apply` → creates an `InstructorApplication` (status
   `PENDING`), user's role is unchanged until approved
3. Admin reviews via `GET /api/v1/admin/instructor-applications` →
   `POST /api/v1/admin/instructor-applications/{id}/approve` — only on approval
   does the user's role become `INSTRUCTOR`
4. Every instructor-only endpoint checks role `INSTRUCTOR` **and**
   application status `APPROVED` — the gate is enforced at the API layer,
   not just hidden in the UI

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

**Important structural decision:** Turborepo orchestrates JavaScript/TypeScript
only. It cannot build or run the Java/Maven backend. So the backend lives
*alongside* the Turborepo-managed apps in the same repository, but outside
Turborepo's own build graph — it's built with Maven, containerized with its
own Dockerfile, and wired to the rest of the system via Docker Compose for
local development. Calling this a "Turborepo monorepo" isn't quite
accurate — it's a monorepo where Turborepo manages the JS/TS half.

```
elearny/
├── frontend/                    # All frontend surfaces live here, side by side
│   ├── web/                     # Next.js (Turborepo-managed)
│   └── mobile/                  # Expo React Native (Turborepo-managed)
├── packages/                    # Shared across frontend/web + frontend/mobile (Turborepo-managed)
│   ├── api-client/              # Typed fetch wrapper for the Spring Boot API
│   ├── types/                   # Shared TS types (mirrors backend DTOs)
│   ├── ui/                      # Shared design-system components (web + native-compatible where feasible)
│   └── config/                  # Shared eslint/tsconfig/tailwind config
├── backend/                     # Spring Boot 3.5 (Java 21) — Maven, NOT Turborepo-managed
│   └── (see section 4)
├── docs/                        # prd.md, architecture.md, rules.md, phases.md, design.md, memory.md, deployment.md
├── docker-compose.yml           # Wires backend + Postgres + frontend/web (dev) together locally
├── turbo.json                   # Turborepo pipeline — only touches frontend/*, and packages/
└── package.json                 # Root workspace config (npm/pnpm workspaces)
```

`frontend/` is a single grouping folder holding both frontend surfaces —
`frontend/web` and `frontend/mobile` — side by side, distinct from
`backend/` which stays a flat top-level folder. This keeps every
frontend-facing thing under one parent while still cleanly separating the
Next.js app from the Expo app underneath it.

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
│   │   │   ├── auth/                         # 2.1 — register, login, TOTP 2FA, JWT issuing/refresh
│   │   │   ├── user/                         # User entity/profile, role management
│   │   │   ├── instructor/                   # 2.2 — instructor application + approval workflow
│   │   │   ├── course/                       # 3.1 — course/section/lesson CRUD, versioning, drip content, draft/publish states
│   │   │   ├── media/                        # 3.1/3.2 — R2 upload, signed URL generation for video/resources
│   │   │   ├── enrollment/                   # 2.3/2.4/3.2 — enrollment records, progress tracking, bookmarks/notes
│   │   │   ├── discovery/                    # 3.3 — search, filters, categories, rule-based recommendations
│   │   │   ├── review/                       # 3.3 — course reviews & ratings
│   │   │   ├── exam/                         # 3.4/2.5 — quizzes, exams, attempts, violations, grading
│   │   │   ├── certificate/                  # 3.5/2.5 — PDF generation, verification endpoint
│   │   │   ├── payment/                      # 3.6/2.3 — Razorpay orders, webhooks, coupons, refunds
│   │   │   ├── revenue/                      # 3.6 — instructor revenue dashboard, payout status
│   │   │   ├── admin/                        # 3.7 — moderation, platform analytics, category management
│   │   │   ├── notification/                 # 3.8 — in-app notifications table, email dispatch (Gmail SMTP)
│   │   │   ├── community/                    # 3.9 — per-course discussion/Q&A threads, instructor announcements
│   │   │   ├── gamification/                 # 3.10 — badges, streaks, points, leaderboard
│   │   │   ├── bundle/                       # 3.11 — learning paths / course bundles, wishlist
│   │   │   ├── localization/                 # 3.12 — supported languages, translation storage
│   │   │   ├── practicehub/                  # 3.13 — public articles, practice problems, Judge0 integration for code execution — NOTE: article authorship role (instructor vs. admin vs. dedicated content role) is not yet decided, see memory.md open questions
│   │   │   ├── growth/                       # 3.14 — referral codes, affiliate tracking
│   │   │   └── chatbot/                      # 2.6/3.15/3.16 — LLM provider client, rate limiting, prompt scoping
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
│   │   └── revenue/
│   └── (admin)/                   # Role-gated layout
│       ├── instructor-applications/
│       ├── course-moderation/
│       └── analytics/
├── components/                    # App-specific components (not shared with mobile)
├── lib/                           # Uses packages/api-client under the hood
└── styles/
```

Role-gated route groups `(student)`, `(instructor)`, `(admin)` each carry
their own layout that checks the JWT role claim server-side (middleware)
before rendering — this is the "role-based navigation" from the PRD
implemented structurally, not just as conditional UI. The same three role
groups exist on mobile (section 6) — admin functionality is not web-exclusive.

---

## 6. Mobile Structure (Expo, React Native)

```
frontend/mobile/
├── app/                    # Expo Router (file-based, mirrors frontend/web's route grouping conceptually)
│   ├── (public)/
│   │   ├── articles/[slug]/    # Practice & Content Hub — read/practice on mobile
│   │   └── certificates/verify/[code]/
│   ├── (auth)/
│   ├── (student)/
│   │   ├── dashboard/
│   │   ├── my-courses/[id]/     # Player + progress + notes
│   │   ├── wishlist/
│   │   └── certificates/
│   ├── (instructor)/
│   │   ├── courses/[id]/edit/     # Full course-authoring flow — same capability as web (decided; see phases.md Phase 2)
│   │   ├── analytics/
│   │   └── revenue/
│   └── (admin)/              # Admin functionality on mobile — approvals, moderation, analytics
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

Note: `packages/ui` is shared where feasible, but React Native and web DOM
components aren't drop-in compatible — expect the web-specific components
in `frontend/web/components` and native-specific ones in
`frontend/mobile/components`, with only genuinely cross-platform logic
(not markup) living in `packages/`.

---

## 7. Technology Stack (consolidated)

| Layer | Choice |
|---|---|
| Web frontend | Next.js, Tailwind CSS |
| Mobile app | React Native + Expo |
| Backend | Spring Boot 3.5, Java 21, REST API |
| Monorepo tooling | Turborepo (JS/TS apps + packages only) |
| Database | PostgreSQL |
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
