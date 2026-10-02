import { Text as RNText, TextProps } from "react-native";

/**
 * Use this instead of importing Text directly from 'react-native' anywhere
 * in app screens/components. Applies font-sans (Poppins) by default.
 *
 * Why this exists (2026-09-14): a previous approach mutated Text's
 * defaultProps globally in app/_layout.tsx to try to set a default font app-
 * wide. That turned out unreliable in practice — real device testing showed
 * only explicitly-classed text (headings using font-heading) picked up a
 * custom font; everything else silently fell back to the OS default. This
 * component makes the font assignment explicit and verifiable per-element
 * instead of depending on an implicit global default.
 *
 * className order matters: base "font-sans" comes first, so a caller
 * passing e.g. className="font-heading text-2xl" still gets font-heading
 * winning (later classes override earlier ones for the same property).
 */
export function AppText({ className, ...props }: TextProps & { className?: string }) {
  return <RNText className={`font-sans ${className ?? ""}`} {...props} />;
}
