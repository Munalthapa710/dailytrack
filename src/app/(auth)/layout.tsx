import Image from "next/image";
import { PageTransitionShell } from "@/components/navigation/page-transition-shell";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2.25rem] border border-white/55 bg-[rgba(255,255,255,0.62)] shadow-[0_28px_90px_rgba(15,23,42,0.14)] backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]">
        <div className="hidden bg-[#0f172a] p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[#C9A54C]">DailyRoutine</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">Daily planner for tasks, checklist, and progress tracking.</h1>
          </div>
          <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
            <Image
              alt="Task planner dashboard illustration"
              className="h-auto w-full rounded-[1.25rem]"
              height={760}
              priority
              src="/auth-planner-illustration.svg"
              width={920}
            />
          </div>
        </div>
        <div className="p-6 sm:p-10 lg:p-12">
          <PageTransitionShell>{children}</PageTransitionShell>
        </div>
      </div>
    </div>
  );
}
