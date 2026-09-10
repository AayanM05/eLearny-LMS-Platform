import Spinner from "./Spinner";

const variants = {
  primary: "bg-[var(--color-violet)] text-white hover:bg-[var(--color-violet-deep)]",
  coral: "bg-[var(--color-coral)] text-white hover:bg-[var(--color-coral-deep)]",
  outline: "border border-[var(--color-line)] text-[var(--color-ink)] hover:border-[var(--color-violet)] hover:text-[var(--color-violet)]",
  ghost: "text-[var(--color-ink)] hover:bg-[var(--color-canvas)]",
  danger: "bg-white border border-red-200 text-red-600 hover:bg-red-50",
};

export default function Button({
  as: Comp = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  return (
    <Comp
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Spinner size={16} />}
      {children}
    </Comp>
  );
}
