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
    <div className="app-shell min-h-screen">
      <TopNav userName={userName} />
      <div className="app-main transition-all lg:pl-[244px]">
        <main className="mx-auto max-w-[1600px] px-4 py-4 pb-28 sm:px-6 lg:px-6 lg:py-6">
          <PageTransitionShell>{children}</PageTransitionShell>
        </main>
      </div>
    </div>
  );
}
