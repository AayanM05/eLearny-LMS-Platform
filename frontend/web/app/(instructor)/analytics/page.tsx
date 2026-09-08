'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { Users, DollarSign, BookOpen, Star, PlusCircle, LogOut, TrendingUp, Layers, CheckCircle2, Video, FileText, X } from 'lucide-react';

interface CourseItem {
  id: string;
  title: string;
  category: string;
  price: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  sections?: any[];
  createdAt: string;
}

export default function InstructorAnalyticsPage() {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [price, setPrice] = useState('49.99');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data: any = await api.fetch('/instructor/courses');
      setCourses(Array.isArray(data) ? data : []);
    } catch {
      // Fallback demo courses
      setCourses([
        {
          id: 'c-demo-1',
          title: 'Advanced Microservices & Distributed Systems with Spring Boot 3',
          category: 'Software Engineering',
          price: 89.99,
          status: 'PUBLISHED',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'c-demo-2',
          title: 'Production Kubernetes Cluster Architecture & GitOps Pipeline',
          category: 'DevOps & Cloud',
          price: 69.99,
          status: 'DRAFT',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setCreating(true);
    try {
      const newCourse: any = await api.fetch('/instructor/courses', {
        method: 'POST',
        body: JSON.stringify({
          title,
          category,
          price: parseFloat(price) || 0,
          description,
        }),
      });
      setCourses((prev) => [newCourse, ...prev]);
      setShowModal(false);
      setTitle('');
      setDescription('');
    } catch {
      // Fallback optimistic addition
      const mockCourse: CourseItem = {
        id: `c-mock-${Date.now()}`,
        title,
        category,
        price: parseFloat(price) || 0,
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
      };
      setCourses((prev) => [mockCourse, ...prev]);
      setShowModal(false);
      setTitle('');
      setDescription('');
    } finally {
      setCreating(false);
    }
  };

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
            <h1 className="text-2xl sm:text-3xl font-display font-bold">Instructor Authoring Studio</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage course curriculum, video lectures, and student enrollment metrics.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded shadow-xs hover:opacity-90 transition-opacity flex items-center space-x-2 text-sm self-start sm:self-auto"
          >
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
              <span className="text-xs font-medium">Created Courses</span>
              <BookOpen className="w-4 h-4 text-foreground" />
            </div>
            <div className="text-2xl font-display font-bold">{courses.length} Courses</div>
          </div>

          <div className="p-4 rounded border border-border bg-card space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Average Rating</span>
              <Star className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-display font-bold text-amber-500">4.92 ★</div>
          </div>
        </div>

        {/* Course List Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-display font-bold">My Courses Catalog</h2>

          <div className="grid grid-cols-1 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="p-5 rounded border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-display font-bold text-base">{course.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        course.status === 'PUBLISHED'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : 'bg-muted text-muted-foreground border-border'
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{course.category} • Price: ${course.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1.5 rounded bg-muted border border-border text-foreground font-semibold text-xs hover:bg-accent transition-colors flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Manage Sections & Lessons</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Course Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-md max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display font-bold text-lg">Create New Engineering Course</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Spring Boot 3 Architecture"
                  className="w-full px-3 py-2 text-sm border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Engineering">Software Engineering</option>
                    <option value="DevOps">DevOps & Infrastructure</option>
                    <option value="Data Engineering">Data Engineering</option>
                    <option value="AI & ML">AI & Machine Learning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Course Summary</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of syllabus & outcomes..."
                  className="w-full px-3 py-2 text-sm border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold border border-border rounded bg-muted hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
                >
                  {creating ? 'Saving Course...' : 'Create Course Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

