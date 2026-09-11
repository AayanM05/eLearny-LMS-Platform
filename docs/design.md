# eLearny — Design Document (design.md)

> Status: **v0.6 — living document.** Governs visual identity — color, typography, spacing,
> component styling philosophy, and high content density visual rules. eLearny is high-level and large-scale by design — **not a demo or MVP**.
> Enforces rich multi-card layouts, metric KPI grids, zero deprecation warnings, and multi-state UI shimmers across Next.js (web) and NativeWind v4 (mobile).
> AI tools MUST double-check all UI implementations to ensure proper layout filling, high content density, and multi-state readiness before completion.

---

## 1. Design Philosophy

**Direction: Modern & Minimal + Bold & Vibrant + Corporate & Professional —
explicitly not Warm/Rounded.**

This is a coherent combination, not a contradiction: think closer to
Linear, Stripe, or Vercel's visual language than to a soft consumer-app
feel like Duolingo. Concretely, that means:

- **Generous whitespace and restraint** (from Minimal) — the UI doesn't
  compete with the content; most surfaces are quiet
- **One confident, saturated accent color used deliberately** (from Bold &
  Vibrant) — vibrancy comes from *purposeful pops of color* on key actions
  and moments (CTAs, active states, gamification unlocks), not from
  covering the UI in color
- **Structured, high-contrast layout with sharp edges** (from Corporate &
  Professional, and the explicit anti-rounded preference) — small or
  near-zero border radius, clear grid alignment, no soft/pill-shaped
  buttons, no heavy `rounded-2xl`/`rounded-full` treatments anywhere in
  the interface
- **Explicitly avoided:** large soft corners, pastel/muted palettes,
  bouncy/playful motion, illustration-heavy "friendly" onboarding style

This applies identically across web and mobile — same tokens, same
philosophy, platform-appropriate implementation.

---

## 2. Color System — Token Architecture

**Single source of truth, re-themeable by editing one file.** Every color
in the product is a CSS custom property (design token) referenced by name
— components never contain a raw hex code. To reskin the entire platform
to a different color direction later, only the token *values* in this one
file change; no component code changes.

```css
/* frontend/web/app/globals.css — the ONLY file that defines raw color values */

:root {
  /* Brand */
  --primary: 17 66% 56%;           /* Terracotta Orange (#D96B43) — the official brand accent matching logo-icon */
  --primary-foreground: 0 0% 100%;

  /* Neutrals (structure, most of the UI) */
  --background: 0 0% 100%;
  --foreground: 240 10% 12%;
  --muted: 240 5% 96%;
  --muted-foreground: 240 4% 46%;
  --border: 240 6% 90%;

  /* Semantic */
  --success: 142 71% 40%;
  --warning: 38 92% 50%;
  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 100%;

  /* Structure */
  --radius: 0.25rem;   /* sharp, not the shadcn default 0.5rem+ — see section 4 */
}

.dark {
  --background: 240 10% 8%;
  --foreground: 0 0% 96%;
  --muted: 240 6% 16%;
  --muted-foreground: 240 5% 65%;
  --border: 240 6% 20%;
  --primary: 17 75% 62%;            /* Terracotta Orange (#E57A52) — slightly lighter for high contrast on dark bg */
  --primary-foreground: 240 10% 8%;
  /* success/warning/destructive stay the same unless contrast testing says otherwise */
}
```

Tailwind config maps utility classes to these tokens (`bg-primary`,
`text-foreground`, `border-border`, etc.) rather than to fixed color
values — so `bg-primary` always means "the current theme's primary color,"
whatever that resolves to.

**To change the entire platform's color scheme later:** edit the values in
this one `:root`/`.dark` block. That's the whole re-theming operation —
this is the specific thing you asked for, and it's why every component
must reference tokens (`bg-primary`) and never a raw color (`bg-[#D96B43]`)
or the whole point of this architecture breaks.

**Official Brand Palette:** **Terracotta Orange (`#D96B43` / `HSL 17° 66% 56%`)** is the locked primary brand accent—derived directly from the official `logo-icon.png` student avatar graduation cap mark. It provides a warm, high-confidence, executive visual tone across both web and mobile platforms.

---

## 3. Typography

- **UI/body font:** `Inter` — clean, highly legible at small sizes, the
  de facto standard for modern SaaS/tech interfaces, reinforces the
  Minimal + Professional direction
