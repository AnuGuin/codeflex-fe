"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900"
        aria-label="Toggle theme"
      >
        <div className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-neutral-700 dark:text-neutral-300 transition-all" />
      ) : (
        <Moon className="h-5 w-5 text-neutral-700 dark:text-neutral-300 transition-all" />
      )}
    </button>
  );
}
