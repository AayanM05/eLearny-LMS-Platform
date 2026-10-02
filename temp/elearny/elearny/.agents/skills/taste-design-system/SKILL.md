---
name: taste-design-system
description: High-taste visual design guidelines, color token hierarchy (Terracotta Orange #D96B43), glassmorphism standards, typography rules (Inter, Space Grotesk, Anton), and UI/UX aesthetic excellence for the eLearny LMS Platform.
---

# Taste & Design System Guidelines — eLearny LMS

This skill enforces strict aesthetic standards, visual excellence, curated color palettes, typography hierarchy, and micro-interaction principles across the **eLearny LMS Platform** (`frontend/web` and `frontend/mobile`).

---

## 1. Core Color Palette & Design Tokens

### Primary Theme Accent: Terracotta Orange (`#D96B43`)
Derived from the student graduation mark brand identity:

- **Primary Brand**: `#D96B43` (`hsl(17, 66%, 56%)`)
- **Primary Hover / Active**: `#C45A33` (`hsl(17, 66%, 48%)`)
- **Primary Soft Tint**: `rgba(217, 107, 67, 0.12)` (`hsl(17, 66%, 94%)`)
- **Primary Glow**: `0 10px 25px -5px rgba(217, 107, 67, 0.3)`

### Surface & Background Tokens

| Mode | Background | Surface Card | Border | Primary Text | Secondary Text |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Light** | `#FAFAFA` | `#FFFFFF` | `#E2E8F0` | `#0F172A` | `#64748B` |
| **Dark** | `#090D16` | `#0F172A` | `#1E293B` | `#F8FAFC` | `#94A3B8` |

---

## 2. Typography Hierarchy

- **Body & Controls**: `Inter` — Line height `1.5`, letter spacing `normal`.
- **Headings & Metrics**: `Space Grotesk` — Medium/SemiBold/Bold, letter spacing `-0.02em`.
- **Display & Gamification Badges**: `Anton` — Upper-case display headings, numbers, and achievement badges.

---

## 3. High-Taste Design Rules (The "WOW" Standard)

1. **No Plain Colors**: Never use standard browser red, blue, green, or pure black (`#000000`). Use tailored HSL tokens (`hsl(17, 66%, 56%)`, `#0F172A`).
2. **Glassmorphism Overlay**:
   ```css
   background: rgba(255, 255, 255, 0.75);
   backdrop-filter: blur(12px) saturate(180%);
   border: 1px solid rgba(255, 255, 255, 0.3);
   ```
3. **Subtle Mesh Gradients**: Add soft radial background accents:
   ```css
   background-image: radial-gradient(at 0% 0%, rgba(217, 107, 67, 0.15) 0px, transparent 50%),
                     radial-gradient(at 100% 100%, rgba(15, 23, 42, 0.05) 0px, transparent 50%);
   ```
4. **Dynamic Hover Elevation**: Cards must elevate slightly on hover with matching shadow glow:
   - Web: `transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1)`
   - Scale: `1.02` max, Y-offset: `-4px`.
5. **No Static Minimum Viable Product UI**: Always include loading skeletons, empty states with route action CTAs, and active hover state indicators.
