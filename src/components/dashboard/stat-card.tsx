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
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`mb-4 h-1.5 w-14 rounded-full ${
          tone === "success"
            ? "bg-primary"
            : tone === "warning"
              ? "bg-accent"
              : tone === "danger"
                ? "bg-danger"
                : "bg-slate-300"
        }`}
      />
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p
        className={`mt-3 text-3xl font-bold ${
          tone === "success"
            ? "text-primary"
            : tone === "warning"
              ? "text-accent"
              : tone === "danger"
                ? "text-danger"
                : "text-ink"
        }`}
      >
        {isPercentage ? formatPercentage(value) : value}
      </p>
    </div>
  );
}
