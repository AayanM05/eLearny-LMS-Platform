export default function FormField({ label, error, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-[var(--color-ink-soft)]">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-[var(--color-coral-deep)]">{error}</span>}
    </label>
  );
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-violet)] ${props.className || ""}`}
    />
  );
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-violet)] ${props.className || ""}`}
    />
  );
}

export function Select(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--color-violet)] ${props.className || ""}`}
    />
  );
}
