export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground p-8 flex flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-display font-bold tracking-tight text-primary">
        eLearny LMS Platform
      </h1>
      <p className="text-muted-foreground text-lg max-w-md text-center">
        Full-scale Learning Management System built with Next.js & Spring Boot.
      </p>
      <div className="flex gap-4">
        <button className="bg-primary text-primary-foreground font-medium px-4 py-2 rounded-lg shadow-sm hover:opacity-90 transition-opacity">
          Get Started
        </button>
        <button className="border border-border bg-muted text-foreground font-medium px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors">
          Browse Catalog
        </button>
      </div>
    </main>
  );
}
