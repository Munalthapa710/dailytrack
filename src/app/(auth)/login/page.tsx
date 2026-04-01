import { AuthForm } from "@/components/auth/auth-form";
import { TransitionLink } from "@/components/navigation/transition-link";

export default function LoginPage() {
  return (
    <div>
      <p className="eyebrow">Welcome back</p>
      <h2 className="title-display mt-4 text-5xl">Step back into your work rhythm.</h2>
      <p className="muted-copy mt-4 max-w-md text-sm leading-7">
        Access your tasks, tick today&apos;s work, and review weekly, monthly, and yearly performance in one workspace.
      </p>
      <div className="panel mt-8 p-6 sm:p-7">
        <AuthForm mode="login" />
      </div>
      <p className="muted-copy mt-6 text-sm">
        Need an account?{" "}
        <TransitionLink className="font-semibold text-primary underline-offset-4 transition hover:text-primary/80 hover:underline" href="/register">
          Register here
        </TransitionLink>
      </p>
    </div>
  );
}
