import { AuthForm } from "@/components/auth/auth-form";
import { TransitionLink } from "@/components/navigation/transition-link";

export default function LoginPage() {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.34em] text-primary">Welcome back</p>
      <h2 className="mt-4 text-4xl font-bold tracking-tight text-ink">Sign in to your planner</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
        Access your tasks, tick today&apos;s work, and review weekly, monthly, and yearly performance in one workspace.
      </p>
      <div className="mt-8 rounded-[1.75rem] border border-white/60 bg-white/55 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] backdrop-blur">
        <AuthForm mode="login" />
      </div>
      <p className="mt-6 text-sm text-slate-500">
        Need an account?{" "}
        <TransitionLink className="font-semibold text-primary" href="/register">
          Register here
        </TransitionLink>
      </p>
    </div>
  );
}
