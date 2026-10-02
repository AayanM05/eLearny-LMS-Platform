import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable, TextInput, View } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { AppText } from "@/components/AppText";
import { AppHeading } from "@/components/AppHeading";
import { ApiRequestError, login } from "@/lib/api";
import { setTokens } from "@/lib/auth";

export default function LoginScreen() {
  const router = useRouter();
  const { verified, redirect } = useLocalSearchParams<{ verified?: string; redirect?: string }>();
  const justVerified = verified === "true";

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function defaultLandingFor(role: string): string {
    if (role === "INSTRUCTOR") return "/instructor/dashboard";
    if (role === "ADMIN" || role === "SUPER_ADMIN") return "/admin/instructor-applications";
    return "/";
  }

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      const result = await login(usernameOrEmail, password);
      await setTokens(result.accessToken, result.refreshToken);
      router.replace((redirect as string) || defaultLandingFor(result.user.role));
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.apiError?.message ?? "Login failed. Please try again.");
      } else {
        setError("Couldn't reach the server.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-5">
        <View className="w-full max-w-sm gap-5 rounded border border-border bg-background p-6">
          <View className="items-center">
            <AppHeading className="text-2xl text-foreground">Log in</AppHeading>
            {justVerified && (
              <View className="mt-2 rounded border border-success bg-success/10 px-3 py-2">
                <AppText className="text-sm text-success">Email verified! You can log in now.</AppText>
              </View>
            )}
          </View>

          <View>
            <AppText className="mb-1 text-sm font-medium text-foreground">Username or email</AppText>
            <TextInput
              autoCapitalize="none"
              className="rounded border border-border bg-background px-3 py-2.5 font-sans text-foreground"
              value={usernameOrEmail}
              onChangeText={setUsernameOrEmail}
            />
          </View>

          <View>
            <AppText className="mb-1 text-sm font-medium text-foreground">Password</AppText>
            <View className="relative justify-center">
              <TextInput
                secureTextEntry={!showPassword}
                className="rounded border border-border bg-background px-3 py-2.5 font-sans text-foreground"
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setShowPassword((s) => !s)} className="absolute right-3">
                {showPassword ? <EyeOff size={18} color="#75757A" /> : <Eye size={18} color="#75757A" />}
              </Pressable>
            </View>
          </View>

          {error && (
            <View className="rounded border border-destructive bg-destructive/10 px-3 py-2">
              <AppText className="text-sm text-destructive">{error}</AppText>
            </View>
          )}

          <Pressable
            onPress={handleSubmit}
            disabled={submitting}
            className={`rounded bg-primary px-4 py-3 ${submitting ? "opacity-40" : ""}`}
          >
            <AppText className="text-center font-medium text-primary-foreground">
              {submitting ? "Logging in…" : "Log in"}
            </AppText>
          </Pressable>

          <Pressable onPress={() => router.push("/register")}>
            <AppText className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account? <AppText className="text-primary underline">Register</AppText>
            </AppText>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
