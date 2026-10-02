import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View,  } from "react-native";
import { AppText } from "@/components/AppText";
import { AppHeading } from "@/components/AppHeading";
import { Eye, EyeOff } from "lucide-react-native";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ApiRequestError, checkUsernameAvailability, registerUser } from "@/lib/api";
import { Checkbox } from "@/components/Checkbox";
import { PolicyModal } from "@/components/PolicyModal";

// Patterns copied EXACTLY from backend/.../auth/dto/RegisterRequest.java and
// mirrored from frontend/web/app/register/page.tsx — all three must stay in
// sync per rules.md §13 parity.
const USERNAME_PATTERN = /^[a-zA-Z0-9]{3,20}$/;
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const PASSWORD_RULES = [
  { key: "length", label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  { key: "upper", label: "One uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
  { key: "lower", label: "One lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
  { key: "number", label: "One number", test: (pw: string) => /\d/.test(pw) },
  { key: "special", label: "One special character (!@#$%^&*)", test: (pw: string) => /[!@#$%^&*]/.test(pw) },
] as const;

export default function RegisterScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [policyModalVisible, setPolicyModalVisible] = useState(false);

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const usernameFormatValid = USERNAME_PATTERN.test(username);
  const emailValid = EMAIL_PATTERN.test(email);
  const passwordRuleResults = PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(password) }));
  const passwordValid = passwordRuleResults.every((r) => r.passed);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const firstNameValid = firstName.trim().length > 0;
  const lastNameValid = lastName.trim().length > 0;

  const debouncedUsername = useDebouncedValue(username, 300);
  const [usernameCheck, setUsernameCheck] = useState<
    { status: "idle" } | { status: "checking" } | { status: "available" } | { status: "taken" } | { status: "error" }
  >({ status: "idle" });

  useMemo(() => {
    if (!usernameFormatValid) {
      setUsernameCheck({ status: "idle" });
      return;
    }
    setUsernameCheck({ status: "checking" });
    checkUsernameAvailability(debouncedUsername)
      .then((res) => setUsernameCheck({ status: res.available ? "available" : "taken" }))
      .catch(() => setUsernameCheck({ status: "error" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedUsername]);

  const isValid =
    firstNameValid &&
    lastNameValid &&
    usernameFormatValid &&
    usernameCheck.status === "available" &&
    emailValid &&
    passwordValid &&
    passwordsMatch &&
    termsAccepted;

  async function handleSubmit() {
    setSubmitError(null);
    if (!isValid) {
      setSubmitAttempted(true);
      return;
    }

    setSubmitting(true);
    try {
      await registerUser({ firstName, lastName, username, email, password, termsAccepted });
      router.push({ pathname: "/verify-email", params: { email } });
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setSubmitError(err.apiError?.message ?? "Something went wrong. Please try again.");
      } else {
        setSubmitError("Couldn't reach the server. Check the API URL in lib/api.ts for your setup.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const showError = (condition: boolean) => submitAttempted && condition;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      <ScrollView contentContainerClassName="flex-grow justify-center px-5 py-10">
        <View className="gap-5 rounded border border-border bg-background p-6">
          <View className="items-center">
            <AppHeading className="text-2xl text-foreground">Create your account</AppHeading>
            <AppText className="mt-1 text-sm text-muted-foreground">Start learning with eLearny</AppText>
          </View>

          <View className="flex-row gap-3">
            <Field label="First name" required error={showError(!firstNameValid) ? "Required" : undefined}>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                className={inputClass(showError(!firstNameValid))}
              />
            </Field>
            <Field label="Last name" required error={showError(!lastNameValid) ? "Required" : undefined}>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                className={inputClass(showError(!lastNameValid))}
              />
            </Field>
          </View>

          <Field
            label="Username"
            required
            error={
              showError(username.length > 0 && !usernameFormatValid)
                ? "3-20 characters, letters and numbers only"
                : showError(usernameCheck.status === "taken")
                  ? "That username is taken"
                  : showError(username.length === 0)
                    ? "Required"
                    : undefined
            }
          >
            <View className="relative justify-center">
              <TextInput
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                className={inputClass(
                  showError(username.length === 0 || !usernameFormatValid || usernameCheck.status === "taken")
                )}
              />
              <View className="absolute right-3">
                {usernameCheck.status === "checking" && (
                  <AppText className="text-sm text-muted-foreground">Checking…</AppText>
                )}
                {usernameCheck.status === "available" && <AppText className="text-sm text-success">✓ Available</AppText>}
                {usernameCheck.status === "taken" && <AppText className="text-sm text-destructive">✕ Taken</AppText>}
              </View>
            </View>
          </Field>

          <Field
            label="Email"
            required
            error={
              showError(email.length === 0)
                ? "Required"
                : showError(!emailValid)
                  ? "Enter a valid email address"
                  : undefined
            }
          >
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              className={inputClass(showError(email.length === 0 || !emailValid))}
            />
          </Field>

          <Field label="Password" required>
            <View className="relative justify-center">
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                className={inputClass(showError(!passwordValid))}
              />
              <Pressable onPress={() => setShowPassword((s) => !s)} className="absolute right-3">
                {showPassword ? <EyeOff size={18} color="#75757A" /> : <Eye size={18} color="#75757A" />}
              </Pressable>
            </View>
            <View className="mt-2 gap-1">
              {passwordRuleResults.map((rule) => (
                <AppText key={rule.key} className={`text-xs ${rule.passed ? "text-success" : "text-muted-foreground"}`}>
                  {rule.passed ? "✓" : "○"} {rule.label}
                </AppText>
              ))}
            </View>
          </Field>

          <Field
            label="Confirm password"
            required
            error={
              showError(confirmPassword.length > 0 && !passwordsMatch)
                ? "Passwords don't match"
                : showError(confirmPassword.length === 0)
                  ? "Required"
                  : undefined
            }
          >
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              className={inputClass(showError(confirmPassword.length === 0 || !passwordsMatch))}
            />
          </Field>

          <View>
            <Checkbox
              checked={termsAccepted}
              onOpenPolicy={() => setPolicyModalVisible(true)}
              label="I agree to the Terms of Service & Privacy Policy"
            />
            {submitAttempted && !termsAccepted && (
              <AppText className="mt-1 text-xs text-destructive">You must accept the Terms to continue</AppText>
            )}
          </View>

          {submitError && (
            <View className="rounded border border-destructive bg-destructive/10 px-3 py-2">
              <AppText className="text-sm text-destructive">{submitError}</AppText>
            </View>
          )}

          <Pressable
            onPress={handleSubmit}
            disabled={submitting}
            className={`rounded bg-primary px-4 py-3 ${submitting ? "opacity-40" : ""}`}
          >
            <AppText className="text-center font-medium text-primary-foreground">
              {submitting ? "Creating account…" : "Create account"}
            </AppText>
          </Pressable>
        </View>
      </ScrollView>

      <PolicyModal
        visible={policyModalVisible}
        onClose={() => setPolicyModalVisible(false)}
        onAccept={() => {
          setTermsAccepted(true);
          setPolicyModalVisible(false);
        }}
      />
    </KeyboardAvoidingView>
  );
}

function inputClass(invalid: boolean) {
  const base = "rounded border bg-background px-3 py-2.5 font-sans text-foreground";
  return invalid ? `${base} border-destructive` : `${base} border-border`;
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View className="flex-1">
      <AppText className="mb-1 text-sm font-medium text-foreground">
        {label}
        {required && <AppText className="text-destructive"> *</AppText>}
      </AppText>
      {children}
      {error && <AppText className="mt-1 text-xs text-destructive">{error}</AppText>}
    </View>
  );
}
