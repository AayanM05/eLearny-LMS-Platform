# eLearny — v0 → Target Architecture Migration Guide (v1.1)

> **Status: v1.1 — supersedes v1.0.** Structure simplified, admin/revenue/leave
> flows corrected, phases made strictly sequential (no parallel work streams),
> per the 2026-09-22 planning discussion. Deliverable order going forward:
> **(1) this document → (2) mobile UI-generation prompts doc → (3) backend
> build for V1-gap features not in v0.**
>
> **Ground rule, unchanged:** nothing in v0 gets deleted just because the
> current docs don't mention it. §9.1 is the running list of v0-only features
> that get folded back into `prd.md`/`phases.md` as committed scope. §9.2 is
> the reverse list — target-doc V1 features v0 never had, genuine new build
> work, sequenced for **after** this migration and the mobile UI-prompt doc.
>
> Once every phase below is done, `docs/memory.md` resumes as the live-state
> tracker and this file retires to `docs/legacy/`.

---

## 1. What This Migration Is

v0 already has, working: 30+ entities, 24 controllers, 32 services, JWT
auth, **TOTP 2FA**, **account lockout**, Razorpay payments + signed webhook
handling, coupons, refunds, reviews, wishlist, a per-course forum, Instructor
Leave + Live Session slots/bookings/waitlist, a Teaching Assistant role +
grading UI, Excel export, an event-driven notification dispatcher
(email+SMS+in-app), audit logging, and GDPR consent + anonymization. That's
more than the fresh V1 rebuild in `docs/memory.md` had reached. **This is
why we migrate, not rebuild.**

What v0 doesn't have, structurally: domain-package backend organization, a
monorepo, a mobile app, Next.js, PostgreSQL/Flyway, PDFBox, R2/S3 storage,
or **any backend tests at all**.

What v0 doesn't have, functionally: email OTP, the instructor-application
flow, a Course Agent role, admin course-moderation/takedown, dual-role
(Instructor + Course Agent) revenue payout and leave/calendar, `SUPER_ADMIN`,
gamification, the AI chatbot, course bundles, or exam-integrity logging.

---

## 2. Confirmed Product-Flow Amendments (canonical — supersedes `prd.md` where they conflict)

### 2.1 Roles (6 total)
`STUDENT`, `INSTRUCTOR`, `TEACHING_ASSISTANT` *(ported, not wired — §2.6)*,
`COURSE_AGENT` *(new)*, `ADMIN`, `SUPER_ADMIN`.

### 2.2 Student — unchanged from `prd.md`
Register → email OTP verify → login → browse/enroll → pay → learn → quiz/
assignment → certificate.

### 2.3 Instructor Onboarding
```
[Public /instructor/apply]
  ├─ New application:
  │   1. Form: name, bio, professional details
  │   2. Uploads (real files, object storage): ID proof, certifications
  │      (multiple), sample teaching video
  │   3. Portfolio/LinkedIn — URL field
  │   4. Email — rejected at submit if it belongs to ANY existing User,
  │      any role. A student can never become an instructor on their
  │      existing account — fresh email required.
  │   5. Submit → 6-digit OTP to that email → verify →
  │      InstructorApplication created, PENDING, an 8–10 char
  │      alphanumeric applicationId generated + shown. Email is now
  │      verified — no second OTP later.
  │
  └─ "Already applied? Check status":
      Enter applicationId + email → OTP to that email → verify → shows
      PENDING / APPROVED / REJECTED (+ reason if rejected)

[Admin → Instructor Applications]
  - List filterable PENDING / APPROVED / REJECTED
  - Reviews docs + video + info
  - Approve → single-use, time-limited activation link emailed (no
    second OTP — email already verified). Link → username + password
    setup ONLY → User created, role INSTRUCTOR, tied to that email.
    No login possible before this point.
  - Reject → reason required, REJECTED, cooldownEndsAt = rejectedAt +
    N days (**N = still unconfirmed, §12 Q-A — blocks nothing except
    the exact constant, build with a config value, not a hardcoded
    number, so this is a one-line change whenever you decide**)

[Reapplication rules]
  - PENDING exists for that email → blocked: "An application is
    already under review — track its status above."
  - REJECTED, cooldown not ended → blocked: "Your profile is on a
    cooldown period until <date>."
  - REJECTED, cooldown ended → allowed, same email, no "already
    applied" error. Old application becomes unqueryable by
    applicationId/email (public status-check only) — Admin still sees
    full history. Nothing deleted.

[Instructor, post-activation]
  Course creation, curriculum builder, quiz/assignment creation,
  enrolled-student monitoring, grading + feedback, payouts (§2.4a),
  leave/calendar (§2.4b).
```

