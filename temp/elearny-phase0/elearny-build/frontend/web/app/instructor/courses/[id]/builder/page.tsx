"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
  ApiRequestError,
  CourseDetailResponse,
  addLesson,
  addSection,
  getCourseDetail,
  publishCourse,
} from "@/lib/api";

const CONTENT_TYPES = ["VIDEO", "ARTICLE", "RESOURCE"];

export default function CourseBuilderPage() {
  const authChecked = useRequireAuth();
  const { id } = useParams<{ id: string }>();

  const [course, setCourse] = useState<CourseDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [publishMessage, setPublishMessage] = useState<string | null>(null);

  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [addingSection, setAddingSection] = useState(false);

  const [lessonFormOpenFor, setLessonFormOpenFor] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContentType, setLessonContentType] = useState("VIDEO");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonArticleContent, setLessonArticleContent] = useState("");
  const [lessonResourceUrl, setLessonResourceUrl] = useState("");
  const [lessonDripDays, setLessonDripDays] = useState("0");
  const [addingLesson, setAddingLesson] = useState(false);

  function reload() {
    getCourseDetail(id)
      .then(setCourse)
      .catch((err) => {
        if (err instanceof ApiRequestError) {
          setError(err.status === 404 ? "Course not found (or it's not yours)." : "Failed to load course.");
        }
      });
  }

  useEffect(() => {
    if (!authChecked) return;
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authChecked, id]);

  if (!authChecked) return null;

  async function handleAddSection(e: React.FormEvent) {
    e.preventDefault();
    if (!newSectionTitle.trim() || !course) return;
    setAddingSection(true);
    try {
      await addSection(id, newSectionTitle, course.sections.length);
      setNewSectionTitle("");
      reload();
    } catch (err) {
      if (err instanceof ApiRequestError) setError(err.apiError?.message ?? "Failed to add section.");
    } finally {
      setAddingSection(false);
    }
  }

  async function handleAddLesson(e: React.FormEvent, sectionId: string, position: number) {
    e.preventDefault();
    setAddingLesson(true);
    try {
      await addLesson(id, sectionId, {
        title: lessonTitle,
        contentType: lessonContentType,
        videoUrl: lessonContentType === "VIDEO" ? lessonVideoUrl || undefined : undefined,
        articleContent: lessonContentType === "ARTICLE" ? lessonArticleContent || undefined : undefined,
        resourceUrl: lessonContentType === "RESOURCE" ? lessonResourceUrl || undefined : undefined,
        position,
        dripDelayDays: Number(lessonDripDays) || 0,
      });
      setLessonFormOpenFor(null);
      setLessonTitle("");
      setLessonVideoUrl("");
      setLessonArticleContent("");
      setLessonResourceUrl("");
      setLessonDripDays("0");
      reload();
    } catch (err) {
      if (err instanceof ApiRequestError) setError(err.apiError?.message ?? "Failed to add lesson.");
    } finally {
      setAddingLesson(false);
    }
  }

  async function handlePublish() {
    setPublishMessage(null);
    setError(null);
    try {
      await publishCourse(id);
      setPublishMessage("Course published! 🎉");
      reload();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.apiError?.message ?? "Couldn't publish.");
      }
    }
  }

  if (error && !course) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <p className="text-destructive">{error}</p>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading text-foreground">{course.title}</h1>
          <span
            className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-medium ${
              course.status === "PUBLISHED" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
            }`}
          >
            {course.status} · v{course.version}
          </span>
        </div>
        {course.status === "DRAFT" && (
          <button onClick={handlePublish} className="cursor-pointer rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Publish
          </button>
        )}
      </div>

      {publishMessage && <p className="mt-4 text-sm text-success">{publishMessage}</p>}
      {error && (
        <p className="mt-4 rounded border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="mt-8 space-y-4">
        {course.sections.map((section) => (
          <div key={section.id} className="rounded border border-border p-4">
            <h2 className="font-medium text-foreground">{section.title}</h2>

            <ul className="mt-2 space-y-1">
              {section.lessons.map((lesson) => (
                <li key={lesson.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs">{lesson.contentType}</span>
                  {lesson.title}
                  {lesson.dripDelayDays > 0 && <span className="text-xs">(unlocks day {lesson.dripDelayDays})</span>}
                </li>
              ))}
              {section.lessons.length === 0 && <li className="text-sm text-muted-foreground italic">No lessons yet</li>}
            </ul>

            {lessonFormOpenFor === section.id ? (
              <form
                onSubmit={(e) => handleAddLesson(e, section.id, section.lessons.length)}
                className="mt-3 space-y-2 rounded border border-border p-3"
              >
                <input
                  required
                  placeholder="Lesson title"
                  className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                />
                <select
                  className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                  value={lessonContentType}
                  onChange={(e) => setLessonContentType(e.target.value)}
                >
                  {CONTENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {lessonContentType === "VIDEO" && (
                  <input
                    placeholder="Video URL"
                    className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                    value={lessonVideoUrl}
                    onChange={(e) => setLessonVideoUrl(e.target.value)}
                  />
                )}
                {lessonContentType === "ARTICLE" && (
                  <textarea
                    placeholder="Article content"
                    rows={3}
                    className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                    value={lessonArticleContent}
                    onChange={(e) => setLessonArticleContent(e.target.value)}
                  />
                )}
                {lessonContentType === "RESOURCE" && (
                  <input
                    placeholder="Resource URL"
                    className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                    value={lessonResourceUrl}
                    onChange={(e) => setLessonResourceUrl(e.target.value)}
                  />
                )}
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground">Drip delay (days)</label>
                  <input
                    type="number"
                    min={0}
                    className="w-20 rounded border border-border bg-background px-2 py-1 text-sm text-foreground outline-none focus:border-primary"
                    value={lessonDripDays}
                    onChange={(e) => setLessonDripDays(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={addingLesson}
                    className="cursor-pointer rounded bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
                  >
                    Add lesson
                  </button>
                  <button
                    type="button"
                    onClick={() => setLessonFormOpenFor(null)}
                    className="cursor-pointer text-sm text-muted-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setLessonFormOpenFor(section.id)}
                className="mt-3 cursor-pointer text-sm text-primary underline"
              >
                + Add lesson
              </button>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleAddSection} className="mt-6 flex gap-2">
        <input
          placeholder="New section title"
          className="flex-1 rounded border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
        />
        <button
          type="submit"
          disabled={addingSection}
          className="cursor-pointer rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
        >
          + Add section
        </button>
      </form>
    </main>
  );
}
