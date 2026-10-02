import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <h1 className="text-3xl font-heading text-foreground">eLearny</h1>
      <p className="max-w-md text-muted-foreground">
        Phase 0 scaffold. Backend health check, design tokens, and the
        monorepo structure are wired up — feature screens start in Phase 2
        onward, per <code className="rounded bg-muted px-1 py-0.5">docs/phases.md</code>.
      </p>
      <span className="rounded border border-border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
        Terracotta Orange token check
      </span>
      <Link href="/register" className="text-sm text-primary underline">
        Go to Register page →
      </Link>
    </main>
  );
}
