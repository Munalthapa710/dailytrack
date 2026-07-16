"use client";

import type { Task } from "@prisma/client";
import { format } from "date-fns";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { Button } from "@/components/ui/button";

const priorityClasses = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-[color-mix(in_srgb,var(--app-primary)_12%,white)] text-[var(--app-primary)]",
  high: "bg-amber-50 text-amber-700",
  urgent: "bg-rose-50 text-danger"
};

export function TaskList({
  tasks,
  busyId,
  onDeleteTask,
  onTaskSaved
}: {
  tasks: Task[];
  busyId: string | null;
  onDeleteTask: (taskId: string) => void;
  onTaskSaved: (task: Task) => void;
}) {
  return (
    <div className="panel overflow-hidden">
      <div className="hidden grid-cols-[1.35fr_0.75fr_0.5fr_0.5fr_0.9fr_0.95fr] gap-4 border-b border-[var(--app-line)] bg-slate-50 px-6 py-4 text-xs font-black uppercase tracking-[0.12em] text-slate-500 sm:grid">
        <span>Task</span>
        <span>Date</span>
        <span>Start</span>
        <span>End</span>
        <span>Type</span>
        <span>Actions</span>
      </div>
      <div className="divide-y divide-[var(--app-line)]">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="grid gap-4 px-5 py-5 transition hover:bg-slate-50 sm:grid-cols-[1.35fr_0.75fr_0.5fr_0.5fr_0.9fr_0.95fr] sm:px-6"
          >
            <div>
              <p className="font-extrabold text-[var(--app-text)]">{task.title}</p>
              {task.description ? <p className="mt-1 text-sm text-slate-500">{task.description}</p> : null}
              <div className="mt-2 flex flex-wrap gap-2">
                <span className={`rounded-md px-2 py-1 text-[11px] font-black uppercase ${priorityClasses[task.priority]}`}>
                  {task.priority}
                </span>
                {task.label ? <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-black uppercase text-slate-600">{task.label}</span> : null}
                {task.reminderMinutes !== null ? (
                  <span className="rounded-md bg-indigo-50 px-2 py-1 text-[11px] font-black uppercase text-indigo-700">
                    {task.reminderMinutes === 0 ? "reminder at start" : `${task.reminderMinutes}m reminder`}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="text-sm text-slate-600">{format(task.date, "MMM d, yyyy")}</div>
            <div className="text-sm text-slate-600">{task.startTime}</div>
            <div className="text-sm text-slate-600">{task.endTime}</div>
            <div>
              <span
                className={`inline-flex rounded-md px-3 py-1 text-xs font-extrabold capitalize ${
                  task.isDaily
                    ? "bg-[rgba(83,74,183,0.10)] text-[var(--app-accent)]"
                    : "bg-[color-mix(in_srgb,var(--app-primary)_12%,white)] text-[var(--app-primary)]"
                }`}
              >
                {task.isDaily ? "daily" : "scheduled"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <TaskFormDialog
                mode="edit"
                onTaskSaved={onTaskSaved}
                initialValues={{
                  id: task.id,
                  title: task.title,
                  description: task.description ?? "",
                  startTime: task.startTime,
                  endTime: task.endTime,
                  isDaily: task.isDaily,
                  priority: task.priority,
                  label: task.label ?? "",
                  reminderMinutes: task.reminderMinutes
                }}
              />
              <Button variant="danger" disabled={busyId === task.id} onClick={() => onDeleteTask(task.id)} type="button">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
