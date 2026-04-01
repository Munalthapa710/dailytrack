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
      <div className="mx-auto max-w-[1300px] px-4 pt-5 sm:px-6 lg:px-8">
        <div className="panel-soft px-5 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <TransitionLink className="flex items-center gap-3" href="/dashboard">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#173B42_0%,#24575B_100%)] text-white shadow-lift">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div>
                  <p className="eyebrow">DailyRoutine</p>
                  <p className="mt-1 text-sm font-medium text-slate-500">Hello, {userName}</p>
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
                        "inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition duration-200",
                        isActive
                          ? "bg-[linear-gradient(135deg,#173B42_0%,#24575B_100%)] text-[#fffaf2] shadow-lift"
                          : "bg-[rgba(255,252,247,0.68)] text-slate-600 ring-1 ring-[rgba(23,59,66,0.12)] hover:bg-white hover:text-primary"
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
