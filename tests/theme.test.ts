import { describe, it, expect } from "vitest";
import {
  resolveTheme,
  nextPreference,
  isThemePreference,
  preferenceLabel,
} from "@/lib/theme";

describe("theme.isThemePreference", () => {
  it("accepts known preferences and rejects others", () => {
    expect(isThemePreference("light")).toBe(true);
    expect(isThemePreference("dark")).toBe(true);
    expect(isThemePreference("system")).toBe(true);
    expect(isThemePreference("neon")).toBe(false);
    expect(isThemePreference(null)).toBe(false);
  });
});

describe("theme.resolveTheme", () => {
  it("returns explicit preferences as-is", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("uses prefersDark for the system preference", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
});

describe("theme.nextPreference", () => {
  it("cycles light -> dark -> system -> light", () => {
    expect(nextPreference("light")).toBe("dark");
    expect(nextPreference("dark")).toBe("system");
    expect(nextPreference("system")).toBe("light");
  });
});

describe("theme.preferenceLabel", () => {
  it("labels every preference", () => {
    expect(preferenceLabel("light")).toBe("Light");
    expect(preferenceLabel("dark")).toBe("Dark");
    expect(preferenceLabel("system")).toBe("System");
  });
});
