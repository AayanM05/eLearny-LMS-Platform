# eLearny — Wireframe Specification Document (wireframes.md)

> Status: **v1.0 — living document.** Governs spatial layout schematics, information hierarchy, UI component zoning, responsive breakpoint rules, multi-state rendering blueprints, and REST API mapping across **Next.js Web** (`frontend/web`) and **Expo Mobile** (`frontend/mobile`).
> Bound to the **Terracotta Orange (`#D96B43` / `HSL 17° 66% 56%`)** brand identity and the 6 custom workspace skills in `.agents/skills/`.

---

## 1. Executive Overview & Wireframe Architecture Principles

Every wireframe specification in this document defines:
1. **Visual UI Mockups**: High-fidelity visual design previews.
2. **Desktop & Mobile ASCII Layout Schematics**: Precise spatial zoning for 1440px+ Desktop grid views vs 375px Mobile stacked layouts.
3. **Information Hierarchy & Content Zoning**: Primary content focus, secondary metric widgets, and sticky utility navigation bars.
4. **Multi-State Rendering Blueprints**: Explicit specs for **Populated Data**, **Skeleton Shimmer Loading**, **Empty State (Graphic + CTA Link)**, and **Error State**.
5. **Component Hierarchy & Workspace Skill Triggers**: Direct linkage to [`taste-design-system`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/taste-design-system/SKILL.md), [`mobile-app-uiux-benchmarks`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/mobile-app-uiux-benchmarks/SKILL.md), [`gsap-animation-uiux`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/gsap-animation-uiux/SKILL.md), [`reanimated-mobile-gestures`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/reanimated-mobile-gestures/SKILL.md), [`21st-dev-components`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/21st-dev-components/SKILL.md), and [`shadcn-ui-components`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/shadcn-ui-components/SKILL.md).
6. **Backend REST API Mapping**: Direct connection between visual UI wireframe elements and backend DTO fields.

---

## 2. Master Wireframe Suite

### Wireframe 01: Auth & Registration Screen (`/auth/register`)