### 2.4 Course Agent (new role) + Platform Courses
- Provisioned by Admin directly — no public application (internal/employee
  role). Default: Admin creates the account with an activation link (reuses
  the instructor-activation mechanism, Admin-triggered instead of
  approval-triggered) — **§12 Q-B, default assumed correct unless you say
  otherwise.**
- Same authoring interface as Instructors — Course Creator, Curriculum
  Builder, Quiz/Assignment builders — reused, not rebuilt.
- `Course.courseType`: `INSTRUCTOR` | `PLATFORM`. Platform courses (Course
  Agent output) are eLearny's official/premium catalog, badged in
  Discovery/Browse.
- `Course.instructor` FK — **§12 Q-C still open**: null for `PLATFORM`
  courses, or points at the Course Agent? Pick once, not mid-build.

### 2.4a Revenue — applies to BOTH Instructor and Course Agent (correction from v1.0)
Both roles are compensated when a student enrolls in their course; platform
takes a cut, the remainder is payable to whichever role owns the course.
This is one payout mechanism scoped to "course owner" (a `User` with role
`INSTRUCTOR` or `COURSE_AGENT`), **not** an instructor-only feature. v0's
`InstructorPayoutSummary` generalizes accordingly — same entity/table, the
owning `User`'s role determines nothing about the payout logic itself.
Needs, at minimum: per-enrollment revenue-split calculation, a payout ledger
(what's owed, what's been paid out, when), and a course-owner-facing
earnings view.

### 2.4b Calendar + Leave — applies to BOTH Instructor and Course Agent (correction from v1.0)
Same generalization: v0's `InstructorLeave` becomes leave/availability
tracking for any course-owning role. One mechanism, two eligible roles.

### 2.5 Admin — corrected: monitoring + moderation takedown authority
Not monitoring-only. Admin can pull a published course off the live,
student-visible catalog if it's substandard:
- Reuses `Course.active` (already exists in v0, currently instructor-only
  toggle) — Admin setting it `false` removes it from catalog queries with
  no schema change needed for that part
- Adds `Course.suspensionReason` (string, nullable) + `Course.suspendedAt`
  — **new fields**
- Nothing is hard-deleted — enrollments, payments, reviews, and the course
  record itself all survive; it's unlisted, not destroyed
- The owning Instructor/Course Agent gets a notification (reusing the
  existing `notification/` dispatcher) showing the reason
- **§12 Q-F, new, needs your call**: can the owner appeal/resubmit for
  re-review, or is reactivation admin-initiated only? Affects whether this
  needs a resubmission endpoint or just a manual admin toggle-back.

Beyond takedown: reviews instructor applications (§2.3), full platform
visibility (students, instructors, course agents, courses, activity) — this
part stays exactly as scoped in v1.0/§2.5 originally, just not *exclusively*
monitoring.

### 2.6 Deferred to a future phase — not part of this migration at all
**Both** confirmed deferred, same treatment (ported as-is, kept, not wired
into any active route until you say go):
- **Teaching Assistant** — invite/grading flow
- **Live Sessions / Office Hours** (correction from v1.0, which had assumed
  these stayed active — they don't)

Waitlist entries tied to Live Session slots are deferred along with it (no
independent use without Live Sessions active).

---

## 3. Monorepo Structure — simplified (approved shape)

```
elearny/
├── backend/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       ├── main/java/com/elearny/<domain>/...   # see §5
│       └── test/java/com/elearny/<domain>/...   # see §7
├── frontend/
│   ├── web/                      # Next.js 16 — own package.json, runs standalone
│   └── mobile/                    # Expo SDK 57 — own package.json, runs standalone
├── packages/
│   ├── types/                     # shared TS types (request/response shapes)
│   └── api-client/                # shared typed fetch functions
├── docs/                          # planning docs + this file
├── package.json                   # root — ONLY purpose: npm workspaces, so
│                                   # packages/* are importable as @elearny/*
│                                   # from both frontend/web and frontend/mobile.
│                                   # No Turborepo, no root build orchestration.
├── docker-compose.yml
└── README.md
```

No `packages/ui` (web and mobile render fundamentally different component
code — Tailwind/DOM vs. NativeWind/RN — a shared UI package would be mostly
empty), no `packages/config` (low payoff for the added indirection). `types`
and `api-client` are the two things that genuinely drift if duplicated by
hand across two frontends, so those are the only ones that exist.

v0's root-level docs (`README.md`, `TESTING_GUIDE.md`,
`eLearny_UI_Requirement_Document.md`, `eLearny_AI_UI_Generation_Prompts.md`)
move to `docs/legacy/` — kept, not deleted, not treated as current spec.

