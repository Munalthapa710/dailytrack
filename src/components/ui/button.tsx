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
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-150 focus:outline-none focus:ring-2 focus:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-primary text-white shadow-sm hover:bg-[#232329]",
        variant === "secondary" && "bg-accent text-ink shadow-sm hover:bg-[#d5b56a]",
        variant === "ghost" && "bg-white text-ink ring-1 ring-slate-200 hover:bg-slate-50",
        variant === "danger" && "bg-danger text-white shadow-sm hover:bg-danger/90",
        className
      )}
      {...props}
    />
  );
}
