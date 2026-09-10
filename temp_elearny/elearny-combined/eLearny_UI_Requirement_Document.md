# eLearny — UI Requirement Document
### Operational-Level, Area-Level & Individual-Element UI Specification

---

## Document Control

| Field | Detail |
|---|---|
| Project | eLearny — Learning Management System |
| Document Type | UI Requirement Document (UIRD) |
| Companion Document | `eLearny_Master_Documentation.md` (SRS — functional/technical spec) |
| Target Implementation | React (web) → wrapped/ported to a mobile app shell later |
| Platforms Covered | Desktop web, Tablet web, Mobile web, Mobile app (iOS/Android via React Native or a WebView/Capacitor wrapper) |
| Version | 1.1 |
| Status | Approved for frontend build |
| Revision Notes (1.0 → 1.1) | Two-way audit against the actual backend implementation: added AD9 (Category Management), U7 (public Certificate Verification), and amended T1 (TA pending-invitation/accept state) and Section 4.2 (instructor search) — all four existed in the backend with no corresponding screen in v1.0. Also corrected data-dependency endpoint paths on S12, S13, AD3, AD6, AD7, I5 to match what's actually implemented, and added the platform-coupon-eligibility conditional-UI rule (Section 12.2) now that it's backed by a real Admin-grantable permission rather than an unspecified "eligible instructors" rule. |

---

## Table of Contents

