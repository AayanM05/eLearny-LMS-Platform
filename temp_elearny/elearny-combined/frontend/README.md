# eLearny — Frontend (React)

A Udemy-style SPA for the eLearny LMS, built with Vite + React 19 + React Router 7 + Tailwind CSS v4.
Talks to the Spring Boot backend in `elearny-backend.zip` — same API contract, nothing to translate.

## Running it

```bash
npm install
npm run dev
```

By default the API client points at `http://localhost:8080/api` (the backend's default port).
Override with a `.env` file if needed:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

```bash
npm run build     # production build — verified clean in this environment (see below)
npm run lint       # oxlint
```

## What's in here

```
src/
  api/          One module per backend domain (auth, courses, enrollment, quizzes, forum, admin...)
  context/      AuthContext — login/2FA/register/logout, token persistence
  components/   Shared UI: Navbar, Footer, Button, ProgressRing (signature element), CourseCard,
                Toast, FormField/TextInput/TextArea/Select, ProtectedRoute, Layout
  pages/
    auth/       Login, Register, 2FA challenge, forgot/reset password
    course/     Browse, course detail, course player (video/doc/quiz/assignment + forum)
    student/    Dashboard, wishlist, certificates
    instructor/ Dashboard, course builder (curriculum + quiz + assignment editors)
    admin/      Dashboard, instructor approvals
    misc/       Certificate verification (public), notifications, security/2FA settings, 404
```

## Design system

- **Color**: violet (`#5B3FD6`) as the primary brand color — deliberately the same violet used in
  the backend's certificate PDF template, so a certificate someone downloads still looks like it
  came from the same product as the site they browsed on.
- **Type**: Sora (display/headings), Inter (body), JetBrains Mono (stats, prices, certificate
  codes — anywhere a number or code needs to look precise rather than editorial).
- **Signature element — the progress ring**: a circular completion indicator reused everywhere
  progress matters: course cards, the course player sidebar, the hero. One visual language for
  "how far through this are you," rather than a different progress bar style per page.
- **Signature element — the learning-path spine**: the course player's lesson list and the
  curriculum accordion use a connected vertical line through lessons (`.spine-node` in
  `index.css`) instead of a plain list, reinforcing that a course is a path, not just a folder of files.

## This was verified, unlike the backend

Unlike the Spring Boot backend (blocked from Maven Central in the build sandbox), **this
environment does have npm registry access**, so:
- `npm install` actually completed
- `npm run build` actually succeeded (production bundle: ~362KB JS / ~31KB CSS, gzip ~110KB/~7KB)
- `oxlint` ran clean — zero errors, two stylistic warnings (both from the standard
  "context file exports a hook" pattern, which is fine)

## Real gaps found and fixed while wiring this up

Building the frontend against the actual backend surfaced a few backend bugs I went back and
fixed (documented here rather than glossed over):

1. **`CourseResponse` never populated `sections`** — the course detail/player pages would have
   shown an empty curriculum forever. Fixed: `CourseService.getDetail()` now eagerly builds the
   full section→subsection tree.
2. **`open-in-view: false` + entity-returning endpoints** — several controllers return JPA
   entities directly (`Quiz`, `Assignment`, `Enrollment`, etc.) with lazy associations. With
   `open-in-view` off, serializing those outside a transaction throws
   `LazyInitializationException`. Set back to `true` for now, with the real fix (convert the
   remaining endpoints to response DTOs, the way `CourseResponse`/`CertificateResponse` already
   do) flagged in the backend README as follow-up work.
3. **`User.password` / `User.totpSecret` were serializable** — since `User` gets nested into
   `Enrollment`, `Notification`, `TaAssignment`, and returned directly in
   `AdminController.pending()`, the password hash and TOTP secret would have leaked into JSON
   responses. Added `@JsonIgnore` at the entity level so it's safe regardless of which endpoint
   touches a `User`.
4. **No way to reach mandatory 2FA setup** — `AuthService.login()` returned `2FA_SETUP_REQUIRED`
   without issuing any tokens, but `/2fa/setup` requires an authenticated session. Fixed: that
   response now includes real access/refresh tokens so the frontend can actually call setup+activate.
5. **Missing "list my quiz/assignment/certificates" endpoints** — the player needs to resolve
   "this sub-section is a QUIZ" into the actual quiz to render, and a student needs to list their
   own certificates. Added `GET /api/subsections/{id}/quiz` (answer-key-stripped via a new
   `QuizResponse` DTO — never send `correctOption` to the browser), `GET /api/subsections/{id}/assignment`,
   and `GET /api/certificates/mine`.

## Known simplifications (frontend side)

- **Razorpay Checkout isn't wired up** — `PaymentController.initiate()` returns a real order ID
  and key, but the buy flow stops at "order created" rather than opening Razorpay's Checkout.js
  widget and handling the client-side success callback. That's a few dozen lines against
  Razorpay's documented widget API, deliberately left as the next step rather than guessed at.
- **Instructor "my courses" filters client-side** by matching `instructorName` against the logged
  in user, because the backend's `/api/courses` browse endpoint doesn't take an `instructorId`
  filter yet. Fine for a demo; add that query param backend-side for real usage.
- **TA invitation UI, live session booking UI, coupon/refund admin UI, and reporting/export UI**
  are not built — the API modules for all of them exist in `src/api/`, ready to wire into pages,
  but the pages themselves weren't a priority for this pass. Happy to add any of these next.
