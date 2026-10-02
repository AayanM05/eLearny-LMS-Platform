import { useEffect, useState } from "react";
import { UploadCloud, Clock } from "lucide-react";
import { assignmentApi } from "../../api/quizzes";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import { TextInput } from "../../components/FormField";
import Spinner from "../../components/Spinner";
import { getErrorMessage } from "../../utils/errorMessage";

export default function AssignmentPanel({ subsectionId }) {
  const { push } = useToast();
  const [assignment, setAssignment] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAssignment(null);
    setSubmitted(false);
    setFileUrl("");
    setError("");
    assignmentApi
      .getBySubsection(subsectionId)
      .then((res) => setAssignment(res.data))
      .catch((err) => setError(getErrorMessage(err, "This assignment isn't available yet.")));
  }, [subsectionId]);

  if (error) {
    return <p className="text-sm text-[var(--color-ink-soft)]">{error}</p>;
  }
  if (!assignment) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size={24} />
      </div>
    );
  }

  const submit = async () => {
    if (!fileUrl.trim()) return push("Add a link to your submission file.", "error");
    setSubmitting(true);
    try {
      await assignmentApi.submit(assignment.id, fileUrl.trim());
      setSubmitted(true);
      push("Assignment submitted for grading.", "success");
    } catch (err) {
      push(getErrorMessage(err, "Could not submit assignment."), "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-[var(--color-line)] bg-white p-6">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{assignment.instructions}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[var(--color-ink-soft)]">
          {assignment.allowedFileTypes && <span>Accepted file types: {assignment.allowedFileTypes}</span>}
          {assignment.dueDate && (
            <span className="flex items-center gap-1">
              <Clock size={13} /> Due {new Date(assignment.dueDate).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[var(--color-line)] bg-white p-6">
        <p className="mb-2 text-sm font-semibold">Submit your work</p>
        <p className="mb-3 text-xs text-[var(--color-ink-soft)]">
          Paste a link to your uploaded file (Drive, Dropbox, GitHub, etc.). Resubmitting replaces your previous attempt.
        </p>
        <div className="flex gap-2">
          <TextInput
            placeholder="https://..."
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
          />
          <Button onClick={submit} loading={submitting}>
            <UploadCloud size={15} /> Submit
          </Button>
        </div>
        {submitted && <p className="mt-3 text-sm text-[var(--color-success)]">Submitted — your instructor will grade this soon.</p>}
      </div>
    </div>
  );
}
