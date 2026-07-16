import { AuthForm } from "@/components/auth/auth-form";
import { TransitionLink } from "@/components/navigation/transition-link";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="login-logo">D</div>
        <div>
          <h1 className="text-xl font-black text-slate-950">DailyRoutine</h1>
          <p className="text-sm text-slate-500">Sign in to manage operations</p>
        </div>
      </div>
      <div>
        <AuthForm mode="login" />
      </div>
      <p className="mt-6 text-sm text-slate-500">
        Need an account?{" "}
        <TransitionLink className="font-black text-[var(--app-primary)] underline-offset-4 transition hover:underline" href="/register">
          Register here
        </TransitionLink>
      </p>
    </div>
  );
}
