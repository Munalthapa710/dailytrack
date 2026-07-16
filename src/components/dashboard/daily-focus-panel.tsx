"use client";

import { AlarmClockCheck, ArrowRight, Clock3, TimerReset, TrendingUp } from "lucide-react";
import { DailyBriefing } from "@/types";

function formatDuration(minutes: number) {
  if (minutes <= 0) {
    return "0m";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (!hours) {
    return `${remainingMinutes}m`;
  }

  if (!remainingMinutes) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

function getPillClasses(phase: DailyBriefing["items"][number]["phase"]) {
  if (phase === "now") {
    return "bg-[linear-gradient(135deg,#173B42_0%,#24575B_100%)] text-white ring-0";
  }

  if (phase === "up-next") {
    return "bg-[rgba(124,199,238,0.16)] text-[#2b7091] ring-1 ring-[rgba(124,199,238,0.24)]";
  }

  if (phase === "done") {
    return "bg-[rgba(23,111,91,0.12)] text-[#1c6d5b] ring-1 ring-[rgba(23,111,91,0.2)]";
  }

  if (phase === "missed") {
    return "bg-[rgba(190,91,75,0.12)] text-[#9d4a3d] ring-1 ring-[rgba(190,91,75,0.2)]";
  }

  return "bg-[rgba(29,36,51,0.06)] text-slate-600 ring-1 ring-[rgba(29,36,51,0.08)]";
}

export function DailyFocusPanel({ briefing }: { briefing: DailyBriefing }) {
  const progressWidth = `${Math.min(Math.max(briefing.completionRate, 0), 100)}%`;

  return (
    <section className="grid gap-[22px] xl:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.2fr)]">
      <div className="profit-card">
        <div className="relative z-10">
          <span className="mb-4 block text-sm font-extrabold text-white/85">Today focus</span>
          <strong className="block text-4xl font-black leading-none">{briefing.completionRate}%</strong>
          <p className="mt-4 flex items-center gap-2 text-sm font-bold text-white/90">
            <b className="rounded-full bg-white px-2 py-1 text-xs text-[var(--app-primary-strong)]">{briefing.completedTasks}/{briefing.totalTasks}</b>
            {briefing.currentTask ? briefing.currentTask.title : briefing.nextTask ? `Next: ${briefing.nextTask.title}` : briefing.dateLabel}
          </p>
        </div>
        <svg viewBox="0 0 560 190" aria-hidden="true">
          <path d="M0 126 C55 76 93 91 142 120 C206 158 263 143 310 92 C362 34 399 45 432 85 C473 136 504 135 529 62 C542 25 560 18 581 31" fill="none" />
          <circle cx="390" cy="62" r="10" />
        </svg>
      </div>

      <div className="dashboard-stat-grid">
        {[
          { label: "Planned Time", value: formatDuration(briefing.scheduledMinutes), icon: Clock3 },
          { label: "Finished Time", value: formatDuration(briefing.completedMinutes), icon: AlarmClockCheck },
          { label: "Attention Needed", value: briefing.pendingTasks + briefing.missedTasks, icon: TimerReset },
          { label: "Completion", value: `${briefing.completionRate}%`, icon: TrendingUp }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div className="dashboard-stat-card" key={item.label}>
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--app-primary-soft)] text-[var(--app-primary-strong)]">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-sm font-extrabold text-slate-500">{item.label}</p>
                <b className="text-xs font-black text-[var(--app-primary-strong)]">+15%</b>
              </div>
              <strong className="text-3xl font-black text-[var(--app-text)]">{item.value}</strong>
              <small className="text-xs font-extrabold text-slate-400">{briefing.dateLabel}</small>
            </div>
          );
        })}
      </div>

      <div className="dashboard-panel xl:col-span-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Agenda</p>
            <h3 className="mt-1 text-base font-black text-[var(--app-text)]">Timeline for today</h3>
          </div>
          <div className="rounded-md bg-[color-mix(in_srgb,var(--app-primary)_12%,white)] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--app-primary)]">
            {briefing.totalTasks} blocks
          </div>
        </div>

        {briefing.items.length === 0 ? (
          <div className="inset-panel mt-6 border-dashed px-5 py-8 text-center text-sm text-slate-500">
            No tasks are scheduled for today yet.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {briefing.items.map((item) => (
              <div key={item.id} className="inset-panel px-4 py-4 transition hover:bg-white">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-extrabold text-[var(--app-text)]">{item.title}</h4>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] ${getPillClasses(item.phase)}`}>
                        {item.phase === "up-next" ? "up next" : item.phase}
                      </span>
                      {item.isDaily ? (
                        <span className="inline-flex rounded-full bg-[rgba(23,59,66,0.10)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary ring-1 ring-[rgba(23,59,66,0.14)]">
                          daily
                        </span>
                      ) : null}
                    </div>
                    {item.description ? <p className="mt-1 text-sm text-slate-500">{item.description}</p> : null}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-slate-600">
                    <span>{item.startTime}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                    <span>{item.endTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
