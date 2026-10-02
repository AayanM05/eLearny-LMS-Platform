# eLearny — v0 → Target Architecture Migration Guide

> **Status: v1.0 — living document, created 2026-09-22.** This is the bridge
> between `elearny_v0` (the flat Spring Boot + Vite/React project, ~295 files,
> mostly working, zero tests) and the target architecture in `docs/`
> (`architecture.md`, `prd.md`, `rules.md`, `phases.md`, `design.md`,
> `pages.md`, `processflows.md`, `wireframes.md`, `deployment.md`).
>
> **Ground rule, non-negotiable:** nothing in v0 gets deleted just because
> the current docs don't mention it. §9.1 below is the running list of
> v0-only features that need to be folded back into `prd.md`/`phases.md` so
> they survive the migration as documented, committed scope — not silently
> dropped. §9.2 is the reverse list: target-doc V1 features v0 never had,
> which are net-new build work, not porting work.
>
> Once this document's phases are complete, `docs/memory.md` resumes as the
> live-state tracker (per its own convention) and this file becomes historical
> reference, same as `docs/chat.md`.

---

## 1. What This Migration Actually Is

v0 is **not** a prototype to throw away. It already has, working, in code:
30+ entities, 24 controllers, 32 services, JWT auth, **TOTP 2FA** (fully
implemented — `TotpService`, QR setup, challenge/verify), **account lockout**
(`failedLoginAttempts`/`lockedUntil` on `User`), Razorpay payments + signed
webhook handling, coupons, refunds, reviews, wishlist, a full per-course
forum, **Instructor Leave + Live Session slots/bookings + Waitlist** (already
built — this is V2-A in the target docs' sequencing, and v0 already has it),
a **Teaching Assistant role + grading UI** (already built), Excel export via
Apache POI, an event-driven notification dispatcher (email + SMS via Twilio +
in-app, fan-out from domain events like `PaymentCapturedEvent`), audit
logging, and GDPR consent recording + a data-deletion/anonymization flow.

That is *more* than the fresh V1 rebuild described in `docs/memory.md` had
gotten to as of the 2026-09-22 reset. **This is why we're migrating, not
rebuilding**: the target docs describe the shape we want; v0 already has most
of the substance.

What v0 does **not** have, structurally: domain-package backend organization
(it's `controller/`/`service/`/`repository/`/`entity/` layers, not
`course/`, `payment/`, etc. each self-contained), a monorepo, a mobile app,
Next.js (it's Vite/React Router), PostgreSQL/Flyway (it's MySQL with
`ddl-auto: update`), PDFBox (it's OpenPDF + Flying Saucer), R2/S3 media
storage (it's local disk, `/tmp/elearny-storage`), and **any backend tests
at all** (`src/test/java` doesn't exist).

And functionally, it doesn't yet have: email OTP verification, the
instructor application/approval flow we just designed together, a
`COURSE_AGENT` role, `SUPER_ADMIN`, gamification, the AI chatbot, course
bundles/learning paths, or exam-integrity logging. All net-new V1 work,
detailed in §9.2.

---

## 2. Confirmed Product-Flow Amendments

This section is the canonical spec for the flows we designed together —
**this supersedes `prd.md` §2/§3.1/§3.26 and `architecture.md` §2.2 wherever
they conflict.** Once migration starts, fold this section into those docs
directly (§13, step M0.4) so there's one source of truth again, not two.

### 2.1 Roles (6 total — was 5 in `prd.md`)
`STUDENT`, `INSTRUCTOR`, `TEACHING_ASSISTANT` *(kept in code, not wired into
any route/flow this migration — see §2.5)*, `COURSE_AGENT` *(new)`, `ADMIN`,
`SUPER_ADMIN`.

### 2.2 Student — unchanged from `prd.md`
Register → email OTP verify → login → browse/enroll → pay → learn → quiz/
assignment → certificate. Nothing about this flow changes.

### 2.3 Instructor Onboarding (replaces `prd.md` §3.26's instructor half)

```
[Public /instructor/apply]
  ├─ New application:
  │   1. Form: name, bio, professional details
  │   2. Uploads (real files → object storage, not link fields):
  │      - ID proof
  │      - Certifications (multiple files)
  │      - Sample teaching video
  │   3. Portfolio/LinkedIn — URL field (legitimately just a link)
  │   4. Email — rejected at submit time if it already belongs to ANY
  │      existing User account, any role ("use a different email").
  │      A student can never become an instructor on their existing
  │      account — a fresh email is required, by design (confirmed).
  │   5. Submit → 6-digit OTP to that email → verify →
  │      InstructorApplication created, status PENDING,
  │      an 8–10 char alphanumeric applicationId generated + shown
  │      ("save this ID"). Email is now verified — no second OTP
  │      needed later.
  │
  └─ "Already applied? Check status" (same public page, a link/tab):
      1. Enter applicationId + email
      2. OTP to that email → verify → shows status:
         PENDING / APPROVED / REJECTED (+ reason if rejected)

[Admin → Instructor Applications]
  - List, filterable PENDING / APPROVED / REJECTED
  - Reviews uploaded docs + video + info
  - Approve → single-use, time-limited activation link emailed
    (no second OTP — email already verified at application time).
    Visiting the link → username + password setup ONLY → User account
    created, role INSTRUCTOR, tied to the application's email.
    Instructor cannot log in before this point — no account exists yet.
  - Reject → reason required, status REJECTED, cooldownEndsAt =
    rejectedAt + 15–30 days (confirm exact window, §12 Q-A)

[Reapplication rules — confirmed]
  - PENDING application exists for that email → new submission blocked,
    message: "An application is already under review for this email —
    track its status above." (No new application created.)
  - REJECTED, cooldown NOT yet ended → new submission blocked, message:
    "Your application is on a cooldown period until <date>."
  - REJECTED, cooldown ended → new submission ALLOWED, same email, no
    "already applied" error of any kind. Once this new application is
    submitted, the OLD rejected application's status becomes
    unqueryable by applicationId/email (only the new one is trackable)
    — but Admin can still see full history (all past applications for
    that email) in the admin view. This is a public-facing status-check
    restriction, not a data-retention one — nothing gets deleted.

[Instructor, post-activation — unchanged from prd.md]
  Course creation, curriculum builder, quiz/assignment creation,
  enrolled-student monitoring, grading + feedback.
```

### 2.4 Course Agent (new role) + Platform Courses

- Provisioned directly by Admin — **no public application**, this is
  effectively an internal/employee role. Default: Admin creates the account
  (email + an activation link, reusing the same single-use-link mechanism as
  instructor activation, just Admin-triggered instead of application-approval-
  triggered) — confirm this default, §12 Q-B.
- Course Agents get the **same authoring interface** as Instructors —
  Course Creator, Curriculum Builder, Quiz/Assignment builders — reused
  wholesale, not rebuilt.
- `Course` gets a `courseType` enum: `INSTRUCTOR` | `PLATFORM`. Platform
  courses (Course Agent output) are eLearny's official/premium catalog,
  distinguished in Discovery/Browse (e.g. a "eLearny Official" badge).
- `Course.instructor` (FK) stays but becomes nullable for `PLATFORM`
  courses OR points at the Course Agent — pick one at implementation time
  (§12 Q-C); either way no existing instructor-course code needs to know
  the difference, it's an additive field.

### 2.5 Admin

- Reviews instructor applications (§2.3), approves/rejects.
- **Monitoring-only interface**, distinct from the authoring UI used by
  Instructors/Course Agents: platform-wide visibility into students,
  instructors, course agents, courses, activity — not a course editor.
- Everything already in `prd.md` §3.7 (moderation, category management,
  platform analytics, RBAC) still applies.

### 2.6 Teaching Assistant — explicitly deferred

v0's TA code (`TaAssignment`, `TaStatus`, `TaController`, `TaService`,
`TaInviteRequest`, `TaCourseGradingPage.jsx`, `TaDashboard.jsx`) **is kept,
untouched, ported as-is** during migration — just not wired into the active
route set or the phase checklist below. It comes back online as its own
later phase, unchanged from what's already built, once you say go.

**Open question needing your confirmation before Phase M2 (§12 Q-D):** v0
also has Instructor Leave + Live Session slots/bookings/waitlist already
built and wired into the Instructor UI (`AvailabilityPage.jsx`,
`LiveSessionManagementPage.jsx`, `LiveSessionsPanel.jsx`). The target docs
group Leave/Office-Hours with the TA role as one V2-A phase, but your
instruction was specifically about TA. Default assumption for this doc:
**Leave + Live Sessions stay wired and active** (they're not TA-dependent
functionally in v0 — an instructor can run office hours without ever having
a TA), only literal TA-invite/TA-grading gets deferred. Flag if wrong.

---

## 3. Target Monorepo Structure

```
elearny/
├── frontend/
│   ├── web/                     # Next.js 16 App Router — ports v0's frontend/
│   └── mobile/                  # Expo — 100% NEW, v0 has no mobile app
├── packages/
│   ├── api-client/               # Typed fetch wrapper — replaces v0's src/api/*.js
│   ├── types/                    # Shared TS types (generated from springdoc-openapi)
│   ├── ui/                       # Shared design-system components
│   └── config/                   # eslint/tsconfig/tailwind config
├── backend/                      # Spring Boot — restructured from v0's flat src/
│   ├── pom.xml                   # moved from v0's repo root
│   ├── Dockerfile
│   └── src/
│       ├── main/java/com/elearny/<domain>/...   # see §5 mapping
│       └── test/java/com/elearny/<domain>/...   # NEW — zero tests existed in v0
├── docs/                         # already exists — the 11 planning docs + this file
├── docker-compose.yml
├── turbo.json
└── package.json
```

v0's root-level docs (`README.md`, `TESTING_GUIDE.md`,
`eLearny_UI_Requirement_Document.md`, `eLearny_AI_UI_Generation_Prompts.md`)
move to `docs/legacy/` — kept for reference, not deleted, not treated as
current spec (that's `pages.md`/`prd.md`'s job now).

---

## 4. Dependency & Version Pins

Checked against current registries as of 2026-09-22 (not the training-data
snapshot the earlier docs were written from) — pin these, don't blindly
follow a version number in `rules.md`/`architecture.md` if it's now stale.

| Layer | v0 currently on | Migration target | Note |
|---|---|---|---|
| Java | 21 LTS | **21 LTS (keep)** | Java 25 is the newer LTS (Sept 2025), but Spring Boot 3.5.x is well-proven on 21 and v0's code is already 21-clean — no reason to combine a Java-version bump with this migration |
| Spring Boot | 3.5.4 | **3.5.8** (latest 3.5.x patch) | Spring Boot 4.1.x exists (built on Spring Framework 7) but is a major-version jump with breaking changes — don't combine that risk with a structural migration. Stay on the 3.5 branch v0 already runs; revisit 4.x as a deliberate later upgrade, not part of this doc |
| Database | MySQL 8, `ddl-auto: update` | **PostgreSQL 17 + Flyway** | Matches `architecture.md`; see §6 |
| PDF generation | OpenPDF + Flying Saucer | **Apache PDFBox** | Licensing decision already made in `rules.md` §2 (iText/AGPL avoidance) — OpenPDF itself is LGPL/MPL so not a licensing *violation*, but PDFBox is the documented standard; swap for consistency, not urgency |
| Media storage | Local disk (`/tmp/elearny-storage`) | **AWS S3 SDK v2 → Cloudflare R2** | Real infra gap — local disk storage doesn't survive a Render/container redeploy |
| Frontend framework | Vite + React 19.2.8 + React Router 7 | **Next.js 16.3.x** (current stable) | `rules.md` says "14.2+" — that's a floor from when it was written, not a ceiling; current stable is materially newer and non-deprecated, use it |
| Frontend language | Plain JS (`.jsx`) | **TypeScript, incrementally** | See §8.4 — not a big-bang rewrite |
| Mobile | none | **Expo SDK 57** | SDK 56 has a known Hermes V1 memory regression (fixed in 57) — don't start a fresh mobile app on 56 |
| Node.js | unspecified | **Node 24 LTS** | Current Active LTS line |
| Backend testing | none | **JUnit 5 + Mockito + Testcontainers** (already in v0's `pom.xml` as unused deps!) | See §7 — the dependencies are already there, just never used |

---

## 5. Backend Migration Map — Technical Layers → Domain Packages

v0's `controller/`, `service/`, `repository/`, `entity/`, `dto/request/`,
`dto/response/` each become subfolders **inside** each domain package
(`architecture.md` §4's per-domain shape:
`course/{Controller,Service,Repository,dto/,entity/,mapper/}`). This is a
**mechanical move + import fix**, not a rewrite — the logic inside each
class doesn't change in this pass.

| Target domain package | v0 source files that move in |
|---|---|
| `auth/` | `AuthController`, `AuthService`, `RefreshTokenService`, `RefreshTokenRepository`, `RefreshToken` (entity), `LoginRequest`, `RegisterRequest`, `ForgotPasswordRequest`, `ResetPasswordRequest`, `RefreshTokenRequest`, `TwoFactorChallengeRequest`, `TwoFactorVerifyRequest`, `AuthResponse`, `TotpSetupResponse`, `TotpService`, `LoginHistory` (entity+repo+response — see §9.1), plus all of `security/` (`JwtService`, `JwtAuthenticationFilter`, `CustomUserDetailsService`, `UserPrincipal`) |
| `user/` | `User`, `Role` enums, `UserSummary`, `UserRepository`; the "deactivate user" slice of `AdminService` |
| `instructor/` **(net-new domain)** | v0 has NO `InstructorApplication` entity or dedicated instructor-application service — this is built fresh per §2.3. The existing approve/reject logic embedded in `AdminController`/`AdminService` (`pending()`, `decide()`) gets extracted here and rebuilt around the new flow, not just moved |
| `courseagent/` **(100% net-new)** | No v0 equivalent at all |
| `course/` | `Course`, `Section`, `Subsection` → **rename to `Lesson`**, `CourseLevel`, `ContentType`, `CourseContentController`, `CourseContentService`, `CourseController`, `CourseService`, `CourseCreateRequest`, `SectionCreateRequest`, `SubsectionCreateRequest` → `LessonCreateRequest`, `CourseResponse`, `SectionResponse`, `SubsectionResponse` → `LessonResponse` |
| `media/` | No dedicated service exists — file upload is currently handled ad hoc via `app.storage.dir`. Build fresh against R2/S3 per §4, reusing the multipart config already in `application.yml` |
| `enrollment/` | `Enrollment`, `Progress`, `EnrollmentController`, `EnrollmentService`, `ProgressController`, `ProgressService`, `ProgressResponse` |
| `discovery/` | `Category`, `CategoryController`, `CategoryRepository`, `SearchController`, `SearchService` |
| `review/` | `Review`, `ReviewController`, `ReviewService`, `ReviewCreateRequest`, `ReviewResponse` |
| `exam/` | `Quiz`, `QuizQuestion`, `QuizAttempt`, `QuizController`, `QuizService`, `QuizCreateRequest`, `QuizAttemptRequest`, `QuizResponse`, `QuizAttemptResponse` — **note**: no time-limit field, no violation logging, no question/option randomization exist yet — see §9.2 |
| `assignment/` | `Assignment`, `AssignmentSubmission`, `AssignmentController`, `AssignmentService`, `AssignmentCreateRequest`, `AssignmentSubmitRequest`, `AssignmentGradeRequest`, `AssignmentSubmissionResponse` |
| `certificate/` | `Certificate`, `CertificateController`, `CertificateService`, `CertificateResponse`, `PdfGenerationService` (rework for PDFBox), `templates/pdf/certificate.html` (Thymeleaf → rework for PDFBox's rendering approach, it doesn't consume HTML templates the way Flying Saucer does) |
| `payment/` | `Payment`, `PaymentStatus`, `PaymentController`, `PaymentService`, `WebhookController`, `PurchaseInitiateRequest/Response`, `RazorpayWebhookPayload`, `Coupon`, `CouponController`, `CouponService`, `CouponCreateRequest`, `CouponResponse`, `DiscountType`, `RefundRequest`, `RefundStatus`, `RefundController`, `RefundService`, `RefundRequestCreate`, `RefundDecisionRequest`, `RefundEligibilityResponse`, `RefundRequestResponse` |
| `revenue/` | `InstructorPayoutSummary`; revenue-related slices of `AdminService`/`ReportExportService` |
| `admin/` | `AdminController`/`AdminService` (minus what moved to `instructor/`), `ReportController`, `ReportExportService`, `AuditLog`, `AuditService`, `DashboardStatsResponse`, `EnrollmentTrendPoint`, `UserSummary` — **plus** rework per §2.5's monitoring-only interface split |
| `notification/` | `Notification`, `NotificationType`, `NotificationController`, `NotificationRepository`, all of `service/notification/*` (`NotificationDispatcher`, `EmailNotificationSender`, `SmsNotificationSender`, `InAppNotificationSender`), `CommunicationLog`, `CommunicationChannel`, `CommunicationStatus`, `TwilioConfig`, `MailConfig`, all of `service/event/*` and its listeners (`ForumNotificationListener`, `PaymentReceiptListener`, `WaitlistNotificationListener`) |
| `community/` | `ForumThread`, `ForumReply`, `ForumController`, `ForumService`, `ForumThreadCreateRequest`, `ForumReplyCreateRequest`, `ForumThreadResponse`, `ForumReplyResponse`, `ForumReplyEvent` |
| `gamification/` **(100% net-new)** | No v0 equivalent — no streak/badge/XP/leaderboard entities exist anywhere |
| `bundle/` | `Wishlist`, `WishlistController`, `WishlistService`, `WishlistRepository` port directly. Learning Paths/Bundles themselves are **net-new** — no `Bundle`/`LearningPath` entity in v0 |
| `chatbot/` **(100% net-new)** | No v0 equivalent |
| `ta/` *(ported, unwired — §2.6)* | `TaAssignment`, `TaStatus`, `TaController`, `TaService`, `TaInviteRequest` |
| `leave/` + `livesession/` *(ported, stays wired — §2.6)* | `InstructorLeave`, `LeaveStatus`, `LiveSessionSlot`, `LiveSessionBooking`, `BookingStatus`, `WaitlistEntry`, `WaitlistStatus`, `LiveSessionController`, `LiveSessionService`, `InstructorAvailabilityController`, `InstructorAvailabilityService`, `LiveSessionSlotCreateRequest`, `LiveSessionSlotResponse`, `InstructorUnavailabilityRequest`, `WaitlistOfferedEvent` |
| `privacy/` **(needs doc coverage — §9.1)** | `ConsentRecord`, `ConsentService`, `PrivacyController`, `DataPrivacyService`, `DeletionRequestDecision` |
| `localization/`, `practicehub/`, `growth/` | Not in v0, V2 per docs — skip entirely for this migration |

Shared infra (`config/`, `exception/`, `util/`) moves to `common/` per
`architecture.md` §4 largely as-is: `SecurityConfig`, `MailConfig`,
`TwilioConfig`, `AsyncConfig`, `RetryConfig`, `OpenApiConfig`,
`JpaAuditingConfig`, `DataSeeder`, `StartupBanner`,
`GlobalExceptionHandler` + the 4 custom exceptions, `CodeGenerator`,
`HashUtils`, `SecurityUtils`.

**MapStruct**: v0 doesn't use it (mapping is presumably hand-written or via
Lombok builders inline in services). `rules.md` §1 specifies MapStruct for
entity↔DTO mapping. Recommendation: don't retrofit MapStruct onto every
existing mapper in this pass — adopt it for the `mapper/` subfolder only in
domains you're touching anyway (new `instructor/`, `courseagent/`,
`gamification/`, `chatbot/`), and convert the rest opportunistically. Forcing
a MapStruct rewrite across 23 response DTOs before anything else ships would
directly contradict "as early as possible."

---

## 6. Database Migration Strategy — MySQL/`ddl-auto` → Postgres/Flyway

1. Stand up local PostgreSQL 17 (matches `deployment.md`/`architecture.md`).
2. **Do not hand-translate v0's implicit Hibernate-managed schema into SQL
   from memory.** Instead: point v0's own `ElearnyApplication` at a fresh
   Postgres instance with `ddl-auto: update` temporarily, let Hibernate
   generate the real schema from the actual entities (including every field
   your 45 entities actually have), then run
   `pg_dump --schema-only` (or an equivalent Flyway-baseline tool) against
   that to produce a real, complete `V1__init.sql` — this guarantees the
   migration matches what the entities actually declare, not a manually
   reconstructed approximation that silently drops a column.
3. Split that single baseline into logical `V1__`, `V2__`, `V3__`... per
   domain package as you restructure (mirrors the target's own
   `db/migration/` convention and `memory.md`'s established pattern of one
   migration per backend slice).
4. Switch `ddl-auto` to `validate` once migrations exist — Hibernate then
   *checks* the schema matches the entities instead of silently altering it,
   catching drift immediately.
5. MySQL-specific SQL (if any raw `@Query` native queries exist — grep for
   `nativeQuery = true` before assuming none do) needs a Postgres-syntax
   pass; JPQL/derived-query-method repositories need no changes at all.

---

## 7. Test Infrastructure — What You Asked About Specifically

v0's `pom.xml` **already has** `spring-boot-starter-test`,
`spring-security-test`, `testcontainers` (`junit-jupiter` + `mysql`
modules), and `greenmail-junit5` (for asserting real email content, not just
"was send() called") as dependencies — **they were never used.** Zero files
exist under `src/test/`. So step one isn't "add testing infra," it's "start
writing tests against infra that's already declared" — genuinely fast to
start.

### 7.1 Structure (mirrors `main`, per `architecture.md` §4)
```
backend/src/test/java/com/elearny/
├── auth/
│   ├── AuthControllerTest.java       # MockMvc, full register→verify→login→refresh loop
│   ├── JwtServiceTest.java            # pure unit — token issue/parse/expiry
│   └── AccountLockoutTest.java        # 5-strikes lockout, unlock timing
├── instructor/
│   ├── InstructorApplicationTest.java # apply→OTP verify→admin approve→activate→login
│   └── ReapplicationCooldownTest.java # the exact rules from §2.3 — pending-blocks,
│                                       # rejected+cooldown-blocks, rejected+cooldown-
│                                       # ended-allows, old app becomes untrackable
├── course/
│   └── CourseControllerTest.java      # CRUD, ownership (404 not 403), publish validation
├── payment/
│   └── WebhookControllerTest.java     # signature verification, enrollment-only-from-
│                                       # verified-webhook (never client callback)
├── ...                                 # one package per domain, mirrors main/
└── ElearnyApplicationTests.java        # context-load smoke test
```

### 7.2 Testcontainers over H2
v0's `pom.xml` has both H2 (in-memory) and Testcontainers MySQL as test
deps — pick **Testcontainers with a real Postgres 17 container** for
integration tests, drop the H2 dependency entirely once migrated. This is
exactly the reasoning already written into `rules.md` §1's own table:
*"Testcontainers spins up a real Postgres for integration tests — no
'works on H2, breaks on Postgres' surprises."* Swap the Testcontainers
`mysql` module for the `postgresql` one when you add it.

### 7.3 What "Definition of Done" means for tests here
Per `rules.md` §13a (already established in the target docs, carry it into
this migration too): a checkbox in `memory.md` only gets checked once a
**real command's real output** is logged — `mvn clean test` with an actual
`Tests run: N, Failures: 0, Errors: 0` line, not "tests written." Given v0
has zero tests today, the honest first checklist entry for every ported
domain is "tests written, unverified" until that command actually runs.

### 7.4 Priority order for writing tests (don't try to cover all 45 entities day one)
1. **Auth + the new instructor-application flow** (§2.3) — highest-risk,
   most novel logic, exactly the kind of thing that should have been
   caught by a test before it shipped
2. **Payment webhook signature verification** — this is the single most
   security-critical path in the whole app (fake-payment exploitation risk)
3. **Course ownership/publish validation** — cheap to test, catches
   cross-instructor data leaks
4. Everything else, opportunistically, as each domain package gets touched
   during the migration — not as a separate "write tests for everything"
   phase at the end (that phase never finishes)

---

## 8. Frontend Migration — Vite/React Router → Next.js App Router

### 8.1 Route mapping (37 `.jsx` pages → route groups)

| v0 page | Target route |
|---|---|
| `pages/HomePage.jsx` | `app/(public)/page.tsx` |
| `pages/auth/RegisterPage.jsx` | `app/(auth)/register/page.tsx` |
| `pages/auth/LoginPage.jsx` | `app/(auth)/login/page.tsx` |
| `pages/auth/TwoFactorChallenge.jsx` | `app/(auth)/2fa-challenge/page.tsx` |
| `pages/auth/ForgotPasswordPage.jsx`, `ResetPasswordPage.jsx` | `app/(auth)/forgot-password/`, `app/(auth)/reset-password/` |
| — *(none in v0 — net-new, §9.2)* | `app/(auth)/verify-email/page.tsx` |
| — *(none — net-new)* | `app/(public)/instructor/apply/page.tsx`, `app/(public)/instructor/apply/status/page.tsx` (§2.3) |
| `pages/course/BrowsePage.jsx` | `app/(public)/courses/page.tsx` |
| `pages/course/CourseDetailPage.jsx` | `app/(public)/courses/[slug]/page.tsx` |
| `pages/course/CoursePlayerPage.jsx` | `app/(student)/my-courses/[id]/page.tsx` |
| `pages/course/QuizPlayer.jsx` | `app/(student)/exams/[id]/attempt/page.tsx` |
| `pages/course/AssignmentPanel.jsx`, `ForumPanel.jsx`, `LiveSessionsPanel.jsx` | nested components/tabs inside the course-player route, not standalone routes |
| `pages/student/StudentDashboard.jsx` | `app/(student)/dashboard/page.tsx` |
| `pages/student/WishlistPage.jsx` | `app/(student)/wishlist/page.tsx` |
| `pages/student/CertificatesPage.jsx` | `app/(student)/certificates/page.tsx` |
| `pages/instructor/InstructorDashboard.jsx` | `app/(instructor)/dashboard/page.tsx` |
| `pages/instructor/CourseBuilderPage.jsx` | `app/(instructor)/courses/[id]/builder/page.tsx` |
| `pages/instructor/AvailabilityPage.jsx` | `app/(instructor)/office-hours/page.tsx` |
| `pages/instructor/LiveSessionManagementPage.jsx` | `app/(instructor)/live-sessions/page.tsx` |
| `pages/instructor/TaManagementPage.jsx` | kept, unrouted (§2.6) until TA reactivates |
| `pages/ta/*` | kept, unrouted (§2.6) |
| `pages/admin/AdminDashboard.jsx` | `app/(admin)/dashboard/page.tsx` — **rework per §2.5**, monitoring-only |
| `pages/admin/CategoryManagementPage.jsx`, `CouponManagementPage.jsx`, `RefundReviewPage.jsx`, `ReportsPage.jsx` | `app/(admin)/categories/`, `/coupons/`, `/refunds/`, `/reports/` |
| — *(none — net-new)* | `app/(admin)/instructor-applications/page.tsx` (§2.3) |
| — *(none — net-new)* | `app/(admin)/course-agents/page.tsx` (§2.4) |
| — *(none — net-new)* | `app/(courseagent)/...` — mirrors `(instructor)`'s course-authoring routes |
| `pages/misc/NotificationsPage.jsx` | `app/(student)/notifications/` (+ instructor/admin equivalents) |
| `pages/misc/SecuritySettingsPage.jsx` | `app/settings/account/page.tsx` |
| `pages/misc/PrivacyPage.jsx` | `app/settings/privacy/page.tsx` |
| `pages/misc/VerifyCertificatePage.jsx` | `app/(public)/certificates/verify/[code]/page.tsx` |
| `pages/misc/NotFoundPage.jsx` | `app/not-found.tsx` (Next.js convention) |

### 8.2 Components
`src/components/*` (14 files: `Navbar`, `Footer`, `Layout`, `ProtectedRoute`,
`Button`, `FormField`, `Toast`, `CourseCard`, `ProgressRing`,
`AssignmentGradingPanel`/`AssignmentGradingBySubsection`, `EmptyState`,
`Spinner`, `StarRatingInput`) port largely as-is into
`frontend/web/components/`, converted to Server/Client Components per
`rules.md` §4 ("default to Server Components, `"use client"` only where
interactivity genuinely requires it"). `ProtectedRoute.jsx` specifically
gets **replaced**, not ported — Next.js App Router does this via middleware
+ role-gated layouts (`architecture.md` §5), a client-side wrapper component
is the wrong pattern here.

### 8.3 API layer
`src/api/*.js` (9 files: `client.js`, `auth.js`, `courses.js`,
`enrollment.js`, `admin.js`, `forum.js`, `liveSessions.js`, `quizzes.js`,
`wishlist.js`) → this is exactly what `packages/api-client` is for. Port the
axios-based logic, typed once `packages/types` exists (§8.4). Auth-token
handling in `AuthContext.jsx` needs to move from a pure client-side context
to work with Next.js's server/client split — `lib/auth.ts` +
`hooks/useRequireAuth.ts`, matching the pattern already validated in
`docs/memory.md`'s own build history.

### 8.4 TypeScript — incremental, not big-bang
`rules.md` calls for TypeScript + `packages/types` + Zod. Converting all 37
pages + 14 components to `.tsx` before anything ships would work directly
against "as early as possible." Recommendation:
- New code (the net-new instructor-apply flow, course-agent routes,
  gamification, chatbot) is written in TypeScript from day one.
- Ported v0 pages move over as `.jsx` initially, functionally working: as
  code moves to Next.js, gradually retyping is fine, but don't block a
  ported page's migration on it being fully typed
- Once `springdoc-openapi` is wired on the backend, generate `packages/types`
  from the OpenAPI spec rather than hand-typing 23+ response shapes — this
  is both less work and drift-proof

### 8.5 Styling
v0 already uses Tailwind v4 — good, matches `rules.md` §3. `design.md`'s
token system (Terracotta Orange, sharp radius, Inter/Space Grotesk) isn't
in v0 at all — v0's Tailwind config presumably uses defaults or a different
palette. Applying `design.md` §2's CSS-variable token file is a clean,
mechanical step (swap the token values, then hunt down any raw hex codes in
components — `rules.md` explicitly forbids `bg-[#hexcode]`, everything must
reference `bg-primary` etc.).

### 8.6 Mobile
100% net-new — v0 has no mobile app at all. Per `architecture.md`'s own
stated principle (both frontends "just call our own REST API"), mobile
should start **after** the backend domain restructuring (§5) and API
contracts stabilize, not in parallel with it — building against a moving
backend target wastes work twice. Sequence mobile after Phase M4 below, not
alongside it, even though the target docs otherwise want strict parity —
this is a temporary, explicitly-logged migration-order exception, corrected
by the time each phase is actually marked done in `memory.md`.

---

## 9. Feature Parity Audit

### 9.1 v0 features with no coverage in the current docs — ADD to `prd.md`/`phases.md`, do not drop

| v0 feature | Where it lives in v0 | Action |
|---|---|---|
| **Login history** (`LoginHistory` entity + repo + `LoginHistoryResponse`) | `entity/LoginHistory.java`, wired into `SecuritySettingsPage.jsx` | Add as an explicit line to `prd.md` §3.18 (Account Security Hardening) |
| **Account anonymization / right-to-erasure** (`DataPrivacyService`, `DeletionRequestDecision`, `User.anonymized`) | `service/DataPrivacyService.java`, `controller/PrivacyController.java`, `pages/misc/PrivacyPage.jsx` | `prd.md` §3.25 only mentions "basic consent recording" (V1) and vague "advanced privacy-preference management" (V2) — this concrete anonymization flow needs its own explicit line |
| **Per-instructor platform-wide coupon eligibility** (`User.canCreatePlatformCoupons`, admin-toggled) | `entity/User.java`, `AdminController.setCouponEligibility()` | Add to `prd.md` §3.6 (Commerce) — a real, deliberate permission model beyond "instructor sets coupons for their own courses" |
| **Course prerequisite chaining** (`Course.prerequisiteCourse`) | `entity/Course.java` | Add to `prd.md` §3.1 |
| **Cohort-based courses with seat limits** (`Course.isCohortBased`, `Course.seatLimit`) | `entity/Course.java` | Add to `prd.md` §3.1 — this is real scope (capacity-limited enrollment), not a minor field |
| **Audit log + platform-wide `AuditLog`** | already listed in `prd.md` §3.24 as V2, but v0 has it **built and working now** | Reclassify from "V2, not built" to "already built, verify and carry forward" in `phases.md` |
| **Excel report export (Apache POI)** | `ReportExportService.java`, `ReportController.java` | Same as above — listed V2 in `prd.md` §3.23, but v0 already has it working |
| **Instructor Leave + Live Sessions/Office Hours + Waitlist** | fully built, wired into Instructor UI | Same — `prd.md` lists this V2-A, v0 already has it. Per §2.6, this migration keeps it *active*, not deferred |
| **GDPR consent recording** | `ConsentRecord`, `ConsentService` | Already covered by `prd.md` §3.25 V1 — no doc change needed, just confirming it's real and ported, not rebuilt |

### 9.2 Target-doc V1 features with NO v0 equivalent — genuine new build work

| Feature | `prd.md` ref | Notes |
|---|---|---|
| Email OTP verification at student registration | §3.26 | v0's `RegisterPage.jsx` goes straight through, no OTP step, no `emailVerified` field on `User` |
| Instructor invite-and-activate flow | §3.26 | Redesigned per §2.3 above — supersedes the original doc text |
| `COURSE_AGENT` role + platform courses | — (new, §2.4) | |
| `SUPER_ADMIN` role | §2 | v0's `Role` enum only has 4 values |
| Course draft→submitted→published tri-state + admin review gate | §3.1 | v0 only has `published`/`active` booleans, no review workflow |
| Course versioning (update without breaking active learners' progress) | §3.1 | Not implemented in v0 |
| Drip content / scheduled module release | §3.1 | Not implemented in v0 |
| Exam integrity — timed attempts, randomization, violation logging (full-screen exit, tab-switch, copy/paste block) | §3.4 | v0's `Quiz`/`QuizAttempt` have no time limit, no randomization flag, no violation tracking at all |
| Certificate verification via public QR/unique-code page | §3.5 | v0 has `certificateCode` on the entity but check whether `VerifyCertificatePage.jsx` actually calls a public, no-auth endpoint — verify during migration, don't assume |
| Gamification — streaks, XP, badges, leaderboard | §3.10 | 100% absent from v0 |
| Learning paths / course bundles | §3.11 | 100% absent — only `Wishlist` exists, no `Bundle`/`LearningPath` entity |
| Instructor public profile page | §3.11 | Not in v0's page list |
| 2-Tier AI Assistant Chatbot | §3.15 | 100% absent |
| Mobile app (any of it) | throughout | 100% absent, see §8.6 |

### 9.3 Open items needing your confirmation before coding starts — see §12

---

## 10. Step-by-Step Migration Phases

Unlike `phases.md`'s Phase 0–10 (which assumes building from nothing), these
migration phases are ordered by **structural risk first, feature-gap-filling
last** — get the skeleton right once, then port into it, then fill gaps.
Each phase ends with the same Definition-of-Done bar as `rules.md` §13a: real
command output, logged, before checking anything off.

### Phase M0 — Docs & Decisions (no code)
- Resolve every open question in §12 below
- Fold §2 (confirmed flows) into `prd.md`/`architecture.md` as tracked edits
- Fold §9.1's table into `prd.md`/`phases.md` so v0-only features are
  committed, documented scope
- **Exit criteria:** docs updated, this document's open-question list is empty

### Phase M1 — Monorepo Skeleton
- Create the structure in §3 (empty `frontend/web`, `frontend/mobile`,
  `packages/*`, `backend/`)
- Move `pom.xml` + `src/main` into `backend/` unchanged (still compiles,
  still the old flat package layout — this phase is pure relocation)
- Move `frontend/` (v0's Vite app) into `frontend/web-legacy/` temporarily
  (kept running standalone while the real Next.js port happens in parallel,
  so you're never without a working frontend to test the backend against)
- Turborepo + root `package.json` + `docker-compose.yml` wired per
  `architecture.md` §3
- **Exit criteria:** `mvn clean install` succeeds from `backend/`,
  `npm run dev` still works from `frontend/web-legacy/`

### Phase M2 — Backend Domain Restructuring (§5's table)
- Move classes package-by-package per §5, fixing imports as you go —
  auth/user first (everything else depends on them), then course, then the
  rest in any order
- Postgres + Flyway migration per §6
- **This phase does not add new features** — it's a pure structural move,
  the app should do exactly what v0 did, just organized differently and on
  Postgres instead of MySQL
- **Exit criteria:** `mvn clean test` (once M3 tests exist) or at minimum
  `mvn clean install` + a manual smoke-test pass through login/course-browse/
  enrollment against the real Postgres instance

### Phase M3 — Test Infrastructure (§7)
- Priority order per §7.4: auth → payment webhook → course ownership → rest
- Can run **in parallel with M2** domain-by-domain (write the test for a
  domain right after it's moved, not in a separate pass afterward)
- **Exit criteria:** real `mvn clean test` output logged in `memory.md`,
  non-zero test count, per `rules.md` §13a

### Phase M4 — Frontend Next.js Port (§8)
- Scaffold `frontend/web` proper, port routes per §8.1 table
- Retire `frontend/web-legacy/` once parity is confirmed page-by-page
- **Exit criteria:** `npm run build` clean, manual click-through of every
  ported route against the now-Postgres backend

### Phase M5 — New Instructor/Course-Agent/Admin Flow (§2)
- `InstructorApplication` entity + OTP-at-apply + application-ID status
  check + reapplication-cooldown logic (§2.3) — this is the highest-risk new
  logic in the whole migration, build it test-first (§7.4 priority #1)
- `COURSE_AGENT` role + `Course.courseType` + Admin's monitoring-only
  interface rework (§2.4/§2.5)
- **Exit criteria:** full apply→OTP→admin-approve→activate→login loop
  demonstrated with real test output, not just "written"

### Phase M6 — Fill V1 Gaps (§9.2, in priority order)
1. Student email-OTP verification (small, self-contained, do first)
2. Course draft/submitted/published + versioning + drip content
3. Exam integrity (timed attempts, randomization, violation logging)
4. Certificate public verification (confirm/harden the existing endpoint)
5. `SUPER_ADMIN` role (mostly a schema/RBAC addition, low risk)
6. Gamification engine
7. Learning paths/bundles + instructor public profile
8. AI chatbot
- **Exit criteria per item:** same real-output bar, tracked individually in
  `memory.md`'s checklist (one line per gap, not one line for the whole phase)

### Phase M7 — Mobile (Expo SDK 57)
- Starts only after M4 (frontend) and ideally M5/M6 have stabilized the API
  contracts, per §8.6's reasoning
- Route structure mirrors `frontend/web`'s route groups, per
  `architecture.md` §6

### Phase M8 — Hardening & Deployment
- Same scope as the target `phases.md` Phase 10: production Docker
  hardening, Render/Vercel/Supabase stand-up, security/load-testing pass,
  rate-limiting audit
- This is also when `docs/memory.md` picks back up as the live-state
  tracker and this migration document is retired to `docs/legacy/`

---

## 11. `memory.md` Checklist Template (paste in at Phase M0)

Once M0 is done, replace `memory.md`'s Completion Checklist with a
migration-shaped one instead of the from-scratch Phase 0–10 shape — track
`M0`–`M8` above the same way, unchecked until demonstrated, one line per
concrete deliverable (not one line per phase).

---

## 12. Open Questions — Resolve Before / During Phase M0

- **Q-A (blocking M5):** exact cooldown length after a rejected instructor
  application — 15 days or 30 days? You said "like 1 month or 15 days,"
  need the actual number.
- **Q-B (blocking M5):** Course Agent onboarding — confirmed default is
  Admin creates the account directly with an activation link (reusing the
  instructor-activation mechanism). Confirm or correct.
- **Q-C (blocking M2/M5):** for `PLATFORM` courses, does `Course.instructor`
  stay null, or point at the Course Agent who authored it? (Affects a few
  queries/permission checks — worth deciding once, not mid-build.)
- **Q-D (blocking M2 scope):** confirmed assumption is that Instructor
  Leave + Live Sessions/Office Hours/Waitlist stay **active** during
  migration (only literal TA invite/grading gets deferred) — confirm or
  correct.
- **Q-E (non-blocking, affects §9.1 wording only):** should the
  reapplication-cooldown and application-ID-tracking design also apply
  conceptually to anything else in the platform (e.g. is there any other
  "apply and get reviewed" flow planned), or is this pattern instructor-
  application-specific only? Just checking there's no hidden reuse
  intended before this gets built as a one-off.

---

## 13. Change Log
- **v1.0 (2026-09-22)** — Initial migration doc: full structural inventory
  of `elearny_v0` (295 files), the confirmed instructor/course-agent/admin
  flow redesign, backend domain-package mapping, database/PDF/storage swap
  plan, test infrastructure plan (leveraging already-declared-but-unused
  test dependencies), frontend route-mapping table, full feature-parity
  audit in both directions, and 9-phase (M0–M8) step-by-step plan.
