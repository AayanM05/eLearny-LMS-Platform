# eLearny — Pages Specification Document (pages.md)

> Status: **v1.5 — living document, fresh-start reset.** Comprehensive screen-by-screen specification across all 5 user roles (`Student`, `Instructor`, `Teaching Assistant`, `Admin`, `Super Admin`) and System/Public pages.
> eLearny is high-level and large-scale by design — **not a demo or MVP**.
> **Single Unified Specification for Web & Mobile**: Content, features, inputs, workflows, and capabilities are **100% IDENTICAL** across Web and Mobile within a given screen's own tier. No separate mobile page documents are needed; responsive UI layout adaptations (desktop multi-column vs mobile stacked cards / bottom sheets) are documented directly per page.
> Enforces **§12 High Content Density** (strictly forbidding thin 2-field screens), **§13 100% Web & Mobile Feature & Content Parity**, Zero Deprecation Warning Policy (§15), and explicit cross-references to [`processflows.md`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/docs/processflows.md).
> **Every screen below is tagged `[V1]` or `[V2]`** per `prd.md` §0 / `phases.md`
> v0.9. Build V1 screens first, in `phases.md`'s phase order; V2 screens (Practice
> Hub/Judge0, Teaching Assistant surface, Instructor Leave/Office Hours, AI-Assisted
> Authoring, Referrals, Super Admin governance UI) get built when their phase starts.

---

## Mandatory UI/UX Standards Across All Pages

1. **High Content Density**: Every page MUST feature metric KPI cards with trend badges, multi-widget action toolbars, live field validation indicators, tabbed filtering panels, and contextual helper cards.
2. **Four Mandatory Lifecycle States**: Every page MUST handle **Loading (skeleton shimmer)**, **Empty (informative graphic + CTA with route link)**, **Error (retry button + explanation)**, and **Populated Data**.
3. **Explicit Navigation Target Links**: Every empty state, card, button, and quick-action link MUST state its exact route URL destination.
4. **Responsive Layout Architecture**: Desktop multi-column grid/table layout adapts to Mobile stacked card lists, bottom tab bars, and slide-over drawers.

---

## 1. Auth & Identity Surface (Web + Mobile)

### 1.1 Register Page (`/auth/register`) [V1]
- **Purpose**: New user onboarding with real-time validation and consent capture.
- **Process Flow**: Linked to `processflows.md` Flow 01.
- **Web Layout**: Split-screen design — Left panel features brand artwork & feature highlights (B2C marketplace, LeetCode sandbox, Duolingo gamification); Right panel contains the interactive form.
- **Mobile Layout**: Scrollable full-width container with top logo header and sticky bottom submit button.
- **UI Components & Elements**:
  - Full Name (first/last) text inputs.
  - **Username Input with Debounced Availability Check**: 300ms debounced input. Displays loading spinner → green checkmark badge ("Username available") or red X ("Username taken") + clickable alternate username suggestion chips.
  - Email input. **Phone removed from registration (2026-09-14, user request)** — collected later via a future profile-completion flow instead, keeping signup to the minimum needed to create an account.
  - **Password & Confirm Password Inputs**: Live requirement checklist badges (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char) that flip from grey to green checkmarks in real time. Show/hide password toggle.
  - Password match indicator text.
  - **Terms of Service & Privacy Agreement Checkbox**: Required, custom-styled (not a bare native checkbox). Clicking it opens a modal showing the full policy text; an "Accept" button at the end of the modal is what actually checks it — clicking the checkbox label alone does not.
  - Security reassurance badge ("256-bit encryption & privacy guaranteed") and Support link (`/support`).
  - Mandatory fields are marked with `*`; all interactive elements (buttons, checkbox, show/hide password) show a pointer cursor on hover.
- **Navigation Targets**: "Already have an account? Log In" → `/auth/login`. **Submit success → `/auth/verify-email` (§1.9), never straight to login or dashboard — the account is unverified until OTP confirmation (prd.md §3.26).**
- **States**: Loading, Validating (live field indicators — invalid fields show a red border and an inline error message below the field, not just a disabled submit button), Submitting, Error (duplicate email/username, terms unchecked), Success (redirects to §1.9).

