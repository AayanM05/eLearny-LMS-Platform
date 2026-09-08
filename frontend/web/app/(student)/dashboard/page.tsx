'use client';

import React from 'react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { BookOpen, Award, Clock, Flame, PlayCircle, CheckCircle2, ArrowRight, ShieldCheck, LogOut } from 'lucide-react';

export default function StudentDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-base">
              e
            </div>
            <span className="font-display font-bold text-lg">Student Workspace</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-foreground">{user?.fullName || 'Student User'}</p>
              <p className="text-[11px] text-muted-foreground">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded border border-border"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="p-6 rounded border border-border bg-muted/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Student Account Verified</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">Welcome back, {user?.fullName || 'Student'}!</h1>
            <p className="text-sm text-muted-foreground mt-1">Track your course progress, upcoming assignments, and earned credentials.</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded shadow-sm hover:opacity-90 transition-opacity self-start sm:self-auto"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Catalog</span>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded border border-border bg-card space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Enrolled Courses</span>
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-display font-bold">3 Courses</div>
          </div>
          <div className="p-4 rounded border border-border bg-card space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Learning Hours</span>
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-display font-bold">18.4 hrs</div>
          </div>
          <div className="p-4 rounded border border-border bg-card space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Certificates</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-display font-bold text-emerald-600">1 Issued</div>
          </div>
          <div className="p-4 rounded border border-border bg-card space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Daily Streak</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-display font-bold text-amber-500">5 Days</div>
          </div>
        </div>

        {/* Active Course Progress Card */}
        <div className="space-y-4">
          <h2 className="text-xl font-display font-bold">Continue Learning</h2>

          <div className="p-6 rounded border border-border bg-card flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-muted border border-border text-foreground">Java & Spring Boot</span>
                <span className="text-xs text-muted-foreground">• Module 4 of 6</span>
              </div>
              <h3 className="text-lg font-display font-bold">Spring Boot 3.2 Microservices & Security</h3>
              
              <div className="space-y-1.5 max-w-md">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Overall Progress</span>
                  <span className="font-semibold text-foreground">78%</span>
                </div>
                <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[78%]" />
                </div>
              </div>
            </div>

            <button className="bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 text-sm shrink-0">
              <PlayCircle className="w-4 h-4" />
              <span>Resume Lesson 14</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
