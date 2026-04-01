"use client";

import type { Route } from "next";
import { usePathname } from "next/navigation";
import { CalendarPlus2, CheckSquare, LayoutDashboard } from "lucide-react";
import { LogoutButton } from "@/components/layout/logout-button";
import { TransitionLink } from "@/components/navigation/transition-link";
import { cn } from "@/lib/utils";

const navItems: Array<{
  href: Route;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Add Tasks", icon: CalendarPlus2 },
  { href: "/checklist", label: "Checklist", icon: CheckSquare }
];

export function TopNav({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto max-w-[1300px] px-4 pt-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <TransitionLink className="flex items-center gap-3" href="/dashboard">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">DailyRoutine</p>
                  <p className="text-sm font-medium text-slate-500">Hello, {userName}</p>
                </div>
              </TransitionLink>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <nav className="flex flex-wrap items-center gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  return (
                    <TransitionLink
                      key={item.href}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                        isActive
                          ? "bg-primary text-white"
                          : "bg-white/80 text-slate-600 ring-1 ring-slate-200 hover:bg-white hover:text-ink"
                      )}
                      href={item.href}
                      prefetch
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </TransitionLink>
                  );
                })}
              </nav>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
