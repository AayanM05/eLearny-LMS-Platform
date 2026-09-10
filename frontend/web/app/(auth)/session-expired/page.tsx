'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SessionExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <LogOut className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-display font-bold text-foreground">Session Expired</h2>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Your authentication token has expired due to inactivity. Please sign in again to continue your session safely.
        </p>

        <div className="my-6 p-4 bg-muted/40 border border-border/70 rounded-xl text-xs text-muted-foreground flex items-center space-x-2.5 text-left">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
          <span>Your progress has been auto-saved. Logging back in will restore your current learning context.</span>
        </div>

        <Link
          href="/login"
          className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg shadow-sm hover:opacity-90 transition-opacity text-sm flex items-center justify-center space-x-1.5"
        >
          <span>Sign In Again</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
