'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { 
  Plus, Trash2, Edit3, Video, FileText, Clock, Eye, Send, 
  CheckCircle2, ArrowLeft, Loader2, Layers, AlertCircle, ChevronDown, ChevronUp, Upload 
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  lessonType: 'VIDEO' | 'ARTICLE' | 'RESOURCE';
  contentUrl?: string;
  articleContent?: string;
  durationSeconds: number;
  orderIndex: number;
  preview: boolean;
  dripDelayDays: number;
}

interface Section {
  id: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  subtitle?: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'REJECTED';
  sections: Section[];
}

export default function CourseBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Add Section State
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');

  // Add Lesson State
  const [addingLessonSectionId, setAddingLessonSectionId] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonType, setNewLessonType] = useState<'VIDEO' | 'ARTICLE' | 'RESOURCE'>('VIDEO');
  const [newLessonUrl, setNewLessonUrl] = useState('');
  const [newLessonDrip, setNewLessonDrip] = useState(0);
  const [newLessonPreview, setNewLessonPreview] = useState(false);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const data: any = await api.fetch(`/instructor/courses/${courseId}`);
      setCourse(data);
    } catch {
      // Fallback demo data
      setCourse({
        id: courseId,
        title: 'Master Full-Stack Web Development',
        subtitle: 'From Spring Boot 3 to Next.js 14 and React Native',
        status: 'DRAFT',
        sections: [
          {
            id: 'sec-1',
            title: 'Section 1: Architecture & Project Scaffold',
            orderIndex: 0,
            lessons: [
              {
                id: 'les-1',
                title: 'Lesson 1: Monorepo Architecture Overview',
                lessonType: 'VIDEO',
                contentUrl: 'https://cdn.elearny.com/videos/demo.mp4',
                durationSeconds: 600,
                orderIndex: 0,
                preview: true,
                dripDelayDays: 0,
              },
            ],
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return;
    try {
      await api.fetch(`/instructor/courses/${courseId}/sections`, {
        method: 'POST',
        body: JSON.stringify({
          title: newSectionTitle.trim(),
          orderIndex: course?.sections.length || 0,
        }),
      });
      setNewSectionTitle('');
      setShowAddSection(false);
      fetchCourse();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add section');
    }
  };

  const handleAddLesson = async (sectionId: string) => {
    if (!newLessonTitle.trim()) return;
    try {
      await api.fetch(`/instructor/courses/sections/${sectionId}/lessons`, {
        method: 'POST',
        body: JSON.stringify({
          title: newLessonTitle.trim(),
          lessonType: newLessonType,
          contentUrl: newLessonUrl.trim(),
          durationSeconds: 300,
          dripDelayDays: newLessonDrip,
          preview: newLessonPreview,
          orderIndex: 0,
        }),
      });
      setNewLessonTitle('');
      setNewLessonUrl('');
      setAddingLessonSectionId(null);
      fetchCourse();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add lesson');
    }
  };

  const handlePublishToggle = async () => {
    const newStatus = course?.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await api.fetch(`/instructor/courses/${courseId}/status?status=${newStatus}`, {
        method: 'PATCH',
      });
      setCourse(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update course status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center space-x-3">
            <Link href="/analytics" className="p-2 border border-border rounded-lg bg-card hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-display font-bold">{course?.title}</h1>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${
                  course?.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                }`}>
                  {course?.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{course?.subtitle || 'Curriculum Builder'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePublishToggle}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                course?.status === 'PUBLISHED'
                  ? 'bg-amber-500/10 text-amber-600 border border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{course?.status === 'PUBLISHED' ? 'Unpublish to Draft' : 'Publish Course'}</span>
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-destructive/10 border border-destructive/30 text-destructive text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Section List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-bold flex items-center space-x-2">
              <Layers className="w-5 h-5 text-primary" />
              <span>Course Curriculum</span>
            </h2>
            <button
              onClick={() => setShowAddSection(true)}
              className="px-3.5 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg flex items-center space-x-1 hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              <span>Add Section</span>
            </button>
          </div>

          {/* Add Section Input Form */}
          {showAddSection && (
            <div className="p-4 bg-card border border-primary/40 rounded-xl space-y-3 shadow-md">
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">New Section Title</label>
              <input
                type="text"
                placeholder="e.g. Section 2: Advanced REST API Development"
                value={newSectionTitle}
                onChange={e => setNewSectionTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddSection(false)}
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSection}
                  className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg"
                >
                  Save Section
                </button>
              </div>
            </div>
          )}

          {/* Sections Tree */}
          {course?.sections.map((section, idx) => (
            <div key={section.id} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    S{idx + 1}
                  </span>
                  <h3 className="font-display font-bold text-base text-foreground">{section.title}</h3>
                </div>
                <button
                  onClick={() => setAddingLessonSectionId(section.id)}
                  className="text-xs text-primary font-semibold hover:underline flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Lesson</span>
                </button>
              </div>

              {/* Lesson Items */}
              <div className="space-y-2 pl-2">
                {section.lessons.map((lesson) => (
                  <div key={lesson.id} className="p-3 bg-muted/40 border border-border/80 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {lesson.lessonType === 'VIDEO' ? <Video className="w-4 h-4 text-primary" /> : <FileText className="w-4 h-4 text-emerald-500" />}
                      <div>
                        <p className="text-xs font-semibold text-foreground">{lesson.title}</p>
                        <div className="flex items-center space-x-3 text-[11px] text-muted-foreground mt-0.5">
                          <span>{lesson.lessonType}</span>
                          {lesson.preview && <span className="text-emerald-600 font-medium">Free Preview</span>}
                          {lesson.dripDelayDays > 0 && <span className="text-amber-600 font-medium">Drips Day {lesson.dripDelayDays}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Lesson Form inside Section */}
                {addingLessonSectionId === section.id && (
                  <div className="p-4 bg-background border border-primary/30 rounded-lg space-y-3 mt-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">New Lesson Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Lesson 2: Spring Security JWT Authentication"
                      value={newLessonTitle}
                      onChange={e => setNewLessonTitle(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-border rounded bg-card focus:outline-none focus:ring-1 focus:ring-primary"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-muted-foreground mb-1">Type</label>
                        <select
                          value={newLessonType}
                          onChange={(e: any) => setNewLessonType(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-border rounded bg-card"
                        >
                          <option value="VIDEO">Video</option>
                          <option value="ARTICLE">Article</option>
                          <option value="RESOURCE">Resource</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-muted-foreground mb-1">Drip Delay (Days)</label>
                        <input
                          type="number"
                          min="0"
                          value={newLessonDrip}
                          onChange={e => setNewLessonDrip(parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-xs border border-border rounded bg-card"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-muted-foreground mb-1">Content URL / Video Link</label>
                      <input
                        type="url"
                        placeholder="https://cdn.elearny.com/video.mp4"
                        value={newLessonUrl}
                        onChange={e => setNewLessonUrl(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-border rounded bg-card"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newLessonPreview}
                          onChange={e => setNewLessonPreview(e.target.checked)}
                          className="rounded border-border text-primary"
                        />
                        <span className="text-xs text-muted-foreground">Allow Free Preview</span>
                      </label>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setAddingLessonSectionId(null)}
                          className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAddLesson(section.id)}
                          className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded"
                        >
                          Save Lesson
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
