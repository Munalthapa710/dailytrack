"use client";

import { AlarmClockCheck, ArrowRight, Clock3, TimerReset } from "lucide-react";
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
    return "bg-[rgba(210,154,58,0.16)] text-[#9b6c1f] ring-1 ring-[rgba(210,154,58,0.24)]";
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
    <section className="grid gap-5 xl:grid-cols-[1.2fr_0.9fr]">
      <div className="overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_top_left,rgba(244,207,136,0.24),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_28%),linear-gradient(135deg,#173B42_0%,#214C53_52%,#D29A3A_185%)] p-6 text-white shadow-[0_28px_70px_rgba(23,59,66,0.26)] sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[rgba(245,220,168,0.9)]">Today Focus</p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="title-display text-4xl leading-tight text-[#fffaf2] sm:text-5xl">{briefing.dateLabel}</h2>
            <p className="mt-3 max-w-xl text-sm text-[#e2ece8] sm:text-base">
              {briefing.currentTask
                ? `You are currently inside ${briefing.currentTask.title}. Keep the streak moving.`
                : briefing.nextTask
                  ? `Next up is ${briefing.nextTask.title} at ${briefing.nextTask.startTime}.`
                  : "No active block right now. Use the calm window to prepare tomorrow's work."}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/15 bg-[rgba(255,255,255,0.12)] px-5 py-4 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgba(243,220,171,0.9)]">Completion</p>
            <p className="metric-display mt-2 text-5xl text-[#fffaf2]">{briefing.completionRate}%</p>
            <p className="mt-1 text-sm text-[#dfe9e3]">
              {briefing.completedTasks} of {briefing.totalTasks} tasks finished
            </p>
          </div>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-[linear-gradient(90deg,#fff6df_0%,#F4CF88_100%)]" style={{ width: progressWidth }} />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[24px] border border-white/12 bg-[rgba(255,255,255,0.1)] px-4 py-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-[rgba(243,220,171,0.9)]">
              <Clock3 className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">Planned Time</span>
            </div>
            <p className="metric-display mt-3 text-4xl text-[#fffaf2]">{formatDuration(briefing.scheduledMinutes)}</p>
          </div>
          <div className="rounded-[24px] border border-white/12 bg-[rgba(255,255,255,0.1)] px-4 py-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-[rgba(243,220,171,0.9)]">
              <AlarmClockCheck className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">Finished Time</span>
            </div>
            <p className="metric-display mt-3 text-4xl text-[#fffaf2]">{formatDuration(briefing.completedMinutes)}</p>
          </div>
          <div className="rounded-[24px] border border-white/12 bg-[rgba(255,255,255,0.1)] px-4 py-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-[rgba(243,220,171,0.9)]">
              <TimerReset className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">Attention Needed</span>
            </div>
            <p className="metric-display mt-3 text-4xl text-[#fffaf2]">{briefing.pendingTasks + briefing.missedTasks}</p>
          </div>
        </div>
      </div>

      <div className="panel p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Agenda</p>
            <h3 className="title-display mt-2 text-4xl">Timeline for today</h3>
          </div>
          <div className="rounded-full bg-[rgba(23,59,66,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
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
              <div key={item.id} className="inset-panel px-4 py-4 transition hover:border-[rgba(23,59,66,0.16)] hover:bg-[rgba(255,252,247,0.98)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-semibold text-ink">{item.title}</h4>
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
