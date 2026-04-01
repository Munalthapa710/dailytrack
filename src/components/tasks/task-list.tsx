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
      <div className="hidden grid-cols-[1.5fr_0.85fr_0.55fr_0.55fr_0.8fr_1fr] gap-4 border-b border-[rgba(23,59,66,0.1)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:grid">
        <span>Task</span>
        <span>Date</span>
        <span>Start</span>
        <span>End</span>
        <span>Type</span>
        <span>Actions</span>
      </div>
      <div className="divide-y divide-[rgba(23,59,66,0.08)]">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="grid gap-4 px-5 py-5 transition hover:bg-[rgba(250,242,228,0.56)] sm:grid-cols-[1.5fr_0.85fr_0.55fr_0.55fr_0.8fr_1fr] sm:px-6"
          >
            <div>
              <p className="font-semibold text-ink">{task.title}</p>
              {task.description ? <p className="mt-1 text-sm text-slate-500">{task.description}</p> : null}
            </div>
            <div className="text-sm text-slate-600">{format(task.date, "MMM d, yyyy")}</div>
            <div className="text-sm text-slate-600">{task.startTime}</div>
            <div className="text-sm text-slate-600">{task.endTime}</div>
            <div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  task.isDaily
                    ? "bg-[rgba(124,199,238,0.16)] text-[#2b7091]"
                    : "bg-[rgba(23,59,66,0.08)] text-primary"
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
