import { useEffect, useState } from "react";
import { enrollmentApi } from "../../api/enrollment";
import { courseApi } from "../../api/courses";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import CourseCard from "../../components/CourseCard";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [rows, setRows] = useState(null); // [{ course, progressPercent }]

  useEffect(() => {
    enrollmentApi.myEnrollments().then(async (res) => {
      const enrollments = res.data;
      // One progress lookup per enrolled course — same signature-element consistency as everywhere
      // else in the app (the progress ring), not just a bare list of titles.
      const withProgress = await Promise.all(
        enrollments.map(async (e) => {
          const progress = await courseApi.progress(e.course.id).then((r) => r.data).catch(() => null);
          return { course: e.course, progressPercent: progress?.percent ?? 0 };
        })
      );
      setRows(withProgress);
    }).catch(() => setRows([]));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Pick up where you left off.</p>

      <div className="mt-8">
        {rows === null ? (
          <div className="flex justify-center py-16">
            <Spinner size={28} />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses yet"
            description="Browse the catalog and enroll in your first course."
            action={
              <Link to="/browse" className="rounded-full bg-[var(--color-violet)] px-5 py-2.5 text-sm font-semibold text-white">
                Browse courses
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map(({ course, progressPercent }) => (
              <CourseCard key={course.id} course={course} progress={progressPercent} to={`/learn/${course.id}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
