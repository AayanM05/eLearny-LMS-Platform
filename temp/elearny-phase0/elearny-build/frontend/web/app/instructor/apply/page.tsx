"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ApiRequestError, applyToBeInstructor } from "@/lib/api";

export default function InstructorApplyPage() {
  const authChecked = useRequireAuth();
  const router = useRouter();

  const [bio, setBio] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [expertiseTags, setExpertiseTags] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!authChecked) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await applyToBeInstructor({
        bio,
        yearsExperience: Number(yearsExperience),
        expertiseTags,
        portfolioUrl: portfolioUrl || undefined,
        resumeUrl: resumeUrl || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.apiError?.message ?? "Something went wrong.");
      } else {
        setError("Couldn't reach the server.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div>
          <h1 className="text-2xl font-heading text-foreground">Application submitted</h1>
          <p className="mt-2 text-muted-foreground">
            An admin will review it. You&apos;ll get an email if you&apos;re approved.
          </p>
          <button onClick={() => router.push("/")} className="mt-4 cursor-pointer text-primary underline">
            Back home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-5 rounded border border-border bg-background p-8">
        <div className="text-center">
          <h1 className="text-2xl font-heading text-foreground">Apply to become an instructor</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            No separate instructor registration — every instructor account starts here.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Bio *</label>
          <textarea
            required
            rows={4}
            className="w-full rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Years of teaching/industry experience *</label>
          <input
            required
            type="number"
            min={0}
            className="w-full rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
            value={yearsExperience}
            onChange={(e) => setYearsExperience(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Areas of expertise *</label>
          <input
            required
            placeholder="e.g. JavaScript, React, Node.js"
            className="w-full rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
            value={expertiseTags}
            onChange={(e) => setExpertiseTags(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Portfolio URL</label>
          <input
            type="url"
            className="w-full rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Resume URL</label>
          <input
            type="url"
            className="w-full rounded border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
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
          {submitting ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </main>
  );
}
