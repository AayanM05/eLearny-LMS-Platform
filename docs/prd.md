# eLearny — Product Requirements Document (prd.md)

> Status: **v0.7 — living document.** Every feature listed below is
> **committed scope** using modern, active, non-deprecated package standards
> (Java 21, Spring Boot 3.3.x, Next.js 14.2+, Expo SDK 51). One explicit,
> user-requested exception: §3.20 Live Sessions — see its entry and the
> v0.6 changelog for why. This document does
> not decide *when* something gets built (that's `phases.md`'s job); it
> only decides *what* eLearny includes. New features still get added here
> explicitly, with a version bump — nothing gets silently dropped either.

---

## 1. What to Build

eLearny is a full-scale, production-grade **Learning Management System (LMS)**
— high-level and large-scale by design, not an MVP. It combines a
Udemy-style multi-instructor course marketplace, Coursera-style bundled
learning paths and certification rigor, a GeeksforGeeks-style free
article/practice hub for organic reach, and an AI-assisted layer for
discovery and support.

The platform is architected **API-first**: a single Spring Boot backend
serves a Next.js responsive web app and a React Native (Expo) mobile app
from day one, so no future frontend (tablet-native, desktop app, etc.)
requires backend rework.

Note on sequencing: a system this size cannot be built in one motion —
some pieces genuinely depend on others existing first (auth before
role-based dashboards, course schema before payments, payments before
revenue analytics). That ordering is `phases.md`'s responsibility. This
document's job is to make sure nothing on this list gets quietly cut or
forgotten because of that ordering.

---

## 2. Targeted Users

**Pure B2C**, matching Udemy's model. Four roles:

| Role | Description |
|---|---|
| **Student** | Browses, purchases/enrolls in courses, tracks progress, takes quizzes, earns certificates, leaves reviews. |
| **Instructor** | Creates and manages courses, quizzes, and pricing/coupons. **Must be approved by an Admin** before any instructor-level action is permitted. Views revenue/analytics for own courses. Can invite Teaching Assistants to their own courses. |
| **Teaching Assistant** | Invited by a specific Instructor to one or more of that instructor's courses (not platform-wide, not self-registered). Can grade assignments and moderate discussion on the courses they're assigned to. Cannot create courses, set pricing, or access revenue data — narrower than Instructor by design. Accepts or declines an invitation before gaining any access. |
| **Admin** | Platform-wide management: instructor approval, content moderation, user management, category/taxonomy management, revenue oversight. |

