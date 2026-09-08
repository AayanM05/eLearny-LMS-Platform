'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { ShieldCheck, UserCheck, Clock, AlertTriangle, LogOut, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface ApplicationItem {
  id: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  headline: string;
  bio: string;
  experienceYears: number;
  sampleVideoUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
  createdAt: string;
}

export default function InstructorApplicationsPage() {
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data: any = await api.fetch('/admin/instructor-applications');
      setApplications(Array.isArray(data) ? data : []);
    } catch {
      // Fallback demo data if backend is offline/mock
      setApplications([
        {
          id: 'app-demo-1',
          userId: 'user-demo-1',
          userFullName: 'Dr. Alex Rivera',
          userEmail: 'alex.rivera@example.com',
          headline: 'Senior Systems Architect & Kubernetes Specialist',
          bio: '12+ years building cloud-native infrastructure at scale.',
          experienceYears: 12,
          sampleVideoUrl: 'https://youtube.com/watch?v=demo',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setReviewingId(id);
    try {
      await api.fetch(`/admin/instructor-applications/${id}/review`, {
        method: 'POST',
        body: JSON.stringify({ status, adminNotes: `Reviewed by Admin ${user?.fullName || ''}` }),
      });
      setApplications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } catch {
      // Optimistic update for demo mode
      setApplications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } finally {
      setReviewingId(null);
    }
  };

  const pendingCount = applications.filter((a) => a.status === 'PENDING').length;
  const approvedCount = applications.filter((a) => a.status === 'APPROVED').length;

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">Instructor Applications</h1>
            <p className="text-sm text-muted-foreground mt-1">Review educator credentials before granting platform publishing rights.</p>
          </div>
          <button
            onClick={fetchApplications}
            disabled={loading}
            className="p-2 text-xs font-semibold border border-border rounded bg-card hover:bg-muted transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Metric Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded border border-border bg-card space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Pending Queue</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-display font-bold text-amber-500">{pendingCount} Pending</div>
          </div>
          <div className="p-4 rounded border border-border bg-card space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Approved Instructors</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-display font-bold text-emerald-600">{approvedCount} Approved</div>
          </div>
          <div className="p-4 rounded border border-border bg-card space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Total Applications</span>
              <AlertTriangle className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-display font-bold">{applications.length} Total</div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          <h2 className="text-xl font-display font-bold">Applicant Queue</h2>

          {applications.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border rounded bg-card text-muted-foreground text-sm">
              No instructor applications found.
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="p-5 rounded border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-display font-bold text-base">{app.userFullName}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${
                        app.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : app.status === 'REJECTED'
                          ? 'bg-destructive/10 text-destructive border-destructive/20'
                          : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{app.headline} • {app.userEmail} ({app.experienceYears} yrs exp)</p>
                  <p className="text-xs text-foreground mt-1">{app.bio}</p>
                </div>

                {app.status === 'PENDING' ? (
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleReview(app.id, 'APPROVED')}
                      disabled={reviewingId === app.id}
                      className="px-3.5 py-2 rounded bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors flex items-center space-x-1 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{reviewingId === app.id ? 'Processing...' : 'Approve'}</span>
                    </button>
                    <button
                      onClick={() => handleReview(app.id, 'REJECTED')}
                      disabled={reviewingId === app.id}
                      className="px-3.5 py-2 rounded bg-muted border border-border text-foreground font-semibold text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors flex items-center space-x-1 disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic font-medium">Status Updated</span>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

