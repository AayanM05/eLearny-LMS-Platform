import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable, TextInput, View } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { AppText } from "@/components/AppText";
import { AppHeading } from "@/components/AppHeading";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ApiRequestError, checkUsernameAvailability, setupInstructorAccount } from "@/lib/api";

const USERNAME_PATTERN = /^[a-zA-Z0-9]{3,20}$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

export default function SetupAccountScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();

  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const usernameFormatValid = USERNAME_PATTERN.test(username);
  const passwordValid = PASSWORD_PATTERN.test(password);

  const debouncedUsername = useDebouncedValue(username, 300);
  const [usernameCheck, setUsernameCheck] = useState<"idle" | "checking" | "available" | "taken">("idle");

  useMemo(() => {
    if (!usernameFormatValid) {
      setUsernameCheck("idle");
      return;
    }
    setUsernameCheck("checking");
    checkUsernameAvailability(debouncedUsername)
      .then((res) => setUsernameCheck(res.available ? "available" : "taken"))
      .catch(() => setUsernameCheck("idle"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedUsername]);

  if (!token) {
    return (
      <View className="flex-1 items-center justify-center gap-2 bg-background px-6">
        <AppHeading className="text-2xl text-foreground">Invalid setup link</AppHeading>
        <AppText className="text-center text-muted-foreground">
          This link is missing its token. Check the email again, or contact support.
        </AppText>
      </View>
    );
  }

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await setupInstructorAccount({ token: token as string, otp, username, password });
      setSuccess(true);
      setTimeout(() => router.replace("/login"), 1500);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.apiError?.message ?? "Setup failed.");
      } else {
        setError("Couldn't reach the server.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <View className="flex-1 items-center justify-center gap-2 bg-background px-6">
        <AppHeading className="text-2xl text-foreground">Account ready! 🎉</AppHeading>
        <AppText className="text-muted-foreground">Redirecting you to log in…</AppText>
      </View>
    );
  }

  const canSubmit = usernameFormatValid && usernameCheck === "available" && passwordValid && otp.length === 6 && !submitting;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-5">
        <View className="w-full max-w-md gap-5 rounded border border-border bg-background p-6">
          <View className="items-center">
            <AppHeading className="text-2xl text-foreground">Set up your instructor account</AppHeading>
            <AppText className="mt-1 text-sm text-muted-foreground">You&apos;ve been approved — one more step</AppText>
          </View>

          <View>
            <AppText className="mb-1 text-sm font-medium text-foreground">Verification code *</AppText>
            <TextInput
              keyboardType="number-pad"
              maxLength={6}
              className="rounded border border-border bg-background px-3 py-2.5 text-center font-sans text-lg tracking-widest text-foreground"
              value={otp}
              onChangeText={(v) => setOtp(v.replace(/\D/g, ""))}
            />
          </View>

          <View>
            <AppText className="mb-1 text-sm font-medium text-foreground">Choose a username *</AppText>
            <View className="relative justify-center">
              <TextInput
                autoCapitalize="none"
                className="rounded border border-border bg-background px-3 py-2.5 font-sans text-foreground"
                value={username}
                onChangeText={setUsername}
              />
              <View className="absolute right-3">
                {usernameCheck === "checking" && <AppText className="text-sm text-muted-foreground">Checking…</AppText>}
                {usernameCheck === "available" && <AppText className="text-sm text-success">✓ Available</AppText>}
                {usernameCheck === "taken" && <AppText className="text-sm text-destructive">✕ Taken</AppText>}
              </View>
            </View>
          </View>

          <View>
            <AppText className="mb-1 text-sm font-medium text-foreground">Choose a password *</AppText>
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
            disabled={!canSubmit}
            className={`rounded bg-primary px-4 py-3 ${!canSubmit ? "opacity-40" : ""}`}
          >
            <AppText className="text-center font-medium text-primary-foreground">
              {submitting ? "Activating…" : "Activate account"}
            </AppText>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
