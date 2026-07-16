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
      ? "bg-[color-mix(in_srgb,var(--app-primary)_12%,white)] text-[var(--app-primary)]"
      : tone === "warning"
        ? "bg-[rgba(83,74,183,0.10)] text-[var(--app-accent)]"
        : tone === "danger"
          ? "bg-rose-50 text-danger"
          : "bg-slate-100 text-[var(--app-text)]";

  return (
    <div className="stat-card overflow-hidden">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</p>
        <div className={`rounded-md px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] ${toneClasses}`}>
          {tone}
        </div>
      </div>
      <p className="mt-3 text-2xl font-black text-[var(--app-text)]">
        {isPercentage ? formatPercentage(value) : value}
      </p>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            tone === "success"
              ? "bg-[var(--app-primary)]"
              : tone === "warning"
                ? "bg-[var(--app-accent)]"
                : tone === "danger"
                  ? "bg-danger"
                  : "bg-slate-300"
          }`}
          style={{ width: `${Math.min(100, Math.max(18, value))}%` }}
        />
      </div>
    </div>
  );
}
