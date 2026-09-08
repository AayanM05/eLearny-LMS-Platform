'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'ADMIN') {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="font-display font-bold text-xl text-primary">eLearny</span>
          <span className="text-xs bg-destructive/10 text-destructive border border-destructive/20 px-2 py-0.5 rounded font-medium">Admin Control Center</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">{user.fullName} (Administrator)</span>
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
