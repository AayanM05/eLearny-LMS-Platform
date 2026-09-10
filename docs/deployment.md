# eLearny — Deployment Document (deployment.md)

> Status: **v0.7.** Governs where things actually run — local development
> setup, environment/secret management, and production hosting. Distinct
> from `architecture.md` (which describes structure, not hosting).
> Every choice here is checked against the free-tier constraint from
> `prd.md`, with honest flags where "free" has a real catch. Enforces modern non-deprecated dependency releases across all deployment scripts.

---

## 1. Environments

Two environments for now, not three — a full dev/staging/production split
is more process than a solo project needs at this stage. Add a separate
staging environment later if the team or user base grows enough that
testing directly against the live environment becomes risky.

| Environment | Purpose | Where | Live URLs / Config |
|---|---|---|---|
| **Local** | Day-to-day development | Your machine — IntelliJ (backend), Next.js dev server, Expo dev client | `localhost:8080` (API), `localhost:3000` (Web) |
| **Live** | Continuous testing on real infrastructure, and eventually real users | Vercel (web) + Render (backend) + Supabase (database) + EAS (mobile) | Web: `https://elearny-web.vercel.app`<br>API: `https://elearny-lms-platform.onrender.com/api/v1`<br>DB: Supabase (Session Pooler) |

**On deploying early, per your explicit ask:** don't wait until Phase 13
to deploy anything. Get the "Live" environment stood up once Phase 1
(Auth & Roles) works locally, and push every subsequent phase to it as it
lands. Phase 13 in `phases.md` is about *hardening* the deployment
(security pass, load testing) — not about deployment happening for the
first time. This document's section 5 covers exactly how to make ongoing
deploys effortless (push-to-deploy), so this isn't extra manual work per
phase.

---

## 2. Local Development Setup

### 2.1 Running each piece

| App | How to run | Port | Notes |
|---|---|---|---|
| Backend (Spring Boot) | Open `backend/` as its own project in IntelliJ, run `ElearnyApplication` (or `mvn spring-boot:run` from `backend/`) | `localhost:8080` | IntelliJ only needs to know about the `backend/` folder — it has no awareness of `frontend/web` or `frontend/mobile`, and doesn't need to |
| Web (Next.js) | `cd frontend/web && npm run dev` | `localhost:3000` | **Not 5173** — that's Vite's default port, a different tool. Next.js defaults to 3000 |
| Mobile (Expo) | `cd frontend/mobile && npx expo start` | N/A (QR code / dev client) | Scan with Expo Go on your phone, or run a dev build for testing native modules |
| Database (local) | `docker compose up postgres` (from repo root) | `localhost:5432` | Backend's `application-dev.yml` points here |

**Running everything from one IntelliJ window (optional):** open the repo
root (not just `backend/`) — IntelliJ detects `backend/pom.xml` as a Maven
module automatically. For the frontend, use IntelliJ's Terminal tool
window (supports multiple tabs): one tab `cd frontend/web && npm run dev`,
another for Docker Compose if running Postgres locally. This works in
either IntelliJ edition. **Caveat:** IntelliJ Community has only basic
JS/TS syntax highlighting — no Next.js-aware autocomplete or npm-script
UI (that depth requires IntelliJ Ultimate or a frontend-focused editor
like VS Code). Editing and running the frontend from Community's terminal
still works fine; it's the smart-editing features that differ, not
whether it runs.

### 2.2 CORS (required, not optional)

Since the browser makes requests from `localhost:3000` to
`localhost:8080` — different origins — Spring Security must explicitly
allow this in the `dev` profile, or every API call from local web dev
gets silently blocked by the browser before it even reaches the backend.
This needs a `CorsConfigurationSource` bean allowing `http://localhost:3000`
(dev) and the deployed Vercel domain (prod), added to `common/security/`
per `architecture.md` §4.

### 2.3 Docker Compose's role locally

