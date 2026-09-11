"use me";
"use client";

import React from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Video, 
  FileText, 
  ShieldCheck, 
  Users, 
  Award,
  Play,
  Star,
  BookOpen
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-[#D96B43] selection:text-white">
      {/* Top Header Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-6 sm:px-12 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D96B43] to-[#F2994A] flex items-center justify-center text-white shadow-lg shadow-[#D96B43]/20 group-hover:scale-105 transition-transform duration-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">eLearny <span className="text-[#D96B43]">LMS</span></span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <Link href="#courses" className="hover:text-white transition-colors">Courses</Link>
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/instructor/apply" className="hover:text-[#D96B43] transition-colors flex items-center">
            <Sparkles className="w-4 h-4 mr-1 text-[#D96B43]" /> Teach on eLearny
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link 
            href="/login" 
            className="px-4 py-2 rounded-xl text-slate-300 hover:text-white text-sm font-semibold transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D96B43] to-[#F2994A] text-white font-bold text-sm shadow-lg shadow-[#D96B43]/25 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 px-6 sm:px-12 text-center max-w-5xl mx-auto space-y-8">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#D96B43]/10 border border-[#D96B43]/30 text-[#D96B43] text-xs font-bold uppercase tracking-wider animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>v2.0.0 Architecture • Spring Boot 3 + Next.js 14 + Expo SDK 51</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-none">
          Master Modern Engineering with <span className="bg-gradient-to-r from-[#D96B43] via-[#F2994A] to-amber-300 bg-clip-text text-transparent">Production-Grade</span> Masterclasses
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
          Interactive hands-on curricula, S3 pre-signed 4K streaming, 1-on-1 instructor office hours, and tamper-proof verified certificates.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link 
            href="/register" 
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D96B43] to-[#F2994A] text-white font-extrabold text-base shadow-xl shadow-[#D96B43]/30 hover:brightness-110 transition-all flex items-center justify-center space-x-2"
          >
            <span>Explore Courses</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link 
            href="/instructor/apply" 
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold text-base transition-colors flex items-center justify-center space-x-2"
          >
            <GraduationCap className="w-5 h-5 text-[#D96B43]" />
            <span>Apply as Instructor</span>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 border-t border-slate-900 text-left max-w-4xl mx-auto">
          <div>
            <span className="text-3xl font-extrabold text-white">50K+</span>
            <p className="text-xs text-slate-400 font-medium">Active Global Learners</p>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white">120+</span>
            <p className="text-xs text-slate-400 font-medium">Production Courses</p>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white">99.9%</span>
            <p className="text-xs text-slate-400 font-medium">Video Streaming Uptime</p>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white">100%</span>
            <p className="text-xs text-slate-400 font-medium">Web & Mobile Parity</p>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section id="courses" className="py-16 px-6 sm:px-12 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
            <div>
              <span className="text-[#D96B43] text-xs font-bold uppercase tracking-wider">Curriculum Catalog</span>
              <h2 className="text-3xl font-extrabold text-white mt-1">Featured Masterclasses</h2>
            </div>
            <Link href="/courses" className="text-sm font-bold text-[#D96B43] hover:underline flex items-center">
              View All Courses <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Course Card 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all group flex flex-col justify-between">
              <div>
                <div className="h-48 bg-gradient-to-tr from-slate-900 via-slate-800 to-[#D96B43]/30 p-6 flex flex-col justify-between relative">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 text-[#D96B43] border border-[#D96B43]/30 text-xs font-bold w-max">
                    Software Engineering
                  </span>
                  <div className="flex items-center text-xs text-slate-300 space-x-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-white">4.9</span>
                    <span>(1,240 ratings)</span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#D96B43] transition-colors">
                    Master Spring Boot 3 & Distributed Microservices
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                    Build production-ready microservices with Spring Cloud, OAuth2, JJWT, Docker, and Kafka messaging.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 flex justify-between items-center border-t border-slate-800/60 mt-4">
                <span className="text-xl font-extrabold text-white">$49.99</span>
                <Link href="/register" className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-[#D96B43]">
                  Enroll Now
                </Link>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all group flex flex-col justify-between">
              <div>
                <div className="h-48 bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-600/30 p-6 flex flex-col justify-between relative">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 text-blue-400 border border-blue-500/30 text-xs font-bold w-max">
                    Mobile Development
                  </span>
                  <div className="flex items-center text-xs text-slate-300 space-x-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-white">4.95</span>
                    <span>(890 ratings)</span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    React Native & Expo SDK 51 Masterclass
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                    Build 60fps native iOS & Android applications with Reanimated 3, Gesture Handler, and OTA updates.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 flex justify-between items-center border-t border-slate-800/60 mt-4">
                <span className="text-xl font-extrabold text-white">$59.99</span>
                <Link href="/register" className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-[#D96B43]">
                  Enroll Now
                </Link>
              </div>
            </div>

            {/* Course Card 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all group flex flex-col justify-between">
              <div>
                <div className="h-48 bg-gradient-to-tr from-slate-900 via-slate-800 to-purple-600/30 p-6 flex flex-col justify-between relative">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 text-purple-400 border border-purple-500/30 text-xs font-bold w-max">
                    Architecture & DevOps
                  </span>
                  <div className="flex items-center text-xs text-slate-300 space-x-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-white">4.88</span>
                    <span>(650 ratings)</span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                    High-Scale Cloud Architecture & Kubernetes
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                    Architect fault-tolerant cloud infrastructures, CI/CD pipelines, and multi-region failover.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 flex justify-between items-center border-t border-slate-800/60 mt-4">
                <span className="text-xl font-extrabold text-white">$69.99</span>
                <Link href="/register" className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-[#D96B43]">
                  Enroll Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 sm:px-12 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[#D96B43] text-xs font-bold uppercase tracking-wider">Engineered for Excellence</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Platform Features</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D96B43]/10 border border-[#D96B43]/30 flex items-center justify-center text-[#D96B43]">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Direct S3 Pre-Signed Video</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ultra-low latency 4K video playback with signed short-lived URL signatures for max security.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Live 1-on-1 Office Hours</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Book private mentorship sessions directly with course instructors and Teaching Assistants.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Tamper-Proof Certificates</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Server-generated PDF Box credentials with unique verification codes and QR codes for LinkedIn.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-10 px-6 sm:px-12 text-slate-500 text-sm text-center space-y-4 bg-slate-950">
        <div className="flex justify-center space-x-6 text-xs text-slate-400">
          <Link href="/legal/terms-privacy" className="hover:text-white">Terms of Service</Link>
          <Link href="/legal/terms-privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/instructor/apply" className="hover:text-[#D96B43]">Instructor Application</Link>
        </div>
        <p>© 2026 eLearny LMS Platform. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
