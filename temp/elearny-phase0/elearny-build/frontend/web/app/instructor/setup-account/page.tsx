"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { ApiRequestError, checkUsernameAvailability, setupInstructorAccount } from "@/lib/api";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const USERNAME_PATTERN = /^[a-zA-Z0-9]{3,20}$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

function SetupAccountForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";

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
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div>
          <h1 className="text-2xl font-heading text-foreground">Invalid setup link</h1>
          <p className="mt-2 text-muted-foreground">
            This link is missing its token. Check the email again, or contact support.
          </p>
        </div>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await setupInstructorAccount({ token, otp, username, password });
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 1500);
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
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div>
          <h1 className="text-2xl font-heading text-foreground">Account ready! 🎉</h1>
          <p className="mt-2 text-muted-foreground">Redirecting you to log in…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 rounded border border-border bg-background p-8">
        <div className="text-center">
          <h1 className="text-2xl font-heading text-foreground">Set up your instructor account</h1>
          <p className="mt-1 text-sm text-muted-foreground">You&apos;ve been approved — one more step</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Verification code (from your email) *</label>
          <input
            required
            inputMode="numeric"
            maxLength={6}
            className="w-full rounded border border-border bg-background px-3 py-2 text-center text-lg tracking-widest text-foreground outline-none focus:border-primary"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Choose a username *</label>
          <div className="relative">
            <input
              required
              className="w-full rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
              {usernameCheck === "checking" && <span className="text-muted-foreground">Checking…</span>}
              {usernameCheck === "available" && <span className="text-success">✓ Available</span>}
              {usernameCheck === "taken" && <span className="text-destructive">✕ Taken</span>}
            </span>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Choose a password *</label>
          <div className="relative">
            <input
              required
              type={showPassword ? "text" : "password"}
              className="w-full rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            At least 8 characters, one uppercase, one lowercase, one number, one special character.
          </p>
        </div>

        {error && (
          <p className="rounded border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting || !usernameFormatValid || usernameCheck !== "available" || !passwordValid || otp.length !== 6}
          className="w-full cursor-pointer rounded bg-primary px-4 py-2 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Activating…" : "Activate account"}
        </button>
      </form>
    </main>
  );
}

export default function SetupAccountPage() {
  return (
    <Suspense fallback={null}>
      <SetupAccountForm />
    </Suspense>
  );
}
