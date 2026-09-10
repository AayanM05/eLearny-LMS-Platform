# Fix Mobile Login/Registration Timeout & Cold Start Performance

Address the mobile login/registration timeout issue caused by Render free-tier 15-minute spin-down through a 3-part targeted strategy executed strictly as separate sequential checkpoints.

---

## Plan Overview

> [!IMPORTANT]
> The three fixes will be executed as separate sequential units:
> 1. **Unit 1 (Keep-Warm Workflow):** Create `.github/workflows/keep-warm.yml` to ping `/api/v1/health` every 10 minutes via cron.
> 2. **Unit 2 (Mobile Timeout & Loading State):** Update `frontend/mobile/lib/api.ts` and auth screens (`login.tsx`, `register.tsx`) with explicit 60s auth timeouts and user-friendly slow-start status messages (`"Connecting... this may take a moment on first load"`).
> 3. **Unit 3 (Backend Boot Time Tuning):** Configure `spring.main.lazy-initialization: true` and HikariCP connection pool settings in `application-prod.yml`, then thoroughly test bean initialization.

---

## Detailed Unit Breakdown

### Unit 1: Keep-Warm Workflow

#### [NEW] [.github/workflows/keep-warm.yml](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.github/workflows/keep-warm.yml)
- Create a GitHub Action triggered by a scheduled cron (`*/10 * * * *`) and `workflow_dispatch`.
- Pings `https://elearny-lms-platform.onrender.com/api/v1/health` via `curl` every 10 minutes to keep the Render free-tier instance warm.

---

### Unit 2: Mobile Client Timeout + Loading State

#### [MODIFY] [packages/api-client/src/index.ts](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/packages/api-client/src/index.ts)
- Extend `RequestInit` options to support custom per-request `timeoutMs?: number` (defaulting to 60000ms).

#### [MODIFY] [frontend/mobile/lib/api.ts](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/frontend/mobile/lib/api.ts)
- Expose helper or configuration for 60-second auth request timeouts.

#### [MODIFY] [frontend/mobile/app/(public)/login.tsx](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/frontend/mobile/app/%28public%29/login.tsx)
- Enhance loading UI state while authentication is in progress:
  - Display circular spinner + `"Connecting... this may take a moment on first load"` banner when waiting on backend response.
  - Handle timeouts gracefully with clear instructions.

#### [MODIFY] [frontend/mobile/app/(public)/register.tsx](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/frontend/mobile/app/%28public%29/register.tsx)
- Enhance registration loading UI state to display `"Creating account... this may take a moment on first load if backend is waking up"` with circular progress feedback.

---

### Unit 3: Backend Boot Time Optimization & Live Verification

#### [MODIFY] [backend/src/main/resources/application-prod.yml](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/backend/src/main/resources/application-prod.yml)
- Add:
  ```yaml
  spring:
    main:
      lazy-initialization: true
    datasource:
      hikari:
        minimum-idle: 1
        maximum-pool-size: 5
        connection-timeout: 30000
  ```
- Test Spring Boot startup locally and verify lazy bean initialization does not conceal broken bean dependencies.
- Test actual login/registration against the live backend deployment (`https://elearny-lms-platform.onrender.com/api/v1`).
