import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Switched to Anton (headings) + Poppins (body) 2026-09-14, replacing
// Inter/Space Grotesk. Bundled locally (not next/font/google) for the same
// zero-network-dependency reason as before.
const poppins = localFont({
  variable: "--font-body",
  src: [
    { path: "./fonts/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
  ],
});

const anton = localFont({
  variable: "--font-heading-face",
  src: [{ path: "./fonts/Anton-Regular.ttf", weight: "400", style: "normal" }],
});

export const metadata: Metadata = {
  title: "eLearny",
  description: "eLearny — All-in-One Flagship LMS Platform",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${anton.variable} h-full antialiased`}
    >
      {/* font-sans applied EXPLICITLY here rather than relying on an
          assumed automatic default (that assumption was the actual bug
          reported 2026-09-14 — headings worked because font-heading was
          explicit, body text silently fell back to the OS default because
          nothing ever explicitly said otherwise). suppressHydrationWarning
          is the documented fix for browser extensions injecting <body>
          attributes (e.g. Grammarly) before hydration — unrelated to fonts. */}
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>{children}</body>
    </html>
  );
}
