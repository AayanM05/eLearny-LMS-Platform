import { useEffect, useState } from "react";
import { assignmentApi } from "../api/quizzes";
import AssignmentGradingPanel from "./AssignmentGradingPanel";
import Spinner from "./Spinner";
import { getErrorMessage } from "../utils/errorMessage";

/** Resolves "this sub-section is an ASSIGNMENT" into the actual assignment id, then renders the
 *  grading queue. Shared by the instructor course builder and the TA course view. */
export default function AssignmentGradingBySubsection({ subsectionId }) {
  const [assignmentId, setAssignmentId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setAssignmentId(null);
    setError("");
    assignmentApi.getBySubsection(subsectionId)
      .then((res) => setAssignmentId(res.data.id))
      .catch((err) => setError(getErrorMessage(err, "No assignment configured for this lesson yet.")));
  }, [subsectionId]);

  if (error) return <p className="text-sm text-[var(--color-ink-soft)]">{error}</p>;
  if (!assignmentId) return <div className="flex justify-center py-6"><Spinner size={18} /></div>;
  return <AssignmentGradingPanel assignmentId={assignmentId} />;
}
