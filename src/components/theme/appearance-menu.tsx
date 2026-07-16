"use client";

import { Check, Paintbrush, RotateCcw, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  defaultAppearance,
  loadAppearance,
  resetAppearance,
  saveAppearance,
  type AppearanceSettings
} from "@/lib/appearance";
import { cn } from "@/lib/utils";

const fields: Array<{ key: keyof AppearanceSettings; label: string }> = [
  { key: "primaryColor", label: "Theme" },
  { key: "backgroundColor", label: "Background" },
  { key: "textColor", label: "Text" },
  { key: "sidebarColor", label: "Sidebar" }
];

const presets = ["#0f766e", "#0891b2", "#534ab7", "#4338ca", "#be123c", "#15803d"];

export function AppearanceMenu() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AppearanceSettings>(defaultAppearance);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSettings(loadAppearance());
  }, []);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  function update(key: keyof AppearanceSettings, value: string) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveAppearance(next);
  }

  function reset() {
    resetAppearance();
    setSettings(defaultAppearance);
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        aria-label="Open appearance settings"
        aria-expanded={open}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--app-line)] bg-white text-[var(--app-primary)] shadow-sm transition hover:border-[var(--app-primary)]"
        onClick={() => setOpen((value) => !value)}
        title="Appearance"
        type="button"
      >
        <Paintbrush className="h-4 w-4" />
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-50 w-[min(340px,calc(100vw-2rem))] rounded-lg border border-[var(--app-line)] bg-white p-4 text-left shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Appearance</p>
              <h3 className="mt-1 text-base font-black text-[var(--app-text)]">Website Theme</h3>
            </div>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--app-line)] text-slate-500 transition hover:text-[var(--app-primary)]"
              onClick={reset}
              title="Reset theme"
              type="button"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-4 grid grid-cols-6 gap-2">
            {presets.map((color) => (
              <button
                aria-label={`Use ${color}`}
                className={cn(
                  "theme-swatch grid h-9 place-items-center rounded-lg border border-slate-200",
                  settings.primaryColor === color && "ring-2 ring-[var(--app-primary)] ring-offset-2"
                )}
                key={color}
                onClick={() => update("primaryColor", color)}
                style={{ "--swatch": color } as React.CSSProperties}
                title={color}
                type="button"
              >
                {settings.primaryColor === color ? <Check className="h-4 w-4 text-white" /> : null}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {fields.map((field) => (
              <label className="grid grid-cols-[96px_48px_1fr] items-center gap-2 text-sm" key={field.key}>
                <span className="font-bold text-slate-600">{field.label}</span>
                <input
                  className="h-9 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                  onChange={(event) => update(field.key, event.target.value)}
                  type="color"
                  value={settings[field.key]}
                />
                <input
                  className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-bold uppercase outline-none focus:border-[var(--app-primary)]"
                  maxLength={7}
                  onChange={(event) => update(field.key, event.target.value)}
                  value={settings[field.key]}
                />
              </label>
            ))}
          </div>

          <button
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--app-primary)] px-4 py-2.5 text-sm font-black text-white"
            onClick={() => saveAppearance(settings)}
            type="button"
          >
            <Save className="h-4 w-4" />
            Save Theme
          </button>
        </div>
      ) : null}
    </div>
  );
}
