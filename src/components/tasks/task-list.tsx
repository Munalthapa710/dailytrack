"use client";

import type { Task } from "@prisma/client";
import { format } from "date-fns";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { Button } from "@/components/ui/button";

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
      <div className="hidden grid-cols-[1.5fr_0.85fr_0.55fr_0.55fr_0.8fr_1fr] gap-4 border-b border-[var(--app-line)] bg-slate-50 px-6 py-4 text-xs font-black uppercase tracking-[0.12em] text-slate-500 sm:grid">
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
            className="grid gap-4 px-5 py-5 transition hover:bg-slate-50 sm:grid-cols-[1.5fr_0.85fr_0.55fr_0.55fr_0.8fr_1fr] sm:px-6"
          >
            <div>
              <p className="font-extrabold text-[var(--app-text)]">{task.title}</p>
              {task.description ? <p className="mt-1 text-sm text-slate-500">{task.description}</p> : null}
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
                  isDaily: task.isDaily
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
