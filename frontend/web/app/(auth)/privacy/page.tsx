'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 font-sans text-foreground">
      <div className="max-w-4xl mx-auto space-y-8 bg-card border border-border rounded-2xl p-8 md:p-12 shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-xl">
              e
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">Privacy Policy</h1>
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
            <h2 className="text-lg font-display font-semibold text-foreground">1. Data Collection</h2>
            <p>
              We collect information you provide directly to us when creating an account (full name, username, email, optional phone), enrolling in courses, submitting assignments, and configuring 2FA security settings.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display font-semibold text-foreground">2. Data Usage & Analytics</h2>
            <p>
              Your data is strictly utilized to provide learning services, personalize course recommendations, track quiz scores, issue verifiable certificates, and ensure platform security against unauthorized access.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-display font-semibold text-foreground">3. User Data Rights & GDPR Compliance</h2>
            <p>
              Under §3.19 of our Trust & Governance framework, all users maintain full control over their personal data, including the right to request a complete JSON data export or permanent account deletion at any time via Account & Security settings.
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
          <span>© 2026 eLearny LMS. All rights reserved.</span>
          <Link href="/terms" className="text-primary hover:underline font-medium">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
