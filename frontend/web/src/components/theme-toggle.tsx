"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300/60 dark:border-slate-700/60 animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-all duration-200 shadow-sm hover:scale-105 active:scale-95"
      aria-label="Toggle visual theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 animate-fade-in" />
      ) : (
        <Moon className="w-5 h-5 text-[#D96B43] animate-fade-in" />
      )}
    </button>
  );
}
