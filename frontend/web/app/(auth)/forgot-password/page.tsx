'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setErrorMessage(null);
    try {
      await api.fetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit reset request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl p-8">
        <div className="mb-6 text-center">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground">Forgot Password?</h2>
          <p className="text-xs text-muted-foreground mt-1">
            No worries! Enter your email address below and we'll send reset instructions.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive text-xs rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 text-sm flex items-center justify-center space-x-1.5"
            >
              <span>{isSubmitting ? 'Sending Instructions...' : 'Send Reset Link'}</span>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Check your email</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                If an account exists with that email address, password reset instructions have been sent.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center space-x-1.5 text-xs text-primary font-semibold hover:underline pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Login</span>
            </Link>
          </div>
        )}

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
