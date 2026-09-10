'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { KeyRound, ShieldCheck, ArrowRight, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

export default function TwoFactorChallengePage() {
  const router = useRouter();
  const { setAuthSession } = useAuth();
  const [totpCode, setTotpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.trim().length !== 6) {
      setErrorMessage('Please enter a 6-digit TOTP code');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const response: any = await api.fetch('/auth/2fa/verify', {
        method: 'POST',
        body: JSON.stringify({
          totpCode: totpCode.trim(),
        }),
      });

      setAuthSession(response.user, response.accessToken, response.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid or expired 2FA code');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl p-8">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground">Two-Factor Authentication</h2>
          <p className="text-xs text-muted-foreground mt-1">Enter the 6-digit code from your authenticator app</p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive text-xs rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground text-center">Security Code</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
              <input
                type="text"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg bg-background text-foreground text-center text-xl tracking-[0.4em] font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || totpCode.length !== 6}
            className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 text-sm flex items-center justify-center space-x-1.5"
          >
            <span>{isSubmitting ? 'Verifying Code...' : 'Verify & Continue'}</span>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-border text-center">
          <Link href="/login" className="inline-flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
