import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { courseApi } from "../api/courses";
import { useAuth } from "../context/AuthContext";
import CourseCard from "../components/CourseCard";
import Spinner from "../components/Spinner";

export default function HomePage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    courseApi
      .browse({ page: 0, size: 8 })
      .then((res) => setCourses(res.data.content ?? []))
      .catch(() => setCourses([]));
  }, []);

  return (
    <div>
      {/* Hero: the thesis of eLearny — a learning path you actually finish, proven with a certificate.
          Adjusted for logged-in visitors so a returning Student isn't pitched "become an instructor"
          or shown a generic marketing CTA instead of getting back to what they're actually doing. */}
      <section className="relative overflow-hidden border-b border-[var(--color-line)] bg-gradient-to-b from-[var(--color-violet-pale)] to-[var(--color-canvas)]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--color-violet-deep)] shadow-sm">
              <Sparkles size={13} /> Courses, live sessions, and certificates in one place
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              {user ? (
                <>Welcome back, <span className="text-[var(--color-violet)]">{user.name?.split(" ")[0]}</span>.</>
              ) : (
                <>Learn a skill.<br />Finish the <span className="text-[var(--color-violet)]">whole thing</span>.</>
              )}
            </h1>
            <p className="mt-5 max-w-md text-[var(--color-ink-soft)]">
              eLearny tracks every video, quiz, and assignment against real progress — so
              "enrolled" turns into "completed," and completed turns into a certificate you can verify.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={ctaFor(user)}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-violet)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--color-violet-deep)]"
              >
                {ctaLabelFor(user)} <ArrowRight size={16} />
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-white px-6 py-3 text-sm font-semibold hover:border-[var(--color-violet)]"
                >
                  Become an instructor
                </Link>
              )}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <HeroProgressCard />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Fresh on eLearny</h2>
            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Newly published, ready to start today.</p>
          </div>
          <Link to="/browse" className="text-sm font-semibold text-[var(--color-violet)] hover:underline">
            View all →
          </Link>
        </div>

        {courses === null ? (
          <div className="flex justify-center py-16">
            <Spinner size={28} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/** The signature progress-ring motif, staged in the hero as a live example of what the product does. */
function ctaFor(user) {
  if (!user) return "/browse";
  if (user.role === "ADMIN") return "/admin";
  if (user.role === "INSTRUCTOR") return "/instructor";
  if (user.role === "TEACHING_ASSISTANT") return "/ta";
  return "/dashboard";
}

function ctaLabelFor(user) {
  if (!user) return "Browse courses";
  if (user.role === "STUDENT") return "Go to My Learning";
  return "Go to your dashboard";
}

function HeroProgressCard() {
  return (
    <div className="rounded-3xl border border-[var(--color-line)] bg-white p-6 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16">
          <svg viewBox="0 0 64 64" className="-rotate-90">
            <circle cx="32" cy="32" r="27" fill="none" stroke="var(--color-line)" strokeWidth="6" />
            <circle
              cx="32" cy="32" r="27" fill="none" stroke="var(--color-violet)" strokeWidth="6"
              strokeDasharray="169.6" strokeDashoffset="34" strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono-stat text-sm font-bold">80%</span>
        </div>
        <div>
          <p className="font-display text-sm font-semibold">React for Backend Developers</p>
          <p className="text-xs text-[var(--color-ink-soft)]">12 of 15 lessons complete</p>
        </div>
      </div>
      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[var(--color-line)]">
        <div className="h-full w-4/5 rounded-full bg-[var(--color-violet)]" />
      </div>
      <p className="mt-3 text-xs text-[var(--color-ink-soft)]">3 lessons left until your certificate.</p>
    </div>
  );
}
