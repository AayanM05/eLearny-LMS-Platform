'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="font-display font-bold text-xl text-primary">eLearny</span>
          <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-medium">Instructor Studio</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">{user.fullName} ({user.role})</span>
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="text-sm text-destructive hover:underline"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
