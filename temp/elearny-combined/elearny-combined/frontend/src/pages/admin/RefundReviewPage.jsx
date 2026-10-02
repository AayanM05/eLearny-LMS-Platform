import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, ReceiptText } from "lucide-react";
import { refundApi } from "../../api/admin";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import { TextArea } from "../../components/FormField";
import { getErrorMessage } from "../../utils/errorMessage";

/** FR33-FR35: Admin reviews refund requests raised by students against captured payments. */
export default function RefundReviewPage() {
  const { push } = useToast();
  const [requests, setRequests] = useState(null);
  const [notes, setNotes] = useState({});

  const load = () => refundApi.pending().then((res) => setRequests(res.data)).catch(() => setRequests([]));
  useEffect(load, []);

  const decide = async (id, approve) => {
    try {
      await refundApi.decide(id, { approve, adminNotes: notes[id] || "" });
      push(approve ? "Refund approved — access revoked." : "Refund rejected.", "success");
      load();
    } catch (err) {
      push(getErrorMessage(err, "Could not process this refund."), "error");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Refund requests</h1>

      <div className="mt-6 flex flex-col gap-4">
        {requests === null ? (
          <div className="flex justify-center py-16"><Spinner size={28} /></div>
        ) : requests.length === 0 ? (
          <EmptyState icon={ReceiptText} title="No pending refunds" description="All refund requests have been reviewed." />
        ) : (
          requests.map((r) => (
            <div key={r.id} className="rounded-2xl border border-[var(--color-line)] bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{r.studentName}</p>
                  <p className="text-xs text-[var(--color-ink-soft)]">{r.courseTitle} · ₹{r.amount}</p>
                </div>
              </div>
              <p className="mt-2 text-sm">{r.reason}</p>
              <TextArea
                rows={2}
                placeholder="Admin notes (optional)"
                value={notes[r.id] || ""}
                onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })}
                className="mt-3"
              />
              <div className="mt-3 flex gap-2">
                <Button variant="outline" onClick={() => decide(r.id, true)}>
                  <CheckCircle2 size={14} /> Approve
                </Button>
                <Button variant="danger" onClick={() => decide(r.id, false)}>
                  <XCircle size={14} /> Reject
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
