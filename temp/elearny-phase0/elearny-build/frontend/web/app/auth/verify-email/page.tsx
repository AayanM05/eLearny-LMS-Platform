"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiRequestError, resendOtp, verifyEmail } from "@/lib/api";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (pasted.length === 0) return;
    e.preventDefault();
    const next = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    if (pasted.length === CODE_LENGTH) {
      void handleVerify(pasted);
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  }

  async function handleVerify(code: string) {
    setVerifying(true);
    setError(null);
    try {
      await verifyEmail(email, code);
      router.push("/auth/login?verified=true");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.apiError?.message ?? "Verification failed. Please try again.");
      } else {
        setError("Couldn't reach the server. Is the backend running on localhost:8080?");
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
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-5 rounded border border-border bg-background p-8 text-center">
        <h1 className="text-2xl font-heading text-foreground">Verify your email</h1>
        <p className="text-sm text-muted-foreground">
          Code sent to {maskedEmail() || "your email"}
        </p>

        <div className="flex justify-center gap-2" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              disabled={verifying}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`h-12 w-10 rounded border text-center text-lg font-semibold text-foreground outline-none focus:border-primary ${
                error ? "border-destructive" : "border-border"
              }`}
            />
          ))}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {resendMessage && !error && <p className="text-sm text-success">{resendMessage}</p>}

        <div>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className="cursor-pointer text-sm text-primary underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : resending ? "Sending…" : "Resend code"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}
