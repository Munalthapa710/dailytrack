"use client";

import { useEffect } from "react";
import { applyAppearance, loadAppearance } from "@/lib/appearance";

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyAppearance(loadAppearance());
  }, []);

  return children;
}
