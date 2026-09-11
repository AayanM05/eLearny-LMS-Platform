# eLearny — Process Flows & User Journeys (processflows.md)

> Status: **v1.0 — living document.** Governs end-to-end user journeys, system workflows, state transitions, API endpoint sequences, and cross-page navigation links across all 5 user roles (`Student`, `Instructor`, `Teaching Assistant`, `Admin`, `Super Admin`).
> eLearny is high-level and large-scale by design — **not a demo or MVP**.
> All flows enforce **100% Web & Mobile Feature Parity**, High Content Density, Zero Deprecation Warning Policy, and AI Development Double-Check Guardrails.

---

## 1. Auth & Identity Lifecycle

```
[User Input] ──► [Debounced Checks] ──► [Submit & Verification] ──► [JWT Issue & 2FA] ──► [Dashboard]
```

### Steps & State Machine
1. **User Registration (`/auth/register`)**:
   - User inputs Full Name, Username, Email, Phone (optional), Password, Confirm Password, Role (`STUDENT` or `INSTRUCTOR`), and accepts Terms & Privacy.
   - **Debounced Username Availability Check**: On 300ms debounced keystroke, frontend calls `GET /api/v1/auth/check-username?username=x`. Returns `{ available: boolean, message: string, suggestions: string[] }`. UI updates spinner → green checkmark or red X + alternate username chips.
   - **Password Strength Requirement Checklist**: Live client-side evaluation updating badge chips in real time: Min 8 chars, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Character (`!@#$%^&*`).
   - Frontend validates password match and mandatory terms checkbox before enabling submit button.
   - `POST /api/v1/auth/register` → backend validates DTO (`jakarta.validation`), hashes password with BCrypt, records terms consent (`ConsentRecord`), creates `User` (role `STUDENT` or pending `INSTRUCTOR`), dispatches welcome email via `spring-boot-starter-mail`, and returns 201 Created.
2. **User Login & TOTP 2FA (`/auth/login`)**:
   - `POST /api/v1/auth/login` (email + password).
   - If repeated failed attempts occur (5 consecutive failures), account status updates to `LOCKED` (`AccountLockoutService`), returning 403 Forbidden with error code `ACCOUNT_LOCKED`. Frontend routes user to `/auth/account-locked` displaying a live 15-minute countdown.
   - If 2FA is enabled (`is_totp_enabled = true`), backend issues short-lived `pending2FA` JWT (5 min TTL). Frontend routes to `/auth/2fa-challenge` requiring 6-digit TOTP code.
   - `POST /api/v1/auth/2fa/verify` (TOTP code + `pending2FA` token) → validates RFC 6238 TOTP algorithm (`dev.samstevens.totp`). On success, issues Access JWT (15 min TTL) + Refresh JWT (7 day HTTP-only cookie or Expo `SecureStore`).
3. **Session Refresh & Expiry**:
   - `POST /api/v1/auth/refresh` → rotates access token using refresh token before expiry.
   - On 401 Unauthorized during active navigation, frontend API client triggers silent refresh. If refresh fails, preserves current route state, clears session, and displays Modal Re-Auth Prompt without wiping unsaved work.
4. **Password Reset (`/auth/forgot-password` & `/auth/reset-password`)**:
   - `POST /api/v1/auth/forgot-password` → backend generates single-use 15-min UUID reset token, sends email. Response is always generic 200 OK ("If email exists, reset instructions sent").
   - `POST /api/v1/auth/reset-password` (token + new password) → validates token, updates BCrypt password hash, invalidates all existing user refresh tokens.

---

## 2. Instructor Onboarding & Approval Flow

```
[Student Account] ──► [Submit Application] ──► [Admin Approval Queue] ──► [RBAC Elevation] ──► [Instructor Dashboard]
```

### Steps & State Machine
1. **Application Submission (`/instructor/apply`)**:
   - Student navigates to `/instructor/apply`. Fills in Bio, Teaching Experience, Expertise Categories, Portfolio/LinkedIn Link, and Video Sample URL.
   - `POST /api/v1/instructor/apply` → creates `InstructorApplication` entity with status `PENDING`. User role remains `STUDENT`.
   - Frontend displays Pending Application Banner on student dashboard ("Application under review by Admin").
