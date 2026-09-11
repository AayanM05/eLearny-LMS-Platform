---
name: gsap-animation-uiux
description: Complete guide and design standards for GSAP (GreenSock) web animations, React Native Reanimated mobile gestures, micro-interactions, and 21st.dev/shadcn UI patterns for the eLearny LMS Platform. Use when implementing animated components, landing pages, interactive course cards, scroll reveals, or mobile gestures.
---

# GSAP & UI/UX Animation Guide — eLearny LMS

This skill provides comprehensive instructions, code patterns, performance rules, and UI/UX design standards for creating world-class, smooth 60fps animations across the **eLearny LMS Platform** (`frontend/web` and `frontend/mobile`).

---

## 1. Web Architecture (`frontend/web/`)

### Core Setup & Imports
Always import `gsap` and `useGSAP` from `@gsap/react` via the centralized helper [`src/lib/gsap.ts`](file:///a:/Java%20SpringBoot%20Projects/eLearny%20-%20LMS/frontend/web/src/lib/gsap.ts) to guarantee SSR safety and plugin registration.

```typescript
import { gsap, useGSAP } from "@/lib/gsap";
import { useRef } from "react";
```

### Next.js App Router Context Cleanup
To avoid memory leaks and DOM layout glitches during route changes, wrap component animations in `useGSAP()` or explicit `gsap.context()`:

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export function HeroBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Automatic cleanup on unmount
      gsap.from(".hero-title", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".hero-card", {
        scale: 0.92,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.3,
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <h1 className="hero-title text-4xl font-bold">Master New Skills</h1>
      <div className="flex gap-4 mt-6">
        <div className="hero-card p-6 bg-card border rounded-2xl">Course 1</div>
        <div className="hero-card p-6 bg-card border rounded-2xl">Course 2</div>
      </div>
    </div>
  );
}
```

---

## 2. Standard Web Animation Patterns

### Pattern A: Scroll-Triggered Reveal Grid
Use `ScrollTrigger` for section entrances as users scroll down landing pages and catalog grids:

```typescript
useGSAP(
  () => {
    gsap.from(".scroll-reveal-item", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      y: 50,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "power2.out",
    });
  },
  { scope: containerRef }
);
```

### Pattern B: Terracotta Glow & Hover Physics
For course cards and action buttons, combine CSS transitions with GSAP hover scale physics:

```tsx
export function CourseCard({ title, price }: { title: string; price: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: cardRef });

  const handleMouseEnter = contextSafe(() => {
    gsap.to(cardRef.current, {
      y: -6,
      scale: 1.02,
      boxShadow: "0 20px 30px -10px rgba(217, 107, 67, 0.25)",
      duration: 0.3,
      ease: "power2.out",
    });
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      duration: 0.3,
      ease: "power2.inOut",
    });
  });

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="p-5 rounded-2xl bg-background border border-border/60 transition-colors cursor-pointer"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-primary font-bold mt-2">{price}</p>
    </div>
  );
}
```

---

## 3. Mobile Architecture (`frontend/mobile/`)

React Native does not run on the browser DOM, so mobile native animations use `react-native-reanimated` and `react-native-gesture-handler` for hardware-accelerated 60fps UI thread execution.

### Reanimated Spring Card Example
```tsx
import React from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Pressable, Text } from "react-native";

export function MobileCourseCard({ title }: { title: string }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10 });
      }}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            padding: 16,
            borderRadius: 16,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#E2E8F0",
          },
        ]}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
}
```

---

## 4. UI/UX Component Integration (21st.dev & Shadcn)

When using **Shadcn UI** components or **21st.dev** animated blocks:
1. **Combine Utilities**: Use `cn()` from `@/lib/utils` for tailwind class merging alongside GSAP ref targets.
2. **Accessible Motion**: Honor user preference for reduced motion:
```typescript
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!prefersReducedMotion) {
  // Execute GSAP animation
}
```
3. **Terracotta Theme Tokens**: Always tie active states and focus glows to `hsl(var(--primary))` / `#D96B43`.

---

## 5. Summary Checklist for Animation Tasks

- [ ] Import GSAP through `@/lib/gsap`.
- [ ] Wrap component animations in `useGSAP({ scope: containerRef })`.
- [ ] Use `contextSafe()` for event-handler triggered animations (`onMouseEnter`, `onClick`).
- [ ] Keep duration between `0.2s`–`0.6s` for snappy UI micro-interactions.
- [ ] Ensure mobile UI uses `react-native-reanimated` shared values on the native thread.
