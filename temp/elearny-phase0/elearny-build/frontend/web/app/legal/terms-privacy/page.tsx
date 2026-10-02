// Placeholder only — pages.md §1.8 specs a full Terms & Privacy Viewer page
// with versioned document text, not built yet. This just keeps the Register
// page's link from 404ing while that real page waits its turn.
export default function TermsPrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-foreground">
      <h1 className="text-2xl font-heading">Terms of Service &amp; Privacy Policy</h1>
      <p className="mt-4 text-muted-foreground">
        Placeholder page — the real versioned Terms/Privacy viewer (pages.md
        §1.8) hasn&apos;t been built yet.
      </p>
    </main>
  );
}
