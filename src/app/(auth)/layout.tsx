import Image from "next/image";
import { PageTransitionShell } from "@/components/navigation/page-transition-shell";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="panel-soft grid w-full max-w-6xl overflow-hidden lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(124,199,238,0.22),transparent_30%),linear-gradient(145deg,#173B42_0%,#214C53_48%,#0F252B_100%)] p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-16 top-12 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(124,199,238,0.32),rgba(124,199,238,0)_72%)]" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),rgba(255,255,255,0)_72%)]" />
          <div>
            <p className="eyebrow text-[#d8f0fb]">DailyRoutine</p>
            <h1 className="title-display mt-5 text-5xl text-[#fffaf2]">Design your day with rhythm, clarity, and momentum.</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#dce7e1]">
              Plan work blocks, manage recurring tasks, and move between dashboard, checklist, and analytics with a calmer visual flow.
            </p>
          </div>
          <div className="relative mt-8 overflow-hidden rounded-[1.85rem] border border-white/10 bg-[rgba(255,255,255,0.08)] p-4 backdrop-blur-sm">
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
        <div className="bg-[linear-gradient(180deg,rgba(255,252,247,0.88),rgba(250,242,228,0.72))] p-6 sm:p-10 lg:p-12">
          <PageTransitionShell>{children}</PageTransitionShell>
        </div>
      </div>
    </div>
  );
}
