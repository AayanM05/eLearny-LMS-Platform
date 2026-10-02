"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ApiRequestError, checkUsernameAvailability, registerUser } from "@/lib/api";
import { Checkbox } from "@/components/Checkbox";
import { PolicyModal } from "@/components/PolicyModal";

// Patterns copied EXACTLY from backend/.../auth/dto/RegisterRequest.java —
// see that file's comment for why these must never drift from each other.
const USERNAME_PATTERN = /^[a-zA-Z0-9]{3,20}$/;
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const PASSWORD_RULES = [
  { key: "length", label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  { key: "upper", label: "One uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
  { key: "lower", label: "One lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
  { key: "number", label: "One number", test: (pw: string) => /\d/.test(pw) },
  { key: "special", label: "One special character (!@#$%^&*)", test: (pw: string) => /[!@#$%^&*]/.test(pw) },
] as const;

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // --- Live per-field validation -------------------------------------
  const usernameFormatValid = USERNAME_PATTERN.test(username);
  const emailValid = EMAIL_PATTERN.test(email);
  const passwordRuleResults = PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(password) }));
  const passwordValid = passwordRuleResults.every((r) => r.passed);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const firstNameValid = firstName.trim().length > 0;
  const lastNameValid = lastName.trim().length > 0;

  // A field's error shows once the user has interacted with it OR after a
  // failed submit attempt — not only on blur, so clicking "Create account"
  // with empty fields immediately shows every problem, not just silently
  // disabling the button.
  const shouldShowError = (field: string) => touched[field] || submitAttempted;

  // --- Debounced username availability check --------------------------
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

  function markTouched(field: string) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    if (!isValid) {
      setSubmitAttempted(true);
      return;
    }

    setSubmitting(true);
    try {
      await registerUser({
        firstName,
        lastName,
        username,
        email,
        password,
        termsAccepted,
      });
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setSubmitError(err.apiError?.message ?? "Something went wrong. Please try again.");
      } else {
        setSubmitError("Couldn't reach the server. Is the backend running on localhost:8080?");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md space-y-5 rounded border border-border bg-background p-8"
      >
        <div className="text-center">
          <h1 className="text-2xl font-heading text-foreground">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start learning with eLearny</p>
        </div>

        {/* First / Last name */}
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="First name"
            required
            error={shouldShowError("firstName") && !firstNameValid ? "Required" : undefined}
          >
            <input
              className={inputClass(shouldShowError("firstName") && !firstNameValid)}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => markTouched("firstName")}
            />
          </Field>
          <Field
            label="Last name"
            required
            error={shouldShowError("lastName") && !lastNameValid ? "Required" : undefined}
          >
            <input
              className={inputClass(shouldShowError("lastName") && !lastNameValid)}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => markTouched("lastName")}
            />
          </Field>
        </div>

        {/* Username with debounced availability check */}
        <Field
          label="Username"
          required
          error={
            shouldShowError("username") && username.length > 0 && !usernameFormatValid
              ? "3-20 characters, letters and numbers only"
              : shouldShowError("username") && usernameCheck.status === "taken"
                ? "That username is taken"
                : shouldShowError("username") && username.length === 0
                  ? "Required"
                  : undefined
          }
        >
          <div className="relative">
            <input
              className={inputClass(
                shouldShowError("username") && (username.length === 0 || !usernameFormatValid || usernameCheck.status === "taken")
              )}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => markTouched("username")}
              autoComplete="username"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
              {usernameCheck.status === "checking" && <span className="text-muted-foreground">Checking…</span>}
              {usernameCheck.status === "available" && <span className="text-success">✓ Available</span>}
              {usernameCheck.status === "taken" && <span className="text-destructive">✕ Taken</span>}
            </span>
          </div>
        </Field>

        {/* Email */}
        <Field
          label="Email"
          required
          error={
            shouldShowError("email") && email.length === 0
              ? "Required"
              : shouldShowError("email") && !emailValid
                ? "Enter a valid email address"
                : undefined
          }
        >
          <input
            type="email"
            className={inputClass(shouldShowError("email") && (email.length === 0 || !emailValid))}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => markTouched("email")}
            autoComplete="email"
          />
        </Field>

        {/* Password */}
        <Field label="Password" required>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={inputClass(shouldShowError("password") && !passwordValid)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => markTouched("password")}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <ul className="mt-2 space-y-1">
            {passwordRuleResults.map((rule) => (
              <li
                key={rule.key}
                className={`text-xs ${rule.passed ? "text-success" : "text-muted-foreground"}`}
              >
                {rule.passed ? "✓" : "○"} {rule.label}
              </li>
            ))}
          </ul>
        </Field>

        {/* Confirm password */}
        <Field
          label="Confirm password"
          required
          error={shouldShowError("confirmPassword") && confirmPassword.length > 0 && !passwordsMatch ? "Passwords don't match" : shouldShowError("confirmPassword") && confirmPassword.length === 0 ? "Required" : undefined}
        >
          <input
            type={showPassword ? "text" : "password"}
            className={inputClass(shouldShowError("confirmPassword") && (confirmPassword.length === 0 || !passwordsMatch))}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => markTouched("confirmPassword")}
            autoComplete="new-password"
          />
        </Field>

        {/* Terms — custom checkbox, opens full policy in a modal */}
        <div>
          <Checkbox
            checked={termsAccepted}
            onOpenPolicy={() => setPolicyModalOpen(true)}
            label={
              <>
                I agree to the <span className="text-primary underline">Terms of Service &amp; Privacy Policy</span>
              </>
            }
          />
          {submitAttempted && !termsAccepted && (
            <p className="mt-1 text-xs text-destructive">You must accept the Terms to continue</p>
          )}
        </div>

        {submitError && (
          <p className="rounded border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full cursor-pointer rounded bg-primary px-4 py-2 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <PolicyModal
        open={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
        onAccept={() => {
          setTermsAccepted(true);
          setPolicyModalOpen(false);
        }}
      />
    </main>
  );
}

function inputClass(invalid: boolean) {
  const base = "w-full rounded border bg-background px-3 py-2 text-foreground outline-none focus:border-primary";
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
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
