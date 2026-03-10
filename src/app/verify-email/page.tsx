import Link from "next/link";
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
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className={`text-sm font-semibold ${result.ok ? "text-emerald-600" : "text-red-600"}`}>
          {result.ok ? "Verification complete" : "Verification failed"}
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">{result.message}</h1>
        <div className="mt-8">
          <Link className="inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white" href="/login">
            Go to login
          </Link>
        </div>
      </div>
    </div>
  );
}
