import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, TextInput, View } from "react-native";
import { AppText } from "@/components/AppText";
import { AppHeading } from "@/components/AppHeading";
import { ApiRequestError, resendOtp, verifyEmail } from "@/lib/api";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const email = emailParam ?? "";

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  function maskedEmail() {
    const at = email.indexOf("@");
    if (at <= 1) return email;
    return `${email[0]}***${email.slice(at)}`;
  }

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError(null);

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (next.every((d) => d.length === 1)) {
      void handleVerify(next.join(""));
    }
  }

  function handleKeyPress(index: number, key: string) {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerify(code: string) {
    setVerifying(true);
    setError(null);
    try {
      await verifyEmail(email, code);
      router.replace({ pathname: "/login", params: { verified: "true" } });
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.apiError?.message ?? "Verification failed. Please try again.");
      } else {
        setError("Couldn't reach the server.");
      }
      setDigits(Array(CODE_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setResendMessage(null);
    setError(null);
    try {
      const res = await resendOtp(email);
      setResendMessage(res.message);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.apiError?.message ?? "Couldn't resend the code.");
      }
    } finally {
      setResending(false);
    }
  }

  return (
    <View className="flex-1 items-center justify-center gap-5 bg-background px-6">
      <AppHeading className="text-2xl text-foreground">Verify your email</AppHeading>
      <AppText className="text-sm text-muted-foreground">Code sent to {maskedEmail() || "your email"}</AppText>

      <View className="flex-row gap-2">
        {digits.map((digit, i) => (
          <TextInput
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            value={digit}
            editable={!verifying}
            onChangeText={(v) => handleDigitChange(i, v)}
            onKeyPress={(e) => handleKeyPress(i, e.nativeEvent.key)}
            keyboardType="number-pad"
            maxLength={1}
            className={`h-12 w-10 rounded border text-center text-lg font-semibold text-foreground ${
              error ? "border-destructive" : "border-border"
            }`}
          />
        ))}
      </View>

      {error && <AppText className="text-sm text-destructive">{error}</AppText>}
      {resendMessage && !error && <AppText className="text-sm text-success">{resendMessage}</AppText>}

      <Pressable onPress={handleResend} disabled={cooldown > 0 || resending}>
        <AppText className={`text-sm underline ${cooldown > 0 || resending ? "text-muted-foreground" : "text-primary"}`}>
          {cooldown > 0 ? `Resend code in ${cooldown}s` : resending ? "Sending…" : "Resend code"}
        </AppText>
      </Pressable>
    </View>
  );
}
