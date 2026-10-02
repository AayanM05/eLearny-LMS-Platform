"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ApiRequestError, createCourse } from "@/lib/api";

const DIFFICULTY_OPTIONS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export default function CreateCoursePage() {
  const authChecked = useRequireAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [priceDollars, setPriceDollars] = useState("0");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [promoVideoUrl, setPromoVideoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authChecked) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const course = await createCourse({
        title,
        tagline: tagline || undefined,
        category: category || undefined,
        difficultyLevel: difficultyLevel || undefined,
        priceCents: Math.round(Number(priceDollars) * 100),
        thumbnailUrl: thumbnailUrl || undefined,
        promoVideoUrl: promoVideoUrl || undefined,
      });
      router.push(`/instructor/courses/${course.id}/builder`);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.status === 403 ? "Only instructors can create courses." : err.apiError?.message ?? "Failed to create course.");
      } else {
        setError("Couldn't reach the server.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-5 rounded border border-border bg-background p-8">
        <h1 className="text-2xl font-heading text-foreground">Create a new course</h1>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Title *</label>
          <input
            required
            className="w-full rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Tagline</label>
          <input
            className="w-full rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Category</label>
            <input
              className="w-full rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Difficulty</label>
            <select
              className="w-full rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
            >
              <option value="">Select…</option>
              {DIFFICULTY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0) + opt.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Price (USD)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            className="w-full rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
            value={priceDollars}
            onChange={(e) => setPriceDollars(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Thumbnail URL</label>
          <input
            className="w-full rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Direct media uploads (drag &amp; drop) come in a later pass — paste a URL for now.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Promo video URL</label>
          <input
            className="w-full rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
            value={promoVideoUrl}
            onChange={(e) => setPromoVideoUrl(e.target.value)}
          />
        </div>

        {error && (
          <p className="rounded border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full cursor-pointer rounded bg-primary px-4 py-2 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Creating…" : "Create course & continue"}
        </button>
      </form>
    </main>
  );
}