2. **Admin Review Queue (`/admin/instructor-applications`)**:
   - Admin accesses `/admin/instructor-applications`. API `GET /api/v1/admin/instructor-applications?status=PENDING` returns paginated list.
   - Admin views applicant details, portfolio links, and sample video.
   - **Approval**: `POST /api/v1/admin/instructor-applications/{id}/approve` → updates `InstructorApplication` status to `APPROVED`, updates `User` role to `INSTRUCTOR`, dispatches approval email & push notification.
   - **Rejection**: `POST /api/v1/admin/instructor-applications/{id}/reject` (with rejection reason note) → updates status to `REJECTED`, dispatches feedback email.
3. **RBAC Elevation & Access Control**:
   - Spring Security checks `@PreAuthorize("hasRole('INSTRUCTOR') and @instructorService.isApproved(principal.id)")` on all instructor endpoints.
   - User re-logs or refreshes JWT claim; navigation menu updates to reveal Instructor Dashboard (`/instructor/dashboard`) and Course Creator (`/instructor/courses/create`).

---

## 3. Course Authoring & Content Release Flow

```
[Metadata Wizard] ──► [Curriculum Tree & Drip] ──► [R2 Media Upload] ──► [Admin Review] ──► [Published Versioning]
```

### Steps & State Machine
1. **Course Metadata Wizard (`/instructor/courses/create`)**:
   - Instructor inputs Title, Subtitle, Category/Subcategory, Difficulty Level, Language, Price, Promotional Video, and Cover Image.
   - `POST /api/v1/courses` → creates `Course` entity in `DRAFT` status.
2. **Curriculum Builder (`/instructor/courses/[id]/builder`)**:
   - Instructor adds Sections (`POST /api/v1/courses/{id}/sections`) and Lessons (`POST /api/v1/courses/{id}/sections/{sectionId}/lessons`).
   - Drag-and-drop section/lesson reordering updates `sort_order` via `PATCH /api/v1/courses/{id}/reorder`.
   - **Drip Release Scheduling**: Instructor sets `drip_delay_days` (e.g. Lesson 5 unlocks 7 days after student enrollment).
   - **R2 Pre-signed Media Upload**:
     1. Client requests upload URL: `POST /api/v1/media/upload-url` (filename, contentType, fileSize).
     2. Backend generates Cloudflare R2 pre-signed S3 upload URL (15 min expiry).
     3. Client uploads binary video directly to R2. On success, client saves media key to lesson via `PUT /api/v1/lessons/{id}`.
3. **Quiz & Assessment Builder (`/instructor/courses/[id]/quizzes`)**:
   - Instructor builds module quizzes and final exam: question text, options, correct answer key, pass threshold %, and time limit.
4. **Admin Moderation & Publishing (`/admin/course-moderation`)**:
   - Instructor clicks "Submit for Review" → course status moves `DRAFT` → `SUBMITTED`.
   - Admin reviews curriculum, video quality, and price in `/admin/course-moderation`.
   - Admin approves → `POST /api/v1/admin/courses/{id}/approve` → status updates to `PUBLISHED`.
5. **Course Versioning**:
   - Instructor updates a published course → backend creates an active working draft version without altering active enrolled students' completed lesson records until published.

---

## 4. Course Discovery, Wishlist & Course Bundles

```
[Search & Filters] ──► [Course/Bundle Detail] ──► [Wishlist Toggle] ──► [Recommendation Engine]
```

### Steps & State Machine
1. **Search & Multi-Criteria Filtering (`/courses`)**:
   - Public endpoint `GET /api/v1/courses?query=x&category=y&level=z&priceMin=a&priceMax=b&rating=c&sort=newest&page=0&size=12`.
   - Frontend renders search bar, taxonomy filter tabs, price range sliders, rating checkboxes, and paginated course card grid.
2. **Wishlist Management (`/wishlist`)**:
   - Student clicks bookmark icon on course card → `POST /api/v1/wishlist/{courseId}` (or `DELETE /api/v1/wishlist/{courseId}`). Updates `Wishlist` table.
   - Synchronized across Web header heart badge and Mobile Wishlist tab.
3. **Course Bundles & Specializations (`/bundles/[id]`)**:
   - Instructors/Admins create course bundles (`CourseBundle`).
   - Public bundle page shows grouped courses, calculated bundle discount %, total price savings, and "Enroll in Bundle" CTA.
4. **Rule-Based Recommendation Engine**:
   - `GET /api/v1/discovery/recommendations` evaluates student's enrolled categories, tags, and browse history to return personalized course recommendations.

---

## 5. Commerce, Coupons & Razorpay Webhook Checkout