- **Heading/display font:** `Space Grotesk` — a geometric sans with more
  character than Inter at large sizes, used for page titles and hero
  text to introduce the "Bold" personality without relying on color or
  decoration to do it
- **Scale:** standard modular scale (Tailwind defaults are fine —
  `text-sm` / `text-base` / `text-lg` / `text-xl` / `text-2xl` /
  `text-3xl`+ for display), not a custom scale — no reason to reinvent
  this
- **Weight usage:** headings at `font-semibold`/`font-bold`, body at
  `font-normal` — avoid using font-weight alone to convey emphasis where
  color or size would be clearer

**Cross-platform mechanism — this is the same fonts, applied two
different ways, since web and mobile have no shared font-loading
system:**
- **Web:** `next/font/google` loads Inter + Space Grotesk once in
  `frontend/web/app/layout.tsx`, exposed as CSS variables, referenced by
  Tailwind's `fontFamily` config — this cascades automatically via CSS,
  same as any web font.
- **Mobile:** React Native has no font cascade. Inter and Space Grotesk
  are loaded via `expo-font` + the `@expo-google-fonts` packages, and
  applied as the **global default** via a one-time `Text.defaultProps`
  override in the root layout — see `rules.md` §14 for the exact
  pattern. **This must be set globally in one place, never per-component
  or per-file** — a font being set individually on separate screens is
  a sign the global default isn't wired up correctly, not something to
  patch screen-by-screen.

---

## 4. Spacing & Radius

- **Spacing:** Tailwind's default 4px-based scale (`p-1` through `p-16`,
  etc.) — no custom spacing scale needed
- **Border radius: intentionally small.** `--radius: 0.25rem` (4px) as the
  base token. This is a direct implementation of "no rounded UI
  components" — buttons, cards, and inputs get a crisp, barely-there
  corner rather than the soft `rounded-xl`/`rounded-2xl` common in
  friendlier consumer apps. No `rounded-full` anywhere except genuinely
  circular elements (avatars, status dots) — never on buttons or pills.
- Since `--radius` is a single token, this too can be adjusted platform-wide
  from one place if the feel needs tuning later.

---

## 5. Component Styling Notes

- **Buttons:** sharp corners (per `--radius`), solid `bg-primary` for
  primary actions, outline/ghost variants for secondary — no gradient
  fills, no soft shadows-as-depth (flat design, structure comes from
  borders and spacing, not drop shadows)
- **Cards:** thin `border-border`, minimal or no shadow, sharp corners —
  structure over decoration
- **Inputs:** clear visible border, sharp corners, focus state uses
  `--primary` as a ring/outline color — no soft glow effects
- **Data-heavy views** (admin panels, instructor analytics): favor density
  and clarity over decoration — this is where "Corporate & Professional"
  should be most visible

---

## 6. Iconography & Motion (cross-reference to rules.md §11)

- Icons: `lucide-react` — thin, geometric line icons match the sharp,
  minimal direction better than filled/rounded icon sets
- Motion: deliberate and snappy, not bouncy or playful — short duration
  (150–250ms), simple easing (ease-out for entrances), reserved for
  meaningful moments (page transitions, gamification unlocks, state
  changes) rather than decorative flourish on every hover

---

## 7. Theme Mode

- **Light-first.** Light mode is the default and the primary design
  target; dark mode is a supported toggle (via `next-themes` on web),
  not an equal-priority parallel design — meaning new components get
  designed for light mode first, then checked against the dark token
  values in section 2 for contrast, not designed twice from scratch.

---

## 8. UI/UX Reference & Interaction Quality Bar

**Reference apps, and an explicit note on a real conflict.** Zomato/Swiggy
(mobile reference) and Hostinger/Dreamhost (web reference) are both
visually **rounded and soft** — pill buttons, heavy rounded cards, bright
saturated color use. That directly conflicts with §1's explicit rejection
of rounded/soft aesthetics. Resolution: borrow their **interaction
quality** — animation polish, imagery richness, information density,
motion choreography — not their literal corner radius or color exuberance.
Every component still uses this document's sharp-radius token system
(§4) and indigo/violet palette (§2). If that trade-off is wrong, the fix
is a one-line change to `--radius` in §2's token file, not abandoning
this section's interaction guidance.

