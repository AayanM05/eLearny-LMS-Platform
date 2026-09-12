import type { Metadata } from "next";
import { Inter, Space_Grotesk, Anton } from "next/font/google";
import { ThemeProvider } from "@/src/components/theme-provider";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap"
});

const anton = Anton({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap"
});

export const metadata: Metadata = {
  title: "eLearny — Advanced Next-Gen LMS Platform",
  description: "Master Software Engineering, Cloud Architecture, and Mobile Development with production-grade interactive masterclasses, live office hours, and verified certificates.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={`${inter.variable} ${spaceGrotesk.variable} ${anton.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAFA] dark:bg-[#090D16] text-slate-900 dark:text-slate-100 selection:bg-[#D96B43] selection:text-white transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