`docker-compose.yml` runs **two** things for local dev: a Postgres
container (so you don't need Postgres installed on your machine) and,
optionally, the backend itself in a container (so its environment matches
production). Running the backend directly via IntelliJ instead of through
Docker is fine and often faster for active development — Docker Compose
Postgres alone is the part that matters most locally.

---

## 3. Environment Variables & Secrets

**Rule: `.env.example` files are committed (with placeholder values);
actual `.env` files and real secrets are never committed** — this applies
locally and in production alike.

### 3.1 Backend
- `application-dev.yml` reads local values (from a git-ignored `.env` or IntelliJ run configuration) — DB connection, Razorpay test keys, Gmail SMTP test credentials, LLM API key
- `application-prod.yml` reads the same variable names from the hosting platform's environment variable settings (Render's dashboard) — same config shape, different values, never hardcoded per-environment logic in code

### 3.2 Web
- `.env.local` (git-ignored) for local dev — `NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1`
- Vercel project environment variables for production — same variable name, pointed at the deployed backend's URL instead

### 3.3 Mobile
- Expo's `app.config.js` + `eas.json` build profiles handle environment-specific values (API URL per build profile: development/preview/production) — this is Expo's standard pattern, not a custom `.env` scheme

---

## 4. Production Deployment (Free-Tier, With Honest Caveats)

### 4.1 Database — Supabase (not Render's own Postgres)
Render's free Postgres **expires 30 days after creation** (14-day grace
period, then deletion) — using it would mean your database silently dies
mid-project. **Supabase** has a genuine permanent free Postgres tier (no
card, no expiry), a native Vercel integration for simple connection setup,
and a generous free allowance (500MB database, 50,000 monthly active
users if you ever use its Auth — not needed here since Spring Boot
already owns auth, but harmless to have available). Point
`application-prod.yml`'s datasource at Supabase's connection string via
environment variable. Flyway migrations run identically regardless of
which Postgres host they're pointed at — no schema-level difference.

**One real caveat, not a dealbreaker:** Supabase free-tier projects
**auto-pause after 7 days of inactivity** (data is safe, retrievable with
one click in the dashboard — it's a pause, not a deletion). During active
development this won't bite you, since you'll be touching the database
constantly. It becomes relevant if development goes quiet for over a
week, or once real users are hitting it intermittently — worth revisiting
before that point, same as the other free-tier notes in this document.

### 4.2 Web frontend cannot double as backend hosting — a platform limit, not a preference
Worth stating plainly since it came up: **Vercel cannot host the Spring
Boot backend.** Vercel's serverless functions only run Node.js, Python,
Go, or Ruby, plus its Edge Runtime — there is no supported path for a
long-running JVM process like Spring Boot. This isn't a policy choice to
work around; it's a platform capability limit. The standard, and only
practical, pairing for this exact stack (Spring Boot + Next.js) is
**Vercel for the frontend, a separate host for the backend** — which is
what real projects using this combination consistently do.

### 4.3 Backend — Render (a genuine free tier, not a trial)
Worth correcting directly: **Render's free web service is not a trial —
it's Railway that removed its free tier in 2023** and now only offers a
one-time $5 trial credit. Render's free tier has no expiry and requires
no credit card; its real characteristics are:
- Spins down after 15 minutes of inactivity, causing a 30–60 second cold
  start on the next request
- 750 free instance-hours per workspace per month — enough for one
  backend service running intermittently during development
- **Razorpay webhooks**: Razorpay retries failed/slow webhook deliveries,
  so an occasional cold-start delay is unlikely to lose a payment
  notification — but confirm Razorpay's retry window against Render's
  cold-start time before relying on this for real transactions
- When ready to stop tolerating spin-down (i.e. once this is a real,
  user-facing product, not just a dev/test target), Render's Starter tier
  ($7/month) is the minimum for always-on

**Real-world symptom this causes, and how to mitigate it while staying
free:** the spin-down cold start (30–60+ seconds) is longer than most
HTTP clients' default timeout, so login/registration (often the first
call a fresh app session makes) can fail with what looks like a "server
timeout" even though the server would eventually respond. Three
mitigations, used together:
1. **Keep the service warm** with a scheduled ping every ~10 minutes
   (under the 15-minute spin-down threshold) — a free GitHub Actions
   workflow hitting `/api/v1/health` on a cron works well and needs no
   third-party account. Using close to the full 750 free instance-hours
   this way is expected and fine for one service.
