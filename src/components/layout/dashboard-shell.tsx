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
    <div className="min-h-screen bg-[var(--app-background)] pb-4 lg:flex">
      <TopNav userName={userName} />
      <div className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:ml-72 lg:px-8">
        <main className="relative min-h-[calc(100vh-2rem)] overflow-hidden rounded-lg border border-[var(--app-line)] bg-white px-4 py-5 shadow-panel sm:px-6 lg:py-7">
          <PageTransitionShell>{children}</PageTransitionShell>
        </main>
      </div>
    </div>
  );
}
