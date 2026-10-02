import { useEffect, useState } from "react";
import { Video, Users, Clock } from "lucide-react";
import { courseApi } from "../../api/courses";
import { liveSessionApi } from "../../api/liveSessions";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import { getErrorMessage } from "../../utils/errorMessage";

/** FR58: students book live sessions if there's a free seat, or join the waitlist if full. */
export default function LiveSessionsPanel({ courseId }) {
  const { push } = useToast();
  const [slots, setSlots] = useState(null);

  const load = () => courseApi.liveSessions(courseId).then((res) => setSlots(res.data)).catch(() => setSlots([]));
  useEffect(load, [courseId]);

  const book = async (slotId) => {
    try {
      await liveSessionApi.book(slotId);
      push("Booked! See you there.", "success");
      load();
    } catch (err) {
      if (err.response?.status === 409) {
        push("That slot just filled up — join the waitlist instead.", "info");
      } else {
        push(getErrorMessage(err, "Could not book this session."), "error");
      }
      load();
    }
  };

  const joinWaitlist = async (slotId) => {
    try {
      await liveSessionApi.joinWaitlist(slotId);
      push("You're on the waitlist — we'll notify you if a seat opens up.", "success");
    } catch (err) {
      push(getErrorMessage(err, "Could not join waitlist."), "error");
    }
  };

  if (slots === null) {
    return <div className="flex justify-center py-16"><Spinner size={24} /></div>;
  }
  if (slots.length === 0) {
    return <EmptyState icon={Video} title="No live sessions scheduled" description="Check back later for upcoming sessions." />;
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3">
      {slots.map((s) => {
        const full = s.bookedCount >= s.capacity;
        return (
          <div key={s.id} className="flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-white p-5">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                <Clock size={14} className="text-[var(--color-violet)]" /> {new Date(s.startTime).toLocaleString()}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-ink-soft)]">
                <Users size={12} /> {s.bookedCount}/{s.capacity} booked
              </p>
            </div>
            {full ? (
              <Button variant="outline" onClick={() => joinWaitlist(s.id)}>Join waitlist</Button>
            ) : (
              <Button onClick={() => book(s.id)}>Book seat</Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
