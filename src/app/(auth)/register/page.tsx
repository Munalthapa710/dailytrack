import { AuthForm } from "@/components/auth/auth-form";
import { TransitionLink } from "@/components/navigation/transition-link";

export default function RegisterPage() {
  return (
    <div>
      <p className="eyebrow">Create account</p>
      <h2 className="title-display mt-4 text-5xl">Build a calmer planning ritual.</h2>
      <p className="muted-copy mt-4 max-w-md text-sm leading-7">
        Register once and keep every task, checklist action, and performance metric under your own secure workspace.
      </p>
      <div className="panel mt-8 p-6 sm:p-7">
        <AuthForm mode="register" />
      </div>
      <p className="muted-copy mt-6 text-sm">
        Already have an account?{" "}
        <TransitionLink className="font-semibold text-primary underline-offset-4 transition hover:text-primary/80 hover:underline" href="/login">
          Sign in
        </TransitionLink>
      </p>
    </div>
  );
}
