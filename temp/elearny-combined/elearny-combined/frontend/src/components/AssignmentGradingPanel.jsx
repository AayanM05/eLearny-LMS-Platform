import { useEffect, useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { assignmentApi } from "../api/quizzes";
import { useToast } from "./Toast";
import Button from "./Button";
import { TextInput, TextArea } from "./FormField";
import Spinner from "./Spinner";
import { getErrorMessage } from "../utils/errorMessage";

/** FR17: grading queue for one assignment — reused by both the instructor course builder and the
 *  TA grading view, since the underlying permission check (owning instructor OR scoped active TA)
 *  is already enforced server-side in AssignmentService.assertInstructorOrScopedTa. */
export default function AssignmentGradingPanel({ assignmentId }) {
  const { push } = useToast();
  const [submissions, setSubmissions] = useState(null);
  const [drafts, setDrafts] = useState({});

  const load = () => assignmentApi.submissions(assignmentId).then((res) => setSubmissions(res.data)).catch(() => setSubmissions([]));
  useEffect(load, [assignmentId]);

  const updateDraft = (id, patch) => setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  const submitGrade = async (submission) => {
    const draft = drafts[submission.id] || {};
    const grade = draft.grade ?? submission.grade;
    if (grade === undefined || grade === null || grade === "") {
      return push("Enter a grade (0-100) first.", "error");
    }
    try {
      await assignmentApi.grade(submission.id, { grade: Number(grade), feedback: draft.feedback ?? submission.feedback ?? "" });
      push("Grade saved.", "success");
      load();
    } catch (err) {
      push(getErrorMessage(err, "Could not save grade."), "error");
    }
  };

  if (submissions === null) {
    return <div className="flex justify-center py-8"><Spinner size={20} /></div>;
  }
  if (submissions.length === 0) {
    return <p className="text-sm text-[var(--color-ink-soft)]">No submissions yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {submissions.map((s) => (
        <div key={s.id} className="rounded-lg border border-[var(--color-line)] p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{s.studentName}</p>
            {s.grade != null ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-[var(--color-success)]">
                <CheckCircle2 size={13} /> Graded: {s.grade}/100
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                <Clock size={13} /> Ungraded
              </span>
            )}
          </div>
          <a href={s.fileUrl} target="_blank" rel="noreferrer" className="mt-1 block text-xs text-[var(--color-violet)] underline">
            View submission
          </a>
          <div className="mt-2 flex items-center gap-2">
            <TextInput
              type="number" min="0" max="100" placeholder="Grade"
              defaultValue={s.grade ?? ""}
              onChange={(e) => updateDraft(s.id, { grade: e.target.value })}
              className="w-24"
            />
            <TextArea
              rows={1} placeholder="Feedback (optional)"
              defaultValue={s.feedback ?? ""}
              onChange={(e) => updateDraft(s.id, { feedback: e.target.value })}
            />
            <Button variant="outline" onClick={() => submitGrade(s)}>Save</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
