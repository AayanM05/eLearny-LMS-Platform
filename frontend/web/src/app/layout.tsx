import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "eLearny — Advanced Next-Gen LMS Platform",
  description: "Master Software Engineering, Cloud Architecture, and Mobile Development with production-grade interactive courses, live office hours, and verified certificates.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-[#D96B43] selection:text-white">
        {children}
      </body>
    </html>
  );
}
