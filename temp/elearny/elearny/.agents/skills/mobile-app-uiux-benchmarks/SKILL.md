---
name: mobile-app-uiux-benchmarks
description: Exhaustive architectural breakdown, navigation structures, layout hierarchies, and UI/UX implementation patterns derived from flagship mobile apps (Zomato, Swiggy, Instagram, DigiLocker, Duolingo, Airbnb). Use when building dynamic bottom navs, floating cart docks, story carousels, document verification badges, tactile buttons, or multi-flow mobile structures.
---

# Flagship Mobile App UI/UX Architecture & Benchmark Guide

This skill provides an exhaustive architectural reference, component code snippets, navigation layout trees, and gesture micro-interactions derived from top-tier flagship mobile apps (**Zomato**, **Swiggy**, **Instagram**, **DigiLocker**, **Duolingo**, **Airbnb**). Adapt these patterns directly into the **eLearny LMS Platform** (`frontend/mobile` and `frontend/web`).

---

## 1. Zomato & Swiggy: Frictionless Discovery & Floating Action Docks

### A. Navigation & Header Hierarchy
```
┌─────────────────────────────────────────────────────────────┐
│ [Location Dropdown: "Home - B-402..."]    [Profile Badge] │  <- Sticky Header
├─────────────────────────────────────────────────────────────┤
│ 🔍 [Search "Java, React, Data Science..."]                  │  <- Search Bar
├─────────────────────────────────────────────────────────────┤
│ [ (All) ]  [ (Top Rated) ]  [ (Certifications) ]  [ (Free) ] │  <- Filter Pill Carousel
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Scrollable Content Feed (Course Cards / Categories)       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ 🛍️ 2 Courses Selected | $149                  [ Enroll → ]  │  <- Floating Dock (Absolute)
├─────────────────────────────────────────────────────────────┤
│ 🏠 Home   🔍 Explore   📚 My Courses   🏆 Ranks   👤 Profile │  <- Bottom Tab Navigation
└─────────────────────────────────────────────────────────────┘
```

### B. Implementation: Collapsible Location & Search Header
```tsx
import React from "react";
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate, Extrapolation } from "react-native-reanimated";
import { View, Text, TextInput, Pressable } from "react-native";

export function CollapsibleHeaderScreen() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => {
    const height = interpolate(scrollY.value, [0, 80], [100, 60], Extrapolation.CLAMP);
    const opacity = interpolate(scrollY.value, [0, 50], [1, 0], Extrapolation.CLAMP);
    return { height, opacity };
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <Animated.View style={[{ paddingHorizontal: 16, paddingTop: 12, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderColor: "#E2E8F0" }, headerStyle]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ fontSize: 10, color: "#64748B", fontWeight: "700", letterSpacing: 0.5 }}>LEARNING LOCATION</Text>
            <Text style={{ fontSize: 14, color: "#0F172A", fontWeight: "700" }}>Online • Self-Paced Track ▾</Text>
          </View>
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(217, 107, 67, 0.12)", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#D96B43", fontWeight: "800" }}>AM</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16} contentContainerStyle={{ padding: 16 }}>
        {/* Course feed items */}
      </Animated.ScrollView>
    </View>
  );
}
```

### C. Implementation: Floating Cart / Enrollment Dock
```tsx
export function FloatingEnrollmentDock({ count, totalPrice, onPress }: { count: number; totalPrice: string; onPress: () => void }) {
  if (count === 0) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 80, // Elevated above bottom navigation bar
        left: 16,
        right: 16,
        backgroundColor: "#D96B43", // Terracotta Orange
        borderRadius: 16,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#D96B43",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <View>
        <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600" }}>{count} Course(s) Selected</Text>
        <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800" }}>{totalPrice}</Text>
      </View>

      <Pressable onPress={onPress} style={{ backgroundColor: "#FFFFFF", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 }}>
        <Text style={{ color: "#D96B43", fontWeight: "700", fontSize: 14 }}>Enroll Now →</Text>
      </Pressable>
    </Animated.View>
  );
}
```

---

## 2. Instagram: Story Bubbles, Feed Cards & Gesture Interactions

### A. Story Bubble Ring Carousel
Avatar list with unread gradient ring borders (`#D96B43` to `#F59E0B`) for instructor daily video bytes:

```tsx
import { ScrollView, View, Text, Image, Pressable } from "react-native";

export function StoryBubbleCarousel({ instructors }: { instructors: Array<{ id: string; name: string; avatar: string; hasUnread: boolean }> }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}>
      {instructors.map((instructor) => (
        <Pressable key={instructor.id} style={{ alignItems: "center", marginRight: 14 }}>
          <View style={{
            padding: 2.5,
            borderRadius: 36,
            borderWidth: instructor.hasUnread ? 2.5 : 1,
            borderColor: instructor.hasUnread ? "#D96B43" : "#CBD5E1",
          }}>
            <Image source={{ uri: instructor.avatar }} style={{ width: 56, height: 56, borderRadius: 28 }} />
          </View>
          <Text style={{ fontSize: 11, color: "#334155", marginTop: 4, fontWeight: "500" }}>{instructor.name}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
```

