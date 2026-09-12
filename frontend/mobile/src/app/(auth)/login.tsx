import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Image, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMobileTheme } from "../_layout";

export default function MobileLoginScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useMobileTheme();
  const isDark = theme === "dark";

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Navigate to mobile index/dashboard
    router.replace("/");
  };

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header with Branding Logo & Theme Switcher */}
      <View style={styles.header}>
        <Image
          source={
            isDark
              ? require("../../../assets/branding/logo-dark.png")
              : require("../../../assets/branding/logo-light.png")
          }
          style={styles.logoImage}
          resizeMode="contain"
        />

        <Pressable
          style={[styles.themeBtn, isDark ? styles.darkThemeBtn : styles.lightThemeBtn]}
          onPress={toggleTheme}
        >
          <Text style={styles.themeBtnText}>{isDark ? "☀️" : "🌙"}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title Group */}
        <View style={styles.titleGroup}>
          <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, isDark ? styles.darkSubtext : styles.lightSubtext]}>
            Sign in to continue your learning journey on eLearny LMS.
          </Text>
        </View>

        {/* Card Form */}
        <View style={[styles.formCard, isDark ? styles.darkCard : styles.lightCard]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, isDark ? styles.darkSubtext : styles.lightSubtext]}>
              USERNAME OR EMAIL
            </Text>
            <TextInput
              value={usernameOrEmail}
              onChangeText={setUsernameOrEmail}
              placeholder="janedoe24 or jane@email.com"
              placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
              style={[
                styles.textInput,
                isDark ? styles.darkInput : styles.lightInput,
              ]}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, isDark ? styles.darkSubtext : styles.lightSubtext]}>
              PASSWORD
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••••••"
              secureTextEntry
              placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
              style={[
                styles.textInput,
                isDark ? styles.darkInput : styles.lightInput,
              ]}
            />
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.primaryBtn,
              { transform: [{ scale: pressed ? 0.98 : 1 }] },
            ]}
          >
            <Text style={styles.primaryBtnText}>Sign In →</Text>
          </Pressable>
        </View>

        {/* Link to Register */}
        <View style={styles.footerLinkGroup}>
          <Text style={[styles.footerText, isDark ? styles.darkSubtext : styles.lightSubtext]}>
            Don't have an account?{" "}
          </Text>
          <Pressable onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.linkText}>Sign Up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightBg: {
    backgroundColor: "#FAFAFA",
  },
  darkBg: {
    backgroundColor: "#090D16",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logoImage: {
    height: 36,
    width: 140,
  },
  themeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  lightThemeBtn: {
    backgroundColor: "#F1F5F9",
  },
  darkThemeBtn: {
    backgroundColor: "#1E293B",
  },
  themeBtnText: {
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 20,
  },
  titleGroup: {
    gap: 6,
  },
  title: {
    fontSize: 28,
    fontFamily: "SpaceGrotesk_700Bold",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  formCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    gap: 16,
  },
  lightCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: "#0F172A",
    borderColor: "#1E293B",
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.8,
  },
  textInput: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    borderWidth: 1,
  },
  lightInput: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    color: "#0F172A",
  },
  darkInput: {
    backgroundColor: "#020617",
    borderColor: "#1E293B",
    color: "#FFFFFF",
  },
  primaryBtn: {
    backgroundColor: "#D96B43",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  footerLinkGroup: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  linkText: {
    color: "#D96B43",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  lightText: {
    color: "#0F172A",
  },
  darkText: {
    color: "#FFFFFF",
  },
  lightSubtext: {
    color: "#64748B",
  },
  darkSubtext: {
    color: "#94A3B8",
  },
});
