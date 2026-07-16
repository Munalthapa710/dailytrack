"use client";

export type AppearanceSettings = {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  sidebarColor: string;
};

export const defaultAppearance: AppearanceSettings = {
  primaryColor: "#0f766e",
  backgroundColor: "#f6f8fc",
  textColor: "#0f172a",
  sidebarColor: "#edf7fb"
};

const storageKey = "dailytrack.appearance";
const hexColorPattern = /^#[0-9A-Fa-f]{6}$/;

function sanitizeColor(value: unknown, fallback: string) {
  return typeof value === "string" && hexColorPattern.test(value) ? value : fallback;
}

export function loadAppearance(): AppearanceSettings {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) {
      return defaultAppearance;
    }

    const parsed = JSON.parse(saved) as Partial<AppearanceSettings>;
    return {
      primaryColor: sanitizeColor(parsed.primaryColor, defaultAppearance.primaryColor),
      backgroundColor: sanitizeColor(parsed.backgroundColor, defaultAppearance.backgroundColor),
      textColor: sanitizeColor(parsed.textColor, defaultAppearance.textColor),
      sidebarColor: sanitizeColor(parsed.sidebarColor, defaultAppearance.sidebarColor)
    };
  } catch {
    return defaultAppearance;
  }
}

export function applyAppearance(settings: AppearanceSettings) {
  const root = document.documentElement;
  root.style.setProperty("--app-primary", settings.primaryColor);
  root.style.setProperty("--app-primary-strong", settings.primaryColor);
  root.style.setProperty("--app-background", settings.backgroundColor);
  root.style.setProperty("--app-text", settings.textColor);
  root.style.setProperty("--app-sidebar", settings.sidebarColor);
  root.style.setProperty("--primary", settings.primaryColor);
  root.style.setProperty("--ink", settings.textColor);
}

export function saveAppearance(settings: AppearanceSettings) {
  localStorage.setItem(storageKey, JSON.stringify(settings));
  applyAppearance(settings);
}

export function resetAppearance() {
  localStorage.removeItem(storageKey);
  applyAppearance(defaultAppearance);
}
