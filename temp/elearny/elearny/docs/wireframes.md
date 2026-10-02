# eLearny — Wireframe Specification Document (wireframes.md)

> Status: **v1.3 — living document, fresh-start reset.** Governs spatial layout schematics, information hierarchy, UI component zoning, responsive breakpoint rules, multi-state rendering blueprints, and REST API mapping across **Next.js Web** (`frontend/web`) and **Expo Mobile** (`frontend/mobile`).
> Bound to the **Terracotta Orange (`#D96B43` / `HSL 17° 66% 56%`)** brand identity and the 6 custom workspace skills in `.agents/skills/`.
> **Wireframes are tagged `[V1]`/`[V2]` per `prd.md` §0 / `phases.md` v0.9.** Build
> V1-tagged wireframes first; V2 wireframes (Judge0 sandbox, TA/office-hours,
> camera proctoring, etc.) get drafted when their phase actually starts.

---

## 1. Master End-to-End Process Flows & Journey Architecture

> ⚠️ **Note**: The master process flows below define the core operational foundation of the eLearny LMS Platform. They are living, expandable architectures that encompass the complete lifecycle for Students, Instructors, and Admins. **These are V1 flows** — see `processflows.md` v1.2 for the authoritative, detailed version (this section is a condensed visual companion, kept in sync with it).

### 🎓 Master Flow 01: Complete Student End-to-End Journey `[V1]`
```
[1. Registration] ──► [1b. Email OTP Verification] ──► [2. Login] ──► [3. Explore Catalog] ──► [4. Checkout & Payment]
       │
       ▼
[5. Interactive Player] ──► [6. Quizzes & Timed Exams] ──► [7. Completion & Verified Certificate]
```
1. **Student Registration (`/auth/register`)**:
   - User registers as a Student. Enforces strict live regex validation:
     - **Username**: `/^[a-zA-Z0-9]{3,20}$/` (alphanumeric only, 3-20 characters).
     - **Email**: Standard RFC email regex (`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`).
     - **Password**: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character (`!@#$%^&*`).
     - Live in-line red error feedback displayed whenever regex criteria fail.
1b. **Email OTP Verification (`/auth/verify-email`)** -- new in v1.2, per `prd.md` SS3.26: 6-digit OTP entry, resend cooldown timer, must complete before login is possible.
2. **Student Authentication (`/auth/login`)**:
   - Authenticates credentials, issues JWT tokens, and routes directly to the **Student Dashboard** (`/dashboard` on Web, `/(tabs)/dashboard` on Mobile).
3. **Course Exploration & Taxonomy (`/courses`)**:
   - Browse catalog by category, difficulty level, rating, and search queries with animated filter pills.
4. **Course Purchase & Dual-Mode Checkout (`/checkout/[id]`)**:
   - Order summary card, promotional coupon validation (`ELEARNY20`), Dual-Mode Payment Gateway (eLearny Sandbox 1-click test checkout OR Razorpay Test Mode API), signed webhook signature verification (`/api/v1/webhooks/razorpay`), and instant enrollment generation.
5. **Interactive Course Player (`/my-courses/[id]`)**:
   - Cloudflare R2 presigned video streaming, collapsible section/lesson curriculum drawer, interactive completion checkmarks, and student private notes drawer.
6. **Quizzes & Timed Exams (`/exams/[id]/attempt`)**:
   - Timed quiz/exam attempts, question/option randomization, browser-level tab-switch/fullscreen violation logging, and server-side automated grading. **Corrected in v1.2**: previously referenced Judge0 code-sandbox submissions here — Judge0/Practice Hub is a separate **V2** module (`prd.md` §3.13, Phase V2-B), not part of this V1 exam flow. Removed to match the fix already made in `processflows.md`.
7. **Course Completion & Verified Certificate (`/certificates`)**:
   - Recalculates course progress to 100%. Generates verified PDF certificate with unique credential ID and verification page/QR code.

---

### 📖 Master Flow 02: Complete Instructor & Admin Authoring/Governance Journey `[V1]`
```
[1. Instructor Application] ──► [2. Admin Approval] ──► [2b. Invite-and-Activate] ──► [3. Course Creator Wizard]
       │
       ▼
[4. Curriculum & Drip Builder] ──► [5. Publication & Catalog] ──► [6. Grading & Student Remarks]
```
1. **Instructor Elevation Application (`/instructor/apply`)**:
   - Public application form where prospective teachers submit bio, years of experience, primary expertise tags, portfolio URL, and resume PDF link. (No separate instructor registration toggle).
2. **Admin Review (`/admin/instructor-applications`)**:
   - Admin inspects pending applications. Clicking **"Approve"** creates the account (role `ROLE_INSTRUCTOR`) with no password yet -- see step 2b. **Corrected in v1.2**: previously said this "provisions credentials automatically," implying instant unverified access.
