"use client";

import { useEffect, useState } from "react";
import {
  resolveTheme,
  nextPreference,
  preferenceLabel,
  isThemePreference,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from "@/lib/theme";

function systemPrefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(preference: ThemePreference): void {
  if (typeof document === "undefined") return;
  const theme = resolveTheme(preference, systemPrefersDark());
  document.documentElement.classList.toggle("dark", theme === "dark");
}

/** A button that cycles light -> dark -> system and persists the choice. */
export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>("system");

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const initial: ThemePreference = isThemePreference(stored)
      ? stored
      : "system";
    setPreference(initial);
    applyTheme(initial);
  }, []);

  function cycle() {
    const next = nextPreference(preference);
    setPreference(next);
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={cycle}
      data-testid="theme-toggle"
      aria-label={`Theme: ${preferenceLabel(preference)}`}
      className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      {preferenceLabel(preference)}
    </button>
  );
}

export default ThemeToggle;
