export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-32 animate-pulse rounded-[2.25rem] bg-white/60" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-[1.75rem] bg-white/60" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-[1.75rem] bg-white/60" />
        ))}
      </div>
    </div>
  );
}
