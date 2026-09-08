'use client';

import React from 'react';
import { useAuth } from '@/lib/auth';
import { Users, DollarSign, BookOpen, Star, PlusCircle, LogOut, TrendingUp } from 'lucide-react';

export default function InstructorAnalyticsPage() {
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
            <span className="font-display font-bold text-lg">Instructor Management Studio</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-foreground">{user?.fullName || 'Instructor'}</p>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">Instructor Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">Monitor revenue performance, total enrollments, and course ratings.</p>
          </div>
          <button className="bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded shadow-sm hover:opacity-90 transition-opacity flex items-center space-x-2 text-sm self-start sm:self-auto">
            <PlusCircle className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded border border-border bg-card space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-display font-bold text-emerald-600">$4,850.00</div>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +14% from last month
            </p>
          </div>

          <div className="p-4 rounded border border-border bg-card space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Total Students</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-display font-bold">1,240</div>
          </div>

          <div className="p-4 rounded border border-border bg-card space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Published Courses</span>
              <BookOpen className="w-4 h-4 text-foreground" />
            </div>
            <div className="text-2xl font-display font-bold">4 Courses</div>
          </div>

          <div className="p-4 rounded border border-border bg-card space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Average Rating</span>
              <Star className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-display font-bold text-amber-500">4.92 ★</div>
          </div>
        </div>
      </main>
    </div>
  );
}
