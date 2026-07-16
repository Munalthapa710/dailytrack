"use client";

import { Moon, RotateCcw, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import {
  darkAppearance,
  defaultAppearance,
  loadAppearance,
  resetAppearance,
  saveAppearance,
  type AppearanceSettings
} from "@/lib/appearance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const fields: Array<{ key: "primaryColor" | "backgroundColor" | "textColor" | "sidebarColor"; label: string }> = [
  { key: "primaryColor", label: "Theme color" },
  { key: "backgroundColor", label: "Background" },
  { key: "textColor", label: "Text" },
  { key: "sidebarColor", label: "Sidebar" }
];

export function ThemeSettingsPanel() {
  const [settings, setSettings] = useState<AppearanceSettings>(defaultAppearance);

  useEffect(() => {
    setSettings(loadAppearance());
  }, []);

  function update(next: AppearanceSettings) {
    setSettings(next);
    saveAppearance(next);
  }

  function reset() {
    resetAppearance();
    setSettings(defaultAppearance);
  }

  return (
    <section className="panel p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow">Appearance</p>
          <h2 className="mt-2 text-xl font-black text-[var(--app-text)]">Theme Settings</h2>
        </div>
        <Button type="button" variant="ghost" onClick={reset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="mb-5 grid gap-2 sm:grid-cols-2">
        <Button type="button" variant={settings.mode === "light" ? "primary" : "ghost"} onClick={() => update({ ...defaultAppearance, primaryColor: settings.primaryColor })}>
          <Sun className="mr-2 h-4 w-4" />
          Light Mode
        </Button>
        <Button type="button" variant={settings.mode === "dark" ? "primary" : "ghost"} onClick={() => update({ ...darkAppearance, primaryColor: settings.primaryColor })}>
          <Moon className="mr-2 h-4 w-4" />
          Dark Mode
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.key} className="inset-panel p-4">
            <span className="block text-sm font-black text-[var(--app-text)]">{field.label}</span>
            <div className="mt-3 flex items-center gap-3">
              <input
                className="h-11 w-14 cursor-pointer rounded-lg border border-[var(--app-line)] bg-white p-1"
                type="color"
                value={settings[field.key]}
                onChange={(event) => update({ ...settings, [field.key]: event.target.value })}
              />
              <Input value={settings[field.key]} maxLength={7} onChange={(event) => update({ ...settings, [field.key]: event.target.value })} />
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
