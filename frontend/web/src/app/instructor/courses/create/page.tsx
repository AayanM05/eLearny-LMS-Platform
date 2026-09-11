"use me";
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, 
  Sparkles, 
  DollarSign, 
  Image as PhotoIcon, 
  Film,
  Tag,
  ArrowRight
} from "lucide-react";

export default function CourseCreateWizardPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    category: "Software Engineering",
    level: "BEGINNER",
    price: "49.99",
    currency: "USD",
    tags: "Java, Spring Boot, Architecture",
    description: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    promoVideoUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch("/api/v1/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const courseId = data.data?.id || 1;
        router.push(`/instructor/courses/${courseId}/builder`);
      } else {
        router.push(`/instructor/courses/1/builder`);
      }
    } catch (err) {
      router.push(`/instructor/courses/1/builder`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-[#D96B43] selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D96B43] to-[#F2994A] flex items-center justify-center text-white shadow-lg shadow-[#D96B43]/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">eLearny <span className="text-[#D96B43]">Studio</span></span>
        </Link>
        <div className="flex items-center space-x-4">
          <span className="text-xs text-slate-400">Step 1 of 2: Course Details</span>
        </div>
      </header>

      {/* Main Wizard Form */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center space-x-2 text-[#D96B43] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Flow 03 — Course Creation Wizard</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Create New Masterclass</h1>
            <p className="text-slate-400 text-base mt-1">Set up metadata, pricing, and visual assets before building your curriculum structure.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-10 backdrop-blur-xl shadow-2xl space-y-8">
            {/* Title & Subtitle */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200">Course Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Master Spring Boot 3 & Microservices Architecture"
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D96B43]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Build Production-Ready Cloud Native Applications from Scratch"
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D96B43]"
                />
              </div>
            </div>

            {/* Category, Level, Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-[#D96B43]"
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200">Difficulty Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-[#D96B43]"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="ALL_LEVELS">All Levels</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1 text-[#D96B43]" /> Price (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-[#D96B43]"
                />
              </div>
            </div>

            {/* Course Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Comprehensive Course Description</label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide a detailed overview of what students will learn, prerequisites, and target audience..."
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D96B43]"
              />
            </div>

            {/* Media URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200 flex items-center">
                  <PhotoIcon className="w-4 h-4 mr-2 text-[#D96B43]" /> Course Cover Thumbnail URL
                </label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D96B43]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200 flex items-center">
                  <Film className="w-4 h-4 mr-2 text-[#D96B43]" /> Promotional Video URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.promoVideoUrl}
                  onChange={(e) => setFormData({ ...formData, promoVideoUrl: e.target.value })}
                  placeholder="https://cdn.elearny.com/promo.mp4"
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D96B43]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="py-4 px-8 rounded-xl bg-gradient-to-r from-[#D96B43] to-[#F2994A] text-white font-bold text-base shadow-xl shadow-[#D96B43]/25 hover:brightness-110 active:scale-[0.99] transition-all duration-200 flex items-center space-x-2"
              >
                <span>Proceed to Curriculum Builder</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
