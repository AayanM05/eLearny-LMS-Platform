import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function MobileLoginScreen() {
  const router = useRouter();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Navigate to mobile index/dashboard
    router.replace("/");
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0F172A" }} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <Text style={{ fontSize: 28, fontWeight: "800", color: "#FFFFFF", marginBottom: 8 }}>
        Welcome Back
      </Text>
      <Text style={{ fontSize: 14, color: "#94A3B8", marginBottom: 24 }}>
        Sign in to your eLearny LMS account
      </Text>

      <View style={{ gap: 16 }}>
        <View>
          <Text style={{ fontSize: 11, color: "#CBD5E1", fontWeight: "700", marginBottom: 6 }}>USERNAME OR EMAIL</Text>
          <TextInput
            value={usernameOrEmail}
            onChangeText={setUsernameOrEmail}
            placeholder="janedoe24"
            placeholderTextColor="#64748B"
            style={{ backgroundColor: "#020617", borderWidth: 1, borderColor: "#1E293B", borderRadius: 12, padding: 14, color: "#FFFFFF", fontSize: 14 }}
          />
        </View>

        <View>
          <Text style={{ fontSize: 11, color: "#CBD5E1", fontWeight: "700", marginBottom: 6 }}>PASSWORD</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••••••"
            secureTextEntry
            placeholderTextColor="#64748B"
            style={{ backgroundColor: "#020617", borderWidth: 1, borderColor: "#1E293B", borderRadius: 12, padding: 14, color: "#FFFFFF", fontSize: 14 }}
          />
        </View>

        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => ({
            backgroundColor: "#D96B43",
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: "center",
            marginTop: 12,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "800", fontSize: 15 }}>Sign In →</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/(auth)/register")} style={{ alignItems: "center", marginTop: 12 }}>
          <Text style={{ color: "#D96B43", fontSize: 13, fontWeight: "600" }}>Don't have an account? Sign Up</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
