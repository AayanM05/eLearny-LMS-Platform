import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import ProgressRing from "./ProgressRing";

/**
 * Accepts two different shapes on purpose: the flat CourseResponse DTO (from /courses, /search)
 * which has instructorName/categoryName/averageRating already computed, AND the raw JPA Course
 * entity that comes back nested inside Enrollment/Wishlist (from /enrollments/me, /wishlist) —
 * which instead has nested instructor.name/category.name objects and an averageRating field that
 * defaults to 0.0 rather than reflecting the real rating (it's @Transient, only populated by
 * CourseService's withRatings() step, which those endpoints don't go through).
 * Normalizing here means every caller — Browse, Home, Dashboard, Wishlist — can just pass
 * whatever their endpoint actually returns instead of each needing its own adapter.
 */
export default function CourseCard({ course, progress, to }) {
  const isFree = !course.price || Number(course.price) === 0;

  // Presence of a flat `instructorName` string is what distinguishes a CourseResponse DTO from
  // a raw entity — only the DTO has it. Raw entities carry the same info nested one level deeper.
  const isDto = typeof course.instructorName === "string";
  const instructorName = isDto ? course.instructorName : course.instructor?.name;
  const categoryName = isDto ? course.categoryName : course.category?.name;
  // Rating is only trustworthy when it came from the DTO's computed withRatings() step — showing
  // a raw entity's default 0.0 as a real rating would be actively misleading, so hide it instead.
  const hasReliableRating = isDto;

  return (
    <Link
      to={to ?? `/courses/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-[var(--color-violet-pale)]">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-3xl font-bold text-[var(--color-violet)]">
            {course.title?.[0]?.toUpperCase()}
          </div>
        )}
        {progress != null && (
          <div className="absolute right-2 top-2 rounded-full bg-white/90 p-0.5 shadow">
            <ProgressRing percent={progress} size={40} stroke={4} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {categoryName && (
          <span className="w-fit rounded-full bg-[var(--color-violet-pale)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-violet-deep)]">
            {categoryName}
          </span>
        )}
        <h3 className="font-display text-base font-semibold leading-snug line-clamp-2">{course.title}</h3>
        {instructorName && <p className="text-sm text-[var(--color-ink-soft)]">{instructorName}</p>}
        <div className="mt-auto flex items-center justify-between pt-2">
          {hasReliableRating ? (
            <div className="flex items-center gap-1 text-sm">
              <Star size={14} className="fill-[var(--color-warn)] text-[var(--color-warn)]" />
              <span className="font-mono-stat font-semibold">{course.averageRating?.toFixed(1) ?? "New"}</span>
              {course.reviewCount > 0 && <span className="text-[var(--color-ink-soft)]">({course.reviewCount})</span>}
            </div>
          ) : <span />}
          <span className="font-mono-stat text-base font-bold text-[var(--color-ink)]">
            {isFree ? "Free" : `₹${course.price}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
