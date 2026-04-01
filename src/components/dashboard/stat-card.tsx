import { formatPercentage } from "@/lib/utils";

export function StatCard({
  label,
  value,
  tone = "default",
  isPercentage = false
}: {
  label: string;
  value: number;
  tone?: "default" | "success" | "warning" | "danger";
  isPercentage?: boolean;
}) {
  const toneClasses =
    tone === "success"
      ? "bg-[rgba(23,59,66,0.10)] text-primary"
      : tone === "warning"
        ? "bg-[rgba(124,199,238,0.16)] text-[#2b7091]"
        : tone === "danger"
          ? "bg-[rgba(190,91,75,0.12)] text-danger"
          : "bg-[rgba(29,36,51,0.08)] text-ink";

  return (
    <div className="panel-soft overflow-hidden p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${toneClasses}`}>
          {tone}
        </div>
      </div>
      <p className="metric-display mt-5 text-5xl text-ink">
        {isPercentage ? formatPercentage(value) : value}
      </p>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[rgba(23,59,66,0.08)]">
        <div
          className={`h-full rounded-full ${
            tone === "success"
              ? "bg-primary"
              : tone === "warning"
                ? "bg-accent"
                : tone === "danger"
                  ? "bg-danger"
                  : "bg-[rgba(29,36,51,0.24)]"
          }`}
          style={{ width: `${Math.min(100, Math.max(18, value))}%` }}
        />
      </div>
    </div>
  );
}