### 1.2 Login Page (`/auth/login`) [V1]
- **Purpose**: User authentication and 2FA redirection.
- **Process Flow**: Linked to `processflows.md` Flow 01.
- **Components**: Email/password inputs, "Remember me" checkbox, "Forgot password?" link (`/auth/forgot-password`), "Create account" CTA (`/auth/register`), submit button.
- **Navigation Targets**: Forgot password → `/auth/forgot-password`; 2FA challenge redirect → `/auth/2fa-challenge`; Account locked redirect → `/auth/account-locked`.

### 1.3 Two-Factor Setup Page (`/auth/2fa-setup`) [V1]
- **Purpose**: Enable TOTP 2FA for account security.
- **Components**: QR Code generator graphic, manual secret key text with copy button, 6-digit confirmation input, emergency backup codes list with download button.
- **Navigation Targets**: Cancel/Back → `/settings/account`; Success → `/settings/account`.

### 1.4 Two-Factor Challenge Page (`/auth/2fa-challenge`) [V1]
- **Purpose**: Verify TOTP code during login.
- **Components**: 6-digit auto-advancing code input, "Use backup code" toggle link, resend timer, submit button.

### 1.5 Forgot Password Page (`/auth/forgot-password`) & Reset Password (`/auth/reset-password`) [V1]
- **Purpose**: Password recovery workflow.
- **Components**: Email input, generic success banner, token-validated new password + confirm password fields.

### 1.6 Account Locked Page (`/auth/account-locked`) [V1]
- **Purpose**: Displayed when 5 consecutive failed login attempts lock account.
- **Components**: Lock icon graphic, 15-minute live countdown timer, "Contact Support" button (`/support`).

### 1.7 Session Expired Modal / Page (`/auth/session-expired`) [V1]
- **Purpose**: Non-jarring re-authentication prompt when JWT expires mid-session.
- **Components**: Explanation banner, inline email/password re-login fields, "Preserve active work" indicator.

### 1.8 Terms & Privacy Viewer (`/legal/terms-privacy`) [V1]
- **Purpose**: Public legal agreement viewer.
- **Components**: Scrollable document viewer, table of contents, version history stamp.

### 1.9 Email Verification / OTP Entry Page (`/auth/verify-email`) [V1]
- **Purpose**: Confirms the registering student actually controls the email address before the account becomes usable — see prd.md §3.26.
- **Process Flow**: Linked to `processflows.md` Flow 01 (updated) — reached only via a successful Register submission; the email address is passed along (query param or session state), not re-typed by the user.
- **Components**: 6 individual single-digit OTP input boxes (auto-advance focus to the next box on entry, auto-submit once all 6 are filled), a masked/partial email confirmation line ("Code sent to j***@example.com"), a "Resend code" link that's disabled behind a visible countdown timer (60s) after each send, and a verify button.
- **States**: Awaiting input, Verifying, Success (redirects to `/auth/login`), Error (wrong code — shake animation + inline message; expired code — explicit "This code expired, request a new one" message rather than a generic error).
- **Navigation Targets**: Success → `/auth/login`. "Wrong email?" link → back to `/auth/register`.

---

## 2. Student Surface (Web + Mobile)

### 2.1 Student Dashboard (`/dashboard`) [V1]
- **Purpose**: Primary landing page after login for students.
- **Process Flow**: Linked to `processflows.md` Flow 06, Flow 10.
- **Web Layout**: 3-Column Grid — Left: Navigation sidebar; Center: Main learning feed & KPI cards; Right: Streak, XP Podium & Office Hours widgets.
- **Mobile Layout**: Top KPI summary cards → Vertical scrollable feed → Persistent Bottom Tab Bar (Home, Browse, My Courses, Notifications, Profile).
- **UI Components & Elements**:
  - **Metric KPI Cards Grid**: 4 cards with trend badges: Total Courses Enrolled, Overall Completion %, Active Streak Count (🔥 flame icon), Earned XP Points & Rank.
  - **"Continue Learning" Hero Banner**: Features last-watched course thumbnail, lesson title, progress bar %, and prominent "Resume Lesson" button → `/my-courses/[id]`.
  - **Upcoming Schedule Widget**: Displays next scheduled Office Hour slot or Quiz deadline with "Join Room" button.
  - **Recommended Courses Carousel**: Powered by AI Tier A engine (PRD §3.3/§3.15).
  - **Daily Habit Loop Widget**: "Problem of the Day" shortcut button → `/practice`.
