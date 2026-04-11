"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-black dark:hover:bg-slate-900 shadow-sm"
      aria-label="Toggle Theme"
    >
      <div className="relative h-5 w-5">
        {/* Sun Icon */}
        <Sun className={`absolute inset-0 h-5 w-5 text-amber-500 transition-all duration-500 rotate-0 scale-100 dark:-rotate-90 dark:scale-0`} />
        
        {/* Moon Icon */}
        <Moon className={`absolute inset-0 h-5 w-5 text-blue-500 transition-all duration-500 rotate-90 scale-0 dark:rotate-0 dark:scale-100`} />
      </div>

      {/* Hover effect indicator */}
      <span className="absolute inset-0 rounded-xl bg-blue-500/0 transition-colors group-hover:bg-blue-500/5 dark:group-hover:bg-blue-500/10" />
    </button>
  );
}