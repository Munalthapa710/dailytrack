import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { StatCard } from "@/components/dashboard/stat-card";
import { requireUser } from "@/lib/auth";
import { getAnalyticsForUser } from "@/lib/task-service";

export default async function DashboardPage() {
  const user = await requireUser();
  const analytics = await getAnalyticsForUser(user.id);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Overview</p>
        <h2 className="mt-2 text-3xl font-semibold text-ink">Performance dashboard</h2>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total tasks" value={analytics.summary.total} />
        <StatCard label="Completed" tone="success" value={analytics.summary.completed} />
        <StatCard label="Pending" tone="warning" value={analytics.summary.pending} />
        <StatCard label="Missed" tone="danger" value={analytics.summary.missed} />
        <StatCard label="Completion rate" value={analytics.summary.completionRate} isPercentage tone="success" />
      </section>

      <AnalyticsCharts monthly={analytics.monthly} weekly={analytics.weekly} yearly={analytics.yearly} />
    </div>
  );
}
