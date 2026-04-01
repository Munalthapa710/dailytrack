import * as React from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-[rgba(23,59,66,0.12)] bg-[rgba(255,250,244,0.88)] px-4 py-3 text-sm text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none transition placeholder:text-slate-400 focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/10",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
