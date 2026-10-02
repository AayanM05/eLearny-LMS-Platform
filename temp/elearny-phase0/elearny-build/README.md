# eLearny — Phase 0 (Foundation)

This is the actual code, not just docs — see `docs/` (from `elearny.zip`) for
the full spec. This README covers only what exists right now: Phase 0 of
`docs/phases.md`'s V1 track.

## What's here and its real verification status

| Piece | Status | Verified by |
|---|---|---|
| `frontend/web` (Next.js 16, Tailwind v4, design tokens) | ✅ Builds clean | `npm run build` — real output, see session notes |
| `frontend/mobile` (Expo SDK 57, NativeWind v4) | ✅ Type-checks clean | `npx tsc --noEmit`, `npx expo-doctor` (19/21 — 2 failures are network-sandbox-only, see below) |
| `backend` (Spring Boot 3.3.5, Java 21) | ⚠️ Written, NOT compiled | Needs `mvn clean install` run somewhere with real internet access — the environment this was built in cannot reach Maven Central (network allowlist), confirmed via a real `403 Forbidden` |
| `docker-compose.yml` (Postgres 16) | ⚠️ Written, NOT run | Docker wasn't available in the build environment either |

**Before you trust the backend as "done," run this yourself and check the
output — don't take a doc's word for it (see `docs/rules.md` §13a):**

```bash
docker compose up -d          # starts Postgres
cd backend
mvn clean install             # should download deps and build a jar
mvn test                      # should run ElearnyApplicationTests — contextLoads()
```

If `mvn test` passes, tell whoever/whatever is tracking `docs/memory.md` so
Phase 0's backend checkbox can be honestly checked. If it fails, paste the
real output back — don't guess a fix, get the actual error first.

## Running the frontend locally (this part IS verified)

```bash
cd frontend/web && npm install && npm run dev      # http://localhost:3000
cd frontend/mobile && npm install && npm start      # Expo dev server
```

## Known caveats (logged honestly, not hidden)

- Mobile's color tokens in `tailwind.config.js` are hex approximations of
  `docs/design.md`'s HSL values — React Native/NativeWind can't consume the
  same `hsl(var(--x))` CSS-variable trick web Tailwind v4 uses. Close, but
  not pixel-verified against the web version yet — worth a visual side-by-side
  check once real screens exist (Phase 2+).
- Mobile has 10 moderate `npm audit` findings, all inside Expo's own
  toolchain (`uuid` bounds-check issue via `xcode`/`@expo/config-plugins`),
  not runtime app code. The suggested `npm audit fix --force` would downgrade
  Expo itself, which is worse — left as-is, worth rechecking next Expo SDK
  update rather than forcing now.
- `expo-doctor`'s 2 failing checks ("Check Expo config schema", "Validate
  packages against React Native Directory") failed because they need to
  reach hosts outside this build environment's network allowlist — rerun
  `npx expo-doctor` yourself with normal internet access to get a real result
  on those two.

## Mobile-specific: always use --legacy-peer-deps

`frontend/mobile` has a known, harmless peer-dependency conflict from
Expo SDK 57's own internal devtools package (`@expo/devtools` optionally
wants `react-dom`, which isn't actually used when running on a phone or
emulator). Plain `npm install` will fail there with an ERESOLVE error.

Always run, in `frontend/mobile` specifically:
```powershell
npm install --legacy-peer-deps
```
`frontend/web` and `backend` don't need this — it's mobile-only.