2. **Increase the mobile/web client's request timeout** for auth calls
   specifically (45–60s) and show a genuine "waking up, this may take a
   moment" loading state rather than a generic error — per `rules.md`
   §12, an auth flow without a graceful slow-network state isn't complete.
3. **Reduce Spring Boot's own boot time**: `spring.main.lazy-initialization:
   true`, and tune HikariCP's pool size down (`minimum-idle: 1`,
   `maximum-pool-size: 5`) so establishing the Supabase pooler connection
   doesn't add unnecessary time to an already-slow cold boot. Test
   thoroughly after enabling lazy initialization — it can occasionally
   surface a misconfigured bean that was previously failing silently at
   eager startup instead of at first use.

If spin-down genuinely becomes a dealbreaker later, **Google Cloud Run**
is the strongest genuinely-free alternative (2 million requests/month,
true scale-to-zero, no monthly instance-hour ceiling) — but it requires a
Google Cloud Billing account, which typically needs a credit card on file
for identity verification even though free-tier usage isn't charged. That
trade-off (more generous limits, but a card requirement) is why Render
remains the simpler starting choice for now.

### 4.4 Web — Vercel (excellent free tier, one real restriction)
Vercel's Hobby (free) plan is built for exactly this stack (Next.js,
made by the same team) — auto-deploy on git push, preview URLs per PR,
100GB bandwidth, generous function invocation limits. **The one thing to
know: Vercel's Hobby terms explicitly prohibit commercial use** — and
eLearny is a paid marketplace. This isn't a soft limit; continuing to run
a revenue-generating product on Hobby after going live carries real
account-suspension risk. For development and testing with Razorpay in
test mode (no real money moving), this is a non-issue. Plan to move to
Pro ($20/month) before actually taking live payments — flagging this now
so it isn't a surprise later.

### 4.5 Mobile — EAS Build + EAS Update
- **EAS Build** (free tier: 30 builds/month, lower-priority queue):
  produces an installable app. **Android**: fully free — produces an APK
  you can sideload for testing, no store account needed. **iOS**: Apple
  requires a $99/year Developer Program membership to run on a real
  iPhone or distribute via TestFlight — there is no free tier that gets
  around this; it's an Apple cost, not a hosting cost, and applies
  regardless of which tool builds the app.
- **EAS Update** (free tier: ~1,000 monthly active users, 100GB
  bandwidth): this is the mechanism for updating the app without
  resubmitting to a store — see section 6.

---

## 5. Continuous Deployment (Push-to-Deploy)

Both Vercel and Render support deploying automatically from a GitHub
push, which is what makes "deploy in the middle of development, every
phase" practical instead of a manual chore:
- **Vercel**: connect the GitHub repo once; every push to `main` deploys
  automatically, every PR gets its own preview URL for free
- **Render**: same — connect the repo, auto-deploy on push to `main`
- **Mobile**: not push-to-deploy in the same sense — an `eas build` or
  `eas update` command is a deliberate, explicit action (see section 6),
  since app updates (even OTA ones) shouldn't ship on every commit the
  way a website can

---

## 6. Mobile OTA Update Workflow (No Manual APK Redownload)

This is the mechanism for what you described — updating the app without
making users download a new APK/build each time.

**How it actually works:**
1. The app has `expo-updates` installed, tied to a "runtime version" and
   a channel (e.g. `production`)
2. On app launch (or on a manual trigger — see below), the app checks
   EAS Update's server for a newer JS bundle matching its runtime version
   and channel — this check is the "manifest" you mentioned: a small
   document describing what update (if any) is available
3. If a newer bundle exists, it downloads in the background and applies
   either immediately (with a prompted restart) or on the next natural
   app launch
4. You publish an update with `eas update --branch production --message
   "..."` — no app store review, live within minutes

**Real limit, stated plainly:** this only updates JavaScript/asset-layer
code. If a change adds a new native module, a new permission, or anything
requiring the native binary itself to change, that needs a fresh
`eas build` + store/TestFlight resubmission (or a new APK for Android
sideloading) — OTA cannot cover that. Most feature work (screens, logic,
API calls, styling) qualifies for OTA; native-dependency changes don't.

**"Update available inside the app" as a visible feature, not just
silent background sync:** if you want a visible prompt/banner rather than
a silent auto-apply, that's a small, real feature to build using Expo's
`Updates.checkForUpdateAsync()` and `Updates.fetchUpdateAsync()` APIs —
e.g. a "Check for Updates" option in the app's Settings screen, or an
automatic banner when an update is detected. This isn't in `prd.md` as a
learner-facing feature (it's operational infrastructure, not a course
platform feature) — but it's real work, tracked here and in `phases.md`
Phase 13, not something that happens for free just by using EAS Update.

---

## 7. Change Log
- **v0.1** — Initial deployment strategy: local dev setup (ports, CORS
  requirement, Docker Compose's actual role), environment/secret
  management pattern, and production hosting decisions — Neon over
  Render's own Postgres (30-day expiry trap), Render for backend (with
  spin-down caveat and instance-hour budget), Vercel for web (with the
  commercial-use ToS restriction flagged before it becomes a problem),
  and EAS Build/Update for mobile (Android free, iOS's $99/year Apple fee
  flagged as unavoidable, OTA update mechanism explained concretely).
- **v0.2** — Added guidance on running backend and frontend from a single
  IntelliJ window (repo root + terminal tabs), with an honest note on the
  IntelliJ Community vs. Ultimate gap for JS/Next.js tooling depth.
- **v0.3** — Switched database recommendation from Neon to Supabase (per
  request — native Vercel integration, simple connection setup), with the
  free-tier auto-pause-after-7-days-idle caveat flagged. Corrected a
  misconception: Render's free web service is a genuine ongoing free tier,
  not a trial — Railway is the one that removed its free tier in 2023.
  Added an explicit note that Vercel cannot host the Spring Boot backend
  under any configuration (a platform capability limit, not a preference),
  with Google Cloud Run named as the alternative if Render's spin-down
  ever becomes a dealbreaker. Renamed `apps/web` → `frontend/` and
  `apps/mobile` → `mobile/` throughout (flattened, matching `backend/`
  already being a top-level folder).
- **v0.4** — Corrected v0.3's flattening: paths are now `frontend/web` and
  `frontend/mobile` — `frontend/` groups both surfaces together rather
  than each sitting fully flat at the repo root.
- **v0.5** — Added a real-world symptom section to §4.3: Render's cold
  start (30–60+ seconds) exceeding client HTTP timeouts, causing
  login/registration to fail with an apparent "server timeout" even
  though the backend would eventually respond. Documented three
  mitigations: a scheduled keep-warm ping, longer client timeouts with a
  genuine loading state, and Spring Boot boot-time tuning
  (lazy-initialization, smaller HikariCP pool).
- **v0.6** — Merged in the actual live URLs (Vercel, Render, Supabase)
  into §1's Environments table, added by the user's own AI tool session
  — this doc had drifted in two directions (my copy had the login-fix
  content, the user's had the real URLs) and needed reconciling both ways
  rather than one side silently overwriting the other.
