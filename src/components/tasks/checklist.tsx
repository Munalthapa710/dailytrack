"use client";

import type { Task } from "@prisma/client";
import { format } from "date-fns";
import { startTransition, useEffect, useState } from "react";
import { hydrateTask, type TaskPayload } from "@/lib/task-client";
import { useToast } from "@/components/ui/toast-provider";

const priorityClasses = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-[color-mix(in_srgb,var(--app-primary)_12%,white)] text-[var(--app-primary)]",
  high: "bg-amber-50 text-amber-700",
  urgent: "bg-rose-50 text-danger"
};

export function Checklist({ tasks }: { tasks: Task[] }) {
  const [items, setItems] = useState(tasks);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    setItems(tasks);
  }, [tasks]);

  async function updateStatus(task: Task, checked: boolean) {
    const previousItems = items;
    setBusyId(task.id);
    startTransition(() => {
      setItems((current) =>
        current.map((item) =>
          item.id === task.id
            ? {
                ...item,
                status: checked ? "completed" : "pending",
                completedAt: checked ? new Date() : null
              }
            : item
        )
      );
    });

    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: checked ? "completed" : "pending"
      })
    });

    if (!response.ok) {
      const payload = await response.json();
      showToast(payload.error ?? "Unable to update checklist item.");
      startTransition(() => {
        setItems(previousItems);
      });
    } else {
      const payload = (await response.json()) as { task: TaskPayload };
      const nextTask = hydrateTask(payload.task);
      startTransition(() => {
        setItems((current) => current.map((item) => (item.id === nextTask.id ? nextTask : item)));
      });
      showToast(checked ? "Task marked as completed." : "Task marked as pending.", "success");
    }

    setBusyId(null);
  }

  return (
    <div className="space-y-4">
      {items.map((task) => (
        <div
          key={task.id}
          className="page-panel flex items-start gap-4 transition hover:border-[var(--app-primary-muted)] hover:bg-[var(--app-primary-soft)]"
        >
          <input
            checked={task.status === "completed"}
            className="mt-1 h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
            disabled={busyId === task.id}
            onChange={(event) => updateStatus(task, event.target.checked)}
            type="checkbox"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-extrabold text-[var(--app-text)]">{task.title}</h3>
              <span className="rounded-md bg-[color-mix(in_srgb,var(--app-primary)_12%,white)] px-3 py-1 text-xs font-extrabold capitalize text-[var(--app-primary)]">{task.status}</span>
              <span className={`rounded-md px-3 py-1 text-xs font-extrabold capitalize ${priorityClasses[task.priority]}`}>{task.priority}</span>
              {task.label ? <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-600">{task.label}</span> : null}
              {task.isDaily ? <span className="rounded-md bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-700">daily reset</span> : null}
            </div>
            {task.description ? <p className="mt-2 text-sm text-slate-500">{task.description}</p> : null}
            <p className="mt-3 text-sm text-slate-600">
              {format(task.date, "MMM d, yyyy")} | {task.startTime} - {task.endTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