- **Navigation Targets**:
  - "Explore Catalog" (Empty State CTA) → `/courses`.
  - "Resume Lesson" → `/my-courses/[id]`.
  - "View All Certificates" → `/certificates`.
- **States**:
  - **Loading**: Skeleton shimmer boxes for KPI cards and course hero.
  - **Empty**: Informative graphic ("No courses enrolled yet") + "Explore Courses Catalog" CTA button → `/courses`.
  - **Error**: Retry button + error message.
  - **Populated**: Full 3-column widget dashboard.

### 2.2 Browse / Search Courses (`/courses`) [V1]
- **Purpose**: Public & student course discovery.
- **Process Flow**: Linked to `processflows.md` Flow 04.
- **Components**: Search input bar with auto-complete chips, multi-criteria filter panel (Category/Subcategory taxonomy tree, Level checkboxes, Price range slider, Star rating checkboxes, Language picker), sorting dropdown (Newest, Highest Rated, Price Low-High), paginated course card grid (image, title, instructor name, rating stars, price, wishlist heart icon button).
- **Navigation Targets**: Course card click → `/courses/[slug]`. Empty filter state CTA → "Reset Filters".

### 2.3 Course Detail Page (`/courses/[slug]`) [V1]
- **Purpose**: Pre-purchase course overview and curriculum preview.
- **Process Flow**: Linked to `processflows.md` Flow 04, Flow 05.
- **Components**: Hero header (Title, Subtitle, Rating, Total Students enrolled, Instructor link → `/instructor-profile/[id]`), Sticky Purchase Card (Price, Coupon input box, "Enroll Now" CTA → `/checkout/[id]`, Wishlist toggle, 30-day refund guarantee badge), Accordion Curriculum Tree (Sections, Lessons, Free Preview Video Modals), Student Review Summary & List.

### 2.4 Course Bundle / Specialization Detail (`/bundles/[id]`) [V1]
- **Purpose**: Multi-course learning path detail.
- **Components**: Specialization title, bundled courses list with total price savings badge, "Enroll in Bundle" CTA → `/checkout/bundle/[id]`, certificate badge info.