**Out of scope (a deliberate design boundary, not a deferral):**
organizational/team accounts (bulk seats, org-level admins, assigned
learning paths for employees). This is a genuinely different data model
(a purchaser who isn't the learner), not a smaller version of the B2C
model — so it's excluded on purpose. The schema should still avoid
hardcoding "the buyer is always the learner" so this could be added later
without a rewrite, but it is not part of eLearny's committed feature set.

---

## 3. Features

All features below are committed. None are "maybe later." Where a feature
has real infrastructure or cost implications, that's noted so it's an
informed commitment — not a reason to cut it.

### 3.1 Course Authoring & Content Management (Instructor)
- Course creation with hierarchical structure: Course → Sections/Modules → Lessons
- Lesson content types: video, article/text, downloadable resource/attachment
- Drip content / scheduled release of modules (per course)
- Draft → Submitted → Published course states, with admin review gate
- Course versioning: instructor can update a published course without breaking active learners' progress
- Bulk resource upload (slides, code files, PDFs) per lesson

### 3.2 Learning Experience (Student)
- Progressive video streaming via signed URLs, HTML5/native range requests
- Playback controls: speed adjustment, resume-from-last-position, captions/subtitles
- Student dashboard: enrolled courses, % progress per course, continue-learning shortcut, activity history
- Lesson completion tracking (auto on video watch-through + manual mark-complete for articles)
- Bookmarks / notes on lessons (student-private)

### 3.3 Discovery
- Search (title, instructor, tags, category)
- Filtering: category, level (beginner/intermediate/advanced), price, rating, language
- Course categorization / taxonomy management (admin-controlled categories & subcategories)
- Course reviews and star ratings (student, post-enrollment only, one review per student per course)
- Recommended/related courses: rule-based matching (category/tag/history) — this is also the engine behind the chatbot's course-suggestion capability (3.15)

### 3.4 Assessment & Exams
- Quizzes/assessments per module and per course (final exam)
- Question types: MCQ (single/multi-answer), true/false, short-answer
- Timed exams with configurable time limits
- Randomized question order and randomized answer-option order per attempt
- Configurable pass/fail threshold and retry limits per quiz
- **Exam integrity, browser-level:** full-screen enforcement (exiting logs a violation and can auto-flag/auto-submit), tab-switch/window-blur detection with timestamps, copy/paste and right-click disabled, back-button/navigation blocked during an attempt, violation log visible to the instructor per attempt
- **Exam integrity, camera-based:** webcam identity check, gaze tracking, multi-person detection. This is a separate, heavier build (media pipeline, storage, explicit student consent flow for camera access) than the browser-level checks — real infra, not a toggle — but it is committed scope, to be built as its own module in `phases.md` once the media pipeline exists.

### 3.5 Certification
- Auto-generated PDF certificate on course completion (all lessons + passing final exam if present)
- Unique certificate ID + verification page/QR code so a certificate can be validated by a third party (employer) without logging in
- Certificate includes: student name, course title, instructor name, completion date, unique verification code

### 3.6 Commerce
- Payments via Razorpay (one-time course purchase)
- Coupons: percentage/flat discount, expiry date, usage limits
- Instructor revenue dashboard: sales, revenue over time, payout status
- Refund handling (policy + admin-triggered refund flow)

### 3.7 Governance & Admin
- Admin approval gate for instructors — blocks all instructor actions until approved
- Admin course-approval workflow before a course goes live (moderation)
- Admin panel: user management, instructor approvals, category management, reported-content review, platform-wide analytics
- Role-based access control (RBAC) and role-based navigation (Student / Instructor / Admin)

### 3.8 Communication
- Notifications: in-app (`notifications` table) for enrollment, course updates, quiz results, certificate issuance
- Transactional email (Gmail SMTP): welcome, purchase receipt, course completion, password reset

### 3.9 Community & Engagement
- Per-course discussion/Q&A thread (student ↔ instructor, student ↔ student)
- Instructor announcements per course

### 3.10 Gamification & Interaction Design
- Completion badges/achievements, daily streaks, points, and an opt-in leaderboard (privacy-respecting — no forced public ranking)
- Animated transitions, progress feedback, and micro-interactions across the product — web via `motion`/Framer Motion, mobile via `react-native-reanimated` (described here by behavior, implemented per-platform, since the two frameworks are not interchangeable)
- Animated feedback moments specifically on: lesson completion, quiz pass, certificate issuance

### 3.11 Course Bundling & Discovery Extensions
- **Wishlist / save-for-later** — student can bookmark a course without purchasing
- **Learning paths / course bundles** — instructor or admin groups related courses into a sequential path with its own completion certificate (Coursera's "Specialization" model)
- **Instructor public profile page** — bio, total students, average rating, all published courses

### 3.12 Localization & Multi-Language Support
Two independent layers, per standard i18n practice — a platform can localize
its interface without every course being translated, and the two are built
and shipped separately:
- **Platform UI localization** — interface text (menus, dashboards, buttons, notifications) via `next-intl`/i18next (web) and `i18n-js` (Expo mobile)
- **Course content localization** — instructor-provided subtitles/captions or alternate-language versions of a course. Higher cost per language (storage, instructor workload) — committed, but the specific language list is a business decision to make closer to build time, not a reason to exclude the capability itself

### 3.13 Practice & Content Hub
Inspired by GeeksforGeeks: free long-form articles/tutorials alongside paid
courses, for learner value and organic search traffic that funnels into
course sales.
- Public tutorial/article pages per topic (SEO-friendly, free to read, no login required) — a distinct content type from paid video courses
- Topic-wise practice problems with difficulty levels (easy/medium/hard) and a "Problem of the Day" habit loop
- Embedded code playground inside lessons — in-browser code editor + execution sandbox for programming courses, built on an open-source, self-hostable execution engine (e.g. Judge0) rather than a paid SaaS API
- This is real infrastructure (isolated execution, resource limits, security hardening against malicious/adversarial code submissions) — committed, and specifically called out in `phases.md` as its own build module rather than a quick add-on, because pretending it's small would be dishonest about the work involved

### 3.14 Growth Mechanics
- Referral program: student refers a friend, both get a discount/credit
- Instructor affiliate program: commission for referring new students

### 3.15 AI Assistant (Chatbot)
Two capabilities, both committed, with different infra profiles:

**Course Suggestion (rule-based, no LLM)**
- Recommends courses via category/tag matching, browse history, and enrolled-course similarity — reuses the Discovery recommendation engine (3.3), exposed through the chat UI

**Conversational Q&A (LLM-backed)**
- Answers free-text student questions — platform FAQs, "what should I learn to become a backend developer," course-related questions
- Backed by a genuinely free LLM API tier (no credit card required): Google Gemini Flash or Groq (Llama 3.3 70B) — both viable at eLearny's traffic scale today
- Required engineering: LLM API key stays server-side (Spring Boot calls the provider — key never reaches web/mobile clients); per-user rate limiting in our own backend so one student can't exhaust the platform's shared quota; a graceful fallback response when quota is hit, instead of a broken chat; the bot's scope kept to the platform (FAQs, catalog) rather than open-ended general chat, to keep prompts short and cheap
- Honest note, not a reason to cut it: this is the first feature depending on a third-party service outside our control. As traffic genuinely grows past what any free tier offers, this specific feature is the one most likely to need a paid upgrade — that's a scaling reality, not a scoping choice, and it'll be flagged again when we're closer to that point.

### 3.16 AI-Assisted Authoring & Personalization
- AI-generated quiz question drafts from course content (instructor-assist tool, instructor reviews before publishing)
- AI-driven personalization of recommendations beyond rule-based matching, once there's enough usage data for it to outperform rule-based matching
- Same free-tier LLM dependency and honest cost note as 3.15

### 3.17 Teaching Assistant Role
- Instructors can invite a Teaching Assistant (by email) to one or more of their own specific courses — not platform-wide, not self-registered
- TA accepts/declines the invitation before gaining any access
- TA permissions (per assigned course only): grade assignments, moderate discussion/Q&A (3.9)
- TA cannot: create courses, set pricing, access revenue data, or act on courses they weren't invited to
- Reuses the existing RBAC/role infrastructure from §2 — a fourth role, not a parallel permission system

### 3.18 Account Security Hardening
- Account lockout after repeated failed login attempts, with a clear unlock path (time-based or admin-assisted)
- Session-expiry handling: a clear, non-jarring re-authentication prompt when a JWT expires mid-use, not a silent failure

### 3.19 Trust, Support & Governance Pages
- Student-initiated refund requests (student submits a request; admin reviews it — extends the existing refund flow in §3.6, which was previously admin-initiated only)
- Admin-facing communication log (record of transactional emails/notifications actually sent, for support/debugging)
- Admin-facing audit log (record of admin actions — approvals, moderation, refunds — for accountability)
- Public legal pages: Terms of Use, Privacy Policy
- Help & Support page, and a "What's New" release-notes page

### 3.21 Instructor Availability & Leave Management
- Instructors can schedule leave dates and unavailability windows (`InstructorLeave`, `LeaveStatus`)
- Automatically pauses live office hour slot bookings, notifies assigned Teaching Assistants, and displays leave notices on instructor profiles

### 3.22 Live Session Office Hours & Slot Bookings
- 1-on-1 and small group Office Hour slot scheduling (`LiveSessionSlot`, `LiveSessionBooking`, `BookingStatus`)
- Waitlist management (`WaitlistEntry`, `WaitlistStatus`): automatically notifies students when a booked slot opens up
- Integrates with Google Calendar / iCal download links for booked slots

### 3.23 Excel Reporting & Data Export Engine
- Admin & Instructor data export in `.xlsx` format (powered by Apache POI)
- Financial reports, student enrollment rosters, quiz score analytics, and instructor payout statements exportable with one click

### 3.24 Multi-Channel Communication & Audit Trail
- Multi-channel notification dispatch: Email (SMTP), SMS alerts (`com.twilio.sdk`), and push notifications (`expo-notifications`)
- Full audit logging (`CommunicationLog`, `CommunicationChannel`, `CommunicationStatus`) for delivery tracking and troubleshooting
- Platform-wide administrative audit trail (`AuditLog`) tracking all admin actions (approvals, role changes, refund approvals, moderation) for compliance

### 3.25 GDPR Consent & Privacy Management
- Immutable user consent recording (`ConsentRecord`) tracking exact terms/privacy policy versions agreed to at registration and upon legal updates
- Student privacy preferences management in user profile settings

---

## 4. Change Log
- **v0.1** — Initial baseline PRD drafted from prerequisite scope discussion.
- **v0.2** — Expanded feature list after researching LMS-checklist standards,
  Coursera, and exam anti-cheating practices. Added: content versioning/drip
  content, playback/bookmark features, exam integrity (browser-level +
  camera-based), certificate verification (unique ID/QR), refund handling,
  per-course discussion/Q&A.
- **v0.3** — Added after researching gamification standards, i18n practice,
  and GeeksforGeeks-style content platforms. Added: wishlist, course
  bundles/learning paths, instructor public profiles, gamification
  (badges/streaks/points/leaderboard), platform + content localization, a
  Practice & Content Hub (free articles + practice problems + embedded code
  playground), referral/affiliate growth mechanics, and an AI-features
  section with free-tier cost flags.
- **v0.4** — Formalized the AI chatbot request into a two-part design:
  rule-based course-suggestion engine + LLM-backed Q&A bot (Gemini Flash or
  Groq free tier), with required app-level rate limiting and fallback
  handling called out explicitly.
- **v0.5** — Removed all "deferred / placeholder / v2 / v3 / TBD" framing.
  Every feature in this document is now committed scope. Build order (what
  gets built in what sequence) moves entirely to `phases.md`; this document
  no longer mixes scope decisions with sequencing decisions.
- **v0.6** — Added a fourth role, Teaching Assistant (§2, §3.17), invited
  per-course by an Instructor with narrower permissions than Instructor.
  Added Account Security Hardening (§3.18: lockout, session-expiry
  handling), Trust/Support/Governance pages (§3.19: student-initiated
  refund requests, communication log, audit log, legal pages, help/support,
  what's-new). Added Live Sessions (§3.20) as a **deliberate, user-requested
  exception** to this doc's "nothing deferred" policy — real-time video
  needs infrastructure (self-hosted WebRTC SFU or per-minute-billed managed
  API) that doesn't fit the free-tier constraint yet; explicitly deferred
  rather than committed, at the user's direction, not shrunk silently.
- **v0.7** — Enforced modern non-deprecated dependency standards across Java 21,
  Spring Boot 3.3.x, Next.js 14.2+, and Expo SDK 51.
- **v0.8** — Incorporated combined features from `temp_elearny`: §3.21 Instructor Leave Management, §3.22 Live Session Office Hours & Slot Bookings with Waitlists, §3.23 Excel Data Export Engine (Apache POI), §3.24 Multi-Channel Communication & Audit Trail (Twilio SMS, Email, Push, AuditLog), §3.25 GDPR Consent & Privacy Management.
