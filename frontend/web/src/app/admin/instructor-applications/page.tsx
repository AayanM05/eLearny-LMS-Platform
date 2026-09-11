"use me";
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Check, 
  X, 
  User, 
  Link as LinkIcon, 
  GraduationCap,
  Briefcase,
  Sparkles
} from "lucide-react";

interface Application {
  id: number;
  userId: number;
  userFullName: string;
  userEmail: string;
  bio: string;
  experienceYears: number;
  expertiseTags: string;
  portfolioUrl: string;
  resumeUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export default function AdminInstructorApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      userId: 101,
      userFullName: "Dr. Sarah Jenkins",
      userEmail: "sarah.jenkins@stanford.edu",
      bio: "Senior Distributed Systems Architect with 12 years of hands-on experience building multi-region cloud services. Author of 3 books on Microservices.",
      experienceYears: 12,
      expertiseTags: "Spring Boot, Distributed Systems, Kubernetes, Kafka",
      portfolioUrl: "https://sarahjenkins.dev",
      resumeUrl: "https://sarahjenkins.dev/resume.pdf",
      status: "PENDING",
      createdAt: "2026-09-11T14:30:00Z"
    },
    {
      id: 2,
      userId: 102,
      userFullName: "Alex Vance",
      userEmail: "alex.vance@techlead.io",
      bio: "Staff Frontend Engineer specializing in Next.js App Router, WebGL, and high-performance micro-interactions.",
      experienceYears: 8,
      expertiseTags: "React, Next.js, WebGL, GSAP, TailwindCSS",
      portfolioUrl: "https://alexvance.io",
      resumeUrl: "https://alexvance.io/cv.pdf",
      status: "PENDING",
      createdAt: "2026-09-11T16:45:00Z"
    }
  ]);

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleReview = (id: number, approve: boolean, reason?: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status: approve ? "APPROVED" : "REJECTED",
            }
          : app
      )
    );
    setShowRejectModal(false);
    setSelectedApp(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-[#D96B43] selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D96B43] to-[#F2994A] flex items-center justify-center text-white shadow-lg shadow-[#D96B43]/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">eLearny <span className="text-[#D96B43]">Admin</span></span>
          </Link>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
            RBAC: ROLE_ADMIN
          </span>
        </div>
        <Link href="/admin/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Admin Dashboard
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[#D96B43] text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Flow 02 — Instructor Elevation Verification</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Instructor Applications</h1>
            <p className="text-slate-400 text-sm mt-1">Review pending credentials and elevate qualified applicants to Instructor role.</p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 text-sm">
            <span className="px-3 py-1.5 rounded-lg bg-[#D96B43] text-white font-semibold shadow">Pending ({applications.filter(a => a.status === 'PENDING').length})</span>
            <span className="px-3 py-1.5 text-slate-400">All Applications</span>
          </div>
        </div>

        {/* Application Cards List */}
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-400">
              No pending instructor applications found.
            </div>
          ) : (
            applications.map((app) => (
              <div 
                key={app.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-200 shadow-xl backdrop-blur-md flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#D96B43]/10 border border-[#D96B43]/30 flex items-center justify-center text-[#D96B43] font-bold">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{app.userFullName}</h3>
                      <p className="text-slate-400 text-xs">{app.userEmail} • Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                      app.status === 'PENDING' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' :
                      app.status === 'APPROVED' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' :
                      'bg-red-500/10 border border-red-500/30 text-red-400'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed">{app.bio}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                    <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 flex items-center">
                      <Briefcase className="w-3.5 h-3.5 mr-1.5 text-[#D96B43]" /> {app.experienceYears} Years Exp
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 flex items-center">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#D96B43]" /> {app.expertiseTags}
                    </span>
                    {app.portfolioUrl && (
                      <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg bg-slate-800 text-blue-400 hover:underline flex items-center">
                        <LinkIcon className="w-3.5 h-3.5 mr-1.5" /> Portfolio
                      </a>
                    )}
                  </div>
                </div>

                {app.status === "PENDING" && (
                  <div className="flex md:flex-col justify-end gap-3 min-w-[160px] border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                    <button
                      onClick={() => handleReview(app.id, true)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setShowRejectModal(true);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-red-950/50 hover:text-red-400 border border-slate-700 text-slate-300 font-semibold text-sm flex items-center justify-center space-x-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Reject Modal */}
      {showRejectModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <h3 className="text-xl font-bold text-white">Reject Application — {selectedApp.userFullName}</h3>
            <p className="text-slate-400 text-sm">Please specify a constructive reason for rejecting this application. This feedback will be sent to the applicant.</p>

            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Portfolio links are incomplete or insufficient years of domain teaching experience..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D96B43]"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReview(selectedApp.id, false, rejectionReason)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 shadow-lg shadow-red-600/25"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
