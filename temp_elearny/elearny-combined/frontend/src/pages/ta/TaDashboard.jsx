import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, CheckCircle2 } from "lucide-react";
import { taApi } from "../../api/admin";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import { getErrorMessage } from "../../utils/errorMessage";

/** FR39/FR40: a TA's home base — pending invitations to accept, and active courses to grade/moderate. */
export default function TaDashboard() {
  const { push } = useToast();
  const [invitations, setInvitations] = useState(null);

  const load = () => taApi.mine().then((res) => setInvitations(res.data)).catch(() => setInvitations([]));
  useEffect(load, []);

  const accept = async (id) => {
    try {
      await taApi.accept(id);
      push("Invitation accepted — you can now grade and moderate this course.", "success");
      load();
    } catch (err) {
      push(getErrorMessage(err, "Could not accept invitation."), "error");
    }
  };

  if (invitations === null) {
    return <div className="flex justify-center py-24"><Spinner size={28} /></div>;
  }

  const pending = invitations.filter((i) => i.status === "PENDING");
  const active = invitations.filter((i) => i.status === "ACTIVE");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Teaching assistant dashboard</h1>

      {pending.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">Pending invitations</h2>
          <div className="flex flex-col gap-2">
            {pending.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-xl border border-[var(--color-line)] bg-white p-4">
                <p className="text-sm font-semibold">{i.course?.title}</p>
                <Button onClick={() => accept(i.id)}>Accept invitation</Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">Your courses</h2>
        {active.length === 0 ? (
          <EmptyState icon={GraduationCap} title="No active TA assignments" description="Accept an invitation above once your instructor sends one." />
        ) : (
          <div className="flex flex-col gap-2">
            {active.map((i) => (
              <Link
                key={i.id}
                to={`/ta/courses/${i.course?.id}`}
                className="flex items-center justify-between rounded-xl border border-[var(--color-line)] bg-white p-4 hover:border-[var(--color-violet)]"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[var(--color-success)]" />
                  <p className="text-sm font-semibold">{i.course?.title}</p>
                </div>
                <span className="text-xs font-semibold text-[var(--color-violet)]">Grade &amp; moderate →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
