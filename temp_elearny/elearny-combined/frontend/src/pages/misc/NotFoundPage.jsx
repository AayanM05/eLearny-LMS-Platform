import { Link } from "react-router-dom";
import Button from "../../components/Button";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-mono-stat text-6xl font-bold text-[var(--color-violet)]">404</p>
      <h1 className="mt-3 font-display text-xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6">
        <Button variant="outline">Back home</Button>
      </Link>
    </div>
  );
}
