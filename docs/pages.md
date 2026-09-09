# eLearny — Pages Document (pages.md)

> Status: v0.1. This is the screen-by-screen spec that `prd.md` and
> `architecture.md` deliberately don't cover — what each page actually
> contains, not just that the feature exists. Every page below exists on
> **both** `frontend/web` and `frontend/mobile` unless marked otherwise,
> per the full-parity decisions in `memory.md`. Each entry lists: purpose,
> key components, states to handle, and which PRD section it implements.
> A page is not "done" until it handles its Empty/Loading/Error states —
> a page that only renders when everything goes right is not finished.

**How to use this doc (for the dev tool):** build one page at a time
(one checkpoint unit each, per the kickoff prompt). A page is done when
it (1) fills its actual layout — no orphaned content floating in an
unstyled container — (2) handles all states listed, and (3) matches
`design.md`'s token system and the UI/UX reference doc. Do not mark a
page complete in `memory.md` until you can show it rendering correctly,
not just that the route file exists.

---

## 1. Auth (Web + Mobile)

| Page | Purpose | Key components | States | PRD ref |
|---|---|---|---|---|
| Splash / App Loading | Mobile-only. Shown while checking stored auth token on cold start. | Logo, loading indicator | Loading → routes to Login or role dashboard | — |
| Login | Authenticate | Email/password fields, "Forgot password" link, "Create account" link, submit button | Empty, validating, submitting, error (wrong credentials), 2FA-required redirect | §2.1 |
| Register | Create account | Name/email/password fields, role selection (Student/Instructor — TA is invite-only, not self-registered), terms checkbox | Empty, validating, submitting, error (email taken) | §2.1, §2 |
| Two-Factor Setup | Enable TOTP 2FA | QR code, manual secret fallback text, 6-digit confirmation input | Loading (generating secret), verifying, error (wrong code), success | §2.1 |
| Two-Factor Challenge | Verify TOTP at login | 6-digit input, "use backup method" link if applicable | Submitting, error (wrong/expired code), rate-limited after repeated failures | §2.1, §3.18 |
| Forgot Password | Request reset | Email input | Submitting, success (check-your-email message — never confirm/deny if the email exists) | §3.18 |
| Reset Password | Set new password from emailed link | New password + confirm fields | Invalid/expired token, submitting, success | §3.18 |
| Account Locked | Shown after too many failed login attempts | Explanation, unlock path (wait timer or "contact support" link) | Static with a live countdown if time-based | §3.18 |
| Session Expired | Shown when a JWT expires mid-session | Explanation, re-login prompt (preserve what the user was doing where feasible) | Static | §3.18 |
| Terms & Privacy Viewer | Legal text | Scrollable document view | Static | §3.19 |

---

## 2. Student (Web + Mobile)

