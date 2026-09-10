export default function Spinner({ size = 24, className = "" }) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-[var(--color-line)] border-t-[var(--color-violet)] ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}
