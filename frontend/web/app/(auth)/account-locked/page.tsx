'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, Clock, ArrowLeft, Mail } from 'lucide-react';

export default function AccountLockedPage() {
  const [secondsRemaining, setSecondsRemaining] = useState(900); // 15 minutes default

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md rounded-xl border border-destructive/30 bg-card shadow-xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-display font-bold text-foreground">Account Temporarily Locked</h2>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Too many consecutive failed login attempts were detected on your account. To protect your account security, login has been suspended temporarily.
        </p>

        {/* Live Countdown Timer */}
        <div className="my-6 p-4 bg-muted/50 border border-border rounded-xl">
          <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-primary" />
            <span>Automatic Unlock In</span>
          </div>
          <div className="font-mono text-3xl font-bold text-foreground tracking-widest">
            {secondsRemaining > 0 ? formattedTime : 'UNLOCKED'}
          </div>
        </div>

        <div className="space-y-2">
          {secondsRemaining <= 0 ? (
            <Link
              href="/login"
              className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg shadow-sm hover:opacity-90 transition-opacity text-sm block"
            >
              Try Logging In Again
            </Link>
          ) : (
            <Link
              href="/forgot-password"
              className="w-full bg-secondary text-secondary-foreground font-semibold py-2.5 rounded-lg border border-border text-sm block hover:bg-muted"
            >
              Reset Password via Email
            </Link>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <Link href="/login" className="inline-flex items-center space-x-1 hover:text-foreground">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
          <a href="mailto:support@elearny.com" className="inline-flex items-center space-x-1 text-primary hover:underline">
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Support</span>
          </a>
        </div>
      </div>
    </div>
  );
}
