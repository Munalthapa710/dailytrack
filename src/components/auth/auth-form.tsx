"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigationProgress } from "@/components/navigation/navigation-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";

type AuthMode = "login" | "register";

interface AuthFormValues {
  name?: string;
  email: string;
  password: string;
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const { navigate } = useNavigationProgress();
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AuthFormValues>();

  async function onSubmit(values: AuthFormValues) {
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const payload = await response.json();
    if (!response.ok) {
      showToast(payload.error ?? "Something went wrong.");
      return;
    }

    showToast(
      mode === "login"
        ? "Signed in successfully."
        : "Account created. You can now sign in.",
      "success"
    );
    navigate(mode === "login" ? "/dashboard" : "/login", { replace: true });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      {mode === "register" ? (
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Full name</label>
          <Input className="h-12" placeholder="Enter your full name" {...register("name", { required: "Name is required." })} />
          {errors.name ? <p className="rounded-xl bg-danger/8 px-3 py-2 text-sm text-danger">{errors.name.message}</p> : null}
        </div>
      ) : null}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Email address</label>
        <Input className="h-12" type="email" placeholder="Enter your email address" {...register("email", { required: "Email is required." })} />
        {errors.email ? <p className="rounded-xl bg-danger/8 px-3 py-2 text-sm text-danger">{errors.email.message}</p> : null}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Password</label>
          <span className="text-xs text-slate-400">{mode === "register" ? "Use a strong password" : "Private and secure"}</span>
        </div>
        <div className="relative">
          <Input
            className="h-12 pr-12"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password", { required: "Password is required." })}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-3 inline-flex items-center text-slate-400 transition hover:text-slate-600"
            onClick={() => setShowPassword((value) => !value)}
            type="button"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password ? <p className="rounded-xl bg-danger/8 px-3 py-2 text-sm text-danger">{errors.password.message}</p> : null}
      </div>
      <Button className="h-12 w-full text-sm" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
      </Button>
      <p className="text-center text-xs uppercase tracking-[0.18em] text-slate-400">Secure session and private task data</p>
    </form>
  );
}
