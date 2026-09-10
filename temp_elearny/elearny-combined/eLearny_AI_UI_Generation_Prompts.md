# eLearny — AI UI Generation Prompts (Complete — All 49 Pages)
### Companion to: `eLearny_UI_Requirement_Document.md`

---

## How to Use This

Same workflow as the MediCore prompt set: AI UI generators (Stitch's own docs confirm this) perform noticeably worse when asked to generate many screens in one pass. Run the **Master Style Prompt** once first, then generate **one screen at a time**, staged in the order below (Auth → Student → Instructor → Teaching Assistant → Admin → System & Utility). Student is highest priority — it's the most visually distinctive and teaches the tool your "look" fastest. Iterate 3–5 rounds per screen rather than one-and-done.

**All 49 pages from the UI Requirement Document are covered below — nothing deferred to a "write your own" template.**

---

## 1. Master Style Prompt (run this first)

```
Design system for "eLearny" — a modern, professional online learning platform (Marketplace model, like Udemy). This should feel as polished as a premium consumer product on student-facing screens (think Udemy's catalog browsing, Coursera's course-player sidebar, MasterClass's cinematic course-detail pages, and the navigation ergonomics of apps like Zomato/Swiggy for mobile), while instructor/admin screens should feel like a dense, confident professional tool (think Linear, Notion, or Stripe Dashboard).

Platform: responsive web app, mobile-first, that will later be wrapped as a mobile app. Desktop gets a sidebar, tablet gets a collapsed icon sidebar, mobile gets a bottom tab bar (students) or a hamburger drawer (instructors/admin/TAs).

Color palette:
- Primary/brand: #4F46E5 (a confident, energetic indigo — distinct from a clinical blue, appropriate for an education brand), hover state #4338CA
- Text: #0F172A (primary), #64748B (secondary/muted)
- Backgrounds: #F8FAFC (page canvas), #FFFFFF (cards/surfaces)
- Borders: #E2E8F0
- Success/completed/paid/passed: #16A34A
- Warning/pending/in-review: #D97706
- Danger/failed/rejected/overdue: #DC2626
- Info: #0891B2
- Accent (used ONLY for certificate-earned/course-completion celebratory moments, nowhere else): #EA580C, a warm orange, deliberately distinct from the primary indigo so a completion moment feels genuinely special
Also design a dark mode variant (dark canvas ~#0B1220, dark surface ~#141B2D, text inverted) — keep the warm-orange accent at full saturation in dark mode too.

Typography: Inter for all UI text. A monospace font (like JetBrains Mono) for certificate verification codes, invoice numbers, and coupon codes. A serif display font (like Fraunces or Source Serif) reserved ONLY for the large hero title on a Course Detail page — nowhere else in the app.

Shape & elevation: 6px radius on buttons/inputs, 8px on cards, 12px on modals. Soft, restrained shadows. No glassmorphism, no neumorphism.

Icons: consistent line-icon style (Lucide/Feather), 1.5px stroke weight. Use a small distinct icon per lesson content-type throughout the app: a play-circle icon for Video lessons, a file-text icon for Document lessons, a help-circle icon for Quiz lessons, a clipboard-check icon for Assignment lessons — this icon-per-type mapping should be visually consistent everywhere it appears.

Navigation: desktop/tablet gets a fixed left sidebar + a top bar with search, notification bell, avatar. Mobile student views get a persistent bottom tab bar with 5 icon+label items: Home, Browse, My Courses, Live, Account. Mobile instructor/admin/TA views use a hamburger-triggered slide-over drawer instead.

Overall mood: trustworthy, confident, glossy/premium on student-facing catalog and course-detail screens (generous whitespace, soft shadows, cinematic hero imagery — like Apple Music or MasterClass), denser and more compact on instructor/admin tables and forms (like Notion or Stripe Dashboard). Progress is shown with a simple, tasteful progress bar in the primary indigo color — never with gamified badges, streaks, or competitive leaderboards, which would feel out of place next to graded assignments and real certificates.
```

---

## 2. Stage 1 — Authentication & Onboarding (13 screens)

**1.1 — A1: Splash / Launch Screen**
```
Generate a mobile app splash/launch screen for eLearny. Centered on the page canvas background: the eLearny logo/wordmark at 64px, vertically and horizontally centered, no other content, no navigation chrome, no visible loading spinner. Clean, minimal, confident.
```

**1.2 — A2: Login (Multi-Method)**
```
Generate a Login screen for eLearny. Centered card (max-width ~400px) on the page canvas, logo above the form. A segmented/pill toggle at the top with two options: "Password" and "OTP". Below that, a single smart input field labeled "Email, username, or mobile number" with a small icon on the left that would change based on input type. Below (Password tab active): a password field with a show/hide eye icon. Full-width primary indigo "Log In" button. Below: "Forgot password?" right-aligned, "New here? Create an account" centered at the bottom. Mobile: full-width, no card border, a small biometric icon button above the form for returning users.
```

**1.3 — A2b: OTP Verification**
```
Generate an OTP verification screen for eLearny. Centered content: a message/SMS icon at top, heading "Verify your number", subtext "We've sent a code to +91 98XXX XX234" (masked number). Below: 6 individual square input boxes (~48px each) for the code, indigo border on the focused box. Below the boxes: "Resend code in 0:28" in muted gray with a countdown look, plus a "Change number" text link. Full-width primary "Verify" button.
```

**1.4 — A3: Register (with Role Selector)**
```
Generate a Register screen for eLearny. At the top of the form, two large tappable role-selection cards side by side: "Student" and "Instructor", each with a representative icon and short description ("Learn new skills" / "Teach and earn"). Below the role selection, standard fields: Full Name, Email, Mobile Number, Password (with a strength-meter bar appearing once focused), Confirm Password. A checkbox at the bottom: "I agree to the Terms of Service and Privacy Policy" with "Terms of Service" as a clickable link. Full-width primary "Create Account" button, visually disabled until the checkbox is checked. Footer: "Already have an account? Log in".
```

**1.5 — A3b: Email Verification Confirmation**
```
Generate an email-verification confirmation screen for eLearny. Centered, no form: a large green circular checkmark icon with a subtle "drawn" feel, heading "Email Verified", subtext "Your email has been confirmed", "Continue" button. Also design the error variant: a neutral gray icon, heading "Link Expired", subtext "This link has expired — request a new one from Account & Security", "Go to Login" button.
```

**1.6 — A4: Forgot Password**
```
Generate a Forgot Password screen for eLearny, same card shell as Login. Single field "Email, username, or mobile number", autofocus, full-width primary "Send Reset Link" button. Show the post-submit state too: the form area transitions in place to a checkmark icon and the message "If that account exists, we've sent a link".
```

**1.7 — A5: Reset Password**
```
Generate a Reset Password screen for eLearny, same card shell as Login. Two fields: "New Password" and "Confirm New Password", each with a show/hide icon, password-strength meter beneath the first field. Full-width primary "Update Password" button. Also show the expired-token error state with a "Request a new link" button in place of the form.
```

**1.8 — A6: 2FA Setup**
```
Generate a Two-Factor Authentication setup screen for eLearny, for an Instructor/Admin completing mandatory security setup. Centered: heading "Set up two-factor authentication", instructional text, a QR code placeholder (200x200px), a monospace manual-entry backup code with a "copy" icon button beside it, and a 6-box OTP confirmation input below labeled "Enter the code from your app to confirm". After activation, show a secondary state: 10 backup/recovery codes in a monospace grid with a "Download codes" button and a warning "Save these somewhere safe — you won't see them again".
```

**1.9 — A7: 2FA Challenge**
```
Generate a Two-Factor Authentication challenge screen for eLearny (login step for accounts with 2FA already enabled). Centered: a shield/lock icon, heading "Enter your authentication code", the same 6-box OTP input pattern, full-width "Verify" button, and a smaller text link below: "Use a backup code instead".
```

**1.10 — A8: Account Locked**
```
Generate an Account Locked screen for eLearny. Centered: a red lock icon (24px), heading "Too many attempts", subtext "Try again in 14:32" as a live countdown in bold, and a text link "Reset your password instead". No form fields.
```

**1.11 — A9: Session Expired (Re-authentication Modal)**
```
Generate a Session Expired re-authentication overlay for eLearny — a modal dialog (desktop) on top of a dimmed/blurred background showing the previous screen. Modal content: heading "Your session has expired", subtext "Please sign in again to continue", a compact login form (identifier + password only, no method tabs or registration links), "Log In" button. Also generate the mobile variant as a bottom sheet sliding up instead of a centered modal.
```

**1.12 — A10: Terms & Privacy Viewer**
```
Generate a Terms of Service / Privacy Policy viewer screen for eLearny. Simple document-reading layout: a top bar with the document title and a close (X) icon button, and a scrollable body of formatted legal text below — no other navigation chrome.
```

**1.13 — A11: Instructor Pending Approval**
```
Generate an "Instructor Pending Approval" screen for eLearny. Centered content: a clock/hourglass icon, heading "Your account is under review", explanatory text "Our team typically reviews new instructor applications within 1-2 business days", and a secondary button "Complete your profile" below it — letting the instructor fill in their bio/expertise while they wait rather than leaving them with nothing to do.
```

---

## 3. Stage 2 — Student Portal (14 screens, highest priority)

**2.1 — S1: Home / Dashboard**
```
Generate a mobile Home screen for a Student in eLearny, styled like a well-designed consumer app. Top: greeting header "Good morning, Aayan" with a search icon and notification bell on the right. Below: a full-width "Continue Learning" card — large course thumbnail, course title, a thin indigo progress bar, and subtext "Resume: Lesson 4 — Intro to Hooks", with a large "Resume" button. Below that: an upcoming live session card if applicable (date/time, instructor, "Join" button). Below that: a horizontally-scrollable row of icon-tiles — "Browse Courses", "My Certificates", "My Wishlist". Below that: a horizontally-scrollable row of course cards showing other in-progress courses, each with a small progress bar. Bottom: a persistent 5-icon tab bar — Home (active), Browse, My Courses, Live, Account. Include a small circular floating "Continue Learning" button in the bottom-right corner, offset above the tab bar.
```

**2.2 — S2: Browse Courses**
```
Generate a Browse Courses catalog screen for eLearny, styled like Udemy's course catalog. Top: a search bar with a filter icon (opens a bottom sheet on mobile). Below: a horizontally-scrollable row of category tabs (Development, Design, Business, Marketing, etc.), each with a small icon. Below: a grid of course cards (single column mobile, 3-4 columns desktop) — each card shows a 16:9 thumbnail, course title (2-line max), instructor name, a 5-star rating with review count like "4.8 (2,340)", price or a "Free" badge, and a small "Bestseller" badge on some cards.
```

**2.3 — S2b: Course Detail**
```
Generate a Course Detail page for eLearny, styled with cinematic, premium production quality like a MasterClass course page. Hero section: a large course thumbnail/preview image as a background, with the course title in a large serif display font overlaid on top, instructor name and photo, and a 5-star rating below. Below the hero: a "What you'll learn" checklist section, a collapsed curriculum preview (Module/Lesson tree, each lesson showing its content-type icon and duration — locked lessons show a lock icon instead of play), an instructor bio card, and a reviews list. On mobile, include a STICKY bottom bar fixed to the viewport showing the price and a primary "Enroll Now" button regardless of scroll position. On desktop, show a pinned side card instead with the same price/button, plus a wishlist heart icon in the hero's top-right corner.
```

**2.4 — S3: Course Player**
```
Generate a Course Player screen for eLearny, styled like Coursera's learning interface. Left side: a persistent curriculum sidebar showing a Module → Lesson tree, each lesson row with its content-type icon (play/document/quiz/assignment), a small completion checkmark if done, and duration text — collapsible. Center: the main content area showing a video player with standard controls (scrubber, play/pause, playback speed selector, volume, fullscreen). Right side: a collapsible forum panel showing a short list of Q&A threads for the current lesson, with an "Ask a Question" input at the top. On mobile, the curriculum sidebar becomes a swipe-up bottom sheet instead of a persistent panel, and the forum becomes a separate tab.
```

**2.5 — S3 (Quiz variant): Quiz-in-Progress**
```
Generate the quiz-taking state of eLearny's Course Player content area (same page shell as the video player, just a different content type). Top: a progress indicator "Question 3 of 10" with a thin progress bar. Center: a question card with the question text and 4 radio-button answer options below it. Bottom: "Previous" and "Next" navigation buttons, with a "Submit Quiz" button appearing on the final question. Also generate the results screen: a large score display like "85%", a "Passed!" heading in green with a checkmark icon (or "Not Passed — Try Again" in amber if below threshold), a subtext "Passing threshold: 70%", and a "Continue" or "Retry Quiz" button.
```

**2.6 — S4: My Courses**
```
Generate a "My Courses" screen for eLearny. Top: a segmented control with 4 options: "In Progress", "Completed", "Certificates", "Purchases". Show the "In Progress" tab active: a grid of course cards, each with a thumbnail, title, and a progress bar with percentage text. Completed tab would show similar cards with a small orange "Certificate Earned" badge instead of a progress bar and a "Leave a Review" button if not yet reviewed.
```

**2.7 — S5: My Certificates**
```
Generate a Certificates screen for eLearny. A grid of certificate cards, each with a warm-orange accent border/badge, a small trophy/ribbon icon, course title, completion date, and a monospace verification code with a small "copy" icon next to it. Tapping a card opens a detail view showing a larger certificate preview image, "Download PDF" button, and a "Share" button.
```

**2.8 — S6: Course Purchase / Checkout**
```
Generate a course checkout/payment screen for eLearny, styled with the confidence of a modern fintech app (like CRED or Revolut). Show: an order summary (course thumbnail, title, price), a coupon code input field with an "Apply" button showing live validation feedback (a green checkmark and updated discounted price if valid, red inline text if invalid/expired), a divider, then a bold total amount, and a large primary "Pay ₹1,999" button. Also generate the payment SUCCESS state: a large green circular checkmark with a subtle draw-in feel, "You're Enrolled!" heading, and a prominent "Start Learning" button that leads directly into the course.
```

**2.9 — S7: Live Sessions & Waitlist**
```
Generate a Live Sessions screen for eLearny. Two tabs: "Available Slots" and "My Bookings". Available Slots tab: a list of session cards (instructor name, course, date/time, seats remaining) with a "Book" button, or a "Join Waitlist" button styled slightly differently (outlined instead of filled) on full sessions. My Bookings tab: confirmed session cards showing the meeting link and date/time, plus any waitlisted sessions showing a queue position like "You're #2 on the waitlist".
```

**2.10 — S8: Wishlist**
```
Generate a Wishlist screen for eLearny — a grid of course cards identical in style to the Browse Courses screen, with a small badge on some cards reading "Price Dropped" or "Coupon Available" in the warning-amber color, and a small "Remove" (X) icon in the corner of each card.
```

**2.11 — S9: Forum / Q&A**
```
Generate a full-page Forum/Q&A screen for a lesson in eLearny. An "Ask a Question" input pinned at the top. Below: a list of question threads sorted by upvotes, each showing the student's avatar, question text, an upvote count with an up-arrow icon, and nested reply cards below — instructor and TA replies show a small colored "Instructor" or "TA" label chip next to their name to distinguish them from peer replies.
```

**2.12 — S10: Leave a Review**
```
Generate a "Leave a Review" modal/bottom-sheet for eLearny, shown after a student completes a course. Content: heading "How was [Course Name]?", a large editable 5-star rating input, a text area for a written review, and a "Submit Review" button. Keep this short and focused — no other content on the screen.
```

**2.13 — S11 & S12: Notifications and Account & Security**
```
Generate two related screens for eLearny's Student app:
(1) Notifications — a full-page list grouped by day (Today, Yesterday, etc.), unread items with a left indigo accent bar and subtle background tint, read items plain.
(2) Account & Security — grouped settings cards with headers "Profile" (name/email/phone rows with edit icons), "Security" (a Light/Dark/System segmented theme toggle, "Change Password" row, "Two-Factor Authentication" row with a toggle switch, "Log out of all devices" row in red/destructive styling), and "Privacy" (a "Download my data" row and a separately-styled "Delete my account" row, visually distinct from each other).
```

**2.14 — S13: Refund Request**
```
Generate a Refund Request screen for eLearny. Top: a status banner showing refund eligibility, either green "You're eligible for a refund until March 15" or red "This purchase is no longer eligible for refund" depending on the policy window. Below (if eligible): a reason dropdown, an optional text area for details, and a "Submit Request" button. Also show the post-submission state: a status badge tracker showing "Requested → Under Review → Approved/Rejected → Settled" with the current stage highlighted.
```

---

## 4. Stage 3 — Instructor Portal (10 screens)

**3.1 — I1: Home / Dashboard**
```
Generate an Instructor dashboard for eLearny, desktop layout with a left sidebar (My Courses, Grading Queue, Coupons, Live Sessions, Teaching Assistants, Reviews) and a top bar. Main content: a row of stat cards — "Revenue This Month", "Pending Grading", "New Forum Questions", each with a large number and small trend indicator. Below: a "Recent Activity" list showing recent enrollments, reviews, and forum questions.
```

**3.2 — I2: My Courses**
```
Generate an Instructor's "My Courses" management screen for eLearny. A grid of course cards (denser/more compact styling than the Student-facing version), each showing thumbnail, title, enrollment count, revenue, a Published/Draft status badge, and a publish/unpublish toggle switch. A prominent "+ Create New Course" button/card at the start of the grid.
```

**3.3 — I3: Curriculum Builder**
```
Generate a Curriculum Builder screen for eLearny — an Instructor's course-authoring tool. Left or top: a drag-and-drop reorderable list of Modules, each expandable to show its Lessons, each lesson row showing a small content-type icon (video/document/quiz/assignment) and a 6-dot drag-handle icon on the left. An "+ Add Lesson" button opens a small type-picker with 4 icon options (Video/Document/Quiz/Assignment) before showing the type-specific form. Show the Quiz-creation form as an example: a pass-threshold percentage field at the top, and below it a list of question cards each with a text field for the question and 4 answer options with a radio button to mark the correct one, plus a "+ Add Question" button.
```

**3.4 — I4: Grading Queue**
```
Generate a Grading Queue screen for eLearny Instructor. A data table: student name, course name, submission date, and a "Grade" button per row. Include checkboxes on each row; when multiple are selected, animate in a sticky bottom bar reading "3 selected · Request Resubmission" with a button. Also show the grading side-panel/detail view: the submitted file preview on the left, and a form on the right with a numeric score input and a text area for feedback, with a "Submit Grade" button.
```

**3.5 — I5: Coupons**
```
Generate a Coupons management screen for eLearny Instructor. A data table: coupon code (monospace font), discount (e.g. "20% off" or "₹500 off"), expiry date, usage ("45 / 100 used"). A "+ Create Coupon" button opens a form: code input, discount type toggle (Percentage / Flat Amount), discount value, expiry date picker, usage limit number field, and a course selector.
```

**3.6 — I6: Live Sessions (Publish & Manage)**
```
Generate a Live Sessions management screen for an eLearny Instructor. A calendar or list view for creating new bookable slots (date/time picker + capacity number field + "Publish Slot" button). Below, a list of published slots each showing date/time, capacity ("3/5 booked"), and an expandable list of which students booked or are waitlisted for that slot.
```

**3.7 — I7: Teaching Assistants**
```
Generate a Teaching Assistants management screen for eLearny Instructor. A list of TA invitations per course, each showing the TA's name/email, which course they're assigned to, and a status badge (Pending amber / Active green). An "+ Invite TA" button opens a small form: email input + course selector dropdown.
```

**3.8 — I8: My Reviews**
```
Generate a Reviews screen for eLearny Instructor. Top: a summary card with a large average star rating and total review count, per course if the instructor has multiple courses (a small course selector dropdown). Below: a list of individual public review cards, each with a star rating, the student's name, and their written review — read-only, no reply action.
```

**3.9 — I9: My Schedule & Availability**
```
Generate a Schedule & Availability screen for eLearny Instructor. A weekly grid at the top: days as columns, time blocks as rows, filled/colored cells indicating availability (click-to-toggle). Below: a "Leave Requests" section with a compact form (date range + reason + submit) and a list of past/pending leave requests with status pills.
```

**3.10 — I10: Account & Security**
```
Generate an Account & Security screen for an eLearny Instructor — same structure as the Student's version (Profile / Security / Privacy grouped cards) but the "Two-Factor Authentication" row shows as always-on/mandatory (a locked-on indicator, not a toggle that could imply it can be disabled), with small text underneath: "Required for your role".
```

---

## 5. Stage 4 — Teaching Assistant Portal (3 screens)

**4.1 — T1: My Assigned Courses**
```
Generate a "My Assigned Courses" screen for an eLearny Teaching Assistant, with two sections. First, a "Pending Invitations" section (only shown when non-empty) — cards for courses an Instructor has invited this TA to, each with a course title, inviting instructor's name, and a primary "Accept Invitation" button. Second, an "Active Courses" section below it — simple cards for courses the TA is already active on: thumbnail, course title, owning instructor's name. No "create course" button or any other instructor-only actions anywhere on this screen, not even in a disabled state.
```

**4.2 — T2: Grading Queue**
```
Generate a Grading Queue screen for an eLearny Teaching Assistant — visually identical to the Instructor's Grading Queue (same data table, same side-panel grading form), but pre-filtered to only show submissions from the TA's assigned course(s).
```

**4.3 — T3: Forum**
```
Generate a Forum screen for an eLearny Teaching Assistant — identical to the Student-facing Forum view but with reply capability, scoped to the TA's assigned courses. The TA's own replies show a small "TA" label chip next to their name in the thread.
```

---

## 6. Stage 5 — Admin Portal (8 screens)

**5.1 — AD1: Operations Dashboard**
```
Generate an Admin operations dashboard for eLearny, styled like a professional SaaS analytics dashboard (Stripe Dashboard / Linear quality). Top: a grid of stat cards — "Revenue This Month", "New Enrollments Today", "Pending Instructor Approvals", "Pending Refund Requests", "Failed Deliveries" — each with a large number and a small colored trend arrow. Below: two chart panels side by side, a bar chart "Revenue by Category" and a line chart "Enrollment Trend (30 days)", using only the app's indigo primary color and muted grays.
```

**5.2 — AD2: Instructor Approvals**
```
Generate an Instructor Approvals screen for eLearny Admin. A queue of pending instructor application cards, each expandable to show their submitted bio and areas of expertise, with a primary "Approve" button and a destructive "Reject" button (which opens a small reason-required text field before confirming).
```

**5.3 — AD3: Refund Management**
```
Generate a Refund Management screen for eLearny Admin. A data table of refund requests: student name, course, amount, a five-stage status badge (Requested gray → Under Review amber → Approved green/Rejected red → Settled blue), and request date. Each row expands to show the student's stated reason and their course-progress percentage at time of request, with an "Approve" / "Reject" action pair.
```

**5.4 — AD4: Communication Log**
```
Generate an Admin communication log screen for eLearny. A data table: recipient name, a small channel icon (envelope for email, message bubble for SMS), event type text, a status badge (Sent green / Failed red / Retrying amber with a looping-arrow icon), timestamp, and a "Resend" button visible only on failed rows.
```

**5.5 — AD5: Compliance**
```
Generate an Admin Compliance screen for eLearny. Tabs at top: "Audit Log", "Consent Records", "Data Requests". Show the Audit Log tab active: a dense, deliberately plain data table (Timestamp in monospace, User, Action, Entity), filterable by a date range and user dropdown above the table.
```

**5.6 — AD6: Reports**
```
Generate an Admin Reports screen for eLearny. A left-hand list of report types (Revenue by Category, Enrollment Trend, Top-Rated Courses, Instructor Payout Summary), each with a small chart-type icon. The selected report shows on the right: a chart/table rendering with two export buttons above it — "Export CSV" and "Export XLSX", each with a small file-type icon on the button.
```

**5.7 — AD7: User Management**
```
Generate a User Management screen for eLearny Admin. A data table of all users across roles: name, role (badge with a role-specific icon — graduation cap for Student, presentation-screen for Instructor, headset for TA, shield for Admin), join date, active-status toggle, and a search bar plus role-filter dropdown above the table.
```

**5.8 — AD8: Global Search Results**
```
Generate a global search results screen for eLearny Admin. A search bar at top with the query visible. Below: a vertical list of result cards mixing users and courses, each showing an avatar/thumbnail, name/title (with the matched search text bolded), a type label ("Student", "Instructor", "Course"), and relevant meta info. An empty-results state shows a "no results found" illustration.
```

**5.9 — AD9: Category Management**
```
Generate a Category Management screen for eLearny Admin. Simple and minimal: a text input with an "Add Category" button at top, and below it a wrapped grid of existing category chips/tags (name only, no edit or delete action on this version — categories are additive only).
```

---

## 7. Stage 6 — System & Utility (1 screen)

U1–U6 (404, Server Error, Offline, Rate-Limited, Help & Support, What's New) are identical to MediCore's equivalents — reuse those directly rather than regenerating them. The one exception, with no MediCore equivalent, is the public certificate verification page:

**6.1 — U7: Certificate Verification (Public)**
```
Generate a standalone, unauthenticated "Verify a Certificate" page for eLearny — no navbar/sidebar chrome from the logged-in app, just a minimal centered layout suitable for someone arriving from a QR code on a printed certificate. A single code-input field (placeholder like "ELN-CERT-XXXXXXXX") and a "Verify" button. Success state: a clean, screenshot-friendly card showing the certified student's name, course title, and completion date with a green checkmark. Failure state: a calm, non-alarming "No certificate found with this code" message — this is a common, benign case (mistyped code), not a security event.
```

---

## Coverage Checklist

All 49 pages from `eLearny_UI_Requirement_Document.md` are represented above:
- **Auth (13):** A1, A2, A2b, A3, A3b, A4, A5, A6, A7, A8, A9, A10, A11 ✓
- **Student (14):** S1, S2, S2b, S3 (+ quiz variant), S4, S5, S6, S7, S8, S9, S10, S11, S12, S13 ✓
- **Instructor (10):** I1–I10 ✓
- **Teaching Assistant (3):** T1–T3 ✓
- **Admin (9):** AD1–AD9 ✓
- **System & Utility (1 of 7):** U7 ✓ (U1–U6 reused directly from MediCore, no fresh prompt needed)

Every prompt is fully written out — nothing deferred to a template.
