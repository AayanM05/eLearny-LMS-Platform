---
name: reanimated-mobile-gestures
description: Comprehensive guide for hardware-accelerated 60fps mobile animations, fluid gestures, layout transitions, and interactive spring physics using React Native Reanimated 3 and React Native Gesture Handler in Expo SDK 51+ mobile app (frontend/mobile).
---

# React Native Reanimated & Mobile Gestures Skill — eLearny LMS

This skill provides implementation patterns and performance rules for building smooth, 60fps native mobile animations and touch gestures in the **eLearny LMS Mobile App** (`frontend/mobile`).

---

## 1. Core Architecture & Setup

### Declarative Native Thread Execution
React Native Reanimated executes animation logic on the native UI thread using **worklets**, bypassing JavaScript bridge bottlenecks.

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { View, Text, Pressable } from "react-native";
```

---

## 2. Animation Patterns & Physics

### Pattern A: Interactive Pressable Card with Spring Physics
```tsx
import React from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Pressable, Text } from "react-native";

export function CourseCardTile({ title, category }: { title: string; category: string }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 12, stiffness: 200 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 180 });
      }}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            padding: 18,
            borderRadius: 16,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#E2E8F0",
            marginVertical: 6,
          },
        ]}
      >
        <Text style={{ fontSize: 12, color: "#D96B43", fontWeight: "700" }}>{category}</Text>
        <Text style={{ fontSize: 16, color: "#0F172A", fontWeight: "600", marginTop: 4 }}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
}
```

### Pattern B: Swipeable Pan Gesture (Swipe-to-Dismiss / Action)
```tsx
export function SwipeableLessonRow({ title, onDelete }: { title: string; onDelete: () => void }) {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, -100);
      }
    })
    .onEnd(() => {
      if (translateX.value < -60) {
        translateX.value = withTiming(-100);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[animatedRowStyle, { padding: 16, backgroundColor: "#FFFFFF" }]}>
        <Text>{title}</Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

---

## 3. Best Practices & Rules

1. **Native Thread Rules**: Never perform synchronous JavaScript state updates inside worklet functions unless wrapped in `runOnJS()`.
2. **Spring Parameters**: Use `{ damping: 15, stiffness: 150 }` for standard natural UI bounce.
3. **Terracotta Accent Colors**: Use `#D96B43` (Light theme) or `#E5835C` (Dark theme) for active touch feedback.