```
[Initiate Order] ──► [Apply Coupon] ──► [Razorpay Checkout] ──► [Signed Webhook] ──► [Instant Enrollment]
```

### Steps & State Machine
1. **Order Initialization & Coupon Validation (`/checkout/[courseId]`)**:
   - Student clicks "Enroll Now" or "Buy Course".
   - `POST /api/v1/coupons/validate` (code, courseId) → checks coupon expiry, usage limit, and percentage/flat discount. Returns calculated final amount.
   - `POST /api/v1/orders` (courseId or bundleId, couponCode) → backend calculates final price server-side, interacts with Razorpay Java SDK to create Razorpay Order ID, returns `{ orderId, amount, currency, keyId }`.
2. **Client Checkout**:
   - Web invokes Razorpay Checkout JS modal; Mobile launches Razorpay SDK webview.
3. **Signed Webhook Verification (`POST /api/v1/webhooks/razorpay`)**:
   - Razorpay dispatches `payment.captured` event to backend webhook.
   - Backend calculates HMAC SHA-256 signature using `razorpay_webhook_secret`. **If signature invalid, HTTP 400 rejected instantly.**
   - If signature valid:
     1. Idempotency check: checks if order already processed (`order.status == PAID`). If paid, returns 200 OK.
     2. Updates order status `PAID`, populates payment transaction ID.
     3. Creates `Enrollment` record for student.
     4. Calculates instructor revenue split (e.g. 80% instructor / 20% platform) and updates `InstructorRevenue` ledger.
     5. Dispatches purchase receipt email (Gmail SMTP) and in-app notification.

---

## 6. Student Learning & Progressive Video Streaming

```
[Dashboard Resume] ──► [Signed Video URL] ──► [Watch Progress Tracker] ──► [Notes & Q&A]
```

### Steps & State Machine
1. **Course Player Launch (`/my-courses/[id]`)**:
   - Student opens course player. API `GET /api/v1/enrollments/my-courses/{courseId}` verifies enrollment.
   - Lesson tree rendered with completed checkmarks, drip lock icons, and current progress %.
2. **Progressive Video Streaming**:
   - Student selects video lesson → `GET /api/v1/courses/{id}/lessons/{lessonId}/video-url`.
   - Backend checks drip schedule (`enrollmentDate + drip_delay_days <= currentDate`). If locked, returns 403 Drip Locked.
   - If unlocked, returns short-lived signed R2 URL (10 min TTL). Video player streams via HTML5/Native HTTP range requests.
3. **Progress Reporting & Bookmarks**:
   - Video player emits periodic heartbeat `POST /api/v1/progress` (lessonId, watchedSeconds).
   - When watchedSeconds >= 90% duration, backend automatically marks lesson `COMPLETED` and recalculates overall course progress %.
   - Student types private note → `POST /api/v1/lessons/{id}/notes`.
4. **Lesson Discussion & Announcements**:
   - Student posts Q&A question under lesson → `POST /api/v1/lessons/{id}/questions`.
   - Instructor/TA views and responds in real time.

---

## 7. Assessment, Exam Integrity & Proctoring Flow

```
[Start Exam] ──► [Server Timer] ──► [Browser Violation Checks] ──► [Camera Proctoring] ──► [Auto-Grade]
```

### Steps & State Machine
1. **Exam Launch (`/exams/[id]/attempt`)**:
   - Student launches final exam. `POST /api/v1/exams/{id}/attempts` creates `ExamAttempt` record.
   - Backend randomizes question order and option order per attempt, returns questions, and sets `started_at` timestamp.
2. **Browser Integrity Enforcement**:
   - Frontend enforces Full-Screen Mode.
   - Event listeners track window blur, tab switch, right click, and copy/paste attempts.
   - On violation, frontend calls `POST /api/v1/exams/attempts/{attemptId}/violations` (violationType, timestamp). Recorded in `ExamViolation` table.
   - If violations exceed max threshold (e.g. 3 tab switches), backend auto-submits exam with flagged status.
3. **Sub-phase 5b: Camera Proctoring**:
   - WebRTC camera stream checks student presence, gaze deviation, and multi-person detection. Snapshot frames logged to R2 for admin audit.
4. **Server-Side Grading & Results**:
   - Student clicks submit or timer expires → `POST /api/v1/exams/attempts/{attemptId}/submit`.
   - Backend grades attempt server-side against answer key. Calculates score %, pass/fail status, and unlocks certificate if passed.

