"use me";
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Video, 
  FileText, 
  HelpCircle, 
  Upload,
  CheckCircle,
  Menu,
  Sparkles,
  Eye,
  UploadCloud
} from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  type: "VIDEO" | "QUIZ" | "DOCUMENT" | "ASSIGNMENT";
  contentUrl: string;
  durationSeconds: number;
  isFreePreview: boolean;
}

interface Section {
  id: number;
  title: string;
  lessons: Lesson[];
}

export default function CourseBuilderPage() {
  const [sections, setSections] = useState<Section[]>([
    {
      id: 1,
      title: "Module 1: Foundations & Architecture",
      lessons: [
        {
          id: 101,
          title: "1.1 Introduction to Distributed Microservices",
          type: "VIDEO",
          contentUrl: "https://cdn.elearny.com/videos/lesson1.mp4",
          durationSeconds: 740,
          isFreePreview: true,
        },
        {
          id: 102,
          title: "1.2 System Design Blueprint & Requirements",
          type: "DOCUMENT",
          contentUrl: "https://cdn.elearny.com/docs/architecture.pdf",
          durationSeconds: 0,
          isFreePreview: false,
        }
      ]
    },
    {
      id: 2,
      title: "Module 2: Security & Authentication Engines",
      lessons: [
        {
          id: 201,
          title: "2.1 Implementing Spring Security & OAuth2 / JJWT",
          type: "VIDEO",
          contentUrl: "https://cdn.elearny.com/videos/lesson2.mp4",
          durationSeconds: 1200,
          isFreePreview: false,
        },
        {
          id: 202,
          title: "2.2 Knowledge Check: Security Architecture Quiz",
          type: "QUIZ",
          contentUrl: "",
          durationSeconds: 300,
          isFreePreview: false,
        }
      ]
    }
  ]);

  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [activeUploadModal, setActiveUploadModal] = useState<{ sectionId: number } | null>(null);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState<"VIDEO" | "QUIZ" | "DOCUMENT">("VIDEO");

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    const newSection: Section = {
      id: Date.now(),
      title: newSectionTitle.trim(),
      lessons: [],
    };
    setSections([...sections, newSection]);
    setNewSectionTitle("");
  };

  const handleSimulateUpload = () => {
    if (!lessonTitle.trim()) return;
    setIsUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          if (activeUploadModal) {
            setSections((prevSecs) =>
              prevSecs.map((sec) =>
                sec.id === activeUploadModal.sectionId
                  ? {
                      ...sec,
                      lessons: [
                        ...sec.lessons,
                        {
                          id: Date.now(),
                          title: lessonTitle,
                          type: lessonType,
                          contentUrl: `https://cdn.elearny.com/media/${uploadFileName || 'content.mp4'}`,
                          durationSeconds: lessonType === 'VIDEO' ? 600 : 0,
                          isFreePreview: false,
                        }
                      ]
                    }
                  : sec
              )
            );
          }
          setActiveUploadModal(null);
          setLessonTitle("");
          setUploadFileName("");
          setUploadProgress(0);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-[#D96B43] selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D96B43] to-[#F2994A] flex items-center justify-center text-white shadow-lg shadow-[#D96B43]/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">eLearny <span className="text-[#D96B43]">Studio</span></span>
        </Link>
        <div className="flex items-center space-x-4">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            Status: DRAFT
          </span>
          <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D96B43] to-[#F2994A] text-white font-bold text-sm shadow-lg shadow-[#D96B43]/25 hover:brightness-110">
            Publish Course
          </button>
        </div>
      </header>

      {/* Main Builder Surface */}
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <div className="inline-flex items-center space-x-2 text-[#D96B43] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Hierarchical Curriculum Builder</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Master Spring Boot 3 & Microservices</h1>
            <p className="text-slate-400 text-sm mt-1">Organize modules, upload videos, attach quizzes, and set preview permissions.</p>
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div 
              key={section.id}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6"
            >
              {/* Section Header */}
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
                <div className="flex items-center space-x-3">
                  <Menu className="w-5 h-5 text-slate-500 cursor-grab" />
                  <span className="text-[#D96B43] font-mono text-sm font-bold">Section {idx + 1}</span>
                  <h3 className="text-xl font-bold text-white">{section.title}</h3>
                </div>
                <button
                  onClick={() => setSections(sections.filter(s => s.id !== section.id))}
                  className="text-slate-500 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Lessons Sub-list */}
              <div className="space-y-3 pl-2 sm:pl-6">
                {section.lessons.map((lesson) => (
                  <div 
                    key={lesson.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {lesson.type === "VIDEO" && <Video className="w-5 h-5 text-[#D96B43]" />}
                      {lesson.type === "DOCUMENT" && <FileText className="w-5 h-5 text-blue-400" />}
                      {lesson.type === "QUIZ" && <HelpCircle className="w-5 h-5 text-purple-400" />}
                      <span className="text-sm font-medium text-slate-200">{lesson.title}</span>
                    </div>

                    <div className="flex items-center space-x-4 text-xs">
                      {lesson.isFreePreview && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center">
                          <Eye className="w-3.5 h-3.5 mr-1" /> Free Preview
                        </span>
                      )}
                      {lesson.durationSeconds > 0 && (
                        <span className="text-slate-400">{Math.round(lesson.durationSeconds / 60)} mins</span>
                      )}
                      <button 
                        onClick={() => {
                          setSections(sections.map(s => s.id === section.id ? {
                            ...s,
                            lessons: s.lessons.filter(l => l.id !== lesson.id)
                          } : s))
                        }}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Lesson Button */}
              <div className="pt-2 pl-2 sm:pl-6">
                <button
                  onClick={() => setActiveUploadModal({ sectionId: section.id })}
                  className="inline-flex items-center space-x-2 text-sm font-semibold text-[#D96B43] hover:text-[#F2994A] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Lesson / Media Asset</span>
                </button>
              </div>
            </div>
          ))}

          {/* Add New Section Bar */}
          <div className="flex gap-4">
            <input
              type="text"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="Enter new module title (e.g. Module 3: Microservices Communication)..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D96B43]"
            />
            <button
              onClick={handleAddSection}
              className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm flex items-center space-x-2 border border-slate-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Module</span>
            </button>
          </div>
        </div>
      </main>

      {/* Media Upload Modal */}
      {activeUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center">
                <UploadCloud className="w-6 h-6 mr-2 text-[#D96B43]" /> Add Lesson & Direct Media Upload
              </h3>
              <button onClick={() => setActiveUploadModal(null)} className="text-slate-500 hover:text-white">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Lesson Title</label>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="e.g. 2.3 Configuring JwtAuthenticationFilter"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-[#D96B43] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Content Type</label>
                <select
                  value={lessonType}
                  onChange={(e) => setLessonType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-[#D96B43] outline-none"
                >
                  <option value="VIDEO">Video Asset (.mp4, .mkv)</option>
                  <option value="DOCUMENT">Document PDF / Slides (.pdf)</option>
                  <option value="QUIZ">Interactive Quiz Assessment</option>
                </select>
              </div>

              {lessonType !== "QUIZ" && (
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Upload File (S3 Direct Pre-signed)</label>
                  <input
                    type="file"
                    onChange={(e) => setUploadFileName(e.target.files?.[0]?.name || "")}
                    className="w-full text-slate-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#D96B43]/10 file:text-[#D96B43] hover:file:bg-[#D96B43]/20 cursor-pointer"
                  />
                </div>
              )}

              {isUploading && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Direct S3 Presigned Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#D96B43] to-[#F2994A] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setActiveUploadModal(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateUpload}
                disabled={isUploading}
                className="px-6 py-2.5 rounded-xl bg-[#D96B43] hover:bg-[#c45b35] text-white text-sm font-bold shadow-lg shadow-[#D96B43]/25"
              >
                {isUploading ? "Uploading..." : "Save Lesson"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
