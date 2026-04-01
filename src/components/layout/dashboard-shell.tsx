import { PageTransitionShell } from "@/components/navigation/page-transition-shell";
import { TopNav } from "@/components/layout/top-nav";

export function DashboardShell({
  children,
  userName
}: {
  children: React.ReactNode;
  userName: string;
}) {
  return (
    <div className="min-h-screen pb-8">
      <TopNav userName={userName} />
      <div className="mx-auto mt-6 max-w-[1300px] px-4 sm:px-6 lg:px-8">
        <main className="panel relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(210,154,58,0.18),transparent_68%)]" />
          <PageTransitionShell>{children}</PageTransitionShell>
        </main>
      </div>
    </div>
  );
}
