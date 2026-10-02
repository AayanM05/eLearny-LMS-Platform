"use client";

import { Check } from "lucide-react";

/**
 * Custom-styled checkbox (native <input type="checkbox"> is visually
 * unstyleable across browsers) — per pages.md §1.1's v1.3 spec. `onOpenPolicy`
 * is separate from `checked`/`onChange`: clicking the box itself should open
 * the policy modal (see PolicyModal), not just flip the checkbox directly.
 */
export function Checkbox({
  checked,
  onOpenPolicy,
  label,
}: {
  checked: boolean;
  onOpenPolicy: () => void;
  label: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onOpenPolicy}
      className="flex cursor-pointer items-start gap-2 text-left text-sm text-foreground"
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
          checked ? "border-primary bg-primary" : "border-border bg-background"
        }`}
      >
        {checked && <Check size={14} className="text-primary-foreground" strokeWidth={3} />}
      </span>
      <span>{label}</span>
    </button>
  );
}
