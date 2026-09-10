# eLearny — Testing Guide (Plain English)

This walks you through testing the whole system, step by step, from "does it even start" up to
the trickier features. No jargon assumed — if a term needs explaining, it's explained.

---

## 0. Before you start: get MySQL running

This needs a real MySQL server running on your machine first — no Docker, nothing in-memory.

- If you don't already have MySQL installed, install MySQL Community Server (or use whatever
  local MySQL setup you already have — XAMPP, Homebrew's `mysql`, etc.).
- Make sure the MySQL service is actually **running** (not just installed) before moving to step 1.
- You don't need to create a database by hand — the app creates `elearny_dev` automatically the
  first time it connects, as long as the server itself is reachable.
- Default connection assumes username `root` with no password. If your local MySQL has a
  different username/password, either edit `src/main/resources/application-dev.yml` before
  running, or set `DB_USERNAME` / `DB_PASSWORD` (and `DB_HOST` / `DB_PORT` if needed) as
  environment variables before starting the app in IntelliJ (Run Configuration → Environment variables).

## 1. Starting the app

1. Open this folder in IntelliJ (**File → Open**, pick the folder with `pom.xml` in it).
2. Wait for IntelliJ to finish downloading dependencies (bottom-right progress bar). First time
   only — needs internet access.
3. Open `src/main/java/com/elearny/ElearnyApplication.java`, click the green ▶ button next to
   `public static void main`.
4. Watch the console (the black text area at the bottom). Once it's ready, you'll see a big box
   like this:

```
========================================================================
  eLearny started successfully!
========================================================================
  App:            http://localhost:8080
  Swagger / API:  http://localhost:8080/swagger-ui.html
  Database:       MySQL at localhost:3306/elearny_dev (user: root)
------------------------------------------------------------------------
  Test accounts (see TESTING_GUIDE.md for full scenarios):
    Admin       admin@elearny.com          / Admin@123
    ...
========================================================================
```

**That box appearing is your confirmation the system is running.** Open **http://localhost:8080**
in your browser — that's the actual app, both frontend and backend, on the one address.

If nothing shows up after a minute or two, check the "Troubleshooting" section at the bottom.

---

## 2. Test accounts (already created for you — no sign-up needed)

The app seeds these automatically every time it starts (only in this dev setup — never on a real
deployment). You don't need to register anything to start testing.

| Role | Email | Password | Notes |
|---|---|---|---|
| Admin | `admin@elearny.com` | `Admin@123` | Full control panel access |
| Instructor | `instructor@elearny.com` | `Instructor@123` | Already approved, owns the sample courses |
| Instructor (unapproved) | `pending.instructor@elearny.com` | `Instructor@123` | For testing the approval flow |
| Student | `student@elearny.com` | `Student@123` | Already enrolled in one course |
| Student 2 | `student2@elearny.com` | `Student@123` | Already bought a paid course, has a refund request pending |
| Teaching Assistant | `ta@elearny.com` | `Ta@12345` | Has one pending invitation waiting to be accepted |

**Important:** the Admin and Instructor accounts will ask you to set up two-factor
authentication (2FA) the *first* time you log in — this is a real security feature, not a bug.
When it happens: you'll see a QR code on screen. Open any authenticator app on your phone
(Google Authenticator, Authy, Microsoft Authenticator — any of them work), scan the code, then
type the 6-digit number it shows you into the box on screen. After that one-time setup, future
logins will ask for a fresh 6-digit code each time.

Student accounts don't require this — they can just log in directly.

---

## 3. Sample data already in the system

So you're not testing against an empty app:

- **3 courses**, all by the Instructor account: a free "Web Development Bootcamp" (with a video,
  a document, a quiz, and an assignment already inside it), a paid "Data Science with Python"
  (₹999), and a paid "Advanced Web Development" that *requires* you finish the Bootcamp first
  (this tests the prerequisite feature).
- Student 1 is already enrolled in the Bootcamp and has completed the first lesson.
- Student 2 already "bought" the Data Science course and has an open refund request waiting for
  an Admin to review.
- Two coupon codes: `WELCOME10` (10% off anything) and `PYTHON20` (₹200 off the Data Science course).
- A pending Teaching Assistant invitation for the `ta@elearny.com` account.
- A live session scheduled two days from now for the Bootcamp.

---

## 4. Basic scenarios (start here)

**Scenario 1 — Browse without logging in**
Go to http://localhost:8080 → click "Browse courses" → you should see all 3 sample courses. Click
into one, read the description, scroll to see the curriculum list and reviews.

**Scenario 2 — Register a brand-new student account**
Click "Sign up" → fill the form → pick "Learn (Student)" → accept the Terms of Service checkbox
→ create the account → log in with it. You should land on an empty student dashboard ("No courses yet").

**Scenario 3 — Enroll in the free course and watch a lesson**
Log in as `student@elearny.com`. Go to Browse → open "Complete Web Development Bootcamp" → since
you're already enrolled, click "Go to course". You'll see the lesson list on the left (a small
ring showing your progress) — click a video lesson, then click "Mark as complete" underneath it.
Watch the ring/percentage update.

**Scenario 4 — Take the quiz**
Still inside that course, click the "HTML Basics Quiz" lesson. Answer the 3 questions, submit.
You'll see your score and whether you passed (60% is the pass mark). Try submitting again with
different (wrong) answers to see the fail state too.

