import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRatingInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <Star
            size={22}
            className={(hover || value) >= n ? "fill-[var(--color-warn)] text-[var(--color-warn)]" : "text-[var(--color-line)]"}
          />
        </button>
      ))}
    </div>
  );
}
