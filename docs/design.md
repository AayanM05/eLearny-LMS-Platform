# eLearny — Design Document (design.md)

> Status: **v0.1.** Governs visual identity — color, typography, spacing,
> component styling philosophy. `rules.md` section 11 governs *how* this
> gets implemented in code (icon library, animation discipline, when the
> `frontend-design` skill applies); this document governs *what* the
> actual visual language is.

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
  --primary: 252 75% 58%;          /* Indigo/violet — the one confident accent */
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
  --primary: 252 80% 68%;           /* slightly lighter for contrast on dark bg */
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
must reference tokens (`bg-primary`) and never a raw color (`bg-[#7c3aed]`)
or the whole point of this architecture breaks.

**Chosen starting palette:** Indigo/violet as the primary — reads as
modern and tech-forward, has enough saturation to feel "bold" without
tipping into playful (avoiding pinks/oranges keeps it professional).

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

## 8. Change Log
- **v0.1** — Initial design direction: Modern/Minimal + Bold/Vibrant +
  Professional, explicitly rejecting rounded/soft aesthetics. Indigo/violet
  primary. CSS-custom-property token architecture so the entire color
  scheme can be changed by editing one file. Inter + Space Grotesk
  typography. Small, sharp border radius. Light-first with dark mode
  toggle.
