import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { taApi } from "../../api/admin";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import { TextInput } from "../../components/FormField";
import Spinner from "../../components/Spinner";
import { getErrorMessage } from "../../utils/errorMessage";

/** FR39/FR40: instructor invites a TA (by email) into this course; the TA later accepts, and can be revoked. */
export default function TaManagementPage() {
  const { courseId } = useParams();
  const { push } = useToast();
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [assignments, setAssignments] = useState(null);

  const load = () => taApi.list(courseId).then((res) => setAssignments(res.data)).catch(() => setAssignments([]));

  useEffect(load, [courseId]);

  const invite = async (e) => {
    e.preventDefault();
    setInviting(true);
    try {
      await taApi.invite(courseId, email);
      setEmail("");
      push("Invitation sent.", "success");
      load();
    } catch (err) {
      push(getErrorMessage(err, "Could not send invitation."), "error");
    } finally {
      setInviting(false);
    }
  };

  const revoke = async (assignmentId) => {
    try {
      await taApi.revoke(assignmentId);
      push("Access revoked.", "info");
      load();
    } catch (err) {
      push(getErrorMessage(err, "Could not revoke access."), "error");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Teaching assistants</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
        Invite a user with the Teaching Assistant role to grade and moderate this course.
      </p>

      <form onSubmit={invite} className="mt-6 flex gap-2">
        <TextInput type="email" required placeholder="ta@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" loading={inviting}>
          <UserPlus size={15} /> Invite
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-2">
        {assignments === null ? (
          <div className="flex justify-center py-10"><Spinner size={24} /></div>
        ) : assignments.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-soft)]">No TAs invited yet.</p>
        ) : (
          assignments.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border border-[var(--color-line)] bg-white p-4">
              <div>
                <p className="text-sm font-semibold">{a.taUser?.name}</p>
                <p className="text-xs text-[var(--color-ink-soft)]">{a.taUser?.email} · {a.status}</p>
              </div>
              <Button variant="danger" onClick={() => revoke(a.id)}>Revoke</Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
