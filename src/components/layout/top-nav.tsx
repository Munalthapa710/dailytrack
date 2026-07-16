"use client";

import type { Route } from "next";
import { usePathname } from "next/navigation";
import { CalendarPlus2, CheckSquare, LayoutDashboard, PanelLeftClose } from "lucide-react";
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
  { href: "/checklist", label: "Checklist", icon: CheckSquare }
];

export function TopNav({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 lg:fixed lg:inset-y-0 lg:left-0 lg:w-72">
      <div className="p-3 lg:h-full lg:p-4">
        <div className="app-sidebar flex rounded-lg border border-[var(--app-line)] bg-white/90 p-3 shadow-panel lg:h-full lg:flex-col lg:p-4">
          <div className="flex min-w-0 flex-1 items-center gap-3 lg:flex-none">
            <TransitionLink className="flex min-w-0 items-center gap-3" href="/dashboard">
              <div className="brand-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white shadow-lift">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-black uppercase tracking-[0.12em] text-[var(--app-text)]">DailyRoutine</p>
                <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">Hello, {userName}</p>
              </div>
            </TransitionLink>
          </div>

          <nav className="ml-3 flex items-center gap-2 overflow-x-auto lg:ml-0 lg:mt-8 lg:flex-col lg:items-stretch lg:overflow-visible">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <TransitionLink
                  key={item.href}
                  className={cn(
                    "inline-flex min-w-fit items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-extrabold transition duration-200 lg:min-w-0",
                    isActive
                      ? "bg-[var(--app-primary)] text-white shadow-lift"
                      : "text-slate-600 hover:bg-white hover:text-[var(--app-primary)]"
                  )}
                  href={item.href}
                  prefetch
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </TransitionLink>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:mt-auto lg:flex-col lg:items-stretch">
            <div className="hidden rounded-lg border border-[var(--app-line)] bg-white/70 p-3 text-xs text-slate-500 lg:block">
              <div className="mb-2 flex items-center gap-2 font-black text-[var(--app-text)]">
                <PanelLeftClose className="h-4 w-4 text-[var(--app-primary)]" />
                Workspace
              </div>
              Tasks, checklist, and analytics stay available offline after first load.
            </div>
            <div className="flex items-center gap-2 lg:w-full">
              <AppearanceMenu />
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
