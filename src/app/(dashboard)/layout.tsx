import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireSessionUser } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSessionUser();
  return <DashboardShell userName={user.name}>{children}</DashboardShell>;
}