| Page | Purpose | Key components | States | PRD ref |
|---|---|---|---|---|
| Home / Dashboard | Landing page after login | Continue-learning card (last-watched lesson + resume button), progress-per-course summary, recommended courses (chatbot Tier A engine), quick links | Loading, empty (no enrollments yet — show browse CTA), populated | §3.2, §3.3 |
| Browse / Search Courses | Discovery | Search bar, filter panel (category, level, price, rating, language), course card grid, pagination | Loading, empty (no results — suggest broadening filters), populated | §3.3 |
| Course Detail | Pre-purchase info | Title, instructor (linked to their public profile), price, curriculum outline, reviews, "enroll/buy" or "continue" CTA, wishlist toggle | Loading, not-yet-enrolled vs. already-enrolled variants | §3.3, §3.11 |
| Course Player | Actual learning experience | Video player (signed URL, resume position, speed control, captions), lesson sidebar/outline, notes panel, per-lesson discussion thread, mark-complete control, next-lesson navigation | Loading, buffering, lesson-locked (drip content not yet released), completed-course state (certificate prompt) | §3.1, §3.2, §3.9 |
| Wishlist | Saved-for-later courses | Course card list, remove/enroll actions | Empty, populated | §3.11 |
| My Certificates | Earned certificates | Certificate card per completed course, download/share actions | Empty, populated | §3.5 |
| Certificate Verification (public) | Third-party validation, no login required | Certificate summary (student name, course, date), validity indicator | Valid code, invalid/not-found code | §3.5 |
| Payment History & Refund Request | Purchase records | Order list (date, amount, course), receipt download, "request refund" action per eligible order | Empty, populated, refund-already-requested state | §3.6, §3.19 |
| Notifications | In-app notification center | Notification list (enrollment, quiz results, certificate issuance, announcements), mark-read, filter by type | Empty, unread-badge state, populated | §3.8 |
| Account & Security | Profile + security settings | Name/email/avatar edit, password change, 2FA management, active-session list | Loading, saving, error | §3.18 |
| Privacy & Data | Data-control settings | Data export request, account deletion request | Static with confirmation flows | §3.19 |
| Search Results / Category Page | Landing from a category link or nav search | Same card grid as Browse, pre-filtered | Same as Browse | §3.3 |
| Course Bundle Detail | Learning-path purchase | Bundle contents (list of included courses), bundle price vs. sum of individual prices, "enroll in bundle" CTA | Loading, not-enrolled vs. enrolled | §3.11 |
| Instructor Public Profile | View an instructor's page from a course link | Bio, avg rating, total students, list of their published courses | Loading, populated | §3.11 |
| Practice & Content Hub — Article List | Public, SEO-facing | Topic filter, article card list, difficulty tags | Loading, populated | §3.13 |
| Practice & Content Hub — Article Detail | Public article/tutorial page | Article content, embedded code playground (full editing, both platforms), related articles | Loading, populated | §3.13 |
| Practice Problems List | Coding practice | Problem list by difficulty/topic, "Problem of the Day" banner, solved/unsolved indicator | Loading, empty (none solved yet), populated | §3.13 |
| Practice Problem Detail | Solve a problem | Problem statement, embedded code editor + execution sandbox, run/submit, test-case results | Loading, running, submitted (pass/fail per test case) | §3.13 |
| Chatbot | AI assistant | Chat message thread, input box, quick-suggestion chips | Idle, sending, rate-limited (graceful fallback message) | §3.15 |
| Leaderboard | Gamification | Ranked list (opt-in only), current user's position highlighted | Opted-out state, empty, populated | §3.10 |
| Referral | Growth mechanic | Referral code/link, share action, reward status | Static, reward-earned state | §3.14 |

---

## 3. Instructor (Web + Mobile — full parity, per earlier decision)

| Page | Purpose | Key components | States | PRD ref |
|---|---|---|---|---|
| Dashboard | Landing page | Draft courses, published courses, pending-approval status banner if not yet approved, quick stats | Loading, not-yet-approved (blocks course actions), populated | §2.2 |
| Course Builder — Curriculum | Build course structure | Section/lesson tree editor, drag-to-reorder, add-lesson (video/article/resource), drip-content scheduling per lesson | Loading, saving, draft vs. published-editing (versioning) | §3.1 |
| Course Builder — Quiz Builder | Build assessments | Question list editor, question-type picker (MCQ/true-false/short-answer), randomization toggle, pass-threshold setting | Saving, validation errors (e.g. no correct answer marked) | §3.4 |
| Course Builder — Pricing & Coupons | Set price and discounts | Price input, coupon list (create/edit/expire), bundle inclusion toggle | Saving | §3.6, §3.11 |
| Assignment Grading Queue | Grade submissions | Submission list (pending/graded filter), grading panel (score + feedback) | Empty (nothing pending), populated | §3.4 |
| Teaching Assistant Management | Invite/manage TAs | TA invite form (email + course selection), pending-invite list, active-TA list with per-course scope shown | Empty, invite-pending, populated | §3.17 |
| Coupons | Standalone coupon management (cross-course view) | Coupon list, usage stats | Empty, populated | §3.6 |
| My Reviews | Reviews received across courses | Review list, average rating, reply action if supported | Empty, populated | §3.3 |
| Revenue Dashboard | Earnings | Revenue-over-time chart, per-course breakdown, payout status | Loading, empty (no sales yet), populated | §3.6 |
| Reports | Course/student analytics | Enrollment trends, completion rates, quiz pass rates per course | Loading, empty, populated | §3.6 |
| Account & Security | Same as student's version | — | — | §3.18 |

---

