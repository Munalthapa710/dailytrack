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
        "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-[linear-gradient(135deg,#173B42_0%,#24575B_100%)] text-[#fffaf2] shadow-lift hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(23,59,66,0.24)]",
        variant === "secondary" &&
          "bg-[linear-gradient(135deg,#BFE6F8_0%,#7CC7EE_100%)] text-[#143440] shadow-[0_14px_32px_rgba(124,199,238,0.22)] hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(124,199,238,0.28)]",
        variant === "ghost" &&
          "bg-[rgba(255,252,247,0.72)] text-primary ring-1 ring-[rgba(23,59,66,0.14)] backdrop-blur-sm hover:bg-white hover:text-[rgb(17,43,49)]",
        variant === "danger" &&
          "bg-[linear-gradient(135deg,#BE5B4B_0%,#D06B5B_100%)] text-white shadow-[0_16px_34px_rgba(190,91,75,0.22)] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(190,91,75,0.28)]",
        className
      )}
      {...props}
    />
  );
}
