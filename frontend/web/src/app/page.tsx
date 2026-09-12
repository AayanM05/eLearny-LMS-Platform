"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/src/components/theme-toggle";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Video, 
  Code2, 
  ShieldCheck, 
  Users, 
  Award,
  Star,
  BookOpen,
  Play,
  Check,
  TrendingUp,
  Laptop,
  Briefcase,
  Terminal,
  Clock
} from "lucide-react";

// Mock Course Catalog Data
const COURSES = [
  {
    id: "spring-boot-microservices",
    category: "Software Engineering",
    title: "Master Spring Boot 3 & Distributed Microservices",
    description: "Build enterprise production microservices with Spring Cloud, OAuth2 JWT, Docker, Kafka, and Supabase PostgreSQL.",
    instructor: "Dr. Alex Vance",
    role: "Ex-Google Principal Engineer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 4.92,
    reviews: 1420,
    price: "$49.99",
    tagColor: "from-[#D96B43]/20 to-[#F2994A]/20 text-[#D96B43] border-[#D96B43]/30",
    level: "Advanced",
    duration: "24h 30m"
  },
  {
    id: "react-native-expo-57",
    category: "Mobile Apps",
    title: "React Native & Expo SDK 57 Production Masterclass",
    description: "Build 60fps native iOS & Android applications with Reanimated 4, Gesture Handler, and instant OTA Updates.",
    instructor: "Sarah Jenkins",
    role: "Senior Mobile Architect",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    rating: 4.96,
    reviews: 980,
    price: "$59.99",
    tagColor: "from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
    level: "Intermediate to Advanced",
    duration: "18h 45m"
  },
  {
    id: "cloud-devops-kubernetes",
    category: "Cloud Architecture",
    title: "High-Scale Cloud Architecture & Kubernetes DevOps",
    description: "Architect fault-tolerant cloud infrastructures, terraform IaC pipelines, AWS CloudFront CDN, and multi-region failover.",
    instructor: "Marcus Brody",
    role: "DevOps Tech Lead",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 4.88,
    reviews: 750,
    price: "$69.99",
    tagColor: "from-purple-500/20 to-indigo-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30",
    level: "Advanced",
    duration: "28h 10m"
  },
  {
    id: "fullstack-nextjs-16",
    category: "Software Engineering",
    title: "Fullstack Next.js 16 & Server Actions Masterclass",
    description: "Master App Router, Server Components, Tailwind CSS v4, Optimistic UI, and real-time WebSockets.",
    instructor: "Elena Rostova",
    role: "Fullstack Specialist",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    rating: 4.94,
    reviews: 1110,
    price: "$44.99",
    tagColor: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    level: "All Levels",
    duration: "20h 15m"
  },
  {
    id: "ai-llm-engineering",
    category: "AI & Data Science",
    title: "Applied AI & LLM Systems Engineering with Python",
    description: "Design autonomous AI agents, LangChain pipelines, vector database embeddings (pgvector), and fine-tuned models.",
    instructor: "Dr. Aris Thorne",
    role: "AI Research Director",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 4.98,
    reviews: 1640,
    price: "$79.99",
    tagColor: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
    level: "Advanced",
    duration: "32h 00m"
  },
  {
    id: "system-design-interviews",
    category: "Software Engineering",
    title: "Staff Engineer System Design & Code Execution",
    description: "Pass FAANG system design interviews with distributed Caching, Rate Limiting, Sharding, and Judge0 sandboxes.",
    instructor: "David Miller",
    role: "Staff Software Engineer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    rating: 4.91,
    reviews: 830,
    price: "$54.99",
    tagColor: "from-[#D96B43]/20 to-rose-500/20 text-[#D96B43] border-[#D96B43]/30",
    level: "Intermediate",
    duration: "16h 30m"
  }
];

const CATEGORIES = ["All", "Software Engineering", "Mobile Apps", "Cloud Architecture", "AI & Data Science"];