1. [Purpose & How to Read This Document](#1-purpose--how-to-read-this-document)
2. [Research & Design Inspiration](#2-research--design-inspiration)
3. [Platform Strategy & Breakpoints](#3-platform-strategy--breakpoints)
4. [Global UI Foundations](#4-global-ui-foundations)
5. [Authentication & Onboarding — Page Requirements](#5-authentication--onboarding--page-requirements)
6. [Student Portal — Page Requirements](#6-student-portal--page-requirements)
7. [Instructor Portal — Page Requirements](#7-instructor-portal--page-requirements)
8. [Teaching Assistant Portal — Page Requirements](#8-teaching-assistant-portal--page-requirements)
9. [Admin Portal — Page Requirements](#9-admin-portal--page-requirements)
10. [Mobile App-Specific Requirements](#10-mobile-app-specific-requirements)
11. [System & Utility Screens](#11-system--utility-screens)
12. [Feature Dependency & Conditional UI Map](#12-feature-dependency--conditional-ui-map)
13. [Component-to-Page Traceability Matrix](#13-component-to-page-traceability-matrix)
14. [Glossary](#14-glossary)

---

## 1. Purpose & How to Read This Document

This document specifies eLearny's UI at three levels of resolution, the same discipline used for MediCore's UI Requirement Document, because each level answers a different question at a different stage of the build:

| Tier | Question it answers | Who reads it |
|---|---|---|
| **Operational-Level Details** | What is this screen for, who uses it, when do they arrive, what happens when they leave? Purpose, entry/exit points, data dependencies, page-level states. | Product owner, backend developer, QA |
| **Area-Level Details** | How does the screen divide into zones, and how does each zone behave across screen sizes? | Frontend developer laying out structure |
| **Individual-Element Details** | Exact component, size, color, icon, interaction behavior — referencing the Global Component Library (Section 4.3) wherever a page reuses a shared component. | Frontend developer implementing pixel-level detail |

**Repetition handling:** shared buttons, cards, badges, and layout shells are defined once in Section 4.3; each page's Individual-Element table references them by name and reserves full detail for whatever is genuinely unique to that page.

---

## 2. Research & Design Inspiration

### 2.1 What's borrowed from real LMS/EdTech platforms, and why

| Reference | What's actually borrowed | Where it applies |
|---|---|---|
| **Udemy** | Course-catalog card density (thumbnail, title, instructor, rating, price, a "bestseller"-style badge), and the category-tab browsing pattern for taming a large catalog | Student's Browse Courses (Section 6, S2) |
| **Coursera** | The structured curriculum sidebar (Module → Lesson tree) that stays visible while watching a video, and the progress-percentage ring shown per course | Student's Course Player (S3) |
| **MasterClass** | Cinematic, high-production video-player chrome — large thumbnail hero art, confident typography over dark video backgrounds — used specifically for the course *detail* page hero, not the whole app, since MediCore-style restraint still governs everything else | Student's Course Detail page (S2b) |
| **Duolingo** | Streaks/progress visualization done *tastefully* — a simple progress bar and completion percentage, not badges/confetti/mascots — this system deliberately takes only the clarity of Duolingo's progress feedback, not its gamification layer, which would feel out of place next to graded assignments and certificates that need to be taken seriously | Student's My Courses (S4), course completion state |
| **YouTube / Udemy video player** | Standard video-player conventions (scrubber, playback speed, resume-from-last-position, picture-in-picture where feasible) — a custom video player that reinvents these controls would actively hurt usability, since every user already knows this exact interaction language | Student's Course Player (S3) video sub-section |
| **Linear / Notion / Stripe Dashboard** | Dense, keyboard-first interaction for Instructor/Admin — command palette, compact tables, restrained color used only for status | Instructor's Grading Queue (I4), Curriculum Builder (I3), all of Admin (Section 9) |
| **Zomato/Swiggy/Blinkit (still relevant here too)** | Persistent bottom navigation on mobile, sticky bottom action bars for checkout-style moments, category-tab browsing — the same navigation ergonomics that applied to MediCore's Patient app apply directly to eLearny's Student app, since both are consumer-facing mobile experiences with a browse → detail → convert funnel | Student mobile navigation (Section 4.2), Course purchase checkout (S6) |

### 2.2 Where eLearny deliberately does *not* copy a pattern

- **No infinite-scroll course feed** on Browse Courses — course discovery uses explicit category/filter controls and pagination, since an LMS catalog is something a student deliberately searches, not something to be doom-scrolled
- **No leaderboards or public competitive rankings** — course ratings/reviews are public (unlike MediCore's private doctor feedback, since public reviews are core to how a Marketplace-model platform builds trust — master doc Section 7.9), but *student* performance (quiz scores, completion speed) is never shown competitively against other students, since that would work against the system's actual goal of learning over performing
- **No gamified streak-shaming** (a broken streak triggering guilt-driven notifications) — progress reminders are informational ("You have 2 lessons left in this module") not manipulative
- **Instructor/Admin/TA screens favor density over delight** — Compact-density, table-heavy, closer to Notion/Linear than to the Student app's more spacious consumer treatment

### 2.3 Broader Visual-Style Reference

| Reference | What's borrowed | Where it applies |
|---|---|---|
| **Apple Podcasts / Apple Music** (for course/content browsing) | Card-based content browsing with confident cover art, generous whitespace, soft shadows — a "glossy," premium feel for what's otherwise a catalog of dry metadata | Browse Courses (S2), Course Detail (S2b) |
| **CRED / Revolut / fintech apps** | Confident, high-contrast checkout screens | Course purchase/payment (S6) |
| **Notion / Linear / Stripe Dashboard** | Command palette as primary navigation, dense organized tables | Instructor and Admin portals throughout |
| **Explicitly rejected: glassmorphism and neumorphism** | Both reduce contrast, a poor fit for a system where a Student needs to clearly read a quiz score or an Instructor needs to clearly read a grading rubric | N/A — never used anywhere in this system |

---

## 3. Platform Strategy & Breakpoints

| Platform | Breakpoint | Primary users | Navigation shell |
|---|---|---|---|
| **Desktop web** | ≥1024px | Instructor, Teaching Assistant, Admin (all primarily desktop/workstation roles) | Fixed left sidebar + top bar |
| **Tablet web** | 640–1023px | Student (reading/watching on a tablet is common for this domain specifically), Instructor (reviewing on the go) | Collapsible sidebar (icon-only by default), top bar |
| **Mobile web** | <640px, browser | Student (very common — a large share of course-watching happens on phones) | Bottom tab bar (Student) / hamburger drawer (Instructor/TA/Admin) |
| **Mobile app** | Native or wrapped, <640px | Student (primary — offline-downloaded lessons are a genuinely valuable app-only feature here), Instructor (secondary, for grading/notifications on the move) | Bottom tab bar + native gestures (Section 10) |

**Build implication for React:** every page is built mobile-first at the component level, the same discipline as MediCore, so the codebase is ready to be wrapped into a mobile app shell without a separate rebuild.

---

## 4. Global UI Foundations

### 4.1 Design Tokens & Theming (Light + Dark)

| Token | Light mode | Dark mode | Usage |
|---|---|---|---|
| `--color-primary` | `#4F46E5` (confident indigo — distinct from MediCore's clinical blue, appropriately warmer/more energetic for an education brand) | `#818CF8` | Primary buttons, links, active nav, progress bars |
| `--color-primary-hover` | `#4338CA` | `#A5B4FC` | Hover/pressed state |
| `--color-ink` | `#0F172A` | `#F1F5F9` | Primary text |
| `--color-subtle` | `#64748B` | `#94A3B8` | Secondary/meta text |
| `--color-canvas` | `#F8FAFC` | `#0B1220` | Page background |
| `--color-surface` | `#FFFFFF` | `#141B2D` | Card/panel background |
| `--color-border` | `#E2E8F0` | `#2A3448` | Dividers, input borders |
| `--color-success` | `#16A34A` | `#4ADE80` | Completed, paid, approved, passed quiz |
| `--color-warning` | `#D97706` | `#FBBF24` | Pending, in-review, near-due-date |
| `--color-danger` | `#DC2626` | `#F87171` | Failed, rejected, overdue, refund-eligible-expiring |
| `--color-info` | `#0891B2` | `#22D3EE` | Informational banners, live/in-progress states |
| `--color-accent` (unique to eLearny) | `#EA580C` (warm orange) | `#FB923C` | Reserved specifically for "certificate earned" / course-completion celebratory moments — the *one* place this system allows itself a warmer, more celebratory color, deliberately separate from the primary indigo so a completion moment reads as genuinely special rather than just another primary-colored button |

**Typography**

| Token | Value | Usage |
|---|---|---|
| Font — UI | Inter | All interface text |
| Font — Identifiers | JetBrains Mono | Certificate verification codes, invoice numbers, coupon codes |
| Font — Course Detail Hero | A serif display face (e.g. Fraunces or Source Serif) at large sizes only | Reserved for the Course Detail page's hero title (Section 2.3's MasterClass-inspired treatment) — the one deliberate typographic flourish in the system, never used elsewhere |
| Scale | 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 48px | Fixed scale; 48px reserved for the Course Detail hero title only |

**Shape, elevation, dark-mode exception:** identical system to MediCore (6px inputs/buttons, 8px cards, 12px modals; `shadow-sm`/`md`/`lg`). One dark-mode exception specific to eLearny: the `--color-accent` completion-celebration color stays at full warmth in dark mode, the same principle as MediCore's allergy-red never dimming — a certificate-earned moment is worth protecting visually.

### 4.2 Navigation Pattern by Platform

| Platform | Pattern | Detail |
|---|---|---|
| **Desktop (≥1024px)** | Fixed left sidebar (220px, collapsible to 64px icon-only) + top bar (search, notification bell, theme toggle, user menu) | Role-specific nav items (Sections 6–9) |
| **Tablet (640–1023px)** | Icon-only sidebar by default, expandable | Same items as desktop |
| **Mobile — Student** | **Bottom tab bar**, 5 items: Home · Browse · My Courses · Live · Account | "My Courses" consolidates enrolled courses, certificates, and purchases via an in-tab segmented control, the same consolidation strategy MediCore used for its Patient "Records" tab |
| **Mobile — Instructor/TA/Admin** | Hamburger-triggered slide-over drawer | These roles have more numerous, less consumer-shaped nav items that don't compress into 5 bottom-bar icons |
| **All platforms** | Global search/command palette | Desktop/tablet: `Cmd/Ctrl+K`. Mobile: persistent search icon opening a full-screen search sheet. Student-facing search matches courses **and instructors by name** (`GET /search/courses`, `GET /search/instructors` — two distinct result sections in the same palette, not a single merged list, since a course result and an instructor result lead to different destinations). Instructor/Admin command palette matches courses/students/actions per AD8. |

### 4.3 Global Component Library

| Component | Spec |
|---|---|
| **Button** | Same variant/height system as MediCore (primary/secondary/destructive/ghost; 36px desktop / 44px mobile touch target) |
| **CourseCard** | Thumbnail (16:9), title (2-line clamp), instructor name, `RatingStars`, price or "Free" badge, a small progress bar if the viewer is already enrolled — one component covering both the catalog-browsing context and the "My Courses" context, with the progress bar conditionally rendered (Section 12's Pattern D) |
| **ProgressBar** | A slim horizontal bar, `--color-primary` fill, used on CourseCard, the Course Player's curriculum sidebar, and the Student dashboard — one consistent visual language for "how much is done" everywhere in the app |
| **VideoPlayer** | Standard scrubber, play/pause, playback-speed selector (0.5x–2x), volume, fullscreen, resume-from-last-position on load, captions-track toggle (Section 4.7 of MediCore's accessibility reasoning applies identically here) |
| **QuizForm** | Radio-button question cards, a progress indicator ("Question 3 of 10"), immediate per-question feedback withheld until final submit (all-at-once grading, not per-question), a results screen showing score/pass-fail with a `RatingStars`-style visual for score if appropriate |
| **CertificateBadge** | The `--color-accent` warm-orange treatment, a small trophy/ribbon icon (16px), used on My Courses and the Certificate detail page |
| **StatusBadge** | Same color+label lookup pattern as MediCore, covering course status, submission status, refund status, claim-equivalent (TA invitation) status |
| **DataTable** | Sortable, paginated, Compact/Comfortable density toggle, sticky header |
| **BottomActionBar** (mobile) | Sticky checkout-style bar — used on Course Purchase (S6) and Instructor's bulk-grading action (I4) |
| **BottomSheet / Modal** | Mobile uses BottomSheet, desktop uses Modal, for the same interaction — identical substitution rule to MediCore |
| **ForumThread** | A question card with student avatar, question text, upvote count, and nested reply cards below — instructor/TA replies visually distinguished with a small "Instructor" or "TA" label chip next to their name so students can tell an authoritative answer from a peer comment |
| **CommandPalette** | `Cmd/Ctrl+K` global launcher — fuzzy-matches courses/students/actions |
| **NotificationDropdown/Sheet** | Same pattern as MediCore |
| **FAB** (mobile, Student only) | Single circular button, "Continue Learning" — jumps straight back into the last-watched lesson, the single highest-value shortcut for a returning learner |
| **CouponInput** | An inline text field + "Apply" button at checkout, with live validation feedback (valid/expired/invalid states) shown inline rather than only on submit |

### 4.4 Iconography & SVG Guidelines

Same lucide-react, 1.5px stroke, consistent sizing system as MediCore (Section 4.4 of that document). eLearny-specific additions:
- **Content-type icons**: a small icon per sub-section type (play-circle for Video, file-text for Document, help-circle for Quiz, clipboard-check for Assignment) used throughout the curriculum tree, Curriculum Builder, and Grading Queue — one consistent icon-per-type mapping learned once, applied everywhere
- **Category icons**: each course Category gets a small line-icon on its browse-tab, mirroring MediCore's department-icon pattern
- **Certificate illustration**: a single flat two-tone illustration used on the certificate-earned celebratory state and the empty-state for "no certificates yet"

### 4.5 Motion & Animation Library

Same restrained, functional-only motion system as MediCore (Section 4.5 of that document — 150ms page transitions, 100ms button press, 1.5s skeleton shimmer, etc.), with one addition:
- **Certificate-earned moment**: on reaching 100% course completion, a single non-looping celebratory animation (a warm-orange badge scaling in with a brief confetti-free glow, ~600ms, never repeats) — the one place in the entire system, alongside MediCore's payment-success checkmark, where a genuinely celebratory animation is warranted, specifically because a certificate is a real achievement worth marking, not decoration for its own sake

### 4.6 Universal Page States & Touch Targets

Identical baseline to MediCore Section 4.6 (Loading/Empty/Error/Success/Permission-denied/Stale-conflict/Offline), same 44×44px minimum mobile touch target rule.

### 4.7 Print Layer

Certificates and purchase receipts share their HTML template between the on-screen `@media print` view and the generated PDF, using a serif print font, stripping app chrome — identical principle to MediCore Section 4.7, since a certificate is exactly the kind of document a student may want to print and frame.

---

## 5. Authentication & Onboarding — Page Requirements

### A1. Splash / Launch Screen (mobile app only)

**Operational-Level Details**
- Purpose: brief branded loading moment while the app checks for a valid session token
- Entry: app cold-launch
- Exit: auto-redirects to Home or Login within ~1.5s

**Area-Level & Individual-Element Details** — centered logo/wordmark (64px, fade-in over 300ms, no loop), no navigation chrome — identical pattern to MediCore A1

---

### A2. Login (Multi-Method)

**Operational-Level Details**
- Purpose: authenticate via email, username, or mobile number — same reasoning as MediCore: an Instructor logs in with a work email out of habit, a Student may remember their phone faster
- Exit points: Home → 2FA Challenge (A7, Instructor/Admin) → OTP Verification (A2b) → Register (A3) → Forgot Password (A4)
- States: default, submitting, error, locked-out (A8)

**Area-Level Details** — identical structure to MediCore A2: centered card (desktop) / full-width form (mobile), Password/OTP segmented tabs, smart identifier field

**Individual-Element Details** — same component set as MediCore A2 (segmented control, auto-detecting identifier field, show/hide password, biometric shortcut on mobile)

---

### A2b. OTP Verification

Identical pattern to MediCore A2b — 6-box auto-advancing input, masked phone number, 30-second countdown-gated resend, "Change number" link.

---

### A3. Register

**Operational-Level Details**
- Purpose: self-registration for **both** Student and Instructor roles (unlike MediCore, where only Patients self-register) — Teaching Assistant accounts are invitation-only (master doc FR39), not self-service
- A role selector **is** shown here (Student / Instructor), since eLearny's Marketplace model genuinely supports both self-registering — this is a deliberate difference from MediCore's Register page, worth calling out explicitly since it would be easy to copy MediCore's "no role selector" pattern by habit without checking whether it actually applies
- Exit: Home (Student, immediate) or a Pending Approval state (Instructor — Section 5, A11) after mobile verification via A2b
- Data dependency: `POST /auth/register`, requires ToS acceptance (master doc FR6)

**Area-Level Details**
| Zone | Behavior |
|---|---|
| Role selector | Two large tappable role cards at the top of the form (Student / Instructor), icon + label each — the first and most consequential choice, given more visual weight than a dropdown |
| Form fields | Name, email, phone, password (with strength meter), Confirm Password — identical field set regardless of role; Instructor-specific fields (bio, areas of expertise) are deferred to a post-approval profile-completion step rather than front-loaded into registration, keeping the signup form short for both roles |
| Terms acceptance | Checkbox + inline link to A10 |

---

### A3b. Email Verification (Confirmation Screen)

Identical pattern to MediCore A3b — success checkmark state or expired-link state, no form.

---

### A4. Forgot Password

Identical pattern to MediCore A4 — smart identifier field, non-committal confirmation state.

---

### A5. Reset Password

Identical pattern to MediCore A5 — new/confirm password fields, expired-token error state.

---

### A6. 2FA Setup

**Operational-Level Details**
- Purpose: activate TOTP 2FA — **mandatory for Instructor and Admin** (master doc FR59), optional for Student/Teaching Assistant
- Same QR code + manual-entry code + backup-recovery-codes pattern as MediCore A6

---

### A7. 2FA Challenge

Identical pattern to MediCore A7 — 6-box OTP input, "Use a backup code instead" link.

---

### A8. Account Locked

Identical pattern to MediCore A8 — lock icon, live countdown, "Reset your password instead" link.

---

### A9. Session Expired (Re-authentication)

**Operational-Level Details** — identical to MediCore A9, with one eLearny-specific consideration worth calling out: an Instructor mid-way through building a course curriculum (Section 7, I3) who hits a session expiry should have their in-progress curriculum edits preserved in local state exactly the same way MediCore preserves a Doctor's mid-consultation notes — the underlying principle (never lose in-progress work to a silent token expiry) applies wherever a long-form authoring flow exists, not just in healthcare

---

### A10. Terms & Privacy Viewer

Identical pattern to MediCore A10 — scrollable versioned document view, close button, no other chrome.

---

### A11. Instructor Pending Approval

**Operational-Level Details**
- Purpose: a dedicated state for a newly-registered Instructor whose account is `approved = false` (master doc FR2) — this page doesn't exist in MediCore since MediCore has no self-service staff registration, so it's a genuinely new page type for eLearny, not a reused pattern
- Entry: automatic, immediately after A3/A2b for an Instructor registration
- Exit: automatically resolves to the Instructor Home (Section 7, I1) once Admin approves (Section 9, AD2) — the Instructor doesn't need to do anything further, but should be able to check status by simply logging back in

**Area-Level Details & Elements** — centered content: a clock/hourglass icon, heading "Your account is under review", explanatory text ("Our team typically reviews new instructor applications within 1-2 business days"), and a "Complete your profile" secondary CTA that lets the Instructor fill in bio/expertise (deferred from A3) while waiting, so the waiting period isn't fully wasted time

---

## 6. Student Portal — Page Requirements

This is eLearny's most consumer-facing surface — the direct analog to MediCore's Patient portal — and gets the same full polish treatment: bottom nav, sticky checkout bars, smart defaults, glossy card treatment.

### S1. Home / Dashboard

**Operational-Level Details**
- Purpose: the student's daily landing screen — continue learning without friction
- Entry: default screen after login
- Data dependencies: `GET /students/me/enrollments` (in-progress), `GET /live-sessions/me/upcoming`, `GET /notifications/me`
- States: default (has in-progress courses), empty (new student, nothing enrolled — leads with a prominent "Browse Courses" CTA)

**Area-Level Details**
| Zone | Desktop/Tablet | Mobile |
|---|---|---|
| Header | Greeting + search icon + notification bell + avatar | Same, condensed |
| Continue Learning card | Full-width card: the single most recently-watched course, with its `ProgressBar`, thumbnail, and a large "Resume" button | Same, appears first |
| Upcoming Live Session | Shown only if the student has a booked session soon | Same, pinned near top |
| Quick Actions | Row of icon-tiles: Browse Courses, My Certificates, My Wishlist | Horizontally scrollable |
| In-Progress Courses | A row/grid of `CourseCard`s for everything currently enrolled but not complete | Horizontally scrollable row |

**Individual-Element Details**
| Element | Spec |
|---|---|
| Continue Learning card | Large thumbnail, course title, `ProgressBar`, "Resume: Lesson 4 — Intro to Hooks" subtext showing exactly where they left off |
| FAB (mobile) | The `Continue Learning` `FAB` from Section 4.3 sits bottom-right, offset above the tab bar, jumping straight into the player |

---

### S2. Browse Courses

**Operational-Level Details**
- Purpose: course discovery — the Udemy-style catalog browsing experience
- Entry: bottom-nav "Browse" tab, Home's quick-action tile
- Exit: Course Detail (S2b)
- Data dependency: `GET /courses`

**Area-Level Details**
| Zone | Desktop/Tablet | Mobile |
|---|---|---|
| Search + filter bar | Full search input + filter dropdowns (level, price, rating) inline | Search bar with a filter icon opening a `BottomSheet` |
| Category tabs | Horizontal tab strip (Development, Design, Business, etc.), each with a small icon | Same, horizontally scrollable |
| Course grid | `CourseCard` grid, 3-4 columns | Single column, full-width cards |

**Individual-Element Details**
| Element | Spec |
|---|---|
| `CourseCard` | Thumbnail, title, instructor name, `RatingStars` + review count, price (or "Free"), a small "Bestseller"-style badge if applicable — direct Udemy catalog-density borrow |

---

### S2b. Course Detail

**Operational-Level Details**
- Purpose: give the student enough to decide, then convert into purchase/enrollment — the MasterClass-inspired hero treatment (Section 2.1)
- Entry: from Browse Courses, Wishlist, or a direct link
- Exit: Purchase/Checkout (S6, paid course) or immediate enrollment (free course) → Course Player (S3)
- Data dependency: `GET /courses/{id}`

**Area-Level Details**
| Zone | Desktop/Tablet | Mobile |
|---|---|---|
| Hero | Large course thumbnail/preview-video background, the serif display font (Section 4.1) for the course title overlaid, instructor name/photo, `RatingStars` | Same, condensed height |
| Body (scrollable) | What you'll learn (checklist), full curriculum preview (collapsed section/lesson tree — locked lessons shown but not playable until enrolled), instructor bio card, reviews list | Same |
| **Sticky bottom/side CTA** | A pinned side card (desktop) or **sticky bottom bar** (mobile, matching MediCore's Doctor Profile pattern exactly) showing price and an "Enroll Now" / "Buy Now" button regardless of scroll position | Present and sticky |

**Individual-Element Details**
| Element | Spec |
|---|---|
| Curriculum preview tree | Each lesson row shows its content-type icon (Section 4.4) and duration; locked (not-yet-purchased) lessons show a small lock icon instead of a play icon |
| Wishlist icon | Outline heart → filled heart on tap, top-right of the hero |

---

### S3. Course Player

**Operational-Level Details**
- Purpose: the core learning screen — watch video, read documents, take quizzes, submit assignments
- Entry: "Resume"/"Start" from S1, S2b, or S4
- Exit: back to My Courses once the session ends; 100% completion triggers the certificate-earned celebratory state (Section 4.5)
- Data dependencies: `GET /courses/{id}` (curriculum), `PUT /subsections/{id}/complete`, `POST /quizzes/{id}/attempt`, `POST /assignments/{id}/submit`

**Area-Level Details**
| Zone | Desktop/Tablet | Mobile |
|---|---|---|
| Curriculum sidebar | Persistent left sidebar: Module → Lesson tree, each lesson showing its content-type icon, completion checkmark, and duration — collapsible | Becomes a swipe-up `BottomSheet` rather than a persistent side panel, to give the content area full width on a small screen |
| Content area | Switches by sub-section type: `VideoPlayer`, document viewer, `QuizForm`, or assignment upload form | Same, full-width |
| Forum panel | Collapsible right-side panel showing the `ForumThread` list for the current lesson | Becomes a separate tab/sheet on mobile rather than a side panel |

**Individual-Element Details**
| Element | Spec |
|---|---|
| `VideoPlayer` | Full spec per Section 4.3 — standard scrubber/speed/resume controls, never reinvented |
| `QuizForm` | Question-by-question with a "Question 3 of 10" progress indicator, all-at-once submit, results screen showing score + pass/fail with the medicine-adjacent "reference range" pattern reused here as "passing threshold: 70%, you scored 85%" |
| Assignment submission | `FileUploadDropzone`, shows due date prominently, resubmission clearly labeled as superseding (not deleting) the prior attempt (master doc FR18) |
| Completion celebration | On 100% course completion, the certificate-earned animation (Section 4.5) plays, followed by a modal: "Certificate Earned!" with a "View Certificate" button leading to S5 |

---

### S4. My Courses

**Operational-Level Details**
- Purpose: enrolled course list with progress, consolidating Courses/Certificates/Purchases via a segmented control (the same consolidation strategy as MediCore's Patient "Records" tab)
- Data dependency: `GET /students/me/enrollments`

**Area-Level Details** — segmented control: "In Progress" / "Completed" / "Certificates" / "Purchases", each showing the relevant list — `CourseCard` grid for the first two (with `ProgressBar`), `CertificateBadge` cards for Certificates, invoice-style cards for Purchases

---

### S5. My Certificates

**Operational-Level Details**
- Purpose: view/download earned certificates, each with a public verification code
- Data dependency: `GET /certificates/{id}/pdf`, `GET /certificates/verify/{code}` (public)

**Area-Level Details** — grid of `CertificateBadge` cards (warm-orange accent treatment), each showing course title, completion date, and a monospace verification code with a "copy" icon; tapping opens a detail view with "Download PDF" and "Share" actions

**Individual-Element Details**
| Element | Spec |
|---|---|
| Share action (mobile) | Triggers the native share sheet — same pattern as MediCore's prescription-PDF share, directly useful for a student posting a certificate to LinkedIn |

---

### S6. Course Purchase / Checkout

**Operational-Level Details**
- Purpose: convert — the fintech-grade checkout screen (Section 2.3)
- Entry: "Enroll Now"/"Buy Now" from S2b
- Data dependency: `POST /courses/{id}/purchase/initiate`, Razorpay Checkout, `POST /webhooks/razorpay`

**Area-Level Details**
| Zone | Behavior |
|---|---|
| Order summary | Course thumbnail + title + price |
| `CouponInput` | Inline field + "Apply" button, live validation feedback (valid → shows discounted price update immediately; expired/invalid → inline red text, not a toast) |
| Payment | Razorpay Checkout opens as a modal overlay (desktop) / full-screen flow (mobile) |

**Individual-Element Details** — post-payment success state: checkmark animation, "You're enrolled!" with a direct "Start Learning" button into S3 — converting the success moment straight into the next action rather than dropping the student back at a generic confirmation page

---

### S7. Live Sessions & Waitlist

**Operational-Level Details**
- Purpose: book instructor office-hours/live-session slots, join a waitlist if full
- Data dependency: `POST /live-sessions/{id}/book`, `POST /live-sessions/{id}/waitlist`

**Area-Level Details** — a list of available slots per enrolled course (date/time, capacity remaining), "Book" button per slot or "Join Waitlist" if full; a separate "My Bookings" tab shows confirmed sessions with the meeting link and any active waitlist position

---

### S8. Wishlist

**Operational-Level Details** — a `CourseCard` grid identical to Browse Courses, with a "price dropped" or "coupon available" badge surfaced on relevant cards (master doc FR45), and a "Remove" action per card

---

### S9. Forum / Q&A

**Operational-Level Details**
- Purpose: full-page view of a lesson's discussion thread (the Course Player's collapsible panel, expanded)
- Data dependency: `POST /subsections/{id}/forum-threads`, `POST /forum-threads/{id}/replies`

**Area-Level Details & Elements** — `ForumThread` list, most-upvoted first, "Ask a Question" input pinned at the top; Instructor/TA replies carry their role-label chip (Section 4.3)

---

### S10. Leave a Review

**Operational-Level Details**
- Purpose: post-completion rating/review submission (master doc FR32)
- Entry: prompted after course completion, or from My Courses
- Data dependency: `POST /courses/{id}/reviews`

**Area-Level Details & Elements** — a simple modal/sheet: `RatingStars` (editable, large tap targets), a text area for the written review, "Submit Review" button — deliberately short, since review-fatigue is real and this should take under 30 seconds

---

### S11. Notifications

Identical pattern to MediCore's Patient Notifications (P11) — grouped-by-day list, unread accent treatment.

---

### S12. Account & Security

Same structure as MediCore's Patient Account & Security (P12) — Profile / Security / Privacy grouped cards, theme toggle, optional 2FA, login history (`GET /auth/login-history`, paginated — IP address, device, timestamp per row), data export/deletion requests (`GET /privacy/export`, `POST /privacy/delete-account`).

---

### S13. Refund Request

**Operational-Level Details**
- Purpose: request a refund within the policy window (master doc FR36)
- Entry: from a Purchase card in My Courses (S4)
- Data dependency: `GET /refunds/payments/{paymentId}/eligibility` (pre-check, called on page load), `POST /refunds/payments/{paymentId}` (actual submission)
- The policy window (7 days since purchase by default, and under 30% course progress — both configurable server-side, not hardcoded in the frontend) is checked via the eligibility endpoint first for immediate feedback ("You're eligible for a refund until [date]" or the specific reason it's unavailable) before the actual request is submitted, so the student isn't left waiting on a server round-trip just to learn they're ineligible — the server re-derives and enforces the identical rule at submission time regardless of what the client-side check showed, since that's the real boundary

**Area-Level Details & Elements** — a short form: reason (dropdown + optional text), a clear statement of the policy window status, "Submit Request" button; on submit, transitions to a `StatusBadge`-tracked state the student can follow from My Courses

---

## 7. Instructor Portal — Page Requirements

The Instructor portal is Compact-density, closer to Notion/Linear than to the Student app's consumer polish (Section 2.1), since an Instructor building a curriculum for the tenth time needs speed and density, not delight.

### I1. Home / Dashboard

**Operational-Level Details**
- Purpose: the Instructor's daily landing screen — status at a glance
- Data dependency: `GET /admin/stats`-equivalent scoped to this Instructor's own courses

**Area-Level Details** — stat cards (Revenue This Month, Pending Grading Count, New Forum Questions, Pending Approval status if new) + a "Recent Activity" list

---

### I2. My Courses

**Operational-Level Details**
- Purpose: manage owned courses, create new ones
- Data dependency: `GET /courses?instructor=me`, `POST /courses`

**Area-Level Details** — `CourseCard` grid (reused component, Compact density) with a publish/unpublish toggle per card and an "Edit Curriculum" action leading to I3

---

### I3. Curriculum Builder

**Operational-Level Details**
- Purpose: the Instructor's core authoring tool — build the Module → Lesson tree with mixed content types
- Data dependency: `POST /courses/{id}/sections`, `POST /sections/{id}/subsections`, `POST /subsections/{id}/quiz`, `POST /subsections/{id}/assignment`

**Area-Level Details**
| Zone | Behavior |
|---|---|
| Curriculum tree | Drag-and-drop reorderable Module/Lesson list, each lesson showing its content-type icon |
| Add-content flow | Adding a lesson opens a type picker (Video/Document/Quiz/Assignment icons) **before** showing the type-specific form — never a one-size-fits-all form, the same principle as MediCore's Doctor consultation form avoiding a generic catch-all input |

**Individual-Element Details**
| Element | Spec |
|---|---|
| Quiz question editor | Inline, add/remove questions with a radio-button correct-answer selector per question, a pass-threshold percentage field at the top |
| Drag handle | A 6-dot grip icon (16px) on each row, keyboard-accessible reorder as an alternative (up/down arrow buttons appear on focus) for accessibility parity with the drag gesture |

---

### I4. Grading Queue

**Operational-Level Details**
- Purpose: grade pending assignment submissions across all owned courses
- Data dependency: `PUT /submissions/{id}/grade`

**Area-Level Details** — `DataTable`: student name, course, submission date, a "Grade" action opening a side panel (desktop) / full-screen sheet (mobile) with the submitted file preview + score/feedback form. Multi-select + a `BottomActionBar`-equivalent bulk action bar for returning several ungraded-but-flagged submissions at once (e.g. bulk "Request Resubmission")

---

### I5. Coupons

**Operational-Level Details**
- Data dependency: `POST /coupons` (course-scoped, or platform-wide if `canCreatePlatformCoupons` is true on the requesting Instructor — see AD9's Admin-side toggle at `POST /admin/instructors/{id}/coupon-eligibility?eligible=`)
- A `DataTable` of coupon codes (code in monospace, discount type/value, expiry, usage count vs. limit) with a "Create Coupon" form. The **platform-wide vs. course-scoped choice in the form is Pattern-D conditional**: the "platform-wide" radio option only renders for an Instructor whose account has been granted that permission (checked via the JWT-decoded user profile's `canCreatePlatformCoupons` flag, refreshed on login) — everyone else sees course-scoped as the only option, not a disabled platform-wide option with an explanation, since "you're not eligible" isn't something most Instructors need to be told exists to want

---

### I6. Live Sessions (Publish & Manage)

**Operational-Level Details** — a calendar/list view for publishing bookable slots (date/time/capacity), and a bookings list per slot showing which students booked or are waitlisted

---

### I7. Teaching Assistants

**Operational-Level Details**
- Purpose: invite/manage TAs scoped to specific courses
- Data dependency: `POST /courses/{id}/ta-invitations`

**Area-Level Details & Elements** — a list of active/pending TA invitations per course, each with a `StatusBadge` (Pending/Active), an "Invite TA" form (email input + course selector)

---

### I8. My Reviews

Identical pattern to MediCore's Doctor Ratings (D6) — a summary card (average `RatingStars` + count) above a list of individual **public** reviews (unlike MediCore's private feedback — eLearny reviews are public per master doc FR33, so this page is read-only visibility into what students already see publicly, not a private-only channel)

---

### I9. My Schedule & Availability

Identical structural pattern to MediCore's Doctor Schedule (D5) — weekly availability grid feeding into Live Session slot generation (I6), plus an unavailability/leave request flow (master doc FR44)

---

### I10. Account & Security

Same structure as Student's Account & Security (S12), with the same MediCore-derived rule: 2FA shown as always-on/mandatory for this role, not a disable-able toggle.

---

## 8. Teaching Assistant Portal — Page Requirements

The TA portal is intentionally the smallest in the system — a TA's permissions are scoped to specific assigned courses only (master doc FR40), and the UI should make that scope visually obvious rather than looking like a stripped-down Instructor view that's merely missing buttons.

### T1. My Assigned Courses

**Operational-Level Details & Elements** — two distinct sections, not one list: a **Pending Invitations** section (visible only when non-empty) showing courses an Instructor has invited this TA to, each with an "Accept" primary action (`GET /ta-invitations/mine`, `POST /ta-invitations/{id}/accept`) — and an **Active Courses** section below it, a simple list of the courses this TA is active on (course thumbnail, title, owning Instructor's name), which is what unlocks T2/T3 access for that course. No "create course" or other Instructor-only actions anywhere in this view, not even disabled, per the Pattern-B (hidden, not disabled) dependency rule established in MediCore Section 14. A pending invitation is functionally a blocking gate (Pattern C) on T2/T3 for that specific course — accepting it is what transitions a course from invisible-to-this-TA to fully-scoped-and-gradeable, not a cosmetic status change.

---

### T2. Grading Queue

**Operational-Level Details & Elements** — identical `DataTable` component to Instructor's I4, pre-filtered to only the TA's assigned course(s) — same UI, correctly scoped data, no visual indication of "missing" courses since they were never in scope to begin with

---

### T3. Forum

**Operational-Level Details & Elements** — identical to Student's S9 view but with reply capability, scoped to assigned courses — the TA's replies carry the same role-label chip described in Section 4.3

---

## 9. Admin Portal — Page Requirements

Densest, most desktop-committed surface in the system, matching MediCore's Admin treatment exactly in spirit.

### AD1. Operations Dashboard

**Operational-Level Details** — stat card grid (Revenue This Month, New Enrollments Today, Pending Instructor Approvals, Pending Refund Requests, Failed Deliveries) + two Recharts panels (revenue trend, enrollments by category), each card deep-linking into its detail screen — identical interaction pattern to MediCore AD1

---

### AD2. Instructor Approvals

**Operational-Level Details**
- Purpose: review and approve/reject pending Instructor registrations (the other side of A11)
- Data dependency: `GET /admin/instructors/pending`, `PUT /admin/instructors/{id}/approve`

**Area-Level Details & Elements** — a queue of pending Instructor applications, each expandable to show their submitted bio/expertise, with "Approve" (primary) and "Reject" (destructive, requires a reason) actions

---

### AD3. Refund Management

**Operational-Level Details**
- Data dependency: `GET /refunds/pending`, `POST /refunds/{id}/decide`, `GET /refunds/payments/{paymentId}/eligibility` (used by S13, not AD3 itself, but the same eligibility computation — window days + max progress % — is what AD3's row expansion is showing the Admin)
- `DataTable` of refund requests with `StatusBadge` through the lifecycle (REQUESTED→UNDER_REVIEW→APPROVED/REJECTED→SETTLED), row expansion showing the student's reason and course-progress-at-time-of-request, "Approve" triggering the Razorpay refund API call

---

### AD4. Communication Log

Identical pattern to MediCore AD4 — channel icons (email/SMS), `StatusBadge`, "Resend" on failed rows only.

---

### AD5. Compliance

**Operational-Level Details** — tabbed sub-sections: Audit Log, Consent Records, Data Requests (export/deletion queue) — identical structural pattern to MediCore AD6, minus the Patient-Record-Lookup tab (eLearny has no equivalent sensitive-record-oversight need at the same level, since course/progress data doesn't carry the same clinical weight)

---

### AD6. Reports

**Operational-Level Details**
- Data dependency, four report types each with a JSON endpoint (on-screen chart) and a matching `.csv` endpoint (export button): revenue by course (`GET /reports/revenue.csv`), enrollment trend (`GET /reports/enrollment-trend?days=`, `GET /reports/enrollment-trend.csv?days=`), top-rated courses (`GET /reports/top-rated-courses?limit=`, `GET /reports/top-rated-courses.csv?limit=`), instructor payout summary (`GET /reports/instructor-payouts`, `GET /reports/instructor-payouts.csv`)
- A report picker switching between the four, each with on-screen chart + CSV/XLSX export buttons — identical pattern to MediCore AD7

---

### AD7. User Management

**Operational-Level Details**
- Data dependency: `GET /admin/users?role=&q=&page=` (role filter optional, search across name/email), `POST /admin/users/{id}/deactivate?reason=`
- A `DataTable` of all users across all roles (Student/Instructor/TA/Admin) with search, role filter, and a deactivate action (destructive, confirmation-gated, self-deactivation blocked server-side) — the direct eLearny equivalent of MediCore's Staff Management (AD2), broadened here since eLearny's Students are also platform users an Admin may need to look up, unlike MediCore where Patients aren't Admin-managed in the same way

---

### AD8. Global Search Results

**Operational-Level Details** — identical pattern to MediCore's Patient Search (R5): result cards with matched-text highlighting, empty-results state with a relevant next action

---

### AD9. Category Management

**Operational-Level Details**
- Purpose: create and view the course categories Instructors assign courses to and Students filter Browse by (Section 6, S2's category chips) — a small, low-frequency admin task with no MediCore equivalent (MediCore has no analogous taxonomy-management need)
- Data dependency: `GET /categories`, `POST /categories`

**Area-Level Details & Elements** — a simple two-part screen: a name-input field + "Add" button, and a list/chip-grid of existing categories below it. No edit or delete action in this version — categories are additive only, since removing one that's already assigned to published courses would need a broader reassignment flow not currently in scope.

---

## 10. Mobile App-Specific Requirements

Same cross-cutting requirements as MediCore Section 12 (push notifications, biometric login, offline handling, native share sheet, pull-to-refresh, deep linking, app store considerations, force-update screen, notification permission priming) — all apply identically here. One eLearny-specific addition:

| Requirement | Detail |
|---|---|
| **Offline lesson downloads** | Unlike MediCore (where offline access is about *viewing cached data*), eLearny's mobile app has a genuinely valuable app-only feature: a Student can explicitly download a video lesson for offline viewing (a download icon on each lesson row in the Course Player's curriculum sidebar, Section 6 S3) — downloaded lessons show a small checkmark-in-cloud icon, and progress/quiz-completion made offline syncs and updates the server the next time connectivity returns, using the same "pending sync" indicator pattern described in MediCore's offline handling |

---

## 11. System & Utility Screens

Identical set to MediCore Section 13 — U1 (404), U2 (Server Error/Maintenance), U3 (Offline, full-page web), U4 (Rate-Limited banner), U5 (Help & Support), U6 (What's New/Release Notes) — same specs, same reasoning, reused directly since none of these are domain-specific. Help & Support's FAQ content (U5) is role-aware exactly as MediCore specifies, showing Student-relevant questions by default rather than Instructor curriculum-building questions.

One addition with no MediCore equivalent, since it's not a generic system screen but a specific trust-building feature of the certificate system (master doc FR28):

### U7. Certificate Verification (Public)

**Operational-Level Details**
- Purpose: lets *anyone* — not just the certificate holder — confirm a certificate is genuine. The primary audience is an employer or third party who was handed a certificate code, not a logged-in Student (who has their own copy already visible on S5); this is deliberately **not** gated behind login, and deliberately doesn't require navigating through a Student's account to reach
- Data dependency: `GET /certificates/verify/{code}` (public, unauthenticated — confirms this in `SecurityConfig`)
- Route: a standalone, unauthenticated page (e.g. `/verify`), linkable directly from a printed/PDF certificate (Section 6, S5's print layer includes this URL + the code, ideally as a QR code, next to the verification code text)

**Area-Level Details & Elements** — a single code-input field + "Verify" button. Success state shows the certified student's name, course title, and completion date in a clear, screenshot-friendly card (no other student data exposed, matching the Certificate verification code glossary definition). Failure state ("no certificate found with this code") is calm and non-alarming — an invalid/mistyped code is a common, benign case, not a security event to make a visitor feel scrutinized over.

---

## 12. Feature Dependency & Conditional UI Map

Same discipline as MediCore Section 14 — every dependency in the system gets an explicit UI pattern, not a silent backend validation the user discovers via a failed request.

### 12.1 The Four UI Patterns (same as MediCore Section 14.2)

| Pattern | When to use it |
|---|---|
| **A. Locked/disabled with an explanation** | Dependency is close to satisfied, a path to unlocking is visible |
| **B. Progressive disclosure (hidden until relevant)** | Feature is irrelevant/confusing before its dependency exists |
| **C. Blocking modal/step in a flow** | Dependency must be satisfied before proceeding |
| **D. Conditional content within a shared component** | Same component renders differently based on related state |

### 12.2 System-Wide Dependency Map

| Feature / Screen | Depends on | Pattern used | Where specified |
|---|---|---|---|
| Enrolling in a course | Payment (if paid) succeeding, OR prerequisite course completed (if one is set) | C (payment) + A (prerequisite, disabled with "Complete [Course] first" tooltip) | Section 6, S2b / master doc FR19, FR46 |
| Course Player access to a specific lesson | Enrollment existing for that course | B — the Player route simply isn't reachable without enrollment, redirects to S2b instead | Section 6, S3 |
| Certificate generation | 100% course completion | B — the certificate/celebration UI doesn't exist until triggered; no "0% certificate" placeholder state | Section 6, S3/S5 / master doc FR27 |
| Quiz sub-section marked complete | A passing attempt score | D — the same lesson row in the curriculum tree conditionally shows a checkmark vs. a retry icon based on attempt history, not two different row components | Section 6, S3 |
| Leaving a review | Course completion (100%) | B — "Leave a Review" doesn't appear on an in-progress course's card | Section 6, S4, S10 / master doc FR32 |
| Submitting a refund request | Purchase existing, within the policy window | A — the Refund action is disabled with an explanation once the window has passed, not hidden entirely, since a student should understand *why* rather than wonder where the option went | Section 6, S13 / master doc FR36 |
| TA grading/forum access | An active (accepted) TA assignment for that specific course | B — courses outside a TA's assignment never appear in T1/T2/T3 at all | Section 8 / master doc FR39-40 |
| Instructor course publishing | Instructor account `approved = true` | C — the Curriculum Builder (I3) and Publish toggle are fully blocked, with a persistent banner explaining pending-approval status, while `approved = false` | Section 5, A11 / Section 7, I2-I3 |
| Live session booking | Enrollment in the course the session belongs to | B — sessions for courses a student isn't enrolled in don't appear in their booking list | Section 6, S7 |
| Waitlist claim | A cancellation freeing capacity, within the active claim window | C, time-bound, identical mechanism to MediCore's appointment waitlist | Section 6, S7 / master doc FR89 |
| 2FA-gated actions | Account role (mandatory for Instructor/Admin) | C — blocking redirect immediately after first login | Section 5, A6/A7 |
| Coupon application at checkout | Coupon validity (not expired, under usage limit, applicable to the course in cart) | A — the "Apply" action shows inline validation, invalid coupons rejected with a clear inline reason, never silently ignored | Section 6, S6 / master doc FR35 |
| Platform-wide coupon creation (I5) | Admin having granted the requesting Instructor `canCreatePlatformCoupons` | D — the "platform-wide" option in the Create Coupon form is present or absent based on the logged-in Instructor's own permission flag, not shown-disabled | Section 7, I5 / master doc FR34 |

### 12.3 A Worked Example: the Full Dependency Chain of a Single Course Purchase-to-Certificate Journey

1. **Browsing** a course requires nothing (public) — but the "Enroll"/"Buy" action requires either the course being free, or checkout succeeding (pattern C)
2. **Applying a coupon** at checkout requires the coupon being valid (pattern A — invalid shows inline, doesn't block the rest of checkout)
3. **Payment webhook confirmation** gates the Enrollment record actually being created (pattern C — the frontend callback alone is never trusted, identical principle to MediCore's payment flow)
4. **Course Player access** requires that Enrollment existing (pattern B)
5. **Marking a lesson complete** requires it being a video/document (immediate) or a quiz passed / assignment graded (pattern D — same lesson row, conditional completion logic)
6. **Certificate generation** requires 100% completion across all lessons (pattern B — nothing certificate-related renders before this)
7. **Leaving a review** requires that same 100% completion (pattern B)
8. **Requesting a refund** requires being within the policy window, which itself is partly a function of how much progress was made in step 5 (pattern A, since more progress can *reduce* refund eligibility per master doc FR36)

Steps 5 through 8 all depend, directly or indirectly, on the same underlying progress data — which is exactly why `ProgressBar` (Section 4.3) is one shared component reused across the CourseCard, Course Player sidebar, and Student dashboard rather than three separately-implemented progress indicators that could drift out of sync with each other.

---

## 13. Component-to-Page Traceability Matrix

| Component | Used on |
|---|---|
| `CourseCard` | S2, S2b (as curriculum-adjacent card), S4, S8, I2 |
| `ProgressBar` | S1, S3 (sidebar), S4, `CourseCard` (conditional, Pattern D) |
| `VideoPlayer` | S3 |
| `QuizForm` | S3, I3 (question editor variant) |
| `CertificateBadge` | S4, S5 |
| `ForumThread` | S3 (panel), S9, T3 |
| `BottomActionBar` | S6 (checkout), I4 (bulk grading) |
| `CouponInput` | S6, I5 (creation side) |
| `CommandPalette` | Global — Instructor, TA, Admin |
| `DataTable` | I4, I5, I7, AD1-AD7, T2 |
| `FAB` | S1 (mobile, "Continue Learning") |

---

## 14. Glossary

| Term | Meaning |
|---|---|
| Operational-Level Details | Tier 1 — purpose, entry/exit points, data dependencies, states |
| Area-Level Details | Tier 2 — zone division and cross-breakpoint behavior |
| Individual-Element Details | Tier 3 — exact component/size/color/interaction spec |
| Marketplace Model | The LMS pattern where any approved Instructor can publish and any Student can enroll (master doc Section 5) |
| Progressive disclosure | Hiding a feature until its dependency is satisfied rather than showing it disabled — Pattern B, Section 12.1 |
| Dependency gate | Any point where a screen/action's availability depends on another part of the system's state |
| FEFO-equivalent | Not applicable in eLearny (this term is MediCore-specific, listed here only to note the deliberate absence — eLearny has no physical-inventory dispensing concept) |
| Certificate verification code | A public, unauthenticated lookup code proving a certificate's authenticity without exposing other student data (master doc FR28) |
