'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { 
  User, Mail, Lock, Phone, ArrowRight, CheckCircle2, XCircle, 
  ShieldCheck, AlertCircle, Eye, EyeOff, Loader2, AtSign, Check, X 
} from 'lucide-react';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username max 50 characters').regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  role: z.enum(['STUDENT', 'INSTRUCTOR']),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the Terms & Privacy Policy'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuthSession } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Username checking states
  const [usernameInput, setUsernameInput] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'STUDENT',
      agreeToTerms: false,
    },
  });

  const passwordValue = watch('password', '');
  const usernameValue = watch('username', '');

  // Live password strength checklist
  const passwordChecks = {
    length: passwordValue.length >= 8,
    uppercase: /[A-Z]/.test(passwordValue),
    lowercase: /[a-z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
    special: /[^A-Za-z0-9]/.test(passwordValue),
  };

  // Debounced username availability check
  useEffect(() => {
    if (!usernameValue || usernameValue.length < 3) {
      setUsernameAvailable(null);
      setUsernameSuggestions([]);
      return;
    }

    setIsCheckingUsername(true);
    const timer = setTimeout(async () => {
      try {
        const res: any = await api.fetch(`/auth/check-username?username=${encodeURIComponent(usernameValue)}`);
        setUsernameAvailable(res.available);
        setUsernameSuggestions(res.suggestions || []);
      } catch (err) {
        setUsernameAvailable(null);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [usernameValue]);

  const onSubmit = async (data: RegisterFormValues) => {
    setErrorMessage(null);
    try {
      const response: any = await api.fetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName: data.fullName,
          username: data.username,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });

      setAuthSession(response.user, response.accessToken, response.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-xl border border-border bg-card shadow-xl overflow-hidden">
        
        {/* Left Branding Panel */}
        <div className="bg-gradient-to-br from-primary/10 via-muted/50 to-background p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border">
          <div>
            <div className="flex items-center space-x-2.5 mb-8">
              <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-xl shadow-md">
                e
              </div>
              <span className="font-display font-bold text-xl tracking-tight">eLearny LMS</span>
            </div>

            <h3 className="text-2xl font-display font-bold text-foreground leading-tight mb-3">
              Join thousands of active learners and instructors.
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Unlock interactive video courses, practice coding sandboxes, quizzes, drip content, and verifiable digital certificates.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-border/80">
            <div className="flex items-center space-x-2.5 text-xs text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full Parity Web & Mobile Ecosystem</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>Enterprise-grade JWT Auth & TOTP 2FA Security</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 flex flex-col justify-center max-h-[90vh] overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-display font-bold text-foreground">Create Account</h2>
            <p className="text-xs text-muted-foreground mt-1">Enter your details to get started with eLearny</p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive text-xs rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Account Type Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">Account Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setValue('role', 'STUDENT')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    watch('role') === 'STUDENT'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setValue('role', 'INSTRUCTOR')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    watch('role') === 'INSTRUCTOR'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-muted-foreground hover:bg-muted'
                  }`}
                >
                  Instructor
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  {...register('fullName')}
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}
            </div>

            {/* Username with Live Debounced Check */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">Username</label>
              <div className="relative">
                <AtSign className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  {...register('username')}
                  type="text"
                  placeholder="janedoe99"
                  className="w-full pl-9 pr-9 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <div className="absolute right-3 top-3">
                  {isCheckingUsername && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />}
                  {!isCheckingUsername && usernameAvailable === true && <Check className="w-4 h-4 text-emerald-500" />}
                  {!isCheckingUsername && usernameAvailable === false && <X className="w-4 h-4 text-destructive" />}
                </div>
              </div>
              {errors.username && <p className="text-xs text-destructive mt-1">{errors.username.message}</p>}
              {!errors.username && usernameAvailable === false && (
                <div className="mt-1.5">
                  <p className="text-xs text-destructive">Username is taken.</p>
                  {usernameSuggestions.length > 0 && (
                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="text-[10px] text-muted-foreground">Suggestions:</span>
                      {usernameSuggestions.map(sugg => (
                        <button
                          key={sugg}
                          type="button"
                          onClick={() => setValue('username', sugg, { shouldValidate: true })}
                          className="text-[10px] bg-primary/10 text-primary font-mono px-1.5 py-0.5 rounded hover:bg-primary/20"
                        >
                          {sugg}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Email Address */}
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

            {/* Optional Phone */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create password"
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
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}

              {/* Password Requirement Checklist */}
              <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] bg-muted/30 p-2 rounded-md border border-border/50">
                <div className={`flex items-center space-x-1 ${passwordChecks.length ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                  {passwordChecks.length ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
                  <span>Min 8 characters</span>
                </div>
                <div className={`flex items-center space-x-1 ${passwordChecks.uppercase ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                  {passwordChecks.uppercase ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
                  <span>Uppercase letter</span>
                </div>
                <div className={`flex items-center space-x-1 ${passwordChecks.lowercase ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                  {passwordChecks.lowercase ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
                  <span>Lowercase letter</span>
                </div>
                <div className={`flex items-center space-x-1 ${passwordChecks.number ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                  {passwordChecks.number ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
                  <span>Number (0-9)</span>
                </div>
                <div className={`flex items-center space-x-1 ${passwordChecks.special ? 'text-emerald-500 font-medium' : 'text-muted-foreground'}`}>
                  {passwordChecks.special ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
                  <span>Special character</span>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat password"
                  className="w-full pl-9 pr-9 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Terms & Privacy Agreement */}
            <div className="pt-1">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  {...register('agreeToTerms')}
                  type="checkbox"
                  className="mt-0.5 rounded border-border text-primary focus:ring-primary/40"
                />
                <span className="text-xs text-muted-foreground leading-snug">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary font-medium hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary font-medium hover:underline">
                    Privacy Policy
                  </Link>.
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-xs text-destructive mt-1">{errors.agreeToTerms.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || usernameAvailable === false}
              className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 text-sm flex items-center justify-center space-x-1.5 mt-2"
            >
              <span>{isSubmitting ? 'Creating account...' : 'Complete Registration'}</span>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
