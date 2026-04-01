import { TransitionLink } from "@/components/navigation/transition-link";
import { verifyEmailToken } from "@/lib/email-verification";

export default async function VerifyEmailPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token;

  const result = token
    ? await verifyEmailToken(token)
    : { ok: false as const, message: "Verification token is missing." };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="panel w-full max-w-lg p-8">
        <p className={`eyebrow ${result.ok ? "text-[#1c6d5b]" : "text-[#9d4a3d]"}`}>
          {result.ok ? "Verification complete" : "Verification failed"}
        </p>
        <h1 className="title-display mt-4 text-5xl">{result.message}</h1>
        <p className="muted-copy mt-4 text-sm leading-7">
          {result.ok
            ? "Your account is ready. Continue to the login page and start planning your next session."
            : "Use a fresh verification link or return to the app and request another registration flow."}
        </p>
        <div className="mt-8">
          <TransitionLink className="inline-flex rounded-2xl bg-[linear-gradient(135deg,#173B42_0%,#24575B_100%)] px-5 py-3 text-sm font-semibold text-[#fffaf2] shadow-lift" href="/login">
            Go to login
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}
