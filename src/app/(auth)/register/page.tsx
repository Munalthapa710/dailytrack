import { AuthForm } from "@/components/auth/auth-form";
import { TransitionLink } from "@/components/navigation/transition-link";

export default function RegisterPage() {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.34em] text-primary">Create account</p>
      <h2 className="mt-4 text-4xl font-bold tracking-tight text-ink">Start organizing your day</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
        Register once and keep every task, checklist action, and performance metric under your own secure workspace.
      </p>
      <div className="mt-8 rounded-[1.75rem] border border-white/60 bg-white/55 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur">
        <AuthForm mode="register" />
      </div>
      <p className="mt-6 text-sm text-slate-500">
        Already have an account?{" "}
        <TransitionLink className="font-semibold text-primary" href="/login">
          Sign in
        </TransitionLink>
      </p>
    </div>
  );
}
