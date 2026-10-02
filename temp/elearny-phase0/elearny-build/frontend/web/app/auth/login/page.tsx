"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { ApiRequestError, login } from "@/lib/api";
import { setTokens } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justVerified = searchParams.get("verified") === "true";
  const redirectTo = searchParams.get("redirect");

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function defaultLandingFor(role: string): string {
    if (role === "INSTRUCTOR") return "/instructor/dashboard";
    if (role === "ADMIN" || role === "SUPER_ADMIN") return "/admin/instructor-applications";
    return "/"; // Student Dashboard (/dashboard) doesn't exist yet — Phase 3
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await login(usernameOrEmail, password);
      setTokens(result.accessToken, result.refreshToken);
      router.push(redirectTo || defaultLandingFor(result.user.role));
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.apiError?.message ?? "Login failed. Please try again.");
      } else {
        setError("Couldn't reach the server. Is the backend running on localhost:8080?");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded border border-border bg-background p-8"
      >
        <div className="text-center">
          <h1 className="text-2xl font-heading text-foreground">Log in</h1>
          {justVerified && (
            <p className="mt-2 rounded border border-success bg-success/10 px-3 py-2 text-sm text-success">
              Email verified! You can log in now.
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Username or email</label>
          <input
            className="w-full rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full cursor-pointer rounded bg-primary px-4 py-2 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Logging in…" : "Log in"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-primary underline">
            Register
          </a>
        </p>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