---

## 8. Certification & Public Verification Flow

```
[Exam Passed] ──► [Apache PDFBox PDF] ──► [R2 Upload] ──► [Unique Verification Code] ──► [Public QR Page]
```

### Steps & State Machine
1. **Certificate Generation**:
   - On course completion (all lessons finished + passing final exam), backend triggers `CertificateService`.
   - Generates unique alphanumeric verification code (`e.g., EL-2026-894F2K`).
   - Uses Apache PDFBox to render branded PDF certificate containing Student Name, Course Title, Completion Date, Instructor Name, and Verification QR Code.
   - Stores PDF in Cloudflare R2 (`/certificates/{code}.pdf`) and saves `Certificate` record in DB.
2. **Certificate View & Download (`/certificates`)**:
   - Student views earned certificates in dashboard, downloads PDF, or shares verification link.
3. **Public QR Code Verification (`/certificates/verify/[code]`)**:
   - Third-party employer scans QR code or visits `/certificates/verify/EL-2026-894F2K`.
   - Public API `GET /api/v1/certificates/verify/{code}` (no auth required) returns `{ valid: true, studentName, courseTitle, completionDate, instructorName, issueTimestamp }`.

---

## 9. Judge0 Code Execution Practice Sandbox

```
[Practice Hub] ──► [Code Editor Input] ──► [Judge0 Sandbox Submission] ──► [Polling/Webhook] ──► [Evaluation & XP]
```

### Steps & State Machine
1. **Practice Problem Discovery (`/practice`)**:
   - Public user browses SEO articles (`/articles/[slug]`) and practice problems (`/practice`). Filter by topic (Java, Python, JS, SQL, C++) and difficulty (Easy, Medium, Hard). Includes "Problem of the Day" banner.
2. **Code Editor Submission (`/practice/[id]`)**:
   - User inputs solution in Web code editor (Monaco/CodeMirror) or Mobile touch-friendly code editor with syntax helper toolbar.
   - Student selects language, inputs code, and clicks "Run Tests" or "Submit Solution".
3. **Judge0 Sandbox Queue Processing**:
   - Backend endpoint `POST /api/v1/practice/problems/{id}/submit` receives submission.
   - Backend constructs payload and posts to self-hosted Judge0 REST API: source code, language ID, stdin inputs, expected stdout outputs, time limit (2.0s), memory limit (128MB).
   - Judge0 executes code in isolated Linux cgroup container sandbox.
4. **Execution Results & Analytics**:
   - Backend polls Judge0 or receives callback webhook `POST /api/v1/webhooks/judge0`.
   - Returns status per test case: `Accepted`, `Wrong Answer`, `Time Limit Exceeded`, `Memory Limit Exceeded`, or `Compilation Error`.
   - On all test cases passed: updates student's `SolvedProblem` record, awards XP points, and updates daily streak.

---

## 10. Duolingo Gamification Engine & Podium Leaderboards

```
[Daily Action] ──► [Streak Evaluator] ──► [Streak Freeze Check] ──► [XP Economy] ──► [Podium Leaderboard]
```

### Steps & State Machine
1. **Daily Streak Calculation (`GamificationService`)**:
   - Student completes lesson, passes quiz, or solves coding problem.
   - Backend checks `user_streak` table:
     - If active today: streak count preserved.
     - If last activity was yesterday: `streak_count += 1`.
     - If last activity was > 24 hours ago: checks for active **Streak Freeze Power-Up** (`streak_freeze_count > 0`). If available, consumes 1 Freeze and preserves streak! If no Freeze, streak resets to 1.
2. **XP Economy & Badges**:
   - Activity awards XP points: Lesson = +10 XP, Quiz Pass = +50 XP, Coding Problem = +30 XP, Daily Habit = +25 XP.
   - When cumulative XP reaches threshold, unlocks achievement badges (`Badge` entity: "Code Warrior", "7-Day Streak Master", "Quiz Ace").
3. **Real-Time Top-3 Podium Leaderboard (`/leaderboard`)**:
   - Weekly cron/trigger aggregates student XP.
   - Endpoint `GET /api/v1/gamification/leaderboard` returns opt-in leaderboard highlighting Top-1 (Gold), Top-2 (Silver), Top-3 (Bronze) podium positions and current user's rank.

---

## 11. Teaching Assistant Invitation & Scoped Operations Flow

```
[Instructor Invites TA] ──► [Email Link] ──► [TA Accept/Decline] ──► [Scoped Grading Queue]
```