### 8.1 Mobile reference: Zomato/Swiggy-level polish
What to actually borrow:
- **Card-based content with real imagery**, not placeholder icons — course cards, article cards, and practice-problem cards should feel image-rich and browsable, the way a food-delivery app's restaurant cards do
- **Skeleton loading states**, not bare spinners — content-shaped placeholders that resolve into real content
- **Micro-interactions on every interactive element** — a button press, a card tap, a completed action all get a small, deliberate animation response (via `react-native-reanimated`/Moti-equivalent, per `rules.md`) — nothing should feel inert
- **Pull-to-refresh** on list/feed screens (Home, Browse, Notifications)
- **Bottom tab navigation** with icon + label, persistent across the app's primary sections (Home, Browse, My Courses/Learning, Notifications, Profile) — this is the actual mechanism for "the app should feel like a real app," not a web page in a native wrapper
- **Smooth screen-transition animations** between navigation states — no jarring instant cuts

### 8.2 Web reference: Hostinger/Dreamhost-level marketing polish
What to actually borrow (applies to public-facing pages — landing, course
detail, article pages — not internal dashboards, which should stay dense
and functional per §5):
- **A real hero section** — actual imagery/illustration and a clear value
  proposition, not empty whitespace with a headline floating alone
- **Feature grids with icons and short copy**, not walls of paragraph text
- **Trust signals** — real stats *only once they're real* (see the
  critical note below), reviews, instructor credibility markers
- **Clear visual hierarchy and section rhythm** — alternating content
  density/background treatment between sections so a long page doesn't
  feel monotonous
- **Generous but purposeful whitespace** — full-width sections with
  properly constrained inner content (per §8.3), not content awkwardly
  shrunk into a corner of the viewport

### 8.3 Layout rule — fills the screen properly (fixes the "thin pages" problem)
This directly addresses a real problem found in the last build pass —
pages rendering as small, unstyled content islands rather than actual
screens:
- **Every page's outer container fills the viewport** (`w-full`,
  appropriate `min-h-screen` on web; `flex: 1` on mobile) — the page
  background and structural chrome always extend edge to edge
- **Content width is a deliberate choice, not an accident**: dashboards
  and data views use the full available width in a grid/table layout;
  reading content (articles, course descriptions) uses a constrained
  max-width (e.g. `max-w-3xl`) *centered* within the full-width page, for
  readability — never the whole page rendering at a cramped default width
- **No orphaned content** — a form, a card, or a message should never sit
  alone in an unstyled box in the top-left corner of an otherwise empty
  page. Every page has a deliberate layout: header/nav context, main
  content area sized to its content type, appropriate padding

### 8.4 Critical honesty rule — no fabricated content
**Never place placeholder statistics, fake testimonials, invented phone
numbers/support emails, or claims about features that don't yet work
into any page, "for now" or "to make it look complete."** A landing page
claiming "15,000+ students enrolled" or a support number that doesn't
exist is not a UI/UX choice — it is a deceptive design defect and is 
never acceptable, including on a work-in-progress build. Where a
real number/testimonial doesn't exist yet, the honest options are: omit
the section entirely, use a clearly-marked placeholder in a
non-production build, or show the section once the real data exists.
This applies regardless of how visually convincing the fabricated version
looks.

---

## 10. Brand Logo & Visual Identity Assets

**Master Brand Assets (`logo/` Directory Structure)**:

1. **Master Brand Files**:
   - **`logo/hr-logo.png`**: Light Mode horizontal logo with white background.
   - **`logo/hr-logo-bgr.png`**: Light Mode horizontal logo transparent background.
   - **`logo/hr-logo-dark.png`**: Dark Mode horizontal logo with dark background (`#1E2022`).
   - **`logo/hr-logo-dark-bgr.png`**: Dark Mode horizontal logo transparent background.
   - **`logo/logo-icon.png`**: Square 1:1 icon mark — Terracotta / Copper Orange (`#D96B43`) student profile avatar pictogram with a graduation cap.
   - **`logo/favicon/`**: Complete Web Favicon Kit (`favicon.ico`, `favicon.svg`, `favicon-96x96.png`, `apple-touch-icon.png`, `site.webmanifest`).

