"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/common/BrandLogo";
import { useGSAP } from "@/lib/gsap";
import gsap from "gsap";

export default function RegisterPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Debounced Username State
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);

  // Password Requirements State
  const passwordCriteria = {
    minChar: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[@#$%^&+=!._-]/.test(password),
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  // Debounced username check effect
  useEffect(() => {
    if (!username || username.trim().length < 3) {
      setUsernameAvailable(null);
      setUsernameSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      setIsCheckingUsername(true);
      // Simulate/call debounced availability check
      if (["admin", "root", "test"].includes(username.toLowerCase())) {
        setUsernameAvailable(false);
        setUsernameSuggestions([`${username}_2026`, `${username}_lms`, `${username}123`]);
      } else {
        setUsernameAvailable(true);
        setUsernameSuggestions([]);
      }
      setIsCheckingUsername(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

  useGSAP(
    () => {
      gsap.from(".auth-hero-content", {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".auth-form-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
      });
    },
    { scope: containerRef }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid || usernameAvailable === false) return;
    // Simulate successful registration and route to login
    router.push("/auth/login?registered=true");
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col justify-between p-6 md:p-12 font-sans">
      <header className="flex justify-between items-center max-w-7xl mx-auto w-full">
        <BrandLogo variant="horizontal" className="h-10 w-auto" />
        <Link href="/auth/login" className="text-sm font-semibold text-primary hover:underline">
          Already have an account? Log in →
        </Link>
      </header>

      <main className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center my-8">
        {/* Left Hero Section */}
        <div className="auth-hero-content space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
            <span>✨ eLearny LMS Platform v2.0.0</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-heading leading-tight text-white">
            Join the Global Learning Community
          </h1>
          <p className="text-slate-400 text-lg max-w-lg">
            Unlock 40+ interactive courses, Judge0 coding sandbox, Duolingo-style gamification, and verified PDF certificates.
          </p>
        </div>

        {/* Right Form Card */}
        <div className="auth-form-card bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white mb-2 font-heading">Create Your Account</h2>
          <p className="text-slate-400 text-sm mb-6">Enter your details below to get started.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase">Username</label>
                {isCheckingUsername && <span className="text-xs text-slate-400">Checking...</span>}
                {usernameAvailable === true && <span className="text-xs font-bold text-emerald-400">✓ Username available</span>}
                {usernameAvailable === false && <span className="text-xs font-bold text-rose-400">✗ Username taken</span>}
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="janedoe24"
                className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-white placeholder-slate-600 focus:outline-none transition-all text-sm ${
                  usernameAvailable === true ? "border-emerald-500/60" : usernameAvailable === false ? "border-rose-500/60" : "border-slate-800 focus:border-primary"
                }`}
              />
              {usernameSuggestions.length > 0 && (
                <div className="mt-2 text-xs text-slate-400">
                  <span>Suggested: </span>
                  {usernameSuggestions.map((sug) => (
                    <button key={sug} type="button" onClick={() => setUsername(sug)} className="text-primary hover:underline font-semibold mr-2">
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane.doe@email.com"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm mb-3"
              />

              {/* Password Requirement Checklist Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center gap-1.5 ${passwordCriteria.minChar ? "text-emerald-400 font-semibold" : "text-slate-500"}`}>
                  <span>{passwordCriteria.minChar ? "✓" : "○"}</span> Min 8 characters
                </div>
                <div className={`flex items-center gap-1.5 ${passwordCriteria.hasUpper ? "text-emerald-400 font-semibold" : "text-slate-500"}`}>
                  <span>{passwordCriteria.hasUpper ? "✓" : "○"}</span> 1 uppercase letter
                </div>
                <div className={`flex items-center gap-1.5 ${passwordCriteria.hasLower ? "text-emerald-400 font-semibold" : "text-slate-500"}`}>
                  <span>{passwordCriteria.hasLower ? "✓" : "○"}</span> 1 lowercase letter
                </div>
                <div className={`flex items-center gap-1.5 ${passwordCriteria.hasNumber ? "text-emerald-400 font-semibold" : "text-slate-500"}`}>
                  <span>{passwordCriteria.hasNumber ? "✓" : "○"}</span> 1 number
                </div>
                <div className={`flex items-center gap-1.5 ${passwordCriteria.hasSpecial ? "text-emerald-400 font-semibold" : "text-slate-500"}`}>
                  <span>{passwordCriteria.hasSpecial ? "✓" : "○"}</span> 1 special character
                </div>
              </div>
            </div>

            {/* Role Selection Segmented Switch */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Account Role</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-sm">
                <button
                  type="button"
                  onClick={() => setRole("STUDENT")}
                  className={`py-2 px-4 rounded-lg font-bold transition-all ${
                    role === "STUDENT" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white"
                  }`}
                >
                  🎓 Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("INSTRUCTOR")}
                  className={`py-2 px-4 rounded-lg font-bold transition-all ${
                    role === "INSTRUCTOR" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white"
                  }`}
                >
                  📖 Instructor
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-primary focus:ring-primary h-4 w-4"
              />
              <label htmlFor="terms" className="text-xs text-slate-400">
                I agree to the{" "}
                <Link href="/legal/terms-privacy" className="text-primary hover:underline">
                  Terms of Service & Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={!termsAccepted || !isPasswordValid || usernameAvailable === false}
              className="w-full py-3.5 px-6 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              Sign Up (#D96B43)
            </button>
          </form>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-500 py-4 border-t border-slate-800/60 max-w-7xl mx-auto w-full">
        © 2026 eLearny LMS Platform. All rights reserved.
      </footer>
    </div>
  );
}
