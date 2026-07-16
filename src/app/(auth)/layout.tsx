import { PageTransitionShell } from "@/components/navigation/page-transition-shell";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 p-6 text-slate-950">
      <PageTransitionShell>{children}</PageTransitionShell>
    </div>
  );
}
