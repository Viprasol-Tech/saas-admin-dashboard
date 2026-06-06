/**
 * Theme helpers.
 *
 * Pure logic for the light/dark theme toggle, kept separate from React so the
 * resolution rules are unit-testable. The actual DOM/localStorage wiring lives
 * in the `ThemeToggle` client component.
 */

export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

export const THEME_STORAGE_KEY = "vp-theme";

/** Type guard for a stored theme preference string. */
export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

/**
 * Resolves a preference into a concrete theme. "system" uses the supplied
 * `prefersDark` flag (from a media query) to decide.
 */
export function resolveTheme(
  preference: ThemePreference,
  prefersDark: boolean,
): Theme {
  if (preference === "system") return prefersDark ? "dark" : "light";
  return preference;
}

/** Cycles a preference: light -> dark -> system -> light. */
export function nextPreference(current: ThemePreference): ThemePreference {
  switch (current) {
    case "light":
      return "dark";
    case "dark":
      return "system";
    case "system":
      return "light";
  }
}

/** Short label for the current preference, for the toggle button. */
export function preferenceLabel(preference: ThemePreference): string {
  switch (preference) {
    case "light":
      return "Light";
    case "dark":
      return "Dark";
    case "system":
      return "System";
  }
}
