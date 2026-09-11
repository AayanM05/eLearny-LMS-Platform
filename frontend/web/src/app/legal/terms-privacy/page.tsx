"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/common/BrandLogo";

export default function TermsPrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 p-6 md:p-12 font-sans">
      <header className="flex justify-between items-center max-w-4xl mx-auto w-full mb-12">
        <BrandLogo variant="horizontal" className="h-10 w-auto" />
        <Link href="/auth/register" className="text-sm font-semibold text-primary hover:underline">
          ← Back to Registration
        </Link>
      </header>

      <main className="max-w-4xl mx-auto w-full bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-2xl shadow-xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white mb-2">Terms of Service & Privacy Policy</h1>
          <p className="text-sm text-slate-400">Effective Date: September 12, 2026 • Version 1.0 (GDPR Compliant)</p>
        </div>

        <section className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-white font-heading">1. Acceptable Use & Account Integrity</h2>
          <p>
            By creating an account on the eLearny LMS Platform, you agree to provide accurate registration details, maintain account confidentiality, and follow all platform guidelines.
          </p>
        </section>

        <section className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-white font-heading">2. Data Privacy & GDPR Consent Recording</h2>
          <p>
            We process your personal information (full name, email, IP address, and progress history) in accordance with global privacy laws. Consent is recorded via audit-logged consent records.
          </p>
        </section>

        <section className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-white font-heading">3. Academic & Certificate Verification</h2>
          <p>
            Certificates issued upon course completion feature unique verification codes and digital signatures to ensure public authenticity.
          </p>
        </section>
      </main>
    </div>
  );
}