export default function HomePage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredCourses = activeCategory === "All" 
    ? COURSES 
    : COURSES.filter(c => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-[#D96B43] selection:text-white transition-colors duration-300 mesh-gradient-bg">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 px-6 sm:px-12 py-4 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 flex justify-between items-center transition-colors">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          {mounted && (
            <Image
              src={resolvedTheme === "dark" ? "/assets/branding/logo-dark.png" : "/assets/branding/logo-light.png"}
              alt="eLearny LMS Logo"
              width={160}
              height={42}
              className="h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
              priority
            />
          )}
          {!mounted && (
            <div className="h-9 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          )}
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <Link href="#courses" className="hover:text-[#D96B43] dark:hover:text-[#D96B43] transition-colors">
            Courses
          </Link>
          <Link href="#features" className="hover:text-[#D96B43] dark:hover:text-[#D96B43] transition-colors">
            Features
          </Link>
          <Link href="#enterprise" className="hover:text-[#D96B43] dark:hover:text-[#D96B43] transition-colors">
            Enterprise
          </Link>
          <Link href="/instructor/apply" className="hover:text-[#D96B43] transition-colors flex items-center text-[#D96B43] font-bold">
            <Sparkles className="w-4 h-4 mr-1 text-[#D96B43]" /> Teach on eLearny
          </Link>
        </nav>

        {/* Right Action Controls & Theme Switcher */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <Link 
            href="/login" 
            className="hidden sm:inline-flex px-4 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-[#D96B43] dark:hover:text-[#D96B43] text-sm font-semibold transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D96B43] to-[#F2994A] text-white font-bold text-sm shadow-lg shadow-[#D96B43]/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center space-x-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 sm:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Headline Column */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Architecture Release Badge */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-[#D96B43]/10 border border-[#D96B43]/30 text-[#D96B43] text-xs font-bold uppercase tracking-wider shadow-sm animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>v2.0.0 Architecture • Spring Boot 3 + Next.js 16 + Expo SDK 57</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] font-heading">
            Master Software Engineering with <span className="bg-gradient-to-r from-[#D96B43] via-[#F2994A] to-amber-500 bg-clip-text text-transparent">Production-Grade</span> Masterclasses
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 dark:text-slate-300 text-lg sm:text-xl leading-relaxed max-w-2xl">
            Interactive hands-on curricula, S3 pre-signed 4K streaming, 1-on-1 instructor office hours, integrated code execution sandboxes, and tamper-proof verified credentials.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link 
              href="/register" 
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D96B43] to-[#F2994A] text-white font-extrabold text-base shadow-xl shadow-[#D96B43]/30 hover:brightness-110 transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Masterclasses</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link 
              href="/instructor/apply" 
              className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-base transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <BookOpen className="w-5 h-5 text-[#D96B43]" />
              <span>Apply as Instructor</span>
            </Link>
          </div>

          {/* Key Feature Checkmarks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-[#D96B43]" />
              <span>Direct S3 4K Streaming</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-[#D96B43]" />
              <span>100% Web & Mobile Parity</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-[#D96B43]" />
              <span>Verified PDF Certificates</span>
            </div>
          </div>
        </div>

        {/* Right Floating Glassmorphic Interactive Hero Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 p-6 shadow-2xl backdrop-blur-2xl space-y-6 terracotta-card">
            {/* Card Header: Live Code & Stream Badge */}
            <div className="flex justify-between items-center border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <div className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <div className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 ml-2">SpringController.java</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-ping" /> Live S3 Stream
              </span>
            </div>

            {/* Code Snippet Preview */}
            <div className="font-mono text-xs bg-slate-950 text-slate-200 p-4 rounded-2xl space-y-1.5 overflow-x-auto shadow-inner">
              <div className="text-purple-400">@RestController</div>
              <div className="text-purple-400">@RequestMapping<span className="text-slate-200">(</span><span className="text-emerald-400">"/api/v1/courses"</span><span className="text-slate-200">)</span></div>
              <div><span className="text-blue-400">public class</span> <span className="text-amber-300">CourseController</span> &#123;</div>
              <div className="pl-4 text-purple-400">@GetMapping<span className="text-slate-200">(</span><span className="text-emerald-400">"/stream/&#123;id&#125;"</span><span className="text-slate-200">)</span></div>
              <div className="pl-4"><span className="text-blue-400">public</span> ResponseEntity&lt;SignedUrlResponse&gt; streamVideo() &#123;</div>
              <div className="pl-8 text-slate-400">// Generates 4K S3 pre-signed URL</div>
              <div className="pl-8"><span className="text-blue-400">return</span> mediaService.generatePresignedUrl();</div>
              <div className="pl-4">&#125;</div>
              <div>&#125;</div>
            </div>

            {/* Student Activity Widget */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-2 overflow-hidden">
                  <Image width={32} height={32} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Learner 1" />
                  <Image width={32} height={32} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="Learner 2" />
                  <Image width={32} height={32} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Learner 3" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">1,420 Active Today</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Enrolled in Spring Boot 3 Masterclass</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-[#D96B43]">4.9 / 5.0</span>
                <div className="flex text-amber-400 justify-end">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <Star className="w-3 h-3 fill-amber-400" />
                  <Star className="w-3 h-3 fill-amber-400" />
                  <Star className="w-3 h-3 fill-amber-400" />
                  <Star className="w-3 h-3 fill-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Proof Bar */}
      <section className="py-10 bg-white/70 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">50,000+</span>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Global Engineers</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">120+</span>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Production Courses</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#D96B43] font-heading">99.9%</span>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">S3 Video Uptime</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">100%</span>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Web & Mobile Parity</p>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section id="courses" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <span className="px-3.5 py-1.5 rounded-full bg-[#D96B43]/10 border border-[#D96B43]/30 text-[#D96B43] text-xs font-bold uppercase tracking-wider">
              Curriculum Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
              Featured Production Masterclasses
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#D96B43] text-white shadow-md shadow-[#D96B43]/25 scale-105"
                    : "bg-slate-200/70 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div 
              key={course.id}
              className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md hover:shadow-xl terracotta-card flex flex-col justify-between group"
            >
              <div>
                {/* Course Header Gradient Banner */}
                <div className="h-44 bg-gradient-to-tr from-slate-900 via-slate-800 to-[#D96B43]/40 p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-center z-10">
                    <span className={`px-3 py-1 rounded-full bg-slate-950/80 border text-[11px] font-bold ${course.tagColor}`}>
                      {course.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-300 flex items-center bg-slate-950/60 px-2.5 py-1 rounded-full">
                      <Clock className="w-3 h-3 mr-1 text-[#D96B43]" />
                      {course.duration}
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-white space-x-1.5 z-10">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-extrabold text-sm">{course.rating}</span>
                    <span className="text-slate-300">({course.reviews} reviews)</span>
                  </div>
                </div>

                {/* Course Body Info */}
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#D96B43] dark:group-hover:text-[#D96B43] transition-colors leading-snug font-heading">
                    {course.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
                    {course.description}
                  </p>

                  {/* Instructor Meta */}
                  <div className="flex items-center space-x-3 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                    <Image 
                      src={course.avatar} 
                      alt={course.instructor} 
                      width={36} 
                      height={36} 
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-[#D96B43]/30"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{course.instructor}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{course.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Footer & Price */}
              <div className="p-6 pt-0 flex justify-between items-center border-t border-slate-100 dark:border-slate-800/60 mt-2">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Lifetime Access</span>
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">{course.price}</span>
                </div>

                <Link 
                  href="/register" 
                  className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-[#D96B43] dark:hover:bg-[#D96B43] text-white font-bold text-xs transition-colors shadow-sm"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Features Grid */}
      <section id="features" className="py-20 px-6 sm:px-12 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="px-3.5 py-1.5 rounded-full bg-[#D96B43]/10 border border-[#D96B43]/30 text-[#D96B43] text-xs font-bold uppercase tracking-wider">
              Engineered for Scalability
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
              Why Engineers Choose eLearny LMS
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
               Built with production architectural patterns, real-time sync, and enterprise security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4 shadow-sm hover:border-[#D96B43]/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#D96B43]/10 border border-[#D96B43]/30 flex items-center justify-center text-[#D96B43]">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Direct S3 Pre-Signed Video</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Ultra-low latency 4K video playback with AWS CloudFront CDN signatures for max streaming security.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4 shadow-sm hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Live 1-on-1 Office Hours</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Book private 1-on-1 mentorship slots directly with course instructors and Teaching Assistants.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4 shadow-sm hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Tamper-Proof Certificates</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Server-generated PDF Box credentials with unique verification codes and QR codes for LinkedIn sharing.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4 shadow-sm hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">Browser Code Execution</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Execute code directly in your browser powered by our isolated Docker Judge0 coding sandbox.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise & Instructor Dual CTA Section */}
      <section id="enterprise" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Teach on eLearny Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-[#D96B43]/15 via-transparent to-amber-500/10 border border-[#D96B43]/30 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full bg-[#D96B43]/20 text-[#D96B43] text-xs font-bold uppercase tracking-wider">
              Instructor Onboarding
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              Teach & Monetize Your Expertise
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Create masterclasses, set live 1-on-1 office hour slots, invite TAs, and earn 80% revenue share with automated payouts.
            </p>
          </div>
          <Link 
            href="/instructor/apply" 
            className="w-max px-6 py-3.5 rounded-xl bg-[#D96B43] hover:brightness-110 text-white font-bold text-sm shadow-md transition-all flex items-center space-x-2"
          >
            <span>Apply as Instructor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Enterprise Upskilling Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-blue-500/15 via-transparent to-indigo-500/10 border border-blue-500/30 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              Corporate Teams
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              eLearny for Tech Enterprises
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Upskill software engineering teams with custom learning paths, SSO authentication, and team analytics dashboards.
            </p>
          </div>
          <Link 
            href="/register" 
            className="w-max px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center space-x-2"
          >
            <span>Request Enterprise Demo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 px-6 sm:px-12 text-slate-500 dark:text-slate-400 text-sm transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-200 dark:border-slate-800/80">
          {/* Brand Info */}
          <div className="space-y-4">
            {mounted && (
              <Image
                src={resolvedTheme === "dark" ? "/assets/branding/logo-dark.png" : "/assets/branding/logo-light.png"}
                alt="eLearny LMS Logo"
                width={150}
                height={38}
                className="h-8 w-auto object-contain"
              />
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Next-generation Learning Management System for software engineers, architects, and instructors.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Backend Status: Operational</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="#courses" className="hover:text-[#D96B43]">Browse Masterclasses</Link></li>
              <li><Link href="#features" className="hover:text-[#D96B43]">4K S3 Video Player</Link></li>
              <li><Link href="#features" className="hover:text-[#D96B43]">Judge0 Code Sandbox</Link></li>
              <li><Link href="/instructor/apply" className="hover:text-[#D96B43]">Teach on eLearny</Link></li>
            </ul>
          </div>

          {/* Infrastructure */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Architecture</h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>Spring Boot 3 + Supabase DB</li>
              <li>Next.js 16 + Vercel Web</li>
              <li>Expo SDK 57 + EAS Mobile</li>
              <li>Flyway Schema Migrations</li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Legal & Support</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/legal/terms-privacy" className="hover:text-[#D96B43]">Terms of Service</Link></li>
              <li><Link href="/legal/terms-privacy" className="hover:text-[#D96B43]">Privacy Policy</Link></li>
              <li><a href="https://elearny-backend-api.onrender.com/api/v1/health" target="_blank" rel="noreferrer" className="hover:text-[#D96B43]">Render Health Status</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 space-y-2 sm:space-y-0">
          <p>© 2026 eLearny LMS Platform. All Rights Reserved.</p>
          <p className="font-semibold text-slate-500">Designed with Terracotta Orange Brand Standards</p>
        </div>
      </footer>
    </div>
  );
}
