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
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
      </div>
      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D7E1E8" />
            <XAxis dataKey="label" stroke="#64748B" fontSize={12} />
            <YAxis stroke="#64748B" fontSize={12} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 18,
                border: "1px solid rgba(226, 232, 240, 1)",
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.1)"
              }}
            />
            <Legend />
            <Bar dataKey="completed" fill="#1A1A1F" radius={[6, 6, 0, 0]} />
            <Bar dataKey="pending" fill="#C9A54C" radius={[6, 6, 0, 0]} />
            <Bar dataKey="missed" fill="#C24141" radius={[6, 6, 0, 0]} />
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
