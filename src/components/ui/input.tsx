import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-[var(--app-line)] bg-white px-4 py-3 text-sm text-[var(--app-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none transition placeholder:text-slate-400 focus:border-[var(--app-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--app-primary)]/10",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
