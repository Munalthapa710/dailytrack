"use client";

import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Bell, CalendarPlus2, CheckSquare, LayoutDashboard, Settings } from "lucide-react";
import { LogoutButton } from "@/components/layout/logout-button";
import { TransitionLink } from "@/components/navigation/transition-link";
import { AppearanceMenu } from "@/components/theme/appearance-menu";
import { cn } from "@/lib/utils";

const navItems: Array<{
  href: Route;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Add Tasks", icon: CalendarPlus2 },
  { href: "/checklist", label: "Checklist", icon: CheckSquare },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function TopNav({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <>
      <aside className="inventory-sidebar fixed inset-y-0 left-0 z-40 hidden w-[244px] flex-col px-[14px] lg:flex">
        <div className="sidebar-brand">
          <div className="brand-mark">D</div>
          <div className="min-w-0">
            <strong className="block truncate text-[15px]">DailyRoutine</strong>
            <span className="block truncate text-xs font-bold text-slate-500">{userName}</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-4">
            <div className="sidebar-section-label">Workspace</div>
            <div className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <TransitionLink
                  key={item.href}
                  className={cn(
                    "sidebar-link",
                    isActive && "active"
                  )}
                  href={item.href}
                  prefetch
                >
                  <span className="sidebar-link-icon"><Icon className="h-[18px] w-[18px]" /></span>
                  <span className="truncate">{item.label}</span>
                </TransitionLink>
              );
            })}
            </div>
          </div>
        </nav>

        <div className="border-t border-[#dbe7ef] px-3 py-4">
          <LogoutButton />
        </div>
      </aside>

      <header className="topbar sticky top-0 z-30 flex h-16 items-center justify-between px-4 lg:ml-[244px] lg:px-6">
        <div className="flex items-center gap-3">
          <div className="mobile-top-title grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 leading-none lg:hidden">
            <div className="brand-mark !h-9 !w-9 text-sm">D</div>
            <strong className="text-sm font-black text-slate-950">DailyRoutine</strong>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Planner</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AppearanceMenu />
          <TransitionLink className="icon-button" href="/settings" aria-label="Open settings">
            <Bell className="h-[18px] w-[18px]" />
          </TransitionLink>
          <div className="hidden lg:block">
            <LogoutButton compact />
          </div>
          <div className="lg:hidden">
            <LogoutButton compact iconOnly />
          </div>
        </div>
      </header>

      <nav className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 gap-1 border-t border-[#dbe7ef] bg-white px-2 py-2 shadow-[0_-10px_28px_rgba(15,23,42,0.12)] lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <TransitionLink
              key={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-black",
                isActive ? "bg-[var(--app-primary)] text-white" : "text-slate-500"
              )}
              href={item.href}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label === "Add Tasks" ? "Tasks" : item.label}</span>
            </TransitionLink>
          );
        })}
      </nav>
    </>
  );
}