#### Visual UI Preview
![Auth Registration Screen UI Mockup](file:///C:/Users/itsaa/.gemini/antigravity-ide/brain/a2d4b763-71c6-4181-80b6-45a499ef9758/wireframe_auth_registration_1789146277257.jpg)

#### Desktop ASCII Visual Layout Schematic (1440px Grid)
```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 🎓 eLearny Logo                                                Features   Pricing   Login   │
├───────────────────────────────────────────┬─────────────────────────────────────────────────┤
│                                           │             Create Your Account                 │
│                                           │         Already have an account? Log in         │
│     Join the Global Learning Community    │                                                 │
│                                           │  Full Name: [ Jane Doe                        ] │
│   Unlock knowledge, skills, and           │  Username:  [ janedoe24               ✓ ]       │
│   opportunities with modern online        │             (Debounced availability check)      │
│   education. Sign up to get started.      │  Email:     [ jane.doe@email.com          ] │
│                                           │  Password:  [ ••••••••••                  ] │
│   [ Hero Vector / Brand Graphic ]         │             • Min 8 chars (✓)   • 1 uppercase (✓) │
│                                           │             • 1 number (✓)      • 1 special (✓) │
│                                           │  Role:      [ 🎓 Student ]  [ 📖 Instructor ]   │
│                                           │  [✓] I agree to Terms & Privacy Policy          │
│                                           │  [              Sign Up (#D96B43)             ] │
└───────────────────────────────────────────┴─────────────────────────────────────────────────┘
```

#### Mobile ASCII Visual Layout Schematic (375px Stacked)
```
┌──────────────────────────────────────────┐
│ 🎓 eLearny                        Log In │  <- Top Header Bar
├──────────────────────────────────────────┤
│           Create Account                 │
│                                          │
│ Full Name                                │
│ [ Jane Doe                             ] │
│                                          │
│ Username                                 │
│ [ janedoe24                          ✓ ] │  <- Live Availability Indicator
│                                          │
│ Email Address                            │
│ [ jane.doe@email.com                   ] │
│                                          │
│ Password                                 │
│ [ ••••••••••                           ] │
│ 🟢 Min 8 chars  🟢 Uppercase  🟢 Special │  <- Password Requirement Badges
│                                          │
│ Select Account Role                      │
│ [ 🎓 Student ]     [ 📖 Instructor ]     │  <- Segmented Role Switcher
│                                          │
│ [✓] Agree to Terms & Privacy Policy      │
│                                          │
│ [            Sign Up (#D96B43)         ] │  <- Tactile 3D Button
└──────────────────────────────────────────┘
```

#### Multi-State Rendering Blueprint
- **Populated State**: Input fields filled, username debounced check shows green checkmark `✓ Username available`, password requirement checklist badges light up green (`#10B981`), submit button active.
- **Skeleton Shimmer Loading**: Form card displays pulsed gray skeleton rectangles (`animate-pulse`) while verifying invite codes or session credentials.
- **Empty State**: Initial state with empty inputs, grey disabled submit button (`opacity-50 pointer-events-none`).
- **Error State**: Field-level red borders (`border-destructive`), inline error message `Username "janedoe24" is already taken. Suggestions: janedoe_2026, janedoe_lms`, shaking animation trigger.

#### Backend REST API & DTO Field Mapping
- **Trigger Endpoint**: `POST /api/v1/auth/register` and `GET /api/v1/auth/check-username?username={val}`
- **DTO Fields**: `{ fullName, username, email, password, role: "STUDENT" | "INSTRUCTOR", termsAccepted: true }`

---

### Wireframe 02: Student Dashboard (`/dashboard`)

#### Visual UI Preview
![Student Dashboard UI Mockup](file:///C:/Users/itsaa/.gemini/antigravity-ide/brain/a2d4b763-71c6-4181-80b6-45a499ef9758/wireframe_student_dashboard_1789146310314.jpg)

#### Desktop ASCII Visual Layout Schematic (1440px Grid)
```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 🎓 eLearny LMS  │ 🔍 Search courses...                │ 🔥 14 Days  │ ⚡ 1250 XP │ 👤 Avatar │
├───────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ 🏠 Home│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐              │
│ 📚 My C│ │ Enrolled: 4   │ │ Hours: 28     │ │ Certificates: 2│ │ Rank: #3      │  <- KPI Cards│
│ 🏆 Rank│ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘              │
│ ⚙️ Set │ ┌─────────────────────────────────────────┐ ┌─────────────────────────────────────┐ │
│       │ │ Continue Learning                       │ │ Upcoming Assignments                │ │
│       │ │ Advanced Web Development                │ │ Database Design Essay (Nov 21)      │ │
│       │ │ Progress: [============-------] 72%     │ │ React Submission (Sep 28)           │ │
│       │ │ [ Resume Lesson (#D96B43) ]            │ └─────────────────────────────────────┘ │
│       │ └─────────────────────────────────────────┘                                         │
│       │ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│       │ │ Recommended Courses Carousel                                                    │ │
│       │ │ [Card 1: Data Science]   [Card 2: Digital Marketing]   [Card 3: UI/UX Design]    │ │
│       │ └─────────────────────────────────────────────────────────────────────────────────┘ │
└───────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

#### Mobile ASCII Visual Layout Schematic (375px Stacked)
```
┌──────────────────────────────────────────┐
│ 🎓 eLearny     🔥 14 Days  ⚡ 1250 XP 👤 │  <- Top Bar with Duolingo Gamification Badges
├──────────────────────────────────────────┤
│ 🔍 Search courses, skills, topics...     │  <- Search Bar
├──────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │ Enrolled │ │ Hours    │ │ Certificates│ <- Metric KPI Cards Horizontal Scroll
│ │   4      │ │   28     │ │   2      │   │
│ └──────────┘ └──────────┘ └──────────┘   │
├──────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐ │
│ │ Continue Learning                    │ │
│ │ Advanced Web Development             │ │
│ │ [====================------] 72%     │ │ <- Lesson Progress Bar
│ │ [           Resume Lesson          ] │ │
│ └──────────────────────────────────────┘ │
├──────────────────────────────────────────┤
│ 🏠 Home   🔍 Explore   📚 Courses   👤   │  <- Persistent Bottom Tab Navigation
└──────────────────────────────────────────┘
```

#### Multi-State Rendering Blueprint
- **Populated State**: Real-time KPI counts, active video thumbnail preview, resume progress bar (`72%`), upcoming assignment badges (`Priority`), recommended course cards with star ratings (`4.8 ★`).
- **Skeleton Shimmer Loading**: 4 pulsed rectangular skeletons for KPI cards, large hero placeholder rectangle, horizontal card skeletons.
- **Empty State (New Student)**: Hero card displays `Welcome to eLearny! You haven't enrolled in any courses yet.`, graphic illustration of student at desk, prominent button `[ Explore Course Catalog → ]`.
- **Error State**: Red toast notification `Failed to load dashboard metrics. [ Retry ]`.

#### Backend REST API & DTO Field Mapping
- **Trigger Endpoint**: `GET /api/v1/student/dashboard`
- **DTO Fields**: `{ streakDays, xpPoints, enrolledCount, hoursLearned, certificatesCount, leaderboardRank, activeEnrollment: { courseId, title, progressPercent, lastLessonId }, upcomingAssignments: [...], recommendations: [...] }`

---

### Wireframe 03: Course Exploration Catalog & Mobile Floating Dock (`/courses`)

#### Visual UI Preview
![Mobile Catalog & Floating Dock Mockup](file:///C:/Users/itsaa/.gemini/antigravity-ide/brain/a2d4b763-71c6-4181-80b6-45a499ef9758/wireframe_mobile_catalog_dock_1789146345243.jpg)

#### Mobile Zomato-Style ASCII Visual Layout Schematic (375px)
```
┌──────────────────────────────────────────┐
│ 🎓 eLearny      Seattle, WA ▾         👤 │  <- Location Header Dropdown
├──────────────────────────────────────────┤
│ 🔍 Search courses, skills, instructors...│  <- Sticky Search Bar
├──────────────────────────────────────────┤
│ [ All ]  [ Web Dev ]  [ AI ]  [ Design ] │  <- Horizontal Category Filter Pills
├──────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐ │
│ │ Mastering React & Next.js            │ │
│ │ Sarah J. • 4.9 ★ (1,245 reviews)     │ │
│ │ [ Add to Cart ]             $89.99   │ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │ Generative AI Fundamentals           │ │
│ │ Alex M. • 4.8 ★ (980 reviews)        │ │
│ │ [ Add to Cart ]             $69.99   │ │
│ └──────────────────────────────────────┘ │
├──────────────────────────────────────────┤
│ 🛍️ 2 Courses Selected | $149.99 [Enroll→]│  <- Floating Cart Dock (Absolute)
├──────────────────────────────────────────┤
│ 🏠 Catalog   📚 Courses   🔍   🔔   👤  │  <- Bottom Tab Navigation Bar
└──────────────────────────────────────────┘
```

#### Multi-State Rendering Blueprint
- **Populated State**: Filter pills highlight active category (`All` selected in Terracotta `#D96B43`), course cards display instructor avatars, prices, and review counts. Floating Cart Dock slides up automatically when items > 0 (`transform: translateY(0)`).
- **Skeleton Shimmer Loading**: 3 card shimmer blocks with animated pulse gradient.
- **Empty State**: `No courses found matching "Quantum Computing". Try adjusting your filter tags. [ Reset Filters ]`.
- **Error State**: `Unable to reach course discovery engine. Check network connection. [ Retry ]`.

#### Backend REST API & DTO Field Mapping
- **Trigger Endpoint**: `GET /api/v1/courses?category={cat}&search={q}&page=0&size=10`
- **DTO Fields**: `{ content: [ { id, slug, title, instructorName, rating, reviewCount, price, thumbnailUrl } ], totalElements, totalPages }`

---

### Wireframe 04: Verified Certificate & Credential Page (`/certificates/verify/[code]`)

#### Visual UI Preview
![Verified Certificate Mockup](file:///C:/Users/itsaa/.gemini/antigravity-ide/brain/a2d4b763-71c6-4181-80b6-45a499ef9758/wireframe_verified_certificate_1789146388004.jpg)

#### Desktop ASCII Visual Layout Schematic (1440px Grid)
```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 🎓 eLearny LMS                                                PUBLIC CREDENTIAL VERIFICATION│
├───────────────────────────────────────────┬─────────────────────────────────────────────────┤
│                                           │  Verification Status                            │
│  ┌─────────────────────────────────────┐  │  [✓ Verified Credential]   Issuer: eLearny LMS │
│  │ 🎓 eLearny LMS       Official PDF   │  │  Status: Valid & Active                         │
│  │                                     │  ├─────────────────────────────────────────────────┤
│  │            CERTIFICATE              │  │  Unique Credential ID: EL20231012045 [📋 Copy]  │
│  │          This is awarded to         │  ├─────────────────────────────────────────────────┤
│  │              Jane Doe               │  │  Share This Verification                        │
│  │  for completing Advanced Spring    │  │  [ elearny.com/v/EL20231012045           [📋] ] │
│  │  Boot & React Microservices         │  │  [ Share LinkedIn ]  [ Tweet ]  [ Email ]       │
│  │                                     │  │                                                 │
│  │  Issue Date: Oct 12, 2023           │  │  ┌───────────┐                                  │
│  │  [ Gold Seal ]       [ Signatures ] │  │  │ 🔳 QR Code │  Scan to Verify Instantly      │
│  └─────────────────────────────────────┘  │  └───────────┘                                  │
│  [ ✓ VERIFIED CREDENTIAL (#10B981)     ]  │  [  DOWNLOAD OFFICIAL CERTIFICATE (DigiLocker)  ]│
└───────────────────────────────────────────┴─────────────────────────────────────────────────┘
```

#### Multi-State Rendering Blueprint
- **Populated State**: Verified green checkmark badge (`#10B981`), PDF preview iframe/image with gold foil seal watermark, copyable credential ID link, working QR code image, and DigiLocker style PDF download button.
- **Skeleton Shimmer Loading**: PDF document rectangle shimmer placeholder on left, verification detail card shimmer on right.
- **Empty / Invalid State**: Red warning badge `❌ INVALID OR EXPIRED CREDENTIAL`. Message `Credential code "EL999999" was not found in the eLearny verification registry. [ Report Issue ]`.
- **Error State**: Server connection error banner with retry trigger.

#### Backend REST API & DTO Field Mapping
- **Trigger Endpoint**: `GET /api/v1/certificates/verify/{code}`
- **DTO Fields**: `{ code, studentName, courseTitle, issueDate, certificateUrl, qrCodeUrl, verifiedStatus: true, issuer: "eLearny LMS Platform" }`

---

### Wireframe 05: Instructor Curriculum Builder & Course Design Wizard (`/instructor/courses/[id]/builder`)

#### Visual UI Preview
![Instructor Curriculum Builder Mockup](file:///C:/Users/itsaa/.gemini/antigravity-ide/brain/a2d4b763-71c6-4181-80b6-45a499ef9758/wireframe_instructor_curriculum_builder_1789149169864.jpg)

#### Desktop ASCII Visual Layout Schematic (1440px Grid)
```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 🎓 eLearny LMS   Instructor Curriculum Builder                               🔔 👤 Jane Doe │
├───────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ 🏠 Home│  [✓ 1. Basic Metadata]  ──►  [ 2. Curriculum Builder (#D96B43) ] ──► [ 3. Pricing ]  │
│ 📊 Dash│ ┌──────────────────────────────────────────────┐ ┌─────────────────────────────────┐ │
│ 📖 Cour│ │ Curriculum Tree                              │ │ Lesson Preview Player           │ │
│ ⚙️ Set │ │ ▼ Section 1: Introduction to LMS              │ │ ┌─────────────────────────────┐ │ │
│       │ │   :: 🎬 Getting Started Video                 │ │ │ 🎬 Video Preview            │ │ │
│       │ │      Drip Release: [ 3 days after enrollment ]│ │ └─────────────────────────────┘ │ │
│       │ │   ┌─────────────────────────────────────────┐ │ │ 📝 Quiz Question Builder      │ │ │
│       │ │   │ Video Upload Dropzone (R2 Signed URL)   │ │ └─────────────────────────────────┘ │ │
│       │ │   │ Drag & Drop Video • 45% Complete         │ │                                   │ │
│       │ │   └─────────────────────────────────────────┘ │ │                                   │ │
│       │ │   :: 📝 Quiz 1: Basics Assessment             │ │                                   │ │
│       │ │ ▼ Section 2: Advanced Concepts                │ │                                   │ │
│       │ └──────────────────────────────────────────────┘ │ [  💾 Save & Continue (#D96B43) ] │ │
└───────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

#### Multi-State Rendering Blueprint
- **Populated State**: Multi-step wizard indicator, drag-and-drop handles (`::`), drip release select boxes (`Immediately`, `X days after enrollment`), R2 upload progress bar (`45%`), lesson video preview player, Save & Continue action button.
- **Skeleton Shimmer Loading**: Shimmer outline for curriculum tree section blocks and preview video iframe placeholder.
- **Empty State**: `No modules created yet. Click [ + Add First Section ] to begin building your course curriculum.`
- **Error State**: Video upload failure banner `Upload failed: R2 pre-signed URL expired. [ Re-upload ]`.

#### Backend REST API & DTO Field Mapping
- **Trigger Endpoint**: `GET /api/v1/instructor/courses/{id}/curriculum`, `POST /api/v1/media/upload-url`, `PUT /api/v1/instructor/courses/{id}/curriculum`
- **DTO Fields**: `{ courseId, sections: [ { id, title, orderIndex, lessons: [ { id, title, type: "VIDEO" | "QUIZ" | "DOCUMENT", videoR2Key, dripDelayDays, isFreePreview } ] } ] }`

---

### Wireframe 06: Admin Operations Dashboard & Analytics (`/admin/dashboard`)

#### Visual UI Preview
![Admin Operations Dashboard Mockup](file:///C:/Users/itsaa/.gemini/antigravity-ide/brain/a2d4b763-71c6-4181-80b6-45a499ef9758/wireframe_admin_analytics_dashboard_1789149260679.jpg)

#### Desktop ASCII Visual Layout Schematic (1440px Grid)
```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 🎓 eLearny LMS  │ 🔍 Search system...         [👑 Super Admin]  👤 Alexander K.  🔔 12 ⚙️ 🚪│
├───────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ 📊 Dash│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐              │
│ 👥 User│ │ Gross Revenue │ │ Active Users  │ │ Pending Inst: │ │ Pending Cour: │  <- KPI Cards│
│ 📖 Cour│ │  $248,500     │ │   12,450      │ │   8           │ │   3           │              │
│ ⚙️ Sys │ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘              │
│       │ ┌─────────────────────────────────────────┐ ┌─────────────────────────────────────┐ │
│       │ │ Pending Instructor Approval Review      │ │ Live System Audit Log               │ │
│       │ │ Name        Date       Domain   Action  │ │ • John D. approved 'UX Design'  2m  │ │
│       │ │ Sarah Chen  Jan 11     Tech     [Appr]  │ │ • Maria G. flagged 'AI Ethics' 5m  │ │
│       │ │ David M.    Jan 11     Design   [Appr]  │ │ • John E. approved 'React'     7m  │ │
│       │ └─────────────────────────────────────────┘ └─────────────────────────────────────┘ │
└───────┴─────────────────────────────────────────────────────────────────────────────────────┘
```

#### Multi-State Rendering Blueprint
- **Populated State**: 4 KPI metric cards with sparkline revenue graphs, revenue split donut chart (80% Instructor / 20% Platform), pending instructor review data table with inline `[ Approve ]` / `[ Reject ]` action buttons, and live system audit log event feed.
- **Skeleton Shimmer Loading**: 4 rectangular shimmer metric blocks, table row shimmers, and feed list shimmers.
- **Empty State**: Approval queue shows `No pending instructor applications. All reviews caught up!` with green checkmark.
- **Error State**: System alert `Unable to fetch financial ledger telemetry. [ Refresh ]`.

#### Backend REST API & DTO Field Mapping
- **Trigger Endpoint**: `GET /api/v1/admin/dashboard/metrics`, `GET /api/v1/admin/instructor-applications?status=PENDING`
- **DTO Fields**: `{ totalGrossRevenue, activeUsersCount, pendingInstructorAppsCount, pendingCourseReviewsCount, platformRevenueSplitPercent: 20, instructorRevenueSplitPercent: 80, pendingApplications: [...], auditLogs: [...] }`

---

## 3. Workspace Skills & Layout Component Mapping Matrix

| Wireframe Spec | Target Route URL | Visual Blueprint & Layout Features | Primary Skill Reference |
| :--- | :--- | :--- | :--- |
| **Auth & Registration** | `/auth/register` | Debounced username check, password strength checklist badges, segmented role toggle. | [`taste-design-system`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/taste-design-system/SKILL.md) & [`shadcn-ui-components`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/shadcn-ui-components/SKILL.md) |
| **Student Dashboard** | `/dashboard` | KPI metric cards, continue learning video card with progress bar, streak & XP header bar. | [`taste-design-system`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/taste-design-system/SKILL.md) & [`gsap-animation-uiux`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/gsap-animation-uiux/SKILL.md) |
| **Mobile Catalog & Dock** | `/courses` | Collapsible address header, sticky search, horizontal filter pills, Zomato floating cart dock. | [`mobile-app-uiux-benchmarks`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/mobile-app-uiux-benchmarks/SKILL.md) & [`reanimated-mobile-gestures`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/reanimated-mobile-gestures/SKILL.md) |
| **Verified Certificate** | `/certificates/verify/[code]` | Gold seal certificate preview, DigiLocker verified checkmark badge (`#10B981`), QR code link. | [`mobile-app-uiux-benchmarks`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/mobile-app-uiux-benchmarks/SKILL.md) & [`21st-dev-components`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/21st-dev-components/SKILL.md) |
| **Instructor Builder** | `/instructor/courses/[id]/builder` | Multi-step wizard, drag-and-drop lesson tree, drip delay inputs, pre-signed R2 upload dropzones. | [`21st-dev-components`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/21st-dev-components/SKILL.md) & [`gsap-animation-uiux`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/gsap-animation-uiux/SKILL.md) |
| **Admin Operations** | `/admin/dashboard` | Super Admin KPI cards, revenue split donut chart (80/20), pending instructor approval table, audit feed. | [`taste-design-system`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/taste-design-system/SKILL.md) & [`shadcn-ui-components`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/shadcn-ui-components/SKILL.md) |
| **Quiz & Exam Proctoring** | `/exams/[id]/attempt` | Server-side timer, full-screen enforcement, option randomization, violation logger. | [`taste-design-system`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/taste-design-system/SKILL.md) & [`shadcn-ui-components`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/shadcn-ui-components/SKILL.md) |
| **Gamification Podium** | `/leaderboard` | Top-3 podium (Gold/Silver/Bronze), XP league rank list, Duolingo 3D tactile buttons (`border-b-5`). | [`mobile-app-uiux-benchmarks`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/mobile-app-uiux-benchmarks/SKILL.md) & [`reanimated-mobile-gestures`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/reanimated-mobile-gestures/SKILL.md) |

