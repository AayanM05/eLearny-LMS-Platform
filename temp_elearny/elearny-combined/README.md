# eLearny — Spring Boot backend + React frontend (separate dev servers, one repo)

Backend and frontend run as **two separate processes** during development — a Spring Boot API on
`:8080` and a Vite/React dev server on `:5173` — living in the same repo/IDE window so it still
opens as one project. This replaces an earlier "combined" setup that pre-built the React app and
served it directly from Spring Boot's `static/` folder; that approach is gone (see "What changed"
below for exactly what moved and why).

```
elearny/                  <- open THIS folder in IntelliJ (Maven project root, pom.xml here)
  src/                     backend source (Java)
  pom.xml
  frontend/                React app — separate npm project, lives inside the same repo
    src/
    package.json
    vite.config.js         dev-server proxy config (forwards /api/* to localhost:8080)
  README.md               (this file)
```

## 1. Set up MySQL yourself (no Docker)

**Prerequisite: MySQL Server installed and running locally** (port 3306, the default) — no
Docker, no in-memory database. Grab MySQL Community Server, or use whatever local MySQL setup you
already have (XAMPP, Homebrew's `mysql`, etc.), and make sure the server is running before step 3
below.

Default profile is `dev`, which points at `jdbc:mysql://localhost:3306/elearny_dev` and creates
that database automatically on first connection if it doesn't exist. Default credentials assume
`root` with no password — if yours differs, edit `src/main/resources/application-dev.yml` or
export `DB_HOST` / `DB_PORT` / `DB_USERNAME` / `DB_PASSWORD` env vars before starting.

## 2. Run the backend

1. **File → Open** this folder (the one with `pom.xml` at the root). IntelliJ detects it as a
   Maven project and imports dependencies (needs Maven Central access the first time).
2. Open `src/main/java/com/elearny/ElearnyApplication.java` and click the green ▶ next to `main`.
3. API is on `http://localhost:8080`, Swagger UI at `http://localhost:8080/swagger-ui.html`.

Test accounts and sample courses seed automatically on first run against an empty database (see
`TESTING_GUIDE.md`) — restarting won't wipe or re-seed anything. For a completely fresh start,
`DROP DATABASE elearny_dev;` and restart.

## 3. Run the frontend

`frontend/` is a separate npm project living inside the same folder tree. IntelliJ usually
recognizes `frontend/package.json` and offers an npm scripts tool window automatically; otherwise,
use a terminal:
```bash
cd frontend
npm install
npm run dev
```
It proxies `/api/*` to `localhost:8080` (`frontend/vite.config.js`) — **start the backend first.**
Visit `http://localhost:5173` — that's the app: browse, sign up, log in, enroll, learn, and (as
an Instructor/Admin) manage courses.

## What changed to split this back apart

Three real things changed, not just a folder move:

1. **`SpaForwardingConfig.java` — removed.** It existed only because Spring Boot used to serve
   the built React app itself and needed to forward client-side routes (like `/courses/5`) to
   `index.html` so a refresh wouldn't 404. Vite's dev server handles that natively now, so this
   controller is dead weight — deleted rather than left around disabled.
2. **`frontend/vite.config.js`** — added a `server.proxy` block forwarding `/api/*` to
   `localhost:8080`. Without this, the browser (now on `localhost:5173`) would have nowhere to
   send API calls.