---

## 4. Dependency & Version Pins (unchanged from v1.0, still current)

| Layer | v0 currently on | Migration target |
|---|---|---|
| Java | 21 LTS | **21 LTS (keep)** |
| Spring Boot | 3.5.4 | **3.5.8** (latest 3.5.x patch — stay off the 4.x major, don't stack that risk on a structural migration) |
| Database | MySQL 8, `ddl-auto: update` | **PostgreSQL 17 + Flyway** |
| PDF generation | OpenPDF + Flying Saucer | **Apache PDFBox** |
| Media storage | Local disk | **AWS S3 SDK v2 → Cloudflare R2** |
| Frontend framework | Vite + React 19.2.8 + React Router 7 | **Next.js 16.3.x** |
| Frontend language | Plain JS (`.jsx`) | **TypeScript, incrementally** (§8.4) |
| Mobile | none | **Expo SDK 57** (56 has a known Hermes memory regression) |
| Node.js | unspecified | **Node 24 LTS** |
| Backend testing | none | **JUnit 5 + Mockito + Testcontainers** (already declared, unused, in v0's `pom.xml`) |

---

## 5. Backend Migration Map — Technical Layers → Domain Packages

Mechanical move + import fix — logic doesn't change in this pass, only
where each class lives.

| Target domain package | v0 source files that move in | Notes |
|---|---|---|
| `auth/` | `AuthController`, `AuthService`, `RefreshTokenService`, `RefreshTokenRepository`, `RefreshToken`, `LoginRequest`, `RegisterRequest`, `ForgotPasswordRequest`, `ResetPasswordRequest`, `RefreshTokenRequest`, `TwoFactorChallengeRequest`, `TwoFactorVerifyRequest`, `AuthResponse`, `TotpSetupResponse`, `TotpService`, `LoginHistory` (+repo+response), all of `security/*` | |
| `user/` | `User`, `Role`, `UserSummary`, `UserRepository`, the "deactivate user" slice of `AdminService` | |
| `instructor/` **(new)** | No v0 equivalent — built fresh per §2.3 | `InstructorApplication` entity, application/status-check services, activation flow |
| `courseagent/` **(new)** | No v0 equivalent | Admin-provisioning service, activation reuse from `instructor/` |
| `course/` | `Course` (+ new `suspensionReason`/`suspendedAt` fields, §2.5), `Section`, `Subsection`→`Lesson`, `CourseLevel`, `ContentType`, `CourseContentController/Service`, `CourseController/Service`, `CourseCreateRequest`, `SectionCreateRequest`, `SubsectionCreateRequest`→`LessonCreateRequest`, `CourseResponse`, `SectionResponse`, `SubsectionResponse`→`LessonResponse`, + new `courseType` field (§2.4) | |
| `media/` | No dedicated service — build fresh against R2/S3 | |
| `enrollment/` | `Enrollment`, `Progress`, `EnrollmentController/Service`, `ProgressController/Service`, `ProgressResponse` | |
| `discovery/` | `Category`, `CategoryController/Repository`, `SearchController/Service` | |
| `review/` | `Review`, `ReviewController/Service`, `ReviewCreateRequest`, `ReviewResponse` | |
| `exam/` | `Quiz`, `QuizQuestion`, `QuizAttempt`, `QuizController/Service`, `QuizCreateRequest`, `QuizAttemptRequest`, `QuizResponse`, `QuizAttemptResponse` | no time-limit/randomization/violation-logging yet — §9.2 |
| `assignment/` | `Assignment`, `AssignmentSubmission`, `AssignmentController/Service`, `AssignmentCreateRequest`, `AssignmentSubmitRequest`, `AssignmentGradeRequest`, `AssignmentSubmissionResponse` | |
| `certificate/` | `Certificate`, `CertificateController/Service`, `CertificateResponse`, `PdfGenerationService` (rework for PDFBox), `templates/pdf/certificate.html` (rework — PDFBox doesn't consume HTML templates the way Flying Saucer does) | |
| `payment/` | `Payment`, `PaymentStatus`, `PaymentController/Service`, `WebhookController`, `PurchaseInitiateRequest/Response`, `RazorpayWebhookPayload`, `Coupon`, `CouponController/Service`, `CouponCreateRequest`, `CouponResponse`, `DiscountType`, `RefundRequest`, `RefundStatus`, `RefundController/Service`, `RefundRequestCreate`, `RefundDecisionRequest`, `RefundEligibilityResponse`, `RefundRequestResponse` | |
| `revenue/` | `InstructorPayoutSummary` → **generalized to course-owner scope, §2.4a**; revenue slices of `AdminService`/`ReportExportService` | needs new payout-ledger logic, not present in v0 as more than a summary read |
| `leave/` | `InstructorLeave`, `LeaveStatus` → **generalized to course-owner scope, §2.4b** | |
| `admin/` | `AdminController/AdminService` (minus what moved to `instructor/`), `ReportController`, `ReportExportService`, `AuditLog`, `AuditService`, `DashboardStatsResponse`, `EnrollmentTrendPoint`, `UserSummary`, + **new course-takedown endpoint, §2.5** | |
| `notification/` | `Notification`, `NotificationType`, `NotificationController/Repository`, all of `service/notification/*`, `CommunicationLog`, `CommunicationChannel`, `CommunicationStatus`, `TwilioConfig`, `MailConfig`, all of `service/event/*` + listeners | |
| `community/` | `ForumThread`, `ForumReply`, `ForumController/Service`, `ForumThreadCreateRequest`, `ForumReplyCreateRequest`, `ForumThreadResponse`, `ForumReplyResponse`, `ForumReplyEvent` | |
| `gamification/` **(new)** | none | deferred to §9.2/post-migration |
| `bundle/` | `Wishlist`, `WishlistController/Service/Repository` port directly; Bundles/Learning Paths themselves are new | |
| `chatbot/` **(new)** | none | deferred to §9.2/post-migration |
| `ta/` *(ported, unwired — §2.6)* | `TaAssignment`, `TaStatus`, `TaController/Service`, `TaInviteRequest` | |
| `livesession/` *(ported, unwired — §2.6, correction from v1.0)* | `LiveSessionSlot`, `LiveSessionBooking`, `BookingStatus`, `WaitlistEntry`, `WaitlistStatus`, `LiveSessionController/Service`, `InstructorAvailabilityController/Service`, `LiveSessionSlotCreateRequest/Response`, `InstructorUnavailabilityRequest`, `WaitlistOfferedEvent` | |
| `privacy/` | `ConsentRecord`, `ConsentService`, `PrivacyController`, `DataPrivacyService`, `DeletionRequestDecision` | needs doc coverage, §9.1 |
| `localization/`, `practicehub/`, `growth/` | not in v0, V2 per docs | out of scope entirely for this migration |

Shared infra (`config/`, `exception/`, `util/`) → `common/`, mostly as-is:
`SecurityConfig`, `MailConfig`, `TwilioConfig`, `AsyncConfig`, `RetryConfig`,
`OpenApiConfig`, `JpaAuditingConfig`, `DataSeeder`, `StartupBanner`,
`GlobalExceptionHandler` + 4 custom exceptions, `CodeGenerator`,
`HashUtils`, `SecurityUtils`.

**MapStruct**: not used in v0. Adopt for new/touched domains (`instructor/`,
`courseagent/`, `revenue/`) only in this pass — don't retrofit onto all 23
existing response DTOs before anything ships.

---

## 6. Database Migration Strategy — MySQL/`ddl-auto` → Postgres/Flyway

1. Stand up local PostgreSQL 17.
2. Point v0's app at it with `ddl-auto: update` **temporarily**, let
   Hibernate generate the real schema from the actual entities, then
   `pg_dump --schema-only` that into a real `V1__init.sql` — guarantees the
   baseline matches what the entities actually declare, not a hand-guessed
   approximation.
3. Split into logical `V1__`, `V2__`... per domain package as you restructure.
4. Switch `ddl-auto` to `validate` once migrations exist.
5. Check for any `nativeQuery = true` MySQL-specific SQL before assuming
   none exists; JPQL/derived-query repositories need no syntax changes.

---

## 7. Test Infrastructure

v0's `pom.xml` already declares `spring-boot-starter-test`,
`spring-security-test`, `testcontainers` (`junit-jupiter`+`mysql`), and
`greenmail-junit5` — **unused**, zero files under `src/test/`. Swap the
Testcontainers `mysql` module for `postgresql` when you touch it; drop H2
entirely.

Structure mirrors `main/` domain-by-domain. Priority order for what gets
tests first (not all 45 entities on day one):
1. Auth + the new instructor-application flow (§2.3) — highest-risk, most
   novel logic
2. Payment webhook signature verification — most security-critical path
   in the app
3. Course ownership/publish validation + the new admin-takedown flow (§2.5)
4. Everything else, as each domain is touched during migration

**Definition of Done, per `rules.md` §13a**: a checkbox only gets checked
once a real `mvn clean test` run's real output is logged — "tests written"
is not "done."

---

## 8. Frontend Migration — Vite/React Router → Next.js App Router

(Route-mapping table, component/API-layer notes, TypeScript strategy, and
styling notes are unchanged from v1.0 §8 — still accurate, not reproduced
again here to keep this revision focused on what actually changed. Two
additions from this round: `(instructor)` and the new `(courseagent)` route
groups both get an `/applications/status` and `/payouts` and `/leave` route
respectively, per §2.3/§2.4a/§2.4b; `(admin)` gets a course-takedown action
on the existing course-detail admin view, per §2.5.)

---

## 9. Feature Parity Audit

### 9.1 v0 features with no doc coverage — ADD to `prd.md`/`phases.md`

| v0 feature | Where in v0 | Action |
|---|---|---|
| Login history | `LoginHistory` entity+repo+response | Add to `prd.md` §3.18 |
| Account anonymization / right-to-erasure | `DataPrivacyService`, `DeletionRequestDecision`, `User.anonymized` | Add concrete line to `prd.md` §3.25 |
| Per-instructor platform-wide coupon eligibility | `User.canCreatePlatformCoupons` | Add to `prd.md` §3.6 |
| Course prerequisite chaining | `Course.prerequisiteCourse` | Add to `prd.md` §3.1 |
| Cohort-based courses + seat limits | `Course.isCohortBased`, `Course.seatLimit` | Add to `prd.md` §3.1 |
| Audit log | built and working | Reclassify from "V2, not built" to "already built" in `phases.md` |
| Excel report export | `ReportExportService` (Apache POI) | Same reclassification |
| GDPR consent recording | `ConsentRecord`/`ConsentService` | Already covered, confirming ported not rebuilt |

### 9.2 Target-doc V1 features with no v0 equivalent — sequenced for AFTER this migration + the mobile UI-prompt doc

| Feature | `prd.md` ref |
|---|---|
| Email OTP verification at student registration | §3.26 |
| Instructor invite-and-activate flow | superseded by §2.3 above |
| `COURSE_AGENT` role + platform courses + admin takedown | superseded by §2.4/§2.5 above |
| Dual-role revenue payout + leave/calendar | superseded by §2.4a/§2.4b above |
| `SUPER_ADMIN` role | §2 |
| Course draft→submitted→published tri-state + admin review gate | §3.1 |
| Course versioning | §3.1 |
| Drip content | §3.1 |
| Exam integrity — timed attempts, randomization, violation logging | §3.4 |
| Certificate public verification — confirm/harden | §3.5 |
| Gamification — streaks, XP, badges, leaderboard | §3.10 |
| Learning paths / course bundles + instructor public profile | §3.11 |
| AI chatbot | §3.15 |
| Mobile app (all of it) | throughout |

---

## 10. Step-by-Step Migration Phases — strictly sequential, no overlapping work

Each phase starts only once the previous phase's exit criteria are actually
demonstrated — not "mostly done," not started early to save time. This is
deliberate: v0's own session history (`docs/chat.md`, `docs/memory.md`) shows
real bugs traced back to skipped verification steps — sequencing removes
that risk category entirely.

### Phase M0 — Docs & Decisions (no code)
1. Resolve remaining open questions in §12 (Q-A cooldown length, Q-B/Q-C/Q-F)
2. Fold §2 (confirmed flows) into `prd.md`/`architecture.md` as tracked edits
3. Fold §9.1's table into `prd.md`/`phases.md`
4. **Exit criteria:** docs updated, §12's open-question list is empty or
   every remaining item is explicitly marked "deferred, non-blocking"

### Phase M1 — Monorepo Skeleton
1. Create the folders in §3: empty `backend/`, `frontend/web/`,
   `frontend/mobile/`, `packages/types/`, `packages/api-client/`
2. Move `pom.xml` + `src/main` (and now `src/test` once M3 exists — for
   now, just `src/main`) into `backend/`, unchanged — still the old flat
   package layout, this step is pure relocation, nothing else changes
3. Move v0's `frontend/` (Vite app) into `frontend/web-legacy/` — kept
   running standalone so there's always a working frontend to test the
   backend against while the real Next.js port happens later, in its own
   phase, not this one
4. Root `package.json` with an npm `"workspaces"` field pointing at
   `packages/*` — nothing else in it
5. `docker-compose.yml` (Postgres 17 service, matching `deployment.md`)
6. **Exit criteria:** `mvn clean install` succeeds from `backend/`,
   `npm run dev` still works from `frontend/web-legacy/`. Nothing else is
   touched yet — no domain restructuring, no new features.

### Phase M2 — Backend Domain Restructuring (§5's table only — no new features in this phase)
1. Move `auth/` + `user/` first (everything else depends on them)
2. Move `course/` next
3. Move every remaining existing domain from §5's table, one at a time,
   fixing imports as you go
4. Postgres + Flyway migration per §6
5. Manual smoke-test pass: login, course-browse, enrollment — against the
   real Postgres instance, confirming v0's existing behavior is unchanged
6. **Exit criteria:** `mvn clean install` succeeds, manual smoke test
   passes, confirmed against real Postgres — **do not start M3 until this
   is true**, not "should be fine"

### Phase M3 — Test Infrastructure (§7)
1. Auth + account-lockout tests first
2. Payment webhook signature-verification tests
3. Course ownership/publish-validation tests
4. Remaining domains, one at a time, in the order they appear in §5's table
5. **Exit criteria:** real `mvn clean test` output logged in `memory.md`,
   non-zero test count, per `rules.md` §13a — **do not start M4 until a
   real test run has actually executed and passed**

### Phase M4 — Frontend Next.js Port (§8)
1. Scaffold `frontend/web` proper
2. Port routes in the order given in §8's table (public/auth first, then
   student, then instructor, then admin)
3. Retire `frontend/web-legacy/` only once every route is confirmed
   working against the now-restructured, now-tested backend
4. **Exit criteria:** `npm run build` clean, manual click-through of every
   ported route

### Phase M5 — New Instructor/Course-Agent/Admin Flow (§2.3–§2.5)
1. `InstructorApplication` entity + migration
2. Apply-with-OTP + application-ID status-check endpoints
3. Reapplication-cooldown logic (exact rules from §2.3)
4. Admin approve/reject + activation-link flow
5. `COURSE_AGENT` role + `Course.courseType` + Admin provisioning (§2.4)
6. Course-owner-scoped revenue/payout (§2.4a) and leave/calendar (§2.4b)
   generalization
7. Admin course-takedown flow (§2.5)
8. Tests for all of the above, written alongside each numbered step above,
   not deferred to the end of this phase
9. **Exit criteria:** full apply→OTP→admin-approve→activate→login loop
   demonstrated with real test output; takedown flow demonstrated end to end

### Phase M6 — Mobile UI-Generation Prompts Doc + Mobile Scaffold
1. **Next deliverable after this document** — the flow-based, duplication-
   free prompt doc you asked for, covering every screen mobile needs
   (ported v0 flows + the new instructor-application/course-agent/
   admin-takedown screens from M5)
2. Scaffold `frontend/mobile` (Expo SDK 57)
3. Generate screens using the prompt doc, wire against the now-stable API
   (stable because M2–M5 are already done — building mobile against a
   moving backend target would waste work twice)
4. **Exit criteria:** mobile app builds, core flows (register/login/browse/
   enroll/learn) click-through against the real backend

### Phase M7 — Fill Remaining V1 Gaps (§9.2, in priority order)
1. Student email-OTP verification
2. Course draft/submitted/published + versioning + drip content
3. Exam integrity (timed attempts, randomization, violation logging)
4. Certificate public verification hardening
5. `SUPER_ADMIN` role
6. Gamification engine
7. Learning paths/bundles + instructor public profile
8. AI chatbot
- Each numbered item gets its own line in `memory.md`'s checklist, its own
  exit criteria (real test output), and is built **one at a time**, not
  in parallel with the others

### Phase M8 — Hardening & Deployment
1. Production Docker hardening
2. Render/Vercel/Supabase stand-up
3. Security/load-testing pass, rate-limiting audit
4. `docs/memory.md` resumes as the live-state tracker; this document moves
   to `docs/legacy/`

---

## 11. `memory.md` Checklist Template

At Phase M0's completion, replace `memory.md`'s Completion Checklist with
an M0–M8-shaped one (this document's phase numbers), one line per concrete
deliverable within each phase — matching the numbered steps in §10 above,
not one line per whole phase.

---

## 12. Open Questions

Per this document's own M0 exit criteria (§10), every item below is now
either resolved or explicitly deferred with a low-risk default — nothing
here blocks M1 from starting. Any default marked "(default)" is a one-line
config/logic change if you want it changed later — flagged, not buried.

- **Q-A — RESOLVED (default): 15-day cooldown.** Built as a config value
  (`elearny.instructor-application.cooldown-days`), not hardcoded — change
  the number any time without touching logic. You said "like 1 month or 15
  days"; 15 was picked as the lower-risk default (shorter lockout is easier
  to loosen later than to tighten after applicants have already relied on a
  longer window).
- **Q-B — RESOLVED (confirmed by no objection):** Course Agent onboarding —
  Admin creates the account directly with an activation link, reusing the
  same single-use-link mechanism as instructor approval.
- **Q-C — RESOLVED (default): `Course.instructor` stays a single FK,
  reused for Course Agents.** For a `PLATFORM` course, `Course.instructor`
  points at the Course Agent's own `User` row (a Course Agent is a `User`
  with role `COURSE_AGENT`, same table) rather than adding a second,
  parallel `courseAgent` FK. This is the lower-risk option — every existing
  ownership check, query, and UI binding that already reads
  `Course.instructor` keeps working unchanged for platform courses; only
  `courseType` needs checking wherever the UI decides *how* to label the
  owner (e.g. showing "eLearny Official" instead of a person's name). If
  this ever needs to change (e.g. a platform course with no single named
  owner), it's a additive migration later, not a blocker now.
- **Q-D — RESOLVED:** Live Sessions/Office Hours deferred, same as TA
  (§2.6).
- **Q-E — RESOLVED (confirmed by no objection): instructor-application-
  specific only.** No hidden reuse of the apply→review→approve pattern is
  expected elsewhere in the platform for this migration.
- **Q-F — RESOLVED (default): owner can request re-review; reactivation
  stays Admin-initiated.** Once suspended, the course owner (Instructor or
  Course Agent) gets a "Request re-review" action that notifies Admin with
  any note they add — it does **not** auto-reactivate the course. Admin
  reviews and manually reactivates (or doesn't) after confirming the issue
  is fixed. This mirrors the reapplication-cooldown pattern already
  established in §2.3 (Admin stays the gatekeeper on the way back in, same
  as the way in) rather than introducing a second, different pattern.

---

## 13. Change Log
- **v1.1 (2026-09-22)** — Simplified monorepo structure (dropped Turborepo/
  `packages/ui`/`packages/config`, kept `packages/types`+`packages/api-client`
  via plain npm workspaces); corrected Admin from monitoring-only to
  monitoring+moderation-takedown authority (reusing `Course.active` +
  new reason/timestamp fields, no hard delete); generalized revenue payout
  and leave/calendar from Instructor-only to both Instructor and Course
  Agent; deferred Live Sessions/Office Hours alongside TA (correcting
  v1.0's assumption that it stayed active); rewrote all phases as strictly
  sequential with numbered sub-steps and explicit "do not start the next
  phase until this exit criteria is demonstrated" language; reordered so
  the mobile UI-prompt doc (M6) precedes the V1-gap backend build (M7),
  matching the stated deliverable sequence.
- **v1.0 (2026-09-22)** — Initial migration doc (see `docs/legacy/` once
  this document is also retired).
