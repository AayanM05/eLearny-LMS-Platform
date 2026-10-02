import { useEffect, useState } from "react";

/**
 * Delays updating the returned value until `value` stops changing for
 * `delayMs`. Used so the username-availability check doesn't fire an API
 * request on every single keystroke — matches pages.md §1.1's spec of a
 * "300ms debounced input."
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
