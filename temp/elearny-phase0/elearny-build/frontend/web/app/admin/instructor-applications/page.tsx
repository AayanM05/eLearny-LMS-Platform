"use client";

import { useEffect, useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
  ApiRequestError,
  InstructorApplicationResponse,
  approveApplication,
  listPendingApplications,
  rejectApplication,
} from "@/lib/api";

export default function AdminInstructorApplicationsPage() {
  const authChecked = useRequireAuth();
  const [applications, setApplications] = useState<InstructorApplicationResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [rejectReasonById, setRejectReasonById] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authChecked) return;
    listPendingApplications()
      .then(setApplications)
      .catch((err) => {
        if (err instanceof ApiRequestError) {
          setError(err.status === 403 ? "You don't have admin access." : err.apiError?.message ?? "Failed to load.");
        }
      });
  }, [authChecked]);

  async function handleApprove(id: string) {
    setActioningId(id);
    try {
      await approveApplication(id);
      setApplications((prev) => prev?.filter((a) => a.id !== id) ?? null);
    } catch (err) {
      if (err instanceof ApiRequestError) setError(err.apiError?.message ?? "Approve failed.");
    } finally {
      setActioningId(null);
    }
  }

  async function handleReject(id: string) {
    const reason = rejectReasonById[id]?.trim();
    if (!reason) {
      setError("A rejection reason is required.");
      return;
    }
    setActioningId(id);
    try {
      await rejectApplication(id, reason);
      setApplications((prev) => prev?.filter((a) => a.id !== id) ?? null);
    } catch (err) {
      if (err instanceof ApiRequestError) setError(err.apiError?.message ?? "Reject failed.");
    } finally {
      setActioningId(null);
    }
  }

  if (!authChecked) return null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-heading text-foreground">Instructor applications</h1>
      <p className="mt-1 text-sm text-muted-foreground">Pending review</p>

      {error && (
        <p className="mt-4 rounded border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {applications === null && <p className="mt-6 text-muted-foreground">Loading…</p>}
      {applications?.length === 0 && <p className="mt-6 text-muted-foreground">No pending applications.</p>}

      <div className="mt-6 space-y-4">
        {applications?.map((app) => (
          <div key={app.id} className="rounded border border-border p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-medium text-foreground">
                {app.applicantFirstName} {app.applicantLastName}
              </h2>
              <span className="text-sm text-muted-foreground">{app.applicantEmail}</span>
            </div>
            <p className="mt-2 text-sm text-foreground">{app.bio}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {app.yearsExperience} years · {app.expertiseTags}
            </p>
            {app.portfolioUrl && (
              <a href={app.portfolioUrl} className="mt-1 block text-sm text-primary underline" target="_blank" rel="noreferrer">
                Portfolio
              </a>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleApprove(app.id)}
                disabled={actioningId === app.id}
                className="cursor-pointer rounded bg-success px-3 py-1.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Approve
              </button>
              <input
                placeholder="Rejection reason"
                className="flex-1 rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                value={rejectReasonById[app.id] ?? ""}
                onChange={(e) => setRejectReasonById((prev) => ({ ...prev, [app.id]: e.target.value }))}
              />
              <button
                onClick={() => handleReject(app.id)}
                disabled={actioningId === app.id}
                className="cursor-pointer rounded border border-destructive px-3 py-1.5 text-sm font-medium text-destructive disabled:cursor-not-allowed disabled:opacity-40"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