### 2.5 Course Player & Learning Experience (`/my-courses/[id]`) [V1]
- **Purpose**: Core learning interface for video streaming, notes, and Q&A.
- **Process Flow**: Linked to `processflows.md` Flow 06.
- **Web Layout**: 2-Column Split — Left: HTML5 Video Player + Tabbed Content Panel (Overview, Private Notes, Course Forum, Announcements); Right: Collapsible Section/Lesson Curriculum Tree sidebar with completion checkmarks.
- **Mobile Layout**: Top Video Player → Tabbed panels below player.
- **Components**:
  - HTML5 / Native Video Player (signed R2 URLs, playback speed 0.5x–2x, resume position, captions).
  - Private Notes Editor (`POST /api/v1/lessons/{id}/notes`).
  - **Course Forum tab** (enriched per `prd.md` §3.9's v1.2 changelog — was a flat per-lesson Q&A thread, now a real per-course forum): thread list (title + reply count + last-activity time), "New Thread" button, thread detail view with nested replies, "Mark as accepted answer" action visible to the thread author and the instructor.
  - Next/Previous Lesson Navigation buttons.

### 2.6 Wishlist Page (`/wishlist`) [V1]
- **Purpose**: Saved-for-later courses overview.
- **Components**: Grid of saved course cards, "Move to Cart / Checkout" button, "Remove" action.
- **Empty State**: Informative graphic + "Browse Courses" CTA → `/courses`.

### 2.7 My Certificates Page (`/certificates`) [V1]
- **Purpose**: Display all earned completion certificates.
- **Process Flow**: Linked to `processflows.md` Flow 08.
- **Components**: Certificate card grid showing course title, completion date, verification ID code, "Download PDF" button, and "Share QR Link" button → `/certificates/verify/[code]`.
- **Empty State**: Graphic + "Start Learning" CTA → `/dashboard`.

### 2.7a Assignment Submission Page (`/my-courses/[id]/assignments/[assignmentId]`) [V1]
- **Purpose**: Student view of an instructor-graded assignment — new per `prd.md` §3.4a, distinct from the auto-graded Exam Player (§2.8a is the instructor counterpart).
- **Components**: Prompt/instructions text, due-date badge (turns amber when overdue, doesn't block submission), submission area matching the instructor-configured format (rich text editor, file upload dropzone, or both), one-time Submit button that becomes "Resubmit" only if the instructor explicitly reopens it, and — once graded — the score and written instructor feedback shown inline.
- **States**: Not yet submitted, Submitted & awaiting grading, Graded (score + feedback visible), Reopened for revision.

### 2.8 Public Certificate Verification Page (`/certificates/verify/[code]`) [V1]
- **Purpose**: Third-party verification page (no auth required).
- **Components**: Official eLearny Verification Badge, Student Name, Course Title, Issue Date, Unique Code, PDF download link.

### 2.9 Payment History & Refund Request Page (`/student/purchases`) [V1]
- **Purpose**: Transaction records and refund submission.
- **Process Flow**: Linked to `processflows.md` Flow 14.
- **Components**: Order history table (Date, Order ID, Course Title, Amount, Payment Method, Invoice PDF Download button), "Request Refund" action button (opens refund reason modal).

### 2.10 In-App Notification Center (`/notifications`) [V1]
- **Purpose**: Central hub for system alerts, enrollment confirmations, and Q&A replies.
- **Process Flow**: Linked to `processflows.md` Flow 13.
- **Components**: Tabbed filters (All, Unread, Course Updates, System Alerts), "Mark All as Read" button, notification list items with timestamp and deep-link targets.

### 2.11 Account & Security Settings (`/settings/account`) [V1]
- **Purpose**: Profile information and security settings.
- **Components**: Avatar image uploader, Name/Email/Phone inputs, Password Change form, 2FA Management toggle (`/auth/2fa-setup`), Active Sessions list with "Revoke All" button.

### 2.12 Privacy & GDPR Data Management (`/settings/privacy`) [V1 — basic consent view/withdraw only; advanced privacy-preference management is V2 per prd.md §3.25]
- **Purpose**: Data privacy preferences and GDPR actions.
- **Process Flow**: Linked to `processflows.md` Flow 15.
- **Components**: Marketing Email toggle, Analytics tracking toggle, Opt-in Leaderboard toggle, "Download My Data (.zip)" CTA button, "Delete Account" button with 30-day grace period modal.

### 2.13 Instructor Public Profile (`/instructor-profile/[id]`) [V1]
- **Purpose**: View instructor background and published courses.
- **Components**: Instructor avatar, bio, total students, average rating badge, social links, published course card grid.

### 2.14 Practice Hub — SEO Article List (`/articles`) [V2 — Phase V2-B]
- **Purpose**: Public SEO tutorial and article discovery.
- **Process Flow**: Linked to `processflows.md` Flow 09.
- **Components**: Topic category pills (Java, Python, System Design, SQL), search bar, featured tutorial card, paginated article list grid with reading time tags.

### 2.15 Practice Hub — Article Detail (`/articles/[slug]`) [V2 — Phase V2-B]
- **Purpose**: Long-form public tutorial page with embedded playground.
- **Components**: Markdown article content, author badge, table of contents sidebar, embedded code playground block with "Try it Yourself" button.

### 2.16 Practice Problems List (`/practice`) [V2 — Phase V2-B]
- **Purpose**: LeetCode-style coding problem hub.
- **Process Flow**: Linked to `processflows.md` Flow 09.
- **Components**: "Problem of the Day" hero banner, Filter tabs (All, Unsolved, Solved), Topic pills, Difficulty dropdown (Easy, Medium, Hard), Problem table (Status checkmark, Title, Difficulty badge, Acceptance rate %).

### 2.17 Practice Problem Detail & Judge0 Sandbox Editor (`/practice/[id]`) [V2 — Phase V2-B]
- **Purpose**: Solve coding problems with real-time containerized code execution.
- **Process Flow**: Linked to `processflows.md` Flow 09.
- **Web Layout**: Split-pane layout — Left: Problem statement, examples, test case specifications; Right: Language selector dropdown (Java, Python, C++, JS), Code Editor (Monaco), Execution Control Bar ("Run Code", "Submit Solution"), Output Console Panel (stdout, memory/time usage, test case pass/fail indicators).
- **Mobile Layout**: Top problem description → Embedded code editor with touch-friendly syntax toolbar (`{`, `}`, `;`, `(`, `)`) → Run button → Slide-up output sheet.

### 2.18 2-Tier AI Assistant Chatbot (`/chatbot`) [V1 — Phase 7, pulled forward at user request]
- **Purpose**: Conversational AI assistant for course recommendations and learning support.
- **Process Flow**: Linked to `processflows.md` Flow 16.
- **Components**: Chat message thread, quick-suggestion prompt chips ("Recommend Java courses", "What is Spring Boot?", "How do I earn certificates?"), text input box with send button, daily rate-limit usage progress bar.

### 2.19 Duolingo Gamification Podium Leaderboard (`/leaderboard`) [V1 — Phase 6, pulled forward at user request]
- **Purpose**: Opt-in weekly student competition ranking.
- **Process Flow**: Linked to `processflows.md` Flow 10.
- **Components**:
  - **Top-3 Podium Banner**: Animated Gold (1st), Silver (2nd), Bronze (3rd) podium blocks with student avatars, names, and XP scores.
  - Ranked list table below podium highlighting current user's rank.
  - "Opt Out of Leaderboard" privacy toggle.

### 2.20 Referral & Rewards Program (`/referrals`) [V2 — Phase V2-E]
- **Purpose**: Growth mechanics and student referral links.
- **Process Flow**: Linked to `processflows.md` Flow 18.
- **Components**: Custom referral link input with "Copy Link" button, Social share buttons, Earnings/Discount voucher summary card, Referred friends status table.

---

## 3. Instructor Surface (Web + Mobile — Full Parity)

### 3.1 Instructor Dashboard (`/instructor/dashboard`) [V1]
- **Purpose**: Central hub for course authoring, revenue snapshot, and office hours.
- **Process Flow**: Linked to `processflows.md` Flow 03, Flow 14.
- **Components**: KPI Metric Cards (Total Published Courses, Total Enrolled Students, Total Monthly Revenue, Pending TA Applications), Quick-Action Toolbar ("Create New Course" → `/instructor/courses/create`, "Schedule Office Hours" → `/instructor/office-hours`, "Schedule Leave" → `/instructor/leave`), Draft Courses list, Recent Enrolled Students feed.
- **Navigation Targets**: "Create Course" → `/instructor/courses/create`; "View Revenue" → `/instructor/revenue`.

### 3.2 Instructor Application Form (`/instructor/apply`) [V1]
- **Purpose**: Student application to become an approved instructor.
- **Process Flow**: Linked to `processflows.md` Flow 02.
- **Components**: Bio text area, Teaching experience dropdown, Expertise category checkboxes, Portfolio link input, Sample video upload URL input, Submit application button.

### 3.2a Instructor Account Setup Page (`/instructor/setup-account?token=...`) [V1]
- **Purpose**: The only way an Instructor account is ever activated — see prd.md §3.26. Reached exclusively via the link in the Admin-approval email; never linked to from anywhere else in the app (no public URL to guess).
- **Process Flow**: Linked to `processflows.md` Flow 02 (updated) — final step after Admin approval.
- **Components**: 6-digit OTP entry (same component as §1.9), Username input (same live availability check as §1.1), Password + Confirm Password inputs (same live requirement checklist as §1.1), Activate Account button.
- **States**: Invalid/expired token (shown before any form fields render, with a "Contact support" link, since there's nothing the instructor can self-serve fix), Awaiting OTP, Verifying, Success (redirects to `/auth/login` with a welcome message).
- **Security note**: the setup token alone is not sufficient to activate the account — the OTP must also be entered, so a forwarded/leaked email doesn't single-handedly grant account access.

### 3.3 Course Creator Wizard (`/instructor/courses/create`) [V1]
- **Purpose**: Step 1 of course authoring (Metadata & Media).
- **Process Flow**: Linked to `processflows.md` Flow 03.
- **Components**: Step progress bar (Basic Metadata → Media Assets → Pricing & Coupons → Review), Title/Subtitle inputs, Category taxonomy picker, Promotional Video R2 dropzone, Cover Image dropzone, Save & Next button.

### 3.4 Curriculum Tree & Drip Builder (`/instructor/courses/[id]/builder`) [V1]
- **Purpose**: Build sections, lessons, and drip release schedules.
- **Process Flow**: Linked to `processflows.md` Flow 03.
- **Components**: Add Section button, Drag-and-drop section/lesson reordering list, Lesson editor modal (Title, Content type: Video/Article/Attachment, Drip delay days input, R2 pre-signed media upload box), Course versioning toggle.

### 3.5 Quiz & Exam Builder (`/instructor/courses/[id]/quizzes`) [V1]
- **Purpose**: Create module assessments and final exams.
- **Process Flow**: Linked to `processflows.md` Flow 07, Flow 17.
- **Components**: Add Question button, Question type picker (MCQ single/multi, True/False, Short answer), Randomization toggle, Pass threshold % input, Time limit input, "Generate AI Quiz Questions" CTA button → `/instructor/courses/[id]/quizzes/ai-generate`.

### 3.5a Assignment Grading Panel (`/instructor/courses/[id]/assignments`) [V1]
- **Purpose**: Instructor side of `prd.md` §3.4a — create assignments and grade submissions.
- **Process Flow**: New flow, to be added to `processflows.md` when Phase 5 is built.
- **Components**: Assignment creation form (prompt, submission format, due date, max score), submission list filterable by "Ungraded / Graded / Overdue," per-submission grading view (score input, written feedback text area, "Reopen for revision" button).

### 3.6 AI Quiz Draft Generator (`/instructor/courses/[id]/quizzes/ai-generate`) [V2 — Phase V2-E]
- **Purpose**: AI-assisted assessment draft creation.
- **Process Flow**: Linked to `processflows.md` Flow 17.
- **Components**: Lesson content picker, Number of questions slider, "Generate Drafts" button, Generated questions review list with Approve/Edit/Reject actions.

### 3.7 Pricing & Coupon Manager (`/instructor/courses/[id]/pricing`) [V1]
- **Purpose**: Course price setting and promotional coupon creation.
- **Process Flow**: Linked to `processflows.md` Flow 05.
- **Components**: Base Price input, Discount price input, Create Coupon form (Code, Discount %, Expiry date, Usage limit), Active coupons list with status badges and expire actions.

### 3.8 Teaching Assistant Management (`/instructor/ta-management`) [V2 — Phase V2-A]
- **Purpose**: Invite and manage TAs for instructor's courses.
- **Process Flow**: Linked to `processflows.md` Flow 11.
- **Components**: "Invite TA" form (TA Email, Assigned Course selection checkboxes), Pending invitations list, Active TAs list with assigned course badges and Revoke access buttons.

### 3.9 Office Hours Slot Scheduler (`/instructor/office-hours`) [V2 — Phase V2-A]
- **Purpose**: Manage 1-on-1 and group live slot availability.
- **Process Flow**: Linked to `processflows.md` Flow 12.
- **Components**: Add Slot form (Date, Start Time, Duration, Max Capacity), Scheduled slots list with booked student counts, Waitlist view modal.

### 3.10 Instructor Leave Manager (`/instructor/leave`) [V2 — Phase V2-A]
- **Purpose**: Schedule unavailability windows.
- **Process Flow**: Linked to `processflows.md` Flow 12.
- **Components**: Schedule Leave form (Start Date, End Date, Reason), Active/Past leave list, Auto-pause slots toggle.

### 3.11 Revenue Dashboard & Payout Ledger (`/instructor/revenue`) [V1]
- **Purpose**: Earnings analytics and payout status.
- **Process Flow**: Linked to `processflows.md` Flow 14.
- **Components**: Total Earnings KPI card, Monthly revenue line chart, Per-course revenue split breakdown table, Payout history table with status badges (`PAID`, `PROCESSING`).

### 3.12 Analytics & Apache POI Excel Exporter (`/instructor/reports`) [V1 — on-screen analytics; the Excel export button itself is V2 per Phase V2-D]
- **Purpose**: Student engagement analytics and data export.
- **Process Flow**: Linked to `processflows.md` Flow 14.
- **Components**: Student completion rate charts, Quiz score distribution histogram, "Export Roster (.xlsx)" CTA button, "Export Earnings (.xlsx)" CTA button.

---

## 4. Teaching Assistant Surface (Web + Mobile)

### 4.1 TA Scoped Dashboard (`/ta/dashboard`) [V2 — Phase V2-A]
- **Purpose**: Overview of assigned courses and pending tasks for TAs.
- **Process Flow**: Linked to `processflows.md` Flow 11.
- **Components**: Assigned Courses list cards, Pending Grading Count badge, Unanswered Q&A Questions count badge, Quick links to Scoped Grading Queue (`/ta/grading`) and Discussion Moderation (`/ta/moderation`).

### 4.2 Scoped Course Grading Queue (`/ta/grading`) [V2 — Phase V2-A]
- **Purpose**: Grade student assignment submissions on assigned courses.
- **Process Flow**: Linked to `processflows.md` Flow 11.
- **Components**: Course filter dropdown (assigned courses only), Submissions list (Student name, Submission date, Status: Pending/Graded), Grading Panel (Student code/text view, Score input, Feedback text area, Submit grade button).

### 4.3 Scoped Q&A Forum Moderation (`/ta/moderation`) [V2 — Phase V2-A]
- **Purpose**: Answer student questions and moderate lesson Q&A.
- **Process Flow**: Linked to `processflows.md` Flow 11.
- **Components**: Unanswered questions feed, Inline reply editor, "Pin Answer" action, "Flag Inappropriate" action.

---

## 5. Admin Surface (Web + Mobile — Full Parity)

### 5.1 Operations Dashboard (`/admin/dashboard`) [V1]
- **Purpose**: Platform-wide health and governance overview.
- **Process Flow**: Linked to `processflows.md` Flow 02, Flow 03, Flow 14.
- **Components**: KPI Metric Cards (Total Users, Total Instructors, Platform GMV Revenue, Pending Instructor Approvals count, Pending Course Reviews count), Quick Action Toolbar, Recent Platform Activity feed.

### 5.2 Instructor Approval Queue (`/admin/instructor-applications`) [V1]
- **Purpose**: Review and approve/reject instructor applications.
- **Process Flow**: Linked to `processflows.md` Flow 02.
- **Components**: Pending applications table (Applicant Name, Email, Submission Date, Expertise), Applicant detail drawer (Bio, Experience, Portfolio link, Video sample player), "Approve" button, "Reject" button (with feedback modal).

### 5.3 Course Approval Queue (`/admin/course-moderation`) [V1]
- **Purpose**: Moderation gate before submitted courses go live.
- **Process Flow**: Linked to `processflows.md` Flow 03.
- **Components**: Submitted courses list, Course preview drawer (Curriculum tree, Video sample player, Pricing), "Approve & Publish" button, "Reject with Changes Requested" button.

### 5.4 User Role Management (`/admin/users`) [V1]
- **Purpose**: Manage platform users and role assignments.
- **Components**: Searchable user table (Name, Email, Role badge, Status badge: Active/Locked/Suspended), Role editor dropdown (`STUDENT`, `INSTRUCTOR`, `TEACHING_ASSISTANT`, `ADMIN`, `SUPER_ADMIN`), Suspend/Reinstate user toggle button.

### 5.5 Category Taxonomy Tree Editor (`/admin/categories`) [V1]
- **Purpose**: Manage platform course categories and subcategories.
- **Components**: Category tree hierarchy view, "Add Category" button, "Add Subcategory" button, Drag-and-drop category reordering, Category icon picker.

### 5.6 Refund Request Review Queue (`/admin/refunds`) [V1]
- **Purpose**: Process student-initiated refund requests.
- **Process Flow**: Linked to `processflows.md` Flow 14.
- **Components**: Refund requests table (Student Name, Course Title, Purchase Date, Refund Reason, Course Progress %), "Approve Refund" button (triggers Razorpay refund API), "Deny Refund" button.

### 5.7 Platform Reports & Excel Exporter (`/admin/reports`) [V1 — on-screen reports; Excel export button is V2 per Phase V2-D]
- **Purpose**: Platform-wide financial and user analytics with Excel export.
- **Process Flow**: Linked to `processflows.md` Flow 14.
- **Components**: Platform revenue chart, Monthly active users chart, "Export Full Platform Financials (.xlsx)" CTA button, "Export User Audit Roster (.xlsx)" CTA button.

### 5.8 Multi-Channel Communication Log (`/admin/communication-log`) [V1 — email/in-app only; SMS/push channels are V2 per Phase V2-D]
- **Purpose**: Inspection of sent notifications and emails for support/debugging.
- **Process Flow**: Linked to `processflows.md` Flow 13.
- **Components**: Filterable communication table (Recipient Email/Phone, Channel: Email/SMS/Push, Message Type, Status: Sent/Failed, Timestamp), Delivery retry button.

---

## 6. Super Admin & Compliance Surface (Web + Mobile)

### 6.1 Administrative Audit Trail Log (`/admin/audit-logs`) [V2 — Phase V2-D]
- **Purpose**: Immutable governance audit log of all admin mutations.
- **Process Flow**: Linked to `processflows.md` Flow 13.
- **Components**: Filterable audit trail table (Admin User, Action Executed: e.g. `APPROVE_INSTRUCTOR`, `REFUND_ORDER`, Target Entity ID, Client IP Address, Timestamp), JSON payload detail viewer modal.

### 6.2 Global System Settings Override (`/admin/system-settings`) [V2 — Phase V2-D]
- **Purpose**: Platform-wide configuration management.
- **Components**: Platform Commission Split % slider, Global Maintenance Mode toggle, Free-tier AI Chatbot Daily Limit input, Razorpay Currency settings.

---

## 7. System & Error Pages (Web + Mobile) `[V1]`

| Route | Purpose | Key Components & UI Specifications |
|---|---|---|
| `/404` | Route Not Found | 404 Illustration graphic, "Page Not Found" headline, "Back to Home" CTA button → `/dashboard` or `/`. |
| `/500` | Server Fault | 500 Error graphic, "System Interruption" message, "Retry Request" button, Support link → `/support`. |
| `/offline` | Mobile Offline Connection | **Mobile-Only**. Offline graphic, "No Internet Connection detected", "Retry Connection" button. |
| `/rate-limited` | AI / Endpoint Rate Limit | Rate limit graphic, "Daily AI Quota Reached" message, countdown timer until reset. |
| `/support` | Help & Support FAQ | Searchable FAQ accordions, Submit Support Ticket form, Support contact email. |
| `/whats-new` | Platform Release Notes | Version changelog list, feature highlight badges, video walkthrough clips. |

---

## Change Log
- **v1.0** — Initial comprehensive release establishing screen-by-screen specifications across 40+ pages for all 5 user roles, complete with component trees, navigation target links, empty-state CTAs, responsive Web/Mobile layout rules, and explicit cross-references to `processflows.md`.
- **v1.1** — **Fresh-start reset, aligned to `prd.md` v1.0 / `phases.md` v0.9's V1/V2 split.** Tagged every one of the 40+ screens `[V1]` or `[V2]`. At explicit user request, the AI Chatbot (§2.18) and Gamification Leaderboard (§2.19) are `[V1]`. The entire Teaching Assistant Surface (§4), Practice Hub/Judge0 screens (§2.14–§2.17), Instructor Leave/Office Hours/TA Management (§3.8–§3.10), AI Quiz Draft Generator (§3.6), Referrals (§2.20), and Super Admin governance screens (§6) are `[V2]`. Excel-export buttons specifically (not the surrounding analytics/reports screens, which stay V1) are called out as V2 on §3.12 and §5.7. Multi-Channel Communication Log (§5.8) is V1 for email/in-app only; SMS/push channels are V2.
- **v1.2** — Fixed a real contradiction caught during Phase 1 build: §1.1 (Register Page) had a "Role Selection Toggle (STUDENT/INSTRUCTOR)" that directly conflicted with `processflows.md`/`wireframes.md` Master Flow 02, which already explicitly stated "No separate instructor registration toggle." Removed the toggle — every self-registration is a Student; Instructor access only comes via the separate application/approval flow. Noted that the Terms checkbox creates a `ConsentRecord` on submit.
- **v1.3** — Added email OTP verification (§1.9, new) and the instructor invite-and-activate page (§3.2a, new) per `prd.md` §3.26. §1.1 Register now redirects to §1.9 instead of straight to login/dashboard. Also fixed real UI gaps caught by the user testing the built Register page: invalid fields now specify a red border + inline error text (not just a disabled submit button), the Terms checkbox is custom-styled and opens a full-policy modal with its own Accept button rather than toggling directly, and mandatory fields are marked with `*`.
- **v1.4** — Removed the Phone field from Register (§1.1) at user request — deferred to a future profile-completion flow instead of collecting it at signup.
- **v1.5** — After the user shared a prior (discarded) codebase for reference: added §2.7a (Assignment Submission, student) and §3.5a (Assignment Grading Panel, instructor) per `prd.md` §3.4a. Enriched §2.5's Course Player discussion tab from a flat per-lesson Q&A thread into a real per-course Forum tab (threads, replies, accepted-answer marking) per `prd.md` §3.9.

