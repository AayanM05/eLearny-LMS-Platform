"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ApiRequestError, CourseResponse, listMyCourses } from "@/lib/api";

export default function InstructorDashboardPage() {
  const authChecked = useRequireAuth();
  const [courses, setCourses] = useState<CourseResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authChecked) return;
    listMyCourses()
      .then(setCourses)
      .catch((err) => {
        if (err instanceof ApiRequestError) {
          setError(err.status === 403 ? "This dashboard is for instructors only." : "Failed to load courses.");
        }
      });
  }, [authChecked]);

  if (!authChecked) return null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading text-foreground">Your courses</h1>
        <Link href="/instructor/courses/create" className="cursor-pointer rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          + New course
        </Link>
      </div>

      {error && (
        <p className="mt-4 rounded border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {courses === null && !error && <p className="mt-6 text-muted-foreground">Loading…</p>}
      {courses?.length === 0 && (
        <p className="mt-6 text-muted-foreground">No courses yet — create your first one above.</p>
      )}

      <div className="mt-6 space-y-3">
        {courses?.map((course) => (
          <Link
            key={course.id}
            href={`/instructor/courses/${course.id}/builder`}
            className="block rounded border border-border p-4 hover:border-primary"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-foreground">{course.title}</h2>
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium ${
                  course.status === "PUBLISHED" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                }`}
              >
                {course.status}
              </span>
            </div>
            {course.tagline && <p className="mt-1 text-sm text-muted-foreground">{course.tagline}</p>}
          </Link>
        ))}
      </div>
    </main>
  );
}
