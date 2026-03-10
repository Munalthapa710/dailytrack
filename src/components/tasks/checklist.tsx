"use client";

import type { Task } from "@prisma/client";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/toast-provider";

export function Checklist({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const { showToast } = useToast();

  async function updateStatus(task: Task, checked: boolean) {
    setBusyId(task.id);

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
    } else {
      showToast(checked ? "Task marked as completed." : "Task marked as pending.", "success");
    }

    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
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
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">{task.status}</span>
              {task.isDaily ? <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">daily reset</span> : null}
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