3. **`frontend/src/api/client.js`** — the axios base URL changed from an absolute
   `http://localhost:8080/api` to a relative `/api`. This matters: an absolute URL would have
   silently bypassed the proxy above entirely (axios would hit `:8080` directly, cross-origin,
   rather than routing through Vite's same-origin proxy) — the fix makes the proxy actually the
   thing in effect, not just present but unused.
4. **`SecurityConfig.java`** — the CORS bean already allowed any origin with credentials, which
   covers `localhost:5173` without changes; the final `anyRequest()` fallthrough moved back to
   `.authenticated()` (from the combined version's `.permitAll()`), since there's no more app
   shell for Spring Boot to serve permissively — every real route now either matches an explicit
   rule above or requires auth by default, the same posture the standalone backend always had.

`src/main/resources/static/` is now empty — nothing populates it in this setup. If you ever want
a single combined deployable again, that's still just `npm run build` in `frontend/` + copying
`dist/*` into `static/` + restoring the SPA-forwarding controller, exactly as before.

## What's genuinely unverified

Everything else in this project has been checked the same way as before: brace/paren balance
across all Java files, controller↔service signature matching. The frontend move was verified by
actually building it from its new `frontend/` location (`npm install && npm run build`) and
confirming the output is byte-for-byte identical to what the old combined setup was serving — not
just visually similar, the compiled JS bundle hash matched exactly.

The one thing I cannot verify in this sandbox is `mvn compile` / the actual Maven dependency
resolution, since this environment's network doesn't reach Maven Central. When you open this in
IntelliJ, give it a minute to resolve dependencies and check the "Build" panel — if anything red
shows up, it's almost certainly a small, fixable thing (an import, a library method-signature
drift), not a structural problem, but I want to be upfront that "opens cleanly in IntelliJ" is the
one claim here I haven't personally watched happen.

## Everything else

See the backend and frontend READMEs bundled inside their own zips for the full module list,
design-system notes, and the specific bugs that were found and fixed while wiring the two
together (missing `sections` in course responses, `User` password/TOTP leaking into JSON via
nested entities, a login flow that couldn't reach mandatory 2FA setup, and a few missing
list/detail endpoints the frontend needed).


## Critical fix found via SDK source verification (not just syntax checking)

Static analysis (brace balance, a real Java grammar parser) confirms the code parses — it can't
confirm the code is *correct* against the actual behavior of third-party libraries. So each
external SDK call (Razorpay, TOTP, Twilio, Flying Saucer PDF) was checked against real source/docs
fetched from GitHub. Three came back clean. One did not:

**`PaymentService.verifyWebhookSignature()` was silently accepting forged webhooks.** Razorpay's
`Utils.verifyWebhookSignature()` returns a `boolean` — `false` on a signature mismatch — and only
*throws* for actual processing errors. The original code called it and returned `true` as long as
no exception was thrown, without ever checking that boolean. That means a POST to `/api/webhooks/razorpay`
with any body and any (or no) valid signature would have been accepted as a genuine payment
confirmation — a critical hole in exactly the endpoint responsible for granting paid course access.
Fixed: the boolean return value is now the thing that determines validity.

This is flagged explicitly, not folded quietly into a commit, because it's the kind of bug that
"looks right" in code review and only shows up against the library's actual contract.


## Test data, out of the box

The app now seeds test accounts and sample courses automatically on startup (dev/local-MySQL
profile only
— `DataSeeder.java`, guarded by `@Profile("dev")` and skipped entirely if any user already
exists, so it's idempotent). A startup banner (`StartupBanner.java`) prints the running URL and
test credentials to the console once the app is fully ready — not before, since it listens for
`ApplicationReadyEvent`, which fires after the seeder has finished.

See **TESTING_GUIDE.md** for the full account list and a set of plain-language test scenarios,
basic through advanced, covering every module.

## A second follow-up audit (this one on the frontend)

Asked to double-check "does the frontend actually have every section the doc calls for" — it
didn't. Confirmed missing (not hypothetical): assignment grading UI, any TA-facing screens at all,
instructor-availability UI, and an account privacy page. All four are now built:
`AssignmentGradingPanel` (shared between the instructor course builder and the new TA course
view), `TaDashboard` + `TaCourseGradingPage`, `AvailabilityPage`, and `PrivacyPage` — each backed
by real API calls, with a couple of new backend endpoints added to support them
(`GET /assignments/{id}/submissions`, `GET /ta-invitations/mine`).
