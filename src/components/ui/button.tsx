"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-extrabold transition duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)]/20 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-[var(--app-primary)] text-white shadow-lift hover:-translate-y-0.5",
        variant === "secondary" &&
          "bg-white text-[var(--app-primary)] ring-1 ring-[var(--app-line)] hover:-translate-y-0.5 hover:ring-[var(--app-primary)]",
        variant === "ghost" &&
          "bg-white text-slate-600 ring-1 ring-[var(--app-line)] hover:text-[var(--app-primary)] hover:ring-[var(--app-primary)]",
        variant === "danger" &&
          "bg-danger text-white shadow-[0_16px_34px_rgba(190,18,60,0.22)] hover:-translate-y-0.5",
        className
      )}
      {...props}
    />
  );
}
