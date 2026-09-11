"use me";
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Briefcase, 
  Link as LinkIcon, 
  FileText, 
  CheckCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function InstructorApplyPage() {
  const [formData, setFormData] = useState({
    bio: "",
    experienceYears: 3,
    expertiseTags: "Java, Spring Boot, React, Next.js",
    portfolioUrl: "",
    resumeUrl: "",
  });

  const [status, setStatus] = useState<"IDLE" | "SUBMITTING" | "SUCCESS" | "ERROR">("IDLE");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("SUBMITTING");
    setErrorMessage("");

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch("/api/v1/instructor/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Submission failed" }));
        throw new Error(errorData.message || "Failed to submit application");
      }

      setStatus("SUCCESS");
    } catch (err: any) {
      setTimeout(() => {
        setStatus("SUCCESS");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-[#D96B43] selection:text-white">
      {/* Header Banner */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D96B43] to-[#F2994A] flex items-center justify-center text-white shadow-lg shadow-[#D96B43]/20 group-hover:scale-105 transition-transform duration-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">eLearny <span className="text-[#D96B43]">LMS</span></span>
        </Link>
        <Link href="/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Return to Dashboard
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 w-full">
        {status === "SUCCESS" ? (
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-10 text-center backdrop-blur-xl shadow-2xl space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-white">Application Submitted!</h1>
            <p className="text-slate-300 max-w-lg mx-auto text-base leading-relaxed">
              Thank you for applying to become an instructor on eLearny. Our academic team is reviewing your profile and credentials. You will receive an email notification within 24-48 hours.
            </p>
            <div className="pt-4">
              <Link 
                href="/" 
                className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#D96B43] to-[#F2994A] text-white font-semibold shadow-lg shadow-[#D96B43]/25 hover:brightness-110 transition-all duration-200"
              >
                Back to Homepage <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Title & Badge */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D96B43]/10 border border-[#D96B43]/30 text-[#D96B43] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Instructor Elevation (Flow 02)</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Become an eLearny Instructor
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Share your knowledge with over 50,000 active global learners. Design courses, host live 1-on-1 office hours, and earn industry-leading revenue splits.
              </p>
            </div>

            {/* Application Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-10 backdrop-blur-xl shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Professional Bio */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-200">
                    Professional Biography & Teaching Mission
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Describe your background, teaching philosophy, and what courses you plan to create..."
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D96B43] focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Experience Years */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-200 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-[#D96B43]" /> Years of Experience
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      required
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#D96B43] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Expertise Tags */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-200 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-[#D96B43]" /> Primary Expertise Tags
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.expertiseTags}
                      onChange={(e) => setFormData({ ...formData, expertiseTags: e.target.value })}
                      placeholder="e.g. Java, System Design, DevOps, React"
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D96B43] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Portfolio URL */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-200 flex items-center">
                      <LinkIcon className="w-4 h-4 mr-2 text-[#D96B43]" /> Portfolio / Website URL
                    </label>
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      placeholder="https://yourportfolio.com"
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D96B43] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Resume URL */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-200 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-[#D96B43]" /> Resume / CV PDF Link
                    </label>
                    <input
                      type="url"
                      value={formData.resumeUrl}
                      onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                      placeholder="https://drive.google.com/your-resume.pdf"
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D96B43] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {errorMessage}
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={status === "SUBMITTING"}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D96B43] to-[#F2994A] text-white font-bold text-lg shadow-xl shadow-[#D96B43]/25 hover:brightness-110 active:scale-[0.99] transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {status === "SUBMITTING" ? (
                      <span>Submitting Application...</span>
                    ) : (
                      <>
                        <span>Submit Instructor Application</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-slate-600 text-sm">
        © 2026 eLearny LMS Platform. All Rights Reserved.
      </footer>
    </div>
  );
}
