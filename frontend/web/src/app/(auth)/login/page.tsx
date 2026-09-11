"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/common/BrandLogo";
import { useGSAP } from "@/lib/gsap";
import gsap from "gsap";

export default function LoginPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    setIsLoading(true);
    setErrorMessage("");

    // Simulate login API authentication
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col justify-between p-6 md:p-12 font-sans">
      <header className="flex justify-between items-center max-w-7xl mx-auto w-full">
        <BrandLogo variant="horizontal" className="h-10 w-auto" />
        <Link href="/auth/register" className="text-sm font-semibold text-primary hover:underline">
          Don't have an account? Sign up →
        </Link>
      </header>

      <main className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center my-8">
        {/* Left Hero Section */}
        <div className="auth-hero-content space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
            <span>✨ eLearny LMS Platform v2.0.0</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-heading leading-tight text-white">
            Welcome Back to eLearny
          </h1>
          <p className="text-slate-400 text-lg max-w-lg">
            Resume your active courses, check your daily learning streak, and verify your credentials.
          </p>
        </div>

        {/* Right Form Card */}
        <div className="auth-form-card bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white mb-2 font-heading">Sign In</h2>
          <p className="text-slate-400 text-sm mb-6">Enter your username or email address below.</p>

          {errorMessage && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">Username or Email</label>
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="janedoe24 or jane.doe@email.com"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-primary focus:ring-primary h-4 w-4"
              />
              <label htmlFor="remember" className="text-xs text-slate-400">
                Keep me signed in for 7 days
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-all shadow-lg shadow-primary/25 disabled:opacity-50 mt-4"
            >
              {isLoading ? "Signing In..." : "Sign In →"}
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
