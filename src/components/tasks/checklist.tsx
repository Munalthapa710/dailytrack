"use client";

import type { Task } from "@prisma/client";
import { format } from "date-fns";
import { startTransition, useEffect, useState } from "react";
import { hydrateTask, type TaskPayload } from "@/lib/task-client";
import { useToast } from "@/components/ui/toast-provider";

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
          className="panel flex items-start gap-4 p-5 transition hover:border-[rgba(23,59,66,0.18)] hover:bg-[rgba(255,252,247,0.98)]"
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
              <h3 className="text-base font-semibold text-ink">{task.title}</h3>
              <span className="rounded-full bg-[rgba(23,59,66,0.08)] px-3 py-1 text-xs font-semibold capitalize text-primary">{task.status}</span>
              {task.isDaily ? <span className="rounded-full bg-[rgba(210,154,58,0.14)] px-3 py-1 text-xs font-semibold text-[#9b6c1f]">daily reset</span> : null}
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
