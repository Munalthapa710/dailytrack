"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ChartDatum } from "@/types";

function ChartBlock({ title, data }: { title: string; data: ChartDatum[] }) {
  return (
    <div className="dashboard-panel">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-black text-[var(--app-text)]">{title}</h3>
        <button className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-500" type="button">Monthly</button>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(23, 59, 66, 0.08)" />
            <XAxis dataKey="label" stroke="#64748B" fontSize={12} />
            <YAxis stroke="#64748B" fontSize={12} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                background: "#fff",
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)"
              }}
            />
            <Legend />
            <Bar dataKey="completed" fill="var(--app-primary)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="pending" fill="var(--app-accent)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="missed" fill="var(--danger)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function AnalyticsCharts({
  weekly,
  monthly,
  yearly
}: {
  weekly: ChartDatum[];
  monthly: ChartDatum[];
  yearly: ChartDatum[];
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <ChartBlock title="Weekly analysis" data={weekly} />
      <ChartBlock title="Monthly analysis" data={monthly} />
      <ChartBlock title="Yearly analysis" data={yearly} />
    </div>
  );
}
