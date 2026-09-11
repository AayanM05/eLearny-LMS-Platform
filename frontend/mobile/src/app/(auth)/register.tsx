import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function MobileRegisterScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");

  const handleRegister = () => {
    // Navigate to login
    router.replace("/(auth)/login");
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0F172A" }} contentContainerStyle={{ padding: 24, paddingTop: 60 }}>
      <Text style={{ fontSize: 28, fontWeight: "800", color: "#FFFFFF", marginBottom: 8 }}>
        Create Account
      </Text>
      <Text style={{ fontSize: 14, color: "#94A3B8", marginBottom: 24 }}>
        Join eLearny LMS Mobile App v2.0.0
      </Text>

      <View style={{ gap: 16 }}>
        <View>
          <Text style={{ fontSize: 11, color: "#CBD5E1", fontWeight: "700", marginBottom: 6 }}>FULL NAME</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Jane Doe"
            placeholderTextColor="#64748B"
            style={{ backgroundColor: "#020617", borderWidth: 1, borderColor: "#1E293B", borderRadius: 12, padding: 14, color: "#FFFFFF", fontSize: 14 }}
          />
        </View>

        <View>
          <Text style={{ fontSize: 11, color: "#CBD5E1", fontWeight: "700", marginBottom: 6 }}>USERNAME</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="janedoe24"
            placeholderTextColor="#64748B"
            style={{ backgroundColor: "#020617", borderWidth: 1, borderColor: "#1E293B", borderRadius: 12, padding: 14, color: "#FFFFFF", fontSize: 14 }}
          />
        </View>

        <View>
          <Text style={{ fontSize: 11, color: "#CBD5E1", fontWeight: "700", marginBottom: 6 }}>EMAIL ADDRESS</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="jane.doe@email.com"
            keyboardType="email-address"
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

        {/* Segmented Role Picker */}
        <View style={{ flexDirection: "row", backgroundColor: "#020617", borderRadius: 12, padding: 4, borderWidth: 1, borderColor: "#1E293B" }}>
          <Pressable
            onPress={() => setRole("STUDENT")}
            style={{ flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center", backgroundColor: role === "STUDENT" ? "#D96B43" : "transparent" }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 13 }}>🎓 Student</Text>
          </Pressable>
          <Pressable
            onPress={() => setRole("INSTRUCTOR")}
            style={{ flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center", backgroundColor: role === "INSTRUCTOR" ? "#D96B43" : "transparent" }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 13 }}>📖 Instructor</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleRegister}
          style={({ pressed }) => ({
            backgroundColor: "#D96B43",
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: "center",
            marginTop: 12,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "800", fontSize: 15 }}>Sign Up (#D96B43)</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/(auth)/login")} style={{ alignItems: "center", marginTop: 12 }}>
          <Text style={{ color: "#D96B43", fontSize: 13, fontWeight: "600" }}>Already have an account? Sign In</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
