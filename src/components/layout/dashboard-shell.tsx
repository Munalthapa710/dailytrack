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
        <main className="rounded-2xl border border-slate-200 bg-white px-4 py-6 shadow-sm sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
