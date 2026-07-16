"use client";

import type { Task } from "@prisma/client";
import { addDays, format, isSameDay, startOfMonth, startOfWeek } from "date-fns";

const priorityDot = {
  low: "bg-slate-400",
  medium: "bg-[var(--app-primary)]",
  high: "bg-amber-500",
  urgent: "bg-danger"
};

export function TasksCalendar({ tasks }: { tasks: Task[] }) {
  const today = new Date();
  const first = startOfWeek(startOfMonth(today), { weekStartsOn: 1 });
  const days = Array.from({ length: 35 }, (_, index) => addDays(first, index));

  return (
    <section className="page-panel overflow-hidden p-0">
      <div className="border-b border-slate-200 bg-[var(--app-primary-soft)] px-5 py-4">
        <p className="eyebrow">Calendar</p>
        <h2 className="mt-1 text-xl font-black text-[var(--app-text)]">{format(today, "MMMM yyyy")}</h2>
      </div>
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div className="border-r border-[var(--app-line)] px-2 py-3 last:border-r-0" key={day}>
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const matches = tasks.filter((task) => isSameDay(task.date, day));
          const muted = day.getMonth() !== today.getMonth();
          return (
            <div className="min-h-28 border-b border-r border-[var(--app-line)] p-2 last:border-r-0" key={day.toISOString()}>
              <div className={`text-xs font-black ${muted ? "text-slate-400" : "text-[var(--app-text)]"}`}>{format(day, "d")}</div>
              <div className="mt-2 space-y-1">
                {matches.slice(0, 3).map((task) => (
                  <div className="flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-600" key={task.id}>
                    <span className={`h-2 w-2 shrink-0 rounded-full ${priorityDot[task.priority]}`} />
                    <span className="truncate">{task.title}</span>
                  </div>
                ))}
                {matches.length > 3 ? <p className="text-[11px] font-bold text-slate-400">+{matches.length - 3} more</p> : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
