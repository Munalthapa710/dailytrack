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
    return "bg-primary text-white ring-0";
  }

  if (phase === "up-next") {
    return "bg-amber-100 text-amber-700 ring-1 ring-amber-200";
  }

  if (phase === "done") {
    return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
  }

  if (phase === "missed") {
    return "bg-rose-100 text-rose-700 ring-1 ring-rose-200";
  }

  return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
}

export function DailyFocusPanel({ briefing }: { briefing: DailyBriefing }) {
  const progressWidth = `${Math.min(Math.max(briefing.completionRate, 0), 100)}%`;

  return (
    <section className="grid gap-5 xl:grid-cols-[1.2fr_0.9fr]">
      <div className="overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.34),_transparent_38%),linear-gradient(135deg,#0f172a_0%,#1d4ed8_55%,#38bdf8_100%)] p-6 text-white shadow-lg shadow-sky-900/15 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-100/80">Today Focus</p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">{briefing.dateLabel}</h2>
            <p className="mt-3 text-sm text-sky-100/85 sm:text-base">
              {briefing.currentTask
                ? `You are currently inside ${briefing.currentTask.title}. Keep the streak moving.`
                : briefing.nextTask
                  ? `Next up is ${briefing.nextTask.title} at ${briefing.nextTask.startTime}.`
                  : "No active block right now. Use the calm window to prepare tomorrow's work."}
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-100/80">Completion</p>
            <p className="mt-2 text-4xl font-semibold">{briefing.completionRate}%</p>
            <p className="mt-1 text-sm text-sky-100/80">
              {briefing.completedTasks} of {briefing.totalTasks} tasks finished
            </p>
          </div>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-white" style={{ width: progressWidth }} />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-4 backdrop-blur">
            <div className="flex items-center gap-2 text-sky-100/80">
              <Clock3 className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">Planned Time</span>
            </div>
            <p className="mt-3 text-2xl font-semibold">{formatDuration(briefing.scheduledMinutes)}</p>
          </div>
          <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-4 backdrop-blur">
            <div className="flex items-center gap-2 text-sky-100/80">
              <AlarmClockCheck className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">Finished Time</span>
            </div>
            <p className="mt-3 text-2xl font-semibold">{formatDuration(briefing.completedMinutes)}</p>
          </div>
          <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-4 backdrop-blur">
            <div className="flex items-center gap-2 text-sky-100/80">
              <TimerReset className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">Attention Needed</span>
            </div>
            <p className="mt-3 text-2xl font-semibold">{briefing.pendingTasks + briefing.missedTasks}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">Agenda</p>
            <h3 className="mt-1 text-2xl font-semibold text-ink">Timeline for today</h3>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
            {briefing.totalTasks} blocks
          </div>
        </div>

        {briefing.items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
            No tasks are scheduled for today yet.
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {briefing.items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4 transition hover:border-slate-300 hover:bg-white">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-semibold text-ink">{item.title}</h4>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] ${getPillClasses(item.phase)}`}>
                        {item.phase === "up-next" ? "up next" : item.phase}
                      </span>
                      {item.isDaily ? (
                        <span className="inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-sky-700 ring-1 ring-sky-200">
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