### Steps & State Machine
1. **TA Invitation (`/instructor/ta-management`)**:
   - Instructor inputs TA's email and selects specific assigned course(s).
   - `POST /api/v1/instructor/ta/invite` → creates `TAInvitation` record with `PENDING` status and generates single-use token. Sends email invite link.
2. **TA Accept / Decline (`/ta/invitation/[token]`)**:
   - TA opens link. `POST /api/v1/ta/invitations/{token}/accept` → assigns `TAAssignment` mapping TA to specific course IDs. Role becomes `TEACHING_ASSISTANT`.
3. **Scoped Operations (`/ta/dashboard`)**:
   - TA accesses `/ta/grading` and `/ta/moderation`.
   - API endpoints enforce scoped check: TA can ONLY view/grade assignments and moderate Q&A threads for courses explicitly listed in their `TAAssignment` records. Access to revenue or course pricing is strictly blocked.

---

## 12. Instructor Office Hours, Slot Booking & Leave Management

```
[Instructor Sets Slots/Leave] ──► [Student Slot Booking] ──► [Waitlist Auto-Promotion] ──► [Calendar Sync]
```

### Steps & State Machine
1. **Office Hour Slot Scheduling (`/instructor/office-hours`)**:
   - Instructor defines available 1-on-1 or group slot windows (`LiveSessionSlot`: date, time, duration, max Capacity).
2. **Student Slot Booking & Waitlists (`/courses/[id]/office-hours`)**:
   - Student views available slots and clicks "Book Slot".
   - `POST /api/v1/office-hours/slots/{id}/book` → creates `LiveSessionBooking`.
   - If slot capacity is full, student clicks "Join Waitlist" → `POST /api/v1/office-hours/slots/{id}/waitlist` (creates `WaitlistEntry` with queue position).
   - If a booked student cancels (`DELETE /api/v1/office-hours/bookings/{id}`), backend automatically promotes Waitlist Entry #1 to `BOOKED` status and dispatches push notification + email.
3. **Instructor Leave Management (`/instructor/leave`)**:
   - Instructor schedules leave dates (`InstructorLeave`: startDate, endDate, reason).
   - System automatically pauses live slot bookings during leave window, notifies assigned TAs to cover Q&A, and displays Leave Banner on instructor's profile.
4. **Google Calendar / iCal Export**:
   - Booked slot provides "Add to Google Calendar" link and `.ics` iCal download.

---

## 13. Multi-Channel Communication & Audit Logging

```
[System Event] ──► [Channel Dispatch (Email/SMS/Push)] ──► [CommLog Record] ──► [Admin AuditLog]
```

### Steps & State Machine
1. **Multi-Channel Dispatch**:
   - Events (Enrollment, Password Reset, Office Hour Alert, Admin Action) trigger `NotificationDispatcher`.
   - Email via `spring-boot-starter-mail` (SMTP).
   - SMS via Twilio SDK (`com.twilio.sdk`) for critical alerts.
   - Mobile Push Notifications via `expo-notifications` API.
2. **Communication Logging (`CommunicationLog`)**:
   - Every dispatch creates a `CommunicationLog` entry tracking recipient, channel, message type, delivery status (`SENT`, `FAILED`), and timestamp.
3. **Administrative Audit Trail (`AuditLog`)**:
   - System records all administrative mutations (Instructor Approvals, Course Moderation, Refunds, Role Changes) in `AuditLog` table: `adminUserId`, `action`, `targetEntity`, `ipAddress`, `timestamp`.
   - Searchable by Super Admin in `/admin/audit-logs`.

---

## 14. Financial Payouts, Refunds & Excel Data Export Engine

```
[Refund Request / Payout Ledger] ──► [Admin Review] ──► [Apache POI Excel Export]
```

### Steps & State Machine
1. **Student Refund Request (`/student/purchases`)**:
   - Student requests refund within policy window (e.g. 14 days, < 20% progress) → `POST /api/v1/refunds/request` (orderId, reason). Order status becomes `REFUND_REQUESTED`.
2. **Admin Refund Review Queue (`/admin/refunds`)**:
   - Admin reviews request. `POST /api/v1/admin/refunds/{id}/approve` → triggers Razorpay refund API, revokes enrollment, adjusts instructor revenue balance, records audit log entry.
3. **Instructor Revenue & Payout Ledger (`/instructor/revenue`)**:
   - Revenue split ledger aggregates earnings per course. Displays available balance, pending balance, and payout history.