2b. **Invite-and-Activate** -- new in v1.2, per `prd.md` SS3.26: emailed single-use setup link + OTP; both are required (link alone is not enough) before the instructor sets a username and password.
3. **Course Creation Wizard (`/instructor/courses/create`)**:
   - Step 1 course metadata wizard: Title, tagline, category, difficulty level, USD pricing, thumbnail URL, and promo video.
   - Saves draft to `Course` entity with status `DRAFT`.
4. **Curriculum & Drip Release Builder (`/instructor/courses/[id]/builder`)**:
   - Step 2 module manager: Create sections, upload HD video streams to Cloudflare R2, attach PDF documents, build timed quizzes, and configure drip release delays (`drip_delay_days`).
5. **Course Publication & Catalog Listing**:
   - Course submitted to admin quality check. Upon approval, status updates to `PUBLISHED` and becomes searchable in public catalog.
6. **Enrolled Student Management & Feedback Remarks (`/instructor/students`)**:
   - Instructors inspect enrolled student progress, review submitted exam attempts, grade responses, and provide personalized written opinions, feedback, and performance remarks.

---

## 2. Executive Overview & Wireframe Architecture Principles

Every wireframe specification in this document defines:
1. **Visual UI Mockups**: High-fidelity visual design previews.
2. **Desktop & Mobile ASCII Layout Schematics**: Precise spatial zoning for 1440px+ Desktop grid views vs 375px Mobile stacked layouts.
3. **Information Hierarchy & Content Zoning**: Primary content focus, secondary metric widgets, and sticky utility navigation bars.
4. **Multi-State Rendering Blueprints**: Explicit specs for **Populated Data**, **Skeleton Shimmer Loading**, **Empty State (Graphic + CTA Link)**, and **Error State**.
5. **Component Hierarchy & Workspace Skill Triggers**: Direct linkage to [`taste-design-system`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/taste-design-system/SKILL.md), [`mobile-app-uiux-benchmarks`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/mobile-app-uiux-benchmarks/SKILL.md), [`gsap-animation-uiux`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/gsap-animation-uiux/SKILL.md), [`reanimated-mobile-gestures`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/reanimated-mobile-gestures/SKILL.md), [`21st-dev-components`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/21st-dev-components/SKILL.md), and [`shadcn-ui-components`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/shadcn-ui-components/SKILL.md).
6. **Backend REST API Mapping**: Direct connection between visual UI wireframe elements and backend DTO fields.

---

## 3. Master Wireframe Suite

### Wireframe 01: Auth & Registration Screen (`/auth/register`) `[V1]`

#### Visual UI Preview
![Auth Registration Screen UI Mockup](file:///C:/Users/itsaa/.gemini/antigravity-ide/brain/a2d4b763-71c6-4181-80b6-45a499ef9758/wireframe_auth_registration_1789146277257.jpg)

#### Desktop ASCII Visual Layout Schematic (1440px Grid)
```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 🎓 eLearny Logo                                                Explore   Dashboard   Login  │
├───────────────────────────────────────────┬─────────────────────────────────────────────────┤
│                                           │             Create Student Account              │
│                                           │         Already have an account? Log in         │
│     Join the Global Learning Community    │                                                 │
│                                           │  Full Name: [ Jane Doe                        ] │
│   Unlock knowledge, skills, and           │  Username:  [ janedoe24               ✓ ]       │
│   opportunities with modern online        │             (Regex: alphanumeric 3-20 chars)    │
│   education. Sign up to get started.      │  Email:     [ jane.doe@email.com          ] │
│                                           │  Password:  [ ••••••••••                  ] │
│   [ Hero Vector / Brand Graphic ]         │             • Min 8 chars (✓)   • 1 uppercase (✓) │
│                                           │             • 1 number (✓)      • 1 special (✓) │
│                                           │  Want to teach? [ Apply as Instructor → ]       │
│                                           │  [✓] I agree to Terms & Privacy Policy          │
│                                           │  [      Create Student Account (#D96B43)      ] │
└───────────────────────────────────────────┴─────────────────────────────────────────────────┘
```

---

## Change Log
- **v1.0–v1.1** — Initial wireframe suite: master flow diagrams, executive
  overview of wireframe architecture principles, and the Auth/Registration
  screen as the first fully-specified wireframe.
- **v1.2** — **Fresh-start reset, aligned to `prd.md` v1.0 / `phases.md` v0.9's
  V1/V2 split.** Tagged both master flows and Wireframe 01 `[V1]`. Fixed the
  same Judge0 inconsistency caught in `processflows.md` v1.2 — Master Flow 01
  step 6 no longer implies the V2 code-execution sandbox is part of the V1 exam
  flow. Only one wireframe (Auth/Registration) exists in detail so far; the
  remaining ~39 screens catalogued in `pages.md` still need their own wireframe
  passes, V1 screens first per `phases.md`'s phase order.
- **v1.2** — Mirrored `processflows.md` v1.3's changes: added email OTP verification (step 1b, Master Flow 01) and instructor invite-and-activate (step 2b, Master Flow 02) per `prd.md` §3.26.
