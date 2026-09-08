'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuthSession } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setErrorMessage(null);
    try {
      const response: any = await api.fetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      setAuthSession(response.user, response.accessToken, response.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-background border border-border p-8 rounded-lg shadow-sm">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-display font-bold text-foreground">Create an Account</h2>
          <p className="text-sm text-muted-foreground mt-1">Start learning on eLearny today</p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive text-destructive text-sm rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Full Name</label>
            <input
              {...register('fullName')}
              type="text"
              placeholder="Jane Doe"
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}
          </div>

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
              placeholder="At least 8 characters"
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground font-medium py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