4. **Apache POI Excel Reporting Engine (`/admin/reports` & `/instructor/reports`)**:
   - User clicks "Export Financial Report (.xlsx)" or "Export Enrollment Roster (.xlsx)".
   - Backend calls `ExcelExportService` using Apache POI: constructs workbook, styled header rows, formatted currency cells, auto-sized columns, and streams `.xlsx` binary directly to HTTP response header `Content-Disposition: attachment; filename="report.xlsx"`.

---

## 15. GDPR Consent & Privacy Management

```
[Registration Consent] ──► [Immutable Consent Record] ──► [Privacy Settings] ──► [Data Export/Delete]
```

### Steps & State Machine
1. **Registration Consent Capture**:
   - Terms & Privacy checkbox required during registration. `ConsentRecord` stored with `userId`, `termsVersion`, `privacyVersion`, `ipAddress`, and `timestamp`.
2. **Privacy Preferences (`/settings/privacy`)**:
   - Student toggles email marketing preferences, analytics tracking, and leaderboard visibility.
3. **GDPR Data Export & Account Erasure**:
   - Student submits "Download My Data" → backend generates zip containing profile, progress, quiz history, and payment receipts.
   - Student submits "Delete Account" → initiates 30-day graceful deletion window with account freeze.

---

## 16. 2-Tier AI Assistant Chatbot Flow

```
[Chat Message] ──► [Rate Limit Check] ──► [Rule Match?] ──► [LLM Provider Call] ──► [Graceful Fallback]
```

### Steps & State Machine
1. **Message Submission (`/chatbot`)**:
   - Student submits message via Chatbot UI widget.
   - Endpoint `POST /api/v1/chatbot/message` (messageText).
2. **Tier A: Rule-Based Course Recommender (No LLM, Zero Cost)**:
   - Backend analyzes intent via keyword & vector match (e.g. "recommend backend Java courses").
   - If matched, queries Discovery engine (PRD §3.3) and returns structured course recommendation cards directly. **Zero API cost!**
3. **Tier B: LLM-Backed Contextual Chatbot (Gemini Flash / Groq)**:
   - If general Q&A: backend enforces per-user rate limit (e.g. 20 messages/day) stored in Redis/DB **BEFORE making LLM call**.
   - Backend calls Google Gemini Flash / Groq REST API using `WebClient` with scoped system prompt (platform FAQs + catalog context only).
   - Returns response text to client.
4. **Quota Exhaustion Fallback**:
   - If user hits rate limit or LLM provider returns 429/503: backend returns friendly fallback message ("Daily AI quota reached. Please check our FAQ or try again tomorrow.") without throwing raw errors.

---

## 17. AI-Assisted Authoring (Quiz & Syllabus Drafts)

```
[Lesson Content] ──► [AI Quiz Generator] ──► [Draft Preview & Edit] ──► [Publish to Course]
```

### Steps & State Machine
1. **AI Quiz Draft Generation (`/instructor/courses/[id]/quizzes/ai-generate`)**:
   - Instructor selects lesson/module and clicks "Generate AI Quiz Questions".
   - Backend extracts lesson text/transcript and calls Gemini API with prompt: "Generate 5 multiple choice questions with 4 options and answer explanations from this content."
2. **Instructor Review & Edit Interface**:
   - AI draft questions populated into Quiz Builder UI.
   - Instructor reviews, edits questions/options, adjusts point values, and approves questions.
   - Only approved questions are saved to the live course quiz.

---

## 18. Growth & Referral Program

```
[Generate Link] ──► [Friend Signup] ──► [Discount Applied] ──► [Reward Ledger Update]
```

### Steps & State Machine
1. **Student Referral Link (`/referrals`)**:
   - Student generates custom referral link (`elearny.com/register?ref=STUDENT123`).
   - Referred friend registers using link → gets 10% discount on first course purchase.
   - Referring student receives \$10 platform credit voucher upon friend's first completed purchase.
2. **Instructor Affiliate Tracking**:
   - Instructor generates affiliate link for their own course (`elearny.com/courses/java-mastery?aff=INST456`).
   - Purchases via affiliate link award instructor a higher revenue split (e.g. 90% instead of standard 80%).

---

## Change Log
- **v1.0** — Initial comprehensive release detailing 18 complete process flows across all platform domains, roles, state transitions, API endpoints, and cross-page navigation links.