### B. Double-Tap Micro-Feedback Gesture
Heart/bookmark pop-up animation directly over cards upon double-tap gesture:

```tsx
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withSpring, withTiming } from "react-native-reanimated";

export function DoubleTapCard({ children, onLike }: { children: React.ReactNode; onLike: () => void }) {
  const heartScale = useSharedValue(0);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      heartScale.value = withSequence(
        withSpring(1.2, { damping: 6 }),
        withTiming(0, { duration: 250 })
      );
      onLike();
    });

  const animatedHeartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: heartScale.value > 0 ? 1 : 0,
  }));

  return (
    <GestureDetector gesture={doubleTap}>
      <View style={{ position: "relative" }}>
        {children}
        <Animated.View style={[{ position: "absolute", top: "40%", left: "40%", zIndex: 10 }, animatedHeartStyle]}>
          <Text style={{ fontSize: 64 }}>❤️</Text>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
```

---

## 3. DigiLocker: High-Trust Document Verification & Badge UI

### A. Official Document Card with Green Verification Mark
```tsx
export function DocumentVerificationCard({ title, issuer, issueDate, credentialId }: { title: string; issuer: string; issueDate: string; credentialId: string }) {
  return (
    <View style={{
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: "#E2E8F0",
      marginVertical: 6,
      shadowColor: "#0F172A",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: "#10B981", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "#FFFFFF", fontWeight: "800", fontSize: 14 }}>✓</Text>
          </View>
          <Text style={{ fontSize: 11, color: "#10B981", fontWeight: "700" }}>VERIFIED CREDENTIAL</Text>
        </View>
        <Text style={{ fontSize: 11, color: "#64748B" }}>ID: {credentialId}</Text>
      </View>

      <Text style={{ fontSize: 16, fontWeight: "700", color: "#0F172A", marginTop: 10 }}>{title}</Text>
      <Text style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>{issuer} • Issued {issueDate}</Text>
    </View>
  );
}
```

---

## 4. Duolingo: Path-Based Learning Tree & Tactile 3D Buttons

### A. Tactile 3D Button (Web & Mobile)
```tsx
export function TactileButton({ label, onPress, variant = "primary" }: { label: string; onPress: () => void; variant?: "primary" | "secondary" }) {
  const isPrimary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: isPrimary ? "#D96B43" : "#FFFFFF",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: isPrimary ? "#C45A33" : "#CBD5E1",
        borderBottomWidth: pressed ? 1 : 5,
        borderBottomColor: isPrimary ? "#A34421" : "#94A3B8",
        transform: [{ translateY: pressed ? 4 : 0 }],
        alignItems: "center",
      })}
    >
      <Text style={{ color: isPrimary ? "#FFFFFF" : "#0F172A", fontWeight: "800", fontSize: 15, letterSpacing: 0.3 }}>
        {label}
      </Text>
    </Pressable>
  );
}
```

### B. Header Gamification Bar (Streaks & XP)
```tsx
export function HeaderGamificationBar({ streakDays, xpPoints }: { streakDays: number; xpPoints: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderColor: "#F1F5F9" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FFF7ED", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
        <Text style={{ fontSize: 14 }}>🔥</Text>
        <Text style={{ fontSize: 13, fontWeight: "800", color: "#EA580C" }}>{streakDays} Days</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FEF2F2", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
        <Text style={{ fontSize: 14 }}>⚡</Text>
        <Text style={{ fontSize: 13, fontWeight: "800", color: "#DC2626" }}>{xpPoints} XP</Text>
      </View>
    </View>
  );
}
```

---

## 5. Comprehensive Feature & Architecture Matrix

| Flagship App | Core Layout / Architecture Pattern | eLearny LMS Target Application |
| :--- | :--- | :--- |
| **Zomato & Swiggy** | Collapsible Location Header, Sticky Search, Floating Checkout Dock, Order Timeline | Mobile & Web Course Exploration Catalog, Quick Enrollment Dock, Live Course Progress |
| **Instagram** | Story Ring Carousel, Double-Tap Heart Micro-interaction, Bottom Tab Active Icon Morphing | Student Dashboard Feed (`/dashboard`), Instructor Daily Bytes, Course Bookmarking |
| **DigiLocker** | Verified Document Card with Green Seal Checkmark, Official Watermark, QR Verification Sheet | Student Certificate Portfolio (`/certificates`), Public Credential Verification Page (`/verify/[id]`) |
| **Duolingo** | Path-Based Serpentine Node Tree, Tactile 3D Buttons (`border-b-5`), Streak & XP Bar | Quiz Engine, Gamification Leaderboards, Code Practice Sandbox |
| **Airbnb & Spotify** | Glassmorphism Backdrop Headers, Collapsible Filter Search Cards, Snap Card Carousels | Hero Course Showcases, Category Discovery Wheels |
