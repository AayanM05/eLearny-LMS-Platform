import { useState } from "react";
import { Ticket, Plus } from "lucide-react";
import { couponApi } from "../../api/admin";
import { useToast } from "../../components/Toast";
import Button from "../../components/Button";
import FormField, { TextInput, Select } from "../../components/FormField";
import { getErrorMessage } from "../../utils/errorMessage";

/** FR44/FR45: Admin creates platform-wide coupons (courseId omitted); instructors create per-course
 *  ones from their own course page (same API, courseId supplied) — this page covers the Admin case. */
export default function CouponManagementPage() {
  const { push } = useToast();
  const [form, setForm] = useState({ code: "", discountType: "PERCENTAGE", discountValue: 10, expiryDate: "", usageLimit: "" });
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState([]);

  const submit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await couponApi.create({
        code: form.code.toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        expiryDate: form.expiryDate || null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        courseId: null,
      });
      setCreated((prev) => [data, ...prev]);
      setForm({ code: "", discountType: "PERCENTAGE", discountValue: 10, expiryDate: "", usageLimit: "" });
      push("Coupon created.", "success");
    } catch (err) {
      push(getErrorMessage(err, "Could not create coupon."), "error");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold">Platform coupons</h1>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-4 rounded-2xl border border-[var(--color-line)] bg-white p-5">
        <FormField label="Code">
          <TextInput required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Discount type">
            <Select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
              <option value="PERCENTAGE">Percentage</option>
              <option value="FLAT">Flat amount</option>
            </Select>
          </FormField>
          <FormField label={form.discountType === "PERCENTAGE" ? "Discount (%)" : "Discount (₹)"}>
            <TextInput type="number" min="0" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Expiry date (optional)">
            <TextInput type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
          </FormField>
          <FormField label="Usage limit (optional)">
            <TextInput type="number" min="1" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
          </FormField>
        </div>
        <Button type="submit" loading={creating} className="w-fit">
          <Plus size={15} /> Create coupon
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-2">
        {created.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-xl border border-[var(--color-line)] bg-white p-4">
            <div className="flex items-center gap-2">
              <Ticket size={16} className="text-[var(--color-violet)]" />
              <span className="font-mono-stat text-sm font-semibold">{c.code}</span>
            </div>
            <span className="text-sm text-[var(--color-ink-soft)]">
              {c.discountType === "PERCENTAGE" ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
