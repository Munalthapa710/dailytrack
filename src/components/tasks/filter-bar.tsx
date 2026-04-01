"use client";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useNavigationProgress } from "@/components/navigation/navigation-provider";
import { Button } from "@/components/ui/button";
import { FilterKey } from "@/types";

const filters: { label: string; value: FilterKey }[] = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "This week", value: "week" },
  { label: "This month", value: "month" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Missed", value: "missed" }
];

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startNavigation } = useNavigationProgress();
  const active = (searchParams.get("filter") as FilterKey) ?? "all";

  function setFilter(filter: FilterKey) {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", filter);
    }
    const query = params.toString();
    startNavigation();
    router.push((query ? `${pathname}?${query}` : pathname) as Route);
  }

  return (
    <div className="panel-soft flex flex-wrap gap-2 p-3">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={active === filter.value ? "primary" : "ghost"}
          onClick={() => setFilter(filter.value)}
          type="button"
          className="min-w-[104px]"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
