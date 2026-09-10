'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { BookOpen, ArrowRight, ArrowLeft, Image as ImageIcon, DollarSign, Layers, AlertCircle, Loader2 } from 'lucide-react';

const createCourseSchema = z.object({
  title: z.string().min(5, 'Course title must be at least 5 characters'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS']),
  language: z.string().default('English'),
  price: z.number().min(0, 'Price cannot be negative'),
  thumbnailUrl: z.string().optional(),
});

type CreateCourseForm = z.infer<typeof createCourseSchema>;

export default function CreateCoursePage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseForm>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      category: 'Software Engineering',
      level: 'BEGINNER',
      language: 'English',
      price: 0,
    },
  });

  const onSubmit = async (data: CreateCourseForm) => {
    setErrorMessage(null);
    try {
      const response: any = await api.fetch('/instructor/courses', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      router.push(`/courses/${response.id}/builder`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create course draft');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-display font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">Create New Course</h1>
              <p className="text-xs text-muted-foreground">Set up basic details before building your curriculum</p>
            </div>
          </div>
          <Link href="/analytics" className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center space-x-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </Link>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-destructive/10 border border-destructive/30 text-destructive text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-8 bg-card border border-border rounded-2xl shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">Course Title</label>
              <input
                {...register('title')}
                type="text"
                placeholder="e.g. Master Full-Stack Web Development with Spring Boot & Next.js"
                className="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">Subtitle / Summary</label>
              <input
                {...register('subtitle')}
                type="text"
                placeholder="A comprehensive hands-on guide from scratch to production deployment"
                className="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Category & Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">Category</label>
                <select
                  {...register('category')}
                  className="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">Target Level</label>
                <select
                  {...register('level')}
                  className="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="ALL_LEVELS">All Levels</option>
                </select>
              </div>
            </div>

            {/* Price & Thumbnail */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">Price (USD $)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                  <input
                    {...register('price', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="49.99"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">Thumbnail Image URL</label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                  <input
                    {...register('thumbnailUrl')}
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-foreground">Full Description</label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Detail what students will learn, prerequisites, and target audience..."
                className="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 text-sm flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Creating Course Draft...' : 'Continue to Curriculum Builder'}</span>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
