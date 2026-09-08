'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { Mail, Lock, KeyRound, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Zap, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';

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
  const [loadingDemoRole, setLoadingDemoRole] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
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

  const handleInstantDemoLogin = (role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') => {
    setLoadingDemoRole(role);
    setErrorMessage(null);
    setTimeout(() => {
      const mockUser = {
        id: role === 'ADMIN' ? 'demo-admin-id' : role === 'INSTRUCTOR' ? 'demo-inst-id' : 'demo-stud-id',
        email: role === 'ADMIN' ? 'admin@elearny.com' : role === 'INSTRUCTOR' ? 'instructor@elearny.com' : 'student@elearny.com',
        fullName: role === 'ADMIN' ? 'System Administrator' : role === 'INSTRUCTOR' ? 'Dr. Sarah Jenkins' : 'Alex Rivera',
        role: role,
        createdAt: new Date().toISOString(),
      };
      setAuthSession(mockUser, 'demo_access_token_jwt', 'demo_refresh_token');
      redirectUserByRole(role);
    }, 150);
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-md border border-border bg-card shadow-xl overflow-hidden">
        {/* Left Branding Panel */}
        <div className="bg-muted/40 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border">
          <div>
            <div className="flex items-center space-x-2.5 mb-8">
              <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-lg shadow-sm">
                e
              </div>
              <span className="font-display font-bold text-lg tracking-tight">eLearny LMS</span>
            </div>

            <h3 className="text-2xl font-display font-bold text-foreground leading-tight mb-3">
              Welcome back to your learning hub.
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              Access your enrolled courses, submit assignments, track progress, and earn industry-recognized certifications.
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-border/80">
            {/* Quick Demo Sign-In Box */}
            <div className="p-3.5 bg-background border border-border rounded-md shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Instant Demo Login (0ms Delay)
                </span>
                <span className="text-[10px] text-muted-foreground">Skip Cloud Wait</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleInstantDemoLogin('STUDENT')}
                  disabled={loadingDemoRole !== null}
                  className="py-1.5 px-2 bg-muted hover:bg-primary/10 text-foreground hover:text-primary border border-border text-[11px] font-medium rounded transition-colors text-center"
                >
                  {loadingDemoRole === 'STUDENT' ? 'Logging...' : 'Student'}
                </button>
                <button
                  type="button"
                  onClick={() => handleInstantDemoLogin('INSTRUCTOR')}
                  disabled={loadingDemoRole !== null}
                  className="py-1.5 px-2 bg-muted hover:bg-primary/10 text-foreground hover:text-primary border border-border text-[11px] font-medium rounded transition-colors text-center"
                >
                  {loadingDemoRole === 'INSTRUCTOR' ? 'Logging...' : 'Instructor'}
                </button>
                <button
                  type="button"
                  onClick={() => handleInstantDemoLogin('ADMIN')}
                  disabled={loadingDemoRole !== null}
                  className="py-1.5 px-2 bg-muted hover:bg-primary/10 text-foreground hover:text-primary border border-border text-[11px] font-medium rounded transition-colors text-center"
                >
                  {loadingDemoRole === 'ADMIN' ? 'Logging...' : 'Admin'}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>JWT & 2-Factor Protected Authentication</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Role-based access control (Student, Instructor, Admin)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl font-display font-bold text-foreground tracking-tight">Sign In</h2>
            <p className="text-xs text-muted-foreground mt-1">Enter your account credentials or use Instant Demo</p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive text-xs rounded flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          {!is2faRequired ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setValue('email', 'student@elearny.com');
                      setValue('password', 'Password123!');
                    }}
                    className="text-[11px] text-primary hover:underline"
                  >
                    Auto-fill Demo Credentials
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded shadow-xs hover:opacity-90 transition-opacity disabled:opacity-50 text-sm flex items-center justify-center space-x-1.5"
              >
                <span>{isSubmitting ? 'Authenticating with Backend...' : 'Sign In with Backend'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handle2faSubmit} className="space-y-4">
              <div className="p-3.5 bg-primary/10 border border-primary/20 rounded text-center">
                <ShieldCheck className="w-6 h-6 text-primary mx-auto mb-1" />
                <p className="text-xs text-foreground font-medium">Two-Factor Authentication Required</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Enter the 6-digit code from your authenticator app.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground text-center">6-Digit TOTP Code</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                  <input
                    type="text"
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-9 pr-3 py-2 border border-border rounded bg-background text-foreground text-center text-lg tracking-widest font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded shadow-xs hover:opacity-90 transition-opacity text-sm flex items-center justify-center space-x-1.5"
              >
                <span>Verify 2FA Security Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