2. **Web Frontend Asset Storage (`frontend/web/public/`)**:
   - `frontend/web/public/favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `site.webmanifest` (Tab & PWA icons).
   - `frontend/web/public/assets/branding/hr-logo-bgr.png` (Light mode header logo).
   - `frontend/web/public/assets/branding/hr-logo-dark-bgr.png` (Dark mode header logo).
   - `frontend/web/public/assets/branding/logo-icon.png` (Square avatar & footer icon mark).

3. **Mobile Frontend Asset Storage (`frontend/mobile/assets/`)**:
   - `frontend/mobile/assets/branding/hr-logo-bgr.png` (Light mode splash screen & header logo).
   - `frontend/mobile/assets/branding/hr-logo-dark-bgr.png` (Dark mode splash screen & header logo).
   - `frontend/mobile/assets/branding/logo-icon.png` (Assigned as `icon` in Expo `app.json`).

4. **Mobile Splash Screen Architecture**:
   - Native mobile splash screen renders the **centered horizontal logo** (`hr-logo-bgr.png` for Light theme, `hr-logo-dark-bgr.png` for Dark theme) on `#FFFFFF` or `#0F172A` background according to the active theme chosen in the app.

---


---

## 11. Workspace Customization Skills & Benchmark Reference

All UI/UX implementations must actively consult and adhere to the project's 6 custom workspace skills located in `.agents/skills/`:

1. **[`taste-design-system`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/taste-design-system/SKILL.md)**: Governs visual excellence, Terracotta Orange (`#D96B43` / `HSL 17° 66% 56%`) token hierarchy, glassmorphism standards, and font pairing (`Inter`, `Space Grotesk`, `Anton`).
2. **[`mobile-app-uiux-benchmarks`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/mobile-app-uiux-benchmarks/SKILL.md)**: Governs flagship mobile layout structures derived from Zomato, Swiggy, Instagram, DigiLocker, Duolingo, and Airbnb — including Floating Action Docks, Collapsible Location Headers, Verified Certificate Badges, and Tactile 3D Buttons (`border-b-5`).
3. **[`gsap-animation-uiux`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/gsap-animation-uiux/SKILL.md)**: Governs Next.js GSAP 3 web animations (`useGSAP`, `ScrollTrigger`, `contextSafe` event handlers).
4. **[`reanimated-mobile-gestures`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/reanimated-mobile-gestures/SKILL.md)**: Governs Expo React Native Reanimated 3 hardware-accelerated 60fps native gestures, spring physics, and pan gestures.
5. **[`21st-dev-components`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/21st-dev-components/SKILL.md)**: Governs sourcing, installing, and customizing modern React component blocks via the `21st-dev` MCP server.
6. **[`shadcn-ui-components`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/.agents/skills/shadcn-ui-components/SKILL.md)**: Governs adding and extending Shadcn UI primitives (Radix UI + Tailwind CSS) via the `shadcn` MCP server.

---

## 9. Change Log
- **v0.7** — Added §11 explicitly mapping all 6 custom workspace skills (`taste-design-system`, `mobile-app-uiux-benchmarks`, `gsap-animation-uiux`, `reanimated-mobile-gestures`, `21st-dev-components`, `shadcn-ui-components`) into the design system specification.
- **v0.1** — Initial design direction: Modern/Minimal + Bold/Vibrant +
  Professional, explicitly rejecting rounded/soft aesthetics. Indigo/violet
  primary. CSS-custom-property token architecture so the entire color
  scheme can be changed by editing one file. Inter + Space Grotesk
  typography. Small, sharp border radius. Light-first with dark mode
  toggle.
- **v0.2** — Added a UI/UX Reference & Interaction Quality Bar section:
  Zomato/Swiggy as the mobile polish reference, Hostinger/Dreamhost as the
  web marketing-polish reference — with an explicit note that both
  references are visually rounded/soft, conflicting with §1's stated
  direction, resolved by borrowing interaction quality (motion, imagery,
  density) rather than their literal corner radius or color exuberance.
  Added a full-screen layout rule to directly address thin/orphaned page
  content found in a build review, and a critical rule against fabricated
  stats/testimonials/content appearing anywhere in the product.
- **v0.3** — Fixed a real gap: the typography section only described
  web's font mechanism (`next/font/google` + Tailwind), with no mobile
  equivalent defined — which is what caused per-file font hacks on
  mobile (React Native has no CSS cascade, so nothing was applying the
  fonts globally). Added the explicit cross-platform mechanism: web via
  CSS variables (unchanged), mobile via `expo-font` + a one-time global
  `Text.defaultProps` override — full pattern in `rules.md` §14.
