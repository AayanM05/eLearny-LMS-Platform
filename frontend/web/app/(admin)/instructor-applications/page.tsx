'use client';

import React from 'react';
import { useAuth } from '@/lib/auth';
import { ShieldCheck, UserCheck, Clock, AlertTriangle, LogOut, CheckCircle2, XCircle } from 'lucide-react';

export default function InstructorApplicationsPage() {
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
            <span className="font-display font-bold text-lg">Admin Control Center</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-foreground">{user?.fullName || 'Platform Administrator'}</p>
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
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">Instructor Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">Review pending educator credentials before granting platform publishing rights.</p>
        </div>

        {/* Metric Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded border border-border bg-card space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Pending Applications</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-display font-bold text-amber-500">2 Pending</div>
          </div>
          <div className="p-4 rounded border border-border bg-card space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Approved Instructors</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-display font-bold text-emerald-600">42 Approved</div>
          </div>
          <div className="p-4 rounded border border-border bg-card space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Flagged Reviews</span>
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </div>
            <div className="text-2xl font-display font-bold">0 Flagged</div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          <h2 className="text-xl font-display font-bold">Pending Approval Queue</h2>

          <div className="p-5 rounded border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-base">Dr. Alex Rivera</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">PENDING</span>
              </div>
              <p className="text-xs text-muted-foreground">Submitted: Senior Systems Architect (10+ yrs) • alex@example.com</p>
              <p className="text-xs text-foreground mt-1">Specialization: Distributed Systems & Kubernetes Architecture</p>
            </div>

            <div className="flex items-center space-x-2">
              <button className="px-3.5 py-2 rounded bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Instructor</span>
              </button>
              <button className="px-3.5 py-2 rounded bg-muted border border-border text-foreground font-semibold text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors flex items-center space-x-1">
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