**Scenario 5 — Submit an assignment**
Click the "Project: Build a Landing Page" lesson. Paste any link (e.g.
`https://github.com/example/landing-page`) into the box and submit. You'll see a confirmation.

---

## 5. Intermediate scenarios

**Scenario 6 — Leave a review**
On a course you're enrolled in, scroll to the bottom of the course detail page (not the player —
the page you land on from Browse), pick a star rating, write a comment, post it.

**Scenario 7 — Wishlist**
Open a course you're *not* enrolled in, click "Add to wishlist". Check the heart icon in the top
navigation bar — your saved course should show there.

**Scenario 8 — Grade an assignment (switch accounts)**
Log out, log in as `instructor@elearny.com` (remember: 2FA setup on first login). Go to
"Instructor dashboard" → open the Bootcamp course → find the "Project: Build a Landing Page"
lesson → expand it → click the "Grade submissions" tab. You should see the submission the
student made in Scenario 5. Give it a grade and some feedback, save it.

**Scenario 9 — Ask and answer a forum question**
As the student, open any lesson in the course player, click "Discussion" at the top, post a
question. Then switch to the instructor account, open the same lesson's discussion, and reply.

**Scenario 10 — Apply a coupon**
As a student, go to the paid "Data Science with Python" course, click "Buy now" — this creates a
payment order (it won't fully charge you without real payment gateway keys configured, and that's
expected — the point is confirming the order gets created without errors).

---

## 6. Advanced scenarios

**Scenario 11 — Accept a Teaching Assistant invitation**
Log in as `ta@elearny.com`. You'll land on the TA dashboard showing a pending invitation for the
Bootcamp course. Click "Accept invitation". It should move into "Your courses" — click into it to
see the assignment grading and discussion-moderation view a TA gets.

**Scenario 12 — Approve a new instructor**
Log in as `admin@elearny.com` (2FA setup on first login). On the Admin dashboard, scroll to
"Pending instructor approvals" — you'll see `pending.instructor@elearny.com` waiting. Click
Approve. Then log in as that account and confirm you can now create a course.

**Scenario 13 — Review a refund request**
As Admin, click "Refund requests" at the top of the dashboard. You'll see Student 2's request for
the Data Science course. Approve or reject it — approving should revoke their access to that course.

**Scenario 13b — Test the refund policy window**
Refunds are only allowed within 7 days of purchase AND while course progress is under 30%
(configurable via `REFUND_WINDOW_DAYS` / `REFUND_MAX_PROGRESS_PERCENT` env vars). As Student 2,
try requesting a refund on a course you've made significant progress in, or wait past the window
on a different purchase — you should get a clear reason why it's not eligible rather than a generic
error. The seeded refund request (Scenario 13) is intentionally fresh and progress-free so it
passes both checks by default.

**Scenario 14 — Book a live session, then test the waitlist**
As a student enrolled in the Bootcamp, open the course player, click "Live sessions" at the top,
book the upcoming slot. Log in as a *second* enrolled student (or enroll `student2@elearny.com`
into the Bootcamp first) and try booking the same slot after it's full (capacity is 2) — you
should be offered "Join waitlist" instead.

**Scenario 15 — Finish a course and get a certificate**
As the student, go back into the Bootcamp course player and mark every remaining lesson (video,
quiz already passed, assignment already submitted — note: assignments count once *graded*, so
make sure Scenario 8 is done first) as complete. Once you hit 100%, a certificate is generated in
the background — check "Certificates" from your account menu after a few seconds. Download it,
then open http://localhost:8080/verify and paste in the certificate code shown to confirm the
public verification page works too.

**Scenario 16 — Export or delete your data**
As any logged-in user, open the account menu → "Privacy & data". Try "Export my data" (downloads
a JSON file of your profile/enrollments/payments). The "Delete my account" button is real and
permanent, so only test that one if you don't mind losing that test account — you can always
restart the app to get a fresh one back.

**Scenario 17 — Instructor marks themselves unavailable, then a live session conflict**
As the instructor, go to "Mark unavailable" on the dashboard, pick a date range. Then try
scheduling a new live session that overlaps that range — it should be rejected.

---

## 7. Troubleshooting

- **Nothing happens after clicking Run** — check the console for red text. If it's about a
  missing dependency, IntelliJ is probably still downloading them; wait a bit and try again.
- **"Port 8080 already in use"** — something else on your computer is using that port. Either
  close that other program, or change `server.port` in
  `src/main/resources/application.yml` to something like `8081` and use that in the URL instead.
- **The 2FA QR code won't scan** — you can also type the "secret" text shown next to the QR code
  directly into your authenticator app's "enter code manually" option.
- **A page looks broken after refreshing (like the URL is right but you see an error)** — this
  should not happen in the combined project (that's specifically what `SpaForwardingConfig`
  fixes), but if it does, going back to http://localhost:8080 and clicking through normally is
  the workaround while it gets looked at.
- **Test accounts/sample courses don't come back after you've changed or deleted them** —
  expected. Unlike the old in-memory setup, MySQL persists data between runs now, and the seeder
  only runs against an empty database. If you want a clean slate with fresh seed data again, drop
  the database (`DROP DATABASE elearny_dev;` in a MySQL client, or delete it via whatever MySQL
  GUI you use) and restart the app.
- **"Connection refused" / "Communications link failure" on startup** — MySQL isn't running, or
  isn't running on the port the app expects. Start your local MySQL server, or adjust `DB_PORT`
  if it's not on the default 3306.
