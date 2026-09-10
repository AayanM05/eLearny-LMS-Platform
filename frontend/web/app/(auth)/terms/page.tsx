'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 font-sans text-foreground">
      <div className="max-w-4xl mx-auto space-y-8 bg-card border border-border rounded-2xl p-8 md:p-12 shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-xl">
              e
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">Terms of Service</h1>
              <p className="text-xs text-muted-foreground">Last updated: September 2026</p>
            </div>
          </div>
          <Link href="/register" className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Registration</span>
          </Link>
        </div>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-display font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By creating an account or accessing the eLearny LMS Platform, you agree to be bound by these Terms of Service, our Privacy Policy, and all applicable laws and regulations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display font-semibold text-foreground">2. User Accounts & Integrity</h2>
            <p>
              You are responsible for maintaining the confidentiality of your login credentials and TOTP two-factor authentication tokens. You agree not to share accounts, impersonate others, or upload harmful or infringing content.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display font-semibold text-foreground">3. Intellectual Property & Course Materials</h2>
            <p>
              All video content, coding problems, quizzes, and digital certificates made available through eLearny are protected by copyright law. Instructors retain ownership of their respective course materials while granting eLearny a license to distribute.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display font-semibold text-foreground">4. Refund & Cancellation Policy</h2>
            <p>
              Students may request a full refund within 30 days of purchase, provided less than 30% of the course curriculum has been consumed and no certificate has been generated.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
          <span>© 2026 eLearny LMS. All rights reserved.</span>
          <Link href="/privacy" className="text-primary hover:underline font-medium">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
