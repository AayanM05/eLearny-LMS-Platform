import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, BookOpen, Users, CalendarOff } from "lucide-react";
import { courseApi } from "../../api/courses";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    courseApi.mine().then((res) => setCourses(res.data)).catch(() => setCourses([]));
  }, [user]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Instructor dashboard</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            {user?.approved ? "Manage your courses and content." : "Your instructor account is pending Admin approval."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/instructor/availability">
            <Button variant="outline">
              <CalendarOff size={15} /> Mark unavailable
            </Button>
          </Link>
          <Link to="/instructor/courses/new">
            <Button disabled={!user?.approved}>
              <Plus size={15} /> New course
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        {courses === null ? (
          <div className="flex justify-center py-16">
            <Spinner size={28} />
          </div>
        ) : courses.length === 0 ? (
          <EmptyState icon={BookOpen} title="No courses yet" description="Create your first course to get started." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <Link
                key={c.id}
                to={`/instructor/courses/${c.id}`}
                className="rounded-2xl border border-[var(--color-line)] bg-white p-5 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-semibold">{c.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${c.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {c.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-2 flex items-center gap-1 text-sm text-[var(--color-ink-soft)]">
                  <Users size={13} /> {c.reviewCount ?? 0} reviews · {c.averageRating?.toFixed(1) ?? "—"} rating
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
