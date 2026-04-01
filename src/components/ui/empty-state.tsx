export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="panel p-10 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(23,59,66,0.16),rgba(124,199,238,0.22))] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
        <div className="h-6 w-6 rounded-full border-2 border-primary/55" />
      </div>
      <h3 className="title-display text-3xl">{title}</h3>
      <p className="muted-copy mx-auto mt-3 max-w-md text-sm leading-6">{description}</p>
    </div>
  );
}
