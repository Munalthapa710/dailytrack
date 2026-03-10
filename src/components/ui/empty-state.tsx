export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-5 h-12 w-12 rounded-xl bg-slate-100" />
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}
