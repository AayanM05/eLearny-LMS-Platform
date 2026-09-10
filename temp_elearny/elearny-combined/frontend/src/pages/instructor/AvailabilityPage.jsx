import { useState } from "react";
import { CalendarOff, Plus } from "lucide-react";
import { availabilityApi } from "../../api/admin";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import FormField, { TextInput, TextArea } from "../../components/FormField";
import { getErrorMessage } from "../../utils/errorMessage";

/** FR57: instructor marks themselves unavailable for a date range — live session scheduling
 *  and TA-visible calendars respect this on the backend (LiveSessionService.assertNoConflictWithLeave). */
export default function AvailabilityPage() {
  const { push } = useToast();
  const [form, setForm] = useState({ startDate: "", endDate: "", reason: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState([]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await availabilityApi.markUnavailable(form);
      setSaved((prev) => [data, ...prev]);
      setForm({ startDate: "", endDate: "", reason: "" });
      push("Marked as unavailable.", "success");
    } catch (err) {
      push(getErrorMessage(err, "Could not save."), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-violet-pale)] text-[var(--color-violet)]">
        <CalendarOff size={22} />
      </div>
      <h1 className="font-display text-2xl font-bold">Mark yourself unavailable</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
        Live sessions can't be scheduled over dates you've marked here.
      </p>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-4 rounded-2xl border border-[var(--color-line)] bg-white p-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="From">
            <TextInput type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value, endDate: form.endDate && form.endDate < e.target.value ? e.target.value : form.endDate })} />
          </FormField>
          <FormField label="To">
            <TextInput type="date" required min={form.startDate || undefined} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </FormField>
        </div>
        <FormField label="Reason (optional)">
          <TextArea rows={2} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
        </FormField>
        <Button type="submit" loading={saving} className="w-fit">
          <Plus size={15} /> Mark unavailable
        </Button>
      </form>

      <div className="mt-4 flex flex-col gap-2">
        {saved.map((l) => (
          <div key={l.id} className="rounded-xl border border-[var(--color-line)] bg-white p-4 text-sm">
            {l.startDate} → {l.endDate} {l.reason && <span className="text-[var(--color-ink-soft)]">· {l.reason}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
