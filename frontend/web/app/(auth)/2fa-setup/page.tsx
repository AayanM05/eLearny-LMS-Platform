'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, KeyRound, Copy, Check, AlertCircle, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function TwoFactorSetupPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [secret, setSecret] = useState<string | null>(null);
  const [qrCodeDataUri, setQrCodeDataUri] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load2faSecret() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const res: any = await api.fetch('/auth/2fa/setup', { method: 'POST' });
        setSecret(res.secret);
        setQrCodeDataUri(res.qrCodeDataUri);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to initialize 2FA setup');
      } finally {
        setIsLoading(false);
      }
    }
    load2faSecret();
  }, []);

  const handleCopySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl p-8">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground">Set Up Two-Factor Auth</h2>
          <p className="text-xs text-muted-foreground mt-1">Protect your account with Google Authenticator or Authy</p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive text-xs rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-xs">Generating your unique TOTP secret...</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* QR Code Container */}
            {qrCodeDataUri && (
              <div className="p-4 bg-white rounded-xl border border-border flex justify-center shadow-inner">
                <img src={qrCodeDataUri} alt="2FA QR Code" className="w-48 h-48 object-contain" />
              </div>
            )}

            {/* Manual Secret Fallback */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">Manual Setup Key</label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-muted p-2.5 rounded-lg border border-border font-mono text-xs text-foreground tracking-wider text-center select-all">
                  {secret}
                </div>
                <button
                  onClick={handleCopySecret}
                  className="p-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                  title="Copy Key"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => router.push('/2fa-challenge')}
                className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg shadow-sm hover:opacity-90 transition-opacity text-sm flex items-center justify-center space-x-1.5"
              >
                <span>Verify TOTP Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-border text-center">
          <Link href="/dashboard" className="inline-flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
