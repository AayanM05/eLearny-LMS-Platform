'use client';

import React, { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

function ResetPasswordFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get('token');

  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      setErrorMessage('Missing password reset token. Please request a new reset link.');
      return;
    }
    setErrorMessage(null);
    try {
      await api.fetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          token,
          newPassword: data.newPassword,
        }),
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset password. The link may be invalid or expired.');
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl p-8">
      <div className="mb-6 text-center">
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
          <Lock className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground">Reset Password</h2>
        <p className="text-xs text-muted-foreground mt-1">Enter your new password below</p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive text-xs rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!isSuccess ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                {...register('newPassword')}
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                className="w-full pl-9 pr-9 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && <p className="text-xs text-destructive mt-1">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                {...register('confirmPassword')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Repeat new password"
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 text-sm flex items-center justify-center space-x-1.5"
          >
            <span>{isSubmitting ? 'Updating Password...' : 'Save New Password'}</span>
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          </button>
        </form>
      ) : (
        <div className="text-center py-4 space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Password Reset Complete!</h3>
            <p className="text-xs text-muted-foreground mt-1">Your password has been successfully updated.</p>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg text-sm"
          >
            Sign In Now
          </button>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-border text-center">
        <Link href="/login" className="inline-flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 font-sans">
      <Suspense fallback={<Loader2 className="w-6 h-6 animate-spin text-primary" />}>
        <ResetPasswordFormContent />
      </Suspense>
    </div>
  );
}