## 4. Teaching Assistant (Web + Mobile)

| Page | Purpose | Key components | States | PRD ref |
|---|---|---|---|---|
| Dashboard | Landing page | Pending invitations (accept/decline), list of active course assignments | Empty (no invitations/assignments), populated | §3.17 |
| Course Grading & Moderation | Scoped to assigned courses only | Grading queue (same UI pattern as Instructor's, scoped), discussion moderation view | Empty, populated | §3.17, §3.9 |
| Account & Security | Same as student's version | — | — | §3.18 |

---

## 5. Admin (Web + Mobile — full parity, per earlier decision)

| Page | Purpose | Key components | States | PRD ref |
|---|---|---|---|---|
| Operations Dashboard | Landing page | Platform-wide stats (users, courses, revenue snapshot), pending-action counts (approvals, refunds, moderation) | Loading, populated | §3.7 |
| Instructor Approval Queue | Review applications | Application list, applicant details, approve/reject actions | Empty, populated | §2.2, §3.7 |
| User Management | Manage all roles | Searchable user list, role/status editing, suspend/reinstate action | Loading, populated | §3.7 |
| Category Management | Taxonomy control | Category/subcategory tree editor | Saving | §3.3, §3.7 |
| Coupon Eligibility Management | Platform-wide coupon rules | Rule list/editor (which instructors/categories a coupon type applies to) | Saving | §3.6 |
| Refund Review Queue | Process student-initiated refund requests | Request list, approve/deny actions with reason | Empty, populated | §3.6, §3.19 |
| Reports & Analytics | Platform-wide reporting | Revenue trends, growth metrics, top courses/instructors | Loading, populated | §3.7 |
| Communication Log | Debugging/support visibility | Sent-email/notification log, filter by user/type/date | Empty, populated | §3.19 |
| Audit Log | Accountability record | Admin-action log (who approved/rejected/refunded what, when) | Empty, populated | §3.19 |
| Course Moderation Queue | Approve courses before they go live | Pending-course list, review view, approve/reject | Empty, populated | §3.7 |
| Account & Security | Same as student's version | — | — | §3.18 |

---

## 6. System Pages (Web + Mobile, platform-appropriate)

| Page | Purpose | Notes |
|---|---|---|
| 404 | Route not found | Both platforms |
| Server Error / Maintenance | Backend down or in maintenance | Both platforms |
| Offline | No network connectivity | **Mobile-only** — web relies on the browser's own offline handling |
| Rate-Limited | Shown when the chatbot or another rate-limited endpoint is throttled | Both platforms — ties to §3.15's fallback-message requirement |
| Help & Support | FAQ / contact | Both platforms — §3.19 |
| What's New | Release notes | Both platforms — §3.19 |

---

## 7. Cross-Cutting Notes

- **Every list/grid page** (course browse, notifications, admin queues, etc.) needs pagination or infinite scroll — per `rules.md` §8's pagination convention — not an unbounded single fetch.
- **Every page with user-generated or fetched content** needs a genuine empty state (not just a blank screen) and a genuine error state (not just a spinner that never resolves) — this is the specific thing that was missing in the last build pass, per the live-site review.
- **Full-width, full-height layouts by default.** A page's content should fill the viewport appropriately for its content type (a dashboard uses the full width in a grid; a reading page like an article can be width-constrained for readability, but the page background/chrome still fills the screen). A page with content awkwardly floating in a small unstyled box in the corner is not acceptable output — see the UI/UX reference doc for what "fills the screen properly" looks like in practice.
- Pages not listed individually above but implied by a PRD feature (e.g. a generic "Settings" page) should be folded into "Account & Security" or the most relevant existing page rather than proliferating near-duplicate pages.

---

## Change Log
- **v0.1** — Initial page-by-page spec covering Auth, Student, Instructor,
  Teaching Assistant, Admin, and System pages for both web and mobile.
  Built from a prior project's page list plus a full audit against every
  committed `prd.md` §3.x feature to ensure nothing already committed
  (wishlist, bundles, practice hub, chatbot, gamification, referral, etc.)
  was missing a page. Includes the new Teaching Assistant role's pages and
  the new Trust/Support/Governance pages (§3.19) added in `prd.md` v0.6.
