import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { courseApi, categoryApi } from "../../api/courses";
import CourseCard from "../../components/CourseCard";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";

export default function BrowsePage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const categoryId = params.get("categoryId") || "";

  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState(null);
  const [localQuery, setLocalQuery] = useState(q);

  // Keeps the visible search box in sync when the URL's ?q= changes from outside this page —
  // e.g. using the navbar's global search a second time while already on /browse previously left
  // the input showing the stale first query even though the results below had correctly reloaded.
  useEffect(() => {
    setLocalQuery(q);
  }, [q]);

  useEffect(() => {
    categoryApi.list().then((res) => setCategories(res.data)).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setCourses(null);
    courseApi
      .browse({ q: q || undefined, categoryId: categoryId || undefined, page: 0, size: 24 })
      .then((res) => setCourses(res.data.content ?? []))
      .catch(() => setCourses([]));
  }, [q, categoryId]);

  const submitSearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (localQuery) next.set("q", localQuery);
    else next.delete("q");
    setParams(next);
  };

  const selectCategory = (id) => {
    const next = new URLSearchParams(params);
    if (id) next.set("categoryId", id);
    else next.delete("categoryId");
    setParams(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Browse courses</h1>

      <form onSubmit={submitSearch} className="mt-6 flex max-w-lg items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-4 py-2.5">
        <SearchIcon size={16} className="text-[var(--color-ink-soft)]" />
        <input
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search by title..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        <Chip active={!categoryId} onClick={() => selectCategory("")}>All</Chip>
        {categories.map((c) => (
          <Chip key={c.id} active={String(c.id) === categoryId} onClick={() => selectCategory(c.id)}>
            {c.name}
          </Chip>
        ))}
      </div>

      <div className="mt-8">
        {courses === null ? (
          <div className="flex justify-center py-16">
            <Spinner size={28} />
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            icon={SearchIcon}
            title="No courses found"
            description="Try a different search term or clear your filters."
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
        active
          ? "border-[var(--color-violet)] bg-[var(--color-violet)] text-white"
          : "border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:border-[var(--color-violet)]"
      }`}
    >
      {children}
    </button>
  );
}
