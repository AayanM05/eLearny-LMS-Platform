# eLearny — Rules Document (rules.md)

> Status: **v1.0 — living document.** Governs how code gets written across backend, web, and
> mobile — not what gets built (that's `prd.md`) or how it's structured
> (that's `architecture.md`). eLearny is a full-scale, production-grade LMS — **high-level and large-scale by design, not a demo or MVP**.
> Enforces mandatory High Content Density (§12), 100% Web & Mobile Feature & Content Parity (§13), AI Development Double-Check Guardrails (§12/§13), and Zero Deprecation Warning Policy (§15). AI tools MUST double-check all work against these rules before completing any unit.

---

## 1. Backend Libraries — What to Use

| Concern | Library | Why |
|---|---|---|
| Web framework | Spring Boot 3.3.x (Web MVC) | Java 21 LTS compatibility & stable modern release |
| Data access | Spring Data JPA + Hibernate | Standard, avoids hand-written SQL for CRUD |
| DB migrations | Flyway | Versioned, committed schema changes — no hand-editing a live DB |
| DTO ↔ Entity mapping | MapStruct | Compile-time mapping, avoids hand-written boilerplate mappers and avoids leaking entities over the API |
| Boilerplate reduction | Lombok | `@Getter/@Setter/@Builder` — reduces noise, standard in Spring projects |
| Auth tokens | `io.jsonwebtoken` (jjwt) | JWT issuing/parsing |
| TOTP 2FA | `dev.samstevens.totp` | RFC 6238-compliant TOTP, no need to hand-roll crypto |
| Payments | Razorpay Java SDK (official) | Official SDK over hand-rolled HTTP calls |
| Object storage | AWS S3 SDK (v2) | Cloudflare R2 is S3-API-compatible — use the S3 SDK pointed at R2's endpoint, no separate R2-specific SDK needed |
| Email | `spring-boot-starter-mail` | Already decided (Gmail SMTP) |
| PDF generation | Apache PDFBox | Open-source, no licensing cost (iText's newer versions are AGPL/commercial — PDFBox avoids that ambiguity entirely) |
| API documentation | springdoc-openapi | Auto-generates OpenAPI spec from controllers — `packages/types` on the frontend can be generated from this instead of hand-kept in sync |
| Validation | `jakarta.validation` (Bean Validation) | Annotate DTOs (`@NotNull`, `@Size`, etc.), validate at the controller boundary, not deep in services |
| Testing | JUnit 5 + Mockito + Testcontainers | Testcontainers spins up a real Postgres for integration tests — no "works on H2, breaks on Postgres" surprises |
| Code execution sandbox | Judge0 (self-hosted, called via its REST API — not a Java library) | Isolated execution environment for Practice Hub |
| LLM client | Plain `WebClient` (Spring's reactive HTTP client) to Gemini/Groq's REST API | No need for a heavy SDK for a scoped, simple prompt/response call |

## 2. Backend Libraries — What to Avoid

- **Raw JDBC / hand-written SQL for CRUD** — Spring Data JPA covers this; hand-written SQL is reserved for genuinely complex queries (reporting, search) where JPA would be awkward, and even then goes through `@Query` on a repository, not scattered `JdbcTemplate` calls
- **Exposing JPA entities directly as API responses** — always map to a DTO. An entity has lazy-loading proxies, bidirectional relationships, and internal fields that will leak or break serialization if returned raw
- **Business logic in controllers** — controllers do request/response handling and delegate to services; a controller method should read like a table of contents, not contain `if` chains
- **`@Autowired` field injection** — use constructor injection everywhere (works better with `final` fields, makes dependencies testable and explicit)
- **Storing secrets (API keys, DB passwords) in code or committed config files** — environment variables only, injected via Docker Compose locally and the hosting platform's secret manager in production
- **Trusting any client-submitted value that determines money, time, or grades** — price, exam time limits, and quiz scores are always computed/validated server-side (already established in `architecture.md` flows) — this is a rule, not a one-off decision, and applies to every future feature too
- **`iText` for new PDF work** — recent versions carry AGPL/commercial licensing that conflicts with a free-tier, side-project-friendly stack; PDFBox is the actual choice (architecture.md listed both as options — this rule resolves that ambiguity)

---

## 3. Frontend (Next.js) Libraries — What to Use

| Concern | Library | Why |
|---|---|---|
| Data fetching / caching | TanStack Query (React Query) | Handles caching, refetching, loading/error states for our REST API — avoids hand-rolled `useEffect` fetch logic everywhere |
| Forms & validation | React Hook Form + Zod | Zod schemas can be shared conceptually with backend DTO shapes; RHF avoids re-render-heavy form state |
| UI components | shadcn/ui (on top of Tailwind, already decided) | Copy-in components, not a locked-in dependency — fits a project that will keep evolving its design |
| Animation | `motion` (Framer Motion's successor) | Already decided for engagement/gamification (PRD 3.10) |
| i18n | `next-intl` | Already decided (architecture.md 3.12) |
| Dark mode toggle | `next-themes` | Handles light/dark theme switching + persistence — pairs with the token architecture in `design.md` §2 (toggling just swaps which CSS variable set is active) |
| State that isn't server data | React Context / `useState`, or Zustand only if genuinely needed | Avoid reaching for a global state library before there's a real cross-page state problem to solve |

## 4. Frontend Libraries — What to Avoid

- **Redux (or any heavy global state library) by default** — most of this app's state is server state (courses, enrollment, progress), which TanStack Query already handles; adding Redux on top is usually solving a problem that doesn't exist yet
- **`fetch` calls scattered directly in components** — always go through `packages/api-client`, so auth headers, error handling, and base URL live in one place
- **`any` in TypeScript** — defeats the purpose of the shared `packages/types`; if a type is genuinely unknown, use `unknown` and narrow it
- **Inline `style={{}}` props** — Tailwind utility classes only, for consistency with the design system (`design.md` will govern the actual tokens)
- **Client components by default** — Next.js App Router: default to Server Components, opt into `"use client"` only where interactivity genuinely requires it (forms, animations, anything with `useState`/`useEffect`)

---

## 5. Mobile (Expo) Libraries — What to Use

| Concern | Library | Why |
|---|---|---|
| Navigation | Expo Router | File-based, mirrors the web's route-group structure conceptually |
| Data fetching | TanStack Query (same as web) | Same caching model, same `packages/api-client` |
| Styling | NativeWind v4 | Real Tailwind syntax on React Native — the mobile equivalent of web's Tailwind setup, so the same design vocabulary (spacing, color tokens) applies on both platforms even though the underlying mechanism differs (CSS on web, StyleSheet under the hood on mobile) |
| Fonts | `expo-font` + `@expo-google-fonts/inter` + `@expo-google-fonts/space-grotesk` | Expo's pre-hosted Google Fonts packages — no manual font-file management. See §14 for the mandatory global-loading pattern; this is what was missing and causing per-file font hacks |
| Animation | `react-native-reanimated` | Already decided — `motion` doesn't run on native |
| Notifications | `expo-notifications` | Standard Expo push notification handling |
| Secure token storage | `expo-secure-store` | JWTs must not sit in plain AsyncStorage |

---

## 6. Error Handling Conventions

- **Single global exception handler** (`@RestControllerAdvice`) on the backend — no controller should have its own ad hoc try/catch that formats an error response; exceptions are thrown and caught in exactly one place
- **Standard error response shape**, used everywhere:
```json
{
  "timestamp": "2026-09-08T10:15:00Z",
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "Human-readable summary",
  "details": [ { "field": "email", "issue": "must be a valid email" } ],
  "path": "/api/v1/auth/register"
}
```
- **Never leak stack traces or internal exception messages to the client** — log the full exception server-side, return a safe, generic message + an error code the frontend can key off of
- **HTTP status codes used meaningfully**, not just 200/400/500 for everything: 401 (not authenticated), 403 (authenticated but not authorized — e.g. student hitting an instructor endpoint), 404 (resource doesn't exist), 409 (conflict — e.g. duplicate enrollment), 422 (validation failure), 429 (rate limit — relevant for the chatbot), 500 (genuine server fault)
- **Frontend**: TanStack Query's error state is the single place API errors surface — no separate ad hoc error-catching per component

---

## 7. Layer & Module Boundaries

- **Controller → Service → Repository, one direction only.** A controller never touches a repository directly; a repository never calls a service
- **DTOs cross layer boundaries at the API edge only** — internally, services can pass entities between each other within the same domain package, but anything crossing into another domain package or out over HTTP goes through a DTO
- **Cross-domain calls happen through a service's public methods, not by reaching into another domain's repository** — e.g. the `certificate` package asks `exam`'s service "did this attempt pass?", it doesn't query the `exam_attempts` table directly
- **Neither frontend ever calls a third-party service directly** (Razorpay, R2, Gemini/Groq, Judge0) — always through our own backend, per `architecture.md` section 1. This is a security boundary, not a style preference: it's the only way API keys stay server-side
- **`packages/api-client` is the only thing in the frontend that knows our API's base URL and auth header format** — no component or hook constructs a raw request

---

## 8. API Conventions

- **Versioned from day one**: all endpoints under `/api/v1/...` — this is what lets us change the API later without breaking whatever mobile app version is still in someone's hands (relevant once this reaches app stores and can't force-update everyone instantly)
- **REST resource naming**: plural nouns, no verbs in the path — `/api/v1/courses/{id}/lessons`, not `/api/v1/getCourseLessons`
- **Pagination**: standard `?page=0&size=20` query params, response includes `totalElements`, `totalPages`, `currentPage` — applied consistently on every list endpoint (courses, reviews, notifications, admin lists) rather than each one inventing its own shape
- **Auth header**: `Authorization: Bearer <jwt>` — no custom header schemes
- **Webhooks are signature-verified, always** — `/api/v1/webhooks/razorpay` (and any future webhook) rejects any request that doesn't pass signature verification before touching any business logic
- **Idempotency for payment-adjacent endpoints** — a retried webhook delivery (Razorpay can send the same event twice) must not create a duplicate enrollment or duplicate revenue record
- **CORS is explicitly configured, never wildcarded** — the dev profile allows `http://localhost:3000` (Next.js's actual default port, not 5173), the prod profile allows the deployed Vercel domain. `allowedOrigins("*")` is never used, even during development — see `deployment.md` §2.2

---

## 9. AI / Chatbot Rules

- **Never send personally identifiable information to the LLM provider** beyond what's strictly needed to answer the question — no raw email addresses, payment details, or other students' data in a prompt
- **System prompt scopes the bot to the platform** (FAQs, catalog, course-suggestion intent) — it does not become a general-purpose assistant; this keeps prompts short (cheaper, faster, more of the free quota available) and keeps answers relevant
- **Per-user rate limiting is enforced in our backend before the LLM call is made**, not after — checking quota after already spending it defeats the point
- **The rule-based course-suggestion path never calls the LLM** — if a query matches a suggestion intent, answer from the recommendation engine; the LLM is reserved for genuine free-text Q&A
- **Every LLM call is logged (prompt + response, minus any PII) server-side** for debugging and for tracking real usage against the free-tier quota — so approaching the limit is visible before users start seeing fallback messages
- **API key for the LLM provider lives only in backend environment config** — same rule as every other third-party secret

---

## 10. Code Reusability & Conciseness

- **Prefer a well-maintained library over hand-written logic** whenever one genuinely solves the problem — date/time formatting, form validation, HTTP retries, debouncing, etc. should come from a library (`date-fns`, Zod, TanStack Query's built-in retry), not be reimplemented. A hand-written 80-line date formatter is a bug source; `date-fns` isn't
- **This cuts both ways — it's not "always use the fewest lines," it's "don't duplicate solved problems."** A library call that hides genuinely important logic the team needs to control (e.g. our own grading logic, our own rate-limiting) stays hand-written on purpose; convenience utilities (formatting, animation easing curves, icon rendering) don't
- **Shared logic used in more than one place becomes a shared unit, not a copy-paste**: a repeated backend query pattern → a repository method; a repeated frontend UI pattern → a component in `packages/ui` or `frontend/web/components`; a repeated data-fetching pattern → a custom hook wrapping TanStack Query
- **Don't hand-roll a full page of boilerplate when a library component already covers it** — e.g. a data table with sorting/pagination/filtering should use an existing table component (shadcn/ui's `DataTable` pattern with TanStack Table underneath), not a hand-written `<table>` with manually managed sort state
- **The test for "should this be a library call":** would getting it wrong be a real bug (auth, payment amounts, grading) or a solved UI/utility problem (formatting, animation, icons)? Solved problems use libraries; anything where correctness is business-critical stays explicit and hand-written so it's reviewable

## 11. UI/UX — Modern, Professional, Not Generic

- **Icons/SVGs**: `lucide-react` (already implied by shadcn/ui's ecosystem) for standard icons — not hand-drawn inline SVGs for things that already exist as a well-maintained icon set. Custom illustrations (landing page graphics, empty states) can be custom SVGs, but interface icons shouldn't be reinvented per component
- **Animation**: `motion` on web (already decided, section 3), used deliberately — page transitions, hover/focus feedback, gamification moments (badge unlock, streak milestone, certificate reveal) — not animation for its own sake on every element, which reads as noisy rather than professional
- **Design isn't an afterthought bolted onto working code** — when building actual screens, the `frontend-design` skill governs visual decisions (typography, spacing, color, avoiding templated-looking defaults) and gets consulted before writing UI code, not after
- **`design.md`** is where the actual color palette, typography, and design tokens are decided — this section governs *how* we implement whatever `design.md` specifies, not what the specific colors/fonts are

---

## 12. Build High-Density, Production-Grade Pages (No Thin / Minimal Output)

**This is the single most important rule in this document for avoiding thin, disappointing AI-generated output.** AI tools often fall into the trap of creating minimal, 2-field placeholder screens. In eLearny, **minimal or thin pages are strictly prohibited.** Every page built must feel enterprise-grade, content-rich, visually polished, and production-ready.

- **Mandatory High Content Density**: Every page MUST feature multiple rich UI blocks, metric KPI cards, status badges, interactive tabbed panels, action toolbars, live field validation, and contextual helper widgets.
  - **Auth Pages (e.g., Register)**: Never build just email + password. A real registration screen contains: Full Name (first/last), Username with a live debounced availability check indicator (spinner → checkmark/cross + alternate username suggestions), Email, Phone number (optional), Password + Confirm password with a live requirement checklist badge list (min 8 chars, uppercase, lowercase, number, special character), password-match validation, role selection toggle (`STUDENT` / `INSTRUCTOR`), terms of service & privacy agreement checkbox (required), security reassurance banner, and support link.
  - **Dashboards (Student / Instructor / Admin / TA)**: Must feature a multi-widget grid: KPI metric cards with trend badges (total courses, active streak, certificates earned, total revenue), a "Continue Learning / Active Course" hero card with lesson progress bar and resume button, upcoming deadlines / scheduled office hours widget, recent activity feed, and recommendations carousel.
  - **Course Authoring**: Must include a multi-step workflow wizard (Basic Metadata, Target Audience & Prerequisites, Pricing & Coupons, Curriculum Builder with section/lesson drag-and-drop ordering, drip schedule inputs, R2 upload dropzones, and Quiz builder).
  - **List & Table Pages**: Must feature searching, multi-criteria filtering tabs, sorting dropdowns, pagination controls, status badges, and quick-action toolbars.
- **Multi-State UI Readiness**: Every page MUST explicitly render and handle all four lifecycle states: **Loading (skeleton shimmer)**, **Empty (informative graphic + CTA)**, **Error (retry button + user-friendly explanation)**, and **Populated Data**.
- **Self-Check Before Completion**: Would a user looking at this screen think it is as feature-rich and polished as Udemy, Coursera, Notion, or Stripe? If it looks sparse or minimal, it is **unfinished** and must be enriched with appropriate data cards, widgets, and secondary information blocks.

---

## 13. Strict 100% Web & Mobile Feature & Content Parity

**Every feature, user capability, form option, and workflow MUST exist on BOTH Web and Mobile with equal capability.** Mobile is NEVER a "lite", "view-only", or partial version of the web platform.

- **Identical Functional Capabilities**: If an Instructor can create courses, build curriculums, set drip schedules, view analytics, and manage TA invites on the Web, the Mobile app MUST provide the exact same creation and editing capabilities. If a Student can run code in the Practice Hub, take quizzes, book office hours, and download PDF certificates on the Web, the Mobile app MUST support the exact same features.
- **UX Adaptation, Never Feature Omission**: The only difference between Web and Mobile is responsive UX layout design (e.g. desktop sidebars become bottom tab bars or drawer menus; desktop multi-column data tables become responsive stacked card lists). The underlying actions, inputs, data fields, and features are **100% identical**.
- **Simultaneous Milestone Deliveries**: Backend API + Next.js Web UI + Expo Mobile UI MUST be developed and verified together in the same checkpoint unit. A feature is incomplete until both Web and Mobile are proven working.

---

## 14. Global Font & Theme Application (Mobile) — Set Once, Never Per-File

**This is a mandatory pattern, not a suggestion — it exists specifically
because per-file font fixes were happening, which is the wrong layer to
solve this at.** React Native does not cascade a default font the way
CSS does on web; every `Text` component uses the system font unless
told otherwise. The fix is to override the default **once, globally**,
not to set `fontFamily` on every individual component.

**In `frontend/mobile/app/_layout.tsx` (the root layout — loads exactly
once, before any screen renders):**

1. Load fonts via `expo-font`'s `useFonts` hook with the Google Fonts
   packages from §5, gating render until loaded (standard Expo splash
   screen pattern — `expo-splash-screen`'s `preventAutoHideAsync`/
   `hideAsync`).
2. **Immediately after fonts load, override React Native's `Text` and
   `TextInput` default styles globally**, in this same root file only:
   ```tsx
   import { Text, TextInput } from 'react-native';
   // @ts-ignore
   Text.defaultProps = Text.defaultProps || {};
   Text.defaultProps.style = { fontFamily: 'Inter_400Regular' };
   // @ts-ignore
   TextInput.defaultProps = TextInput.defaultProps || {};
   TextInput.defaultProps.style = { fontFamily: 'Inter_400Regular' };
   ```
   This makes Inter the default font for **every** `Text`/`TextInput` in
   the entire app, automatically, with zero per-file changes.
3. Headings that need Space Grotesk (per `design.md` §3) get it through
   a single shared `Heading` component in `frontend/mobile/components/`
   that sets `fontFamily: 'SpaceGrotesk_700Bold'` — other files use that
   component, they don't set the font family themselves.
4. **If a file needs to set `fontFamily` directly to fix a font problem,
   that is a signal something is wrong upstream** (the global default
   isn't loaded yet, or a component is bypassing the shared `Heading`)
   — the fix is to correct the root cause in `_layout.tsx` or the shared
   component, never to patch the symptom in that individual file.

This is the mobile-side equivalent of web's single-token-file
re-theming goal from `design.md` §2 — one place controls the font
globally, on both platforms, even though the underlying mechanism
necessarily differs (CSS custom properties on web, a global
`defaultProps` override on mobile, since React Native has no CSS cascade).

---

## 15. Zero Deprecation Warning Policy — Modern Package Versions Only

**All libraries, tools, and dependencies installed across root, web, mobile, shared packages, and Java backend must use modern, active, non-deprecated stable release versions.**

- **No Deprecated Packages**: Do not install packages or SDK versions that emit deprecation warnings during `npm install`, `npx`, `expo start`, or `mvn compile`.
- **Node & NPM Tooling**: Use current LTS versions of Node.js and modern NPM package managers.
- **Expo & React Native**: Mobile applications use Expo SDK 51+ and React Native 0.74+ with NativeWind v4.
- **Spring Boot**: Backend uses Spring Boot 3.3.x targeting Java 21 LTS.

---

## 16. Change Log
- **v0.1** — Initial rules drafted covering backend/frontend/mobile library
  choices (with reasoning, including resolving the PDFBox vs. iText
  ambiguity left open in `architecture.md`), error handling conventions,
  layer/module boundaries, API conventions, and AI/chatbot-specific rules.
- **v0.2** — Added code reusability/conciseness guidance (prefer libraries
  over hand-rolled solved-problems, shared logic becomes shared units, with
  an explicit carve-out for business-critical logic that should stay
  hand-written and reviewable) and a UI/UX section (icon library, deliberate
  animation use, `frontend-design` skill governing visual decisions).
- **v0.3** — Consistency pass: fixed a section-numbering gap (9 jumped to
  11 with no 10 — renumbered to 10/11/12), added `next-themes` to the
  frontend library table (it was referenced in `design.md` but never
  tracked here), and removed a stale "design.md is the next doc" reference
  now that `design.md` already exists.
- **v0.4** — Added an explicit CORS rule (dev allows `localhost:3000`,
  never a wildcard) after drafting `deployment.md`, which requires this to
  actually work locally.
- **v0.5** — Path fix: frontend component references now correctly point
  to `frontend/web/components` (folder structure is `frontend/web` +
  `frontend/mobile`, not flat top-level folders).
- **v0.6** — Added §12: "Build the Complete Page, Not the Minimum Literal
  Reading" — the standing rule that `pages.md`/`prd.md` describe scope,
  not an exhaustive field-by-field spec, and filling that gap with real
  production judgment (not the literal minimum) is expected on every
  page, not just the ones called out with extra detail.
- **v0.7** — Added §13: "Full Parity Is Mandatory — No Partial-Platform
  Ships" — a feature isn't done if it only shipped on one frontend
  platform. Also changed `memory.md`'s checklist convention to split
  Web/Mobile into separate checkboxes per phase item so partial
  completion is visible instead of hidden inside one combined box.
- **v0.8** — Fixed a real architectural gap: no styling solution or font
  mechanism was ever defined for mobile, which is why per-file font
  hacks kept happening. Added NativeWind as mobile's styling solution
  (§5) and §14, a mandatory global-font-loading pattern (`expo-font` +
  a one-time `Text.defaultProps` override in the root layout) so the
  font gets set once, globally, never per-file again.
- **v0.9** — Added §15: Zero Deprecation Warning Policy — mandated current
  stable versions across all NPM packages, Expo SDK 51+, Next.js 14.2+, and
  Spring Boot 3.3.x (Java 21).
- **v1.0** — Expanded §12 ("Build High-Density, Production-Grade Pages — No Thin / Minimal Output") to strictly forbid 2-field placeholder UI, requiring multi-widget cards, live validation, status badges, and multi-state rendering. Expanded §13 ("Strict 100% Web & Mobile Feature & Content Parity") to mandate that every feature and creation workflow on Web exists with equal capability on Mobile.

