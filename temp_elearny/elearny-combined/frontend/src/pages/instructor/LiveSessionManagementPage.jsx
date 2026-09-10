import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Video, Plus, Users } from "lucide-react";
import { courseApi } from "../../api/courses";
import { liveSessionApi } from "../../api/liveSessions";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import FormField, { TextInput } from "../../components/FormField";
import Spinner from "../../components/Spinner";
import { getErrorMessage } from "../../utils/errorMessage";

/** FR12/FR57/FR58: instructor schedules live session slots for their course. */
export default function LiveSessionManagementPage() {
  const { courseId } = useParams();
  const { push } = useToast();
  const [slots, setSlots] = useState(null);
  const [form, setForm] = useState({ startTime: "", endTime: "", capacity: 20 });
  const [creating, setCreating] = useState(false);

  const load = () => courseApi.liveSessions(courseId).then((res) => setSlots(res.data)).catch(() => setSlots([]));

  useEffect(load, [courseId]);

  const create = async (e) => {
    e.preventDefault();
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      return push("End time must be after the start time.", "error");
    }
    setCreating(true);
    try {
      await liveSessionApi.create(courseId, {
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        capacity: Number(form.capacity),
      });
      push("Live session scheduled.", "success");
      setForm({ startTime: "", endTime: "", capacity: 20 });
      load();
    } catch (err) {
      push(getErrorMessage(err, "Could not schedule session (check for overlapping sessions or marked unavailability)."), "error");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Live sessions</h1>

      <form onSubmit={create} className="mt-6 flex flex-col gap-4 rounded-2xl border border-[var(--color-line)] bg-white p-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start time">
            <TextInput type="datetime-local" required value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
          </FormField>
          <FormField label="End time">
            <TextInput type="datetime-local" required min={form.startTime || undefined} value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
          </FormField>
        </div>
        <FormField label="Capacity">
          <TextInput type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="w-28" />
        </FormField>
        <Button type="submit" loading={creating} className="w-fit">
          <Plus size={15} /> Schedule session
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-2">
        {slots === null ? (
          <div className="flex justify-center py-10"><Spinner size={24} /></div>
        ) : slots.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-soft)]">No live sessions scheduled yet.</p>
        ) : (
          slots.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl border border-[var(--color-line)] bg-white p-4">
              <div className="flex items-center gap-3">
                <Video size={16} className="text-[var(--color-violet)]" />
                <div>
                  <p className="text-sm font-semibold">{new Date(s.startTime).toLocaleString()}</p>
                  <p className="text-xs text-[var(--color-ink-soft)]">until {new Date(s.endTime).toLocaleTimeString()}</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-[var(--color-ink-soft)]">
                <Users size={13} /> {s.bookedCount}/{s.capacity}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
