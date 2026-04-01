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
    <div className="panel p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Trends</p>
          <h3 className="title-display mt-2 text-3xl">{title}</h3>
        </div>
      </div>
      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(23, 59, 66, 0.08)" />
            <XAxis dataKey="label" stroke="#64748B" fontSize={12} />
            <YAxis stroke="#64748B" fontSize={12} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 18,
                border: "1px solid rgba(23, 59, 66, 0.12)",
                background: "rgba(255, 252, 247, 0.96)",
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)"
              }}
            />
            <Legend />
            <Bar dataKey="completed" fill="#173B42" radius={[8, 8, 0, 0]} />
            <Bar dataKey="pending" fill="#7CC7EE" radius={[8, 8, 0, 0]} />
            <Bar dataKey="missed" fill="#BE5B4B" radius={[8, 8, 0, 0]} />
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
