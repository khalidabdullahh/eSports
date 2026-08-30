"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("arenex_theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme: "dark" | "light" = saved
      ? (saved as "dark" | "light")
      : prefersDark
      ? "dark"
      : "light";

    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Listen to OS system color scheme changes if user hasn't explicitly locked a preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const userManualOverride = localStorage.getItem("arenex_theme");
      if (!userManualOverride) {
        const nextMode = e.matches ? "dark" : "light";
        setTheme(nextMode);
        if (nextMode === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("arenex_theme", next);

    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-8 h-8 rounded-lg bg-surface-elevated border border-surface-border animate-pulse",
          className
        )}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={cn(
        "relative inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-crimson select-none",
        "bg-surface-elevated hover:bg-surface-50 border border-surface-border text-slate-800 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white shadow-sm",
        className
      )}
      title={isDark ? "Switch to Light Theme" : "Switch to Dark Esports Theme"}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-brand-gold transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-slate-800 dark:text-brand-crimson transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
      {showLabel && (
        <span className="ml-2 text-xs font-semibold font-display uppercase tracking-wider text-slate-800 dark:text-gray-200">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
