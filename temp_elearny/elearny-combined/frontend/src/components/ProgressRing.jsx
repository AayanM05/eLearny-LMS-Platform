/**
 * Signature visual motif for eLearny: a circular progress ring, reused on course cards,
 * the student dashboard hero, and the certificate page — a single consistent way of
 * showing "how far through this are you" everywhere in the product.
 */
export default function ProgressRing({ percent = 0, size = 56, stroke = 5, label, className = "" }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="progress-ring -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={percent >= 100 ? "var(--color-success)" : "var(--color-violet)"}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute font-mono-stat font-semibold" style={{ fontSize: size * 0.24 }}>
        {label ?? `${Math.round(percent)}%`}
      </span>
    </div>
  );
}
