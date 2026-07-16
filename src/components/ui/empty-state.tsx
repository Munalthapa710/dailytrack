export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="page-panel border-dashed p-10 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--app-primary-soft)] text-[var(--app-primary-strong)]">
        <div className="h-6 w-6 rounded-full border-2 border-current" />
      </div>
      <h3 className="text-xl font-black text-[var(--app-text)]">{title}</h3>
      <p className="muted-copy mx-auto mt-3 max-w-md text-sm leading-6">{description}</p>
    </div>
  );
}
