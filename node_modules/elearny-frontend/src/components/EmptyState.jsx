export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-line)] px-6 py-16 text-center">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-violet-pale)] text-[var(--color-violet)]">
          <Icon size={22} />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-[var(--color-ink-soft)]">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
