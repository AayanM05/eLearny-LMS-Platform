'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuthSession } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [is2faRequired, setIs2faRequired] = useState(false);
  const [pending2faToken, setPending2faToken] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMessage(null);
    try {
      const response: any = await api.fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response.is2faRequired) {
        setIs2faRequired(true);
        setPending2faToken(response.pending2faToken);
      } else {
        setAuthSession(response.user, response.accessToken, response.refreshToken);
        redirectUserByRole(response.user.role);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handle2faSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      const response: any = await api.fetch('/auth/2fa/verify', {
        method: 'POST',
        body: JSON.stringify({
          pending2faToken,
          totpCode,
        }),
      });

      setAuthSession(response.user, response.accessToken, response.refreshToken);
      redirectUserByRole(response.user.role);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid 2FA code');
    }
  };

  const redirectUserByRole = (role: string) => {
    if (role === 'ADMIN') {
      router.push('/instructor-applications');
    } else if (role === 'INSTRUCTOR') {
      router.push('/analytics');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-background border border-border p-8 rounded-lg shadow-sm">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-display font-bold text-foreground">Sign in to eLearny</h2>
          <p className="text-sm text-muted-foreground mt-1">Enter your details to access your account</p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive text-sm rounded">
            {errorMessage}
          </div>
        )}

        {!is2faRequired ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="name@example.com"
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Password</label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground font-medium py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handle2faSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Two-Factor Authentication is enabled. Please enter the 6-digit code from your authenticator app.
            </p>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">6-Digit Code</label>
              <input
                type="text"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="123456"
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground text-center text-lg tracking-widest focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-medium py-2 rounded hover:opacity-90 transition-opacity"
            >
              Verify 2FA
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
