import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { DailyFocusPanel } from "@/components/dashboard/daily-focus-panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { requireUser } from "@/lib/auth";
import { getAnalyticsForUser, getDailyBriefingForUser } from "@/lib/task-service";

export default async function DashboardPage() {
  const user = await requireUser();
  const [analytics, briefing] = await Promise.all([getAnalyticsForUser(user.id), getDailyBriefingForUser(user.id)]);

  return (
    <div className="space-y-6">
      <DailyFocusPanel briefing={briefing} />

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
