import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { courseApi } from "../../api/courses";
import AssignmentGradingBySubsection from "../../components/AssignmentGradingBySubsection";
import ForumPanel from "../course/ForumPanel";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import { ClipboardList } from "lucide-react";

/** FR39/FR40: a scoped TA's grading + moderation surface for one course — the assignment and
 *  forum permission checks are enforced server-side, so this view only needs to expose them. */
export default function TaCourseGradingPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [activeSubId, setActiveSubId] = useState(null);

  useEffect(() => {
    courseApi.get(courseId).then((res) => setCourse(res.data));
  }, [courseId]);

  if (!course) return <div className="flex justify-center py-24"><Spinner size={28} /></div>;

  const assignmentSubsections = course.sections?.flatMap((s) => s.subsections ?? []).filter((s) => s.contentType === "ASSIGNMENT") ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">{course.title}</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Grade assignments and moderate discussion for this course.</p>

      <h2 className="mt-8 font-display text-lg font-semibold">Assignments</h2>
      {assignmentSubsections.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No assignments in this course" />
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {assignmentSubsections.map((sub) => (
            <div key={sub.id} className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
              <p className="mb-3 text-sm font-semibold">{sub.title}</p>
              <AssignmentGradingBySubsection subsectionId={sub.id} />
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-10 font-display text-lg font-semibold">Discussion</h2>
      <p className="mt-1 mb-4 text-sm text-[var(--color-ink-soft)]">Pick a lesson to view and reply to student questions.</p>
      <select
        className="w-full max-w-sm rounded-xl border border-[var(--color-line)] bg-white px-3.5 py-2.5 text-sm"
        onChange={(e) => setActiveSubId(Number(e.target.value))}
        defaultValue=""
      >
        <option value="" disabled>Select a lesson</option>
        {course.sections?.flatMap((s) => s.subsections ?? []).map((sub) => (
          <option key={sub.id} value={sub.id}>{sub.title}</option>
        ))}
      </select>
      {activeSubId && (
        <div className="mt-4">
          <ForumPanel subsectionId={activeSubId} />
        </div>
      )}
    </div>
  );
}
