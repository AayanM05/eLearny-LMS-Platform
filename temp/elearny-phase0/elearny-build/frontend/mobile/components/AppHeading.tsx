import { Text as RNText, TextProps } from "react-native";

/**
 * Use for screen titles/headings specifically — never combine font-heading
 * with font-sans (AppText) on the same element.
 *
 * Why this exists (2026-09-14): AppText's "font-sans {className}" pattern
 * assumed a later class in the same string (e.g. "font-sans ... font-
 * heading") would win, the way it would in a plain browser CSS cascade.
 * Real device testing showed that assumption was wrong for NativeWind —
 * Poppins applied correctly, but Anton never did on elements combining both
 * classes. Rather than dig further into NativeWind's exact same-property
 * conflict resolution, this component sidesteps the question entirely by
 * only ever setting font-heading, alone, on a given element.
 */
export function AppHeading({ className, ...props }: TextProps & { className?: string }) {
  return <RNText className={`font-heading ${className ?? ""}`} {...props} />;
}
