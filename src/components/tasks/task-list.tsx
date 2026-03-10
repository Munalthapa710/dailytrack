"use client";

import type { Task } from "@prisma/client";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { Button } from "@/components/ui/button";

export function TaskList({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  async function deleteTask(taskId: string) {
    setBusyId(taskId);
    setActionError("");
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const payload = await response.json();
      setActionError(payload.error ?? "Unable to delete task.");
    }

    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {actionError ? <div className="border-b border-danger/20 bg-danger/5 px-6 py-4 text-sm text-danger">{actionError}</div> : null}
      <div className="hidden grid-cols-[1.5fr_0.85fr_0.55fr_0.55fr_0.8fr_1fr] gap-4 border-b border-slate-200/70 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:grid">
        <span>Task</span>
        <span>Date</span>
        <span>Start</span>
        <span>End</span>
        <span>Type</span>
        <span>Actions</span>
      </div>
      <div className="divide-y divide-slate-100/90">
        {tasks.map((task) => (
          <div key={task.id} className="grid gap-4 px-5 py-5 transition hover:bg-slate-50 sm:grid-cols-[1.5fr_0.85fr_0.55fr_0.55fr_0.8fr_1fr] sm:px-6">
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
                  task.isDaily ? "bg-accent/15 text-accent" : "bg-slate-100 text-slate-700"
                }`}
              >
                {task.isDaily ? "daily" : "scheduled"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <TaskFormDialog
                mode="edit"
                initialValues={{
                  id: task.id,
                  title: task.title,
                  description: task.description ?? "",
                  date: format(task.date, "yyyy-MM-dd"),
                  startTime: task.startTime,
                  endTime: task.endTime,
                  isDaily: task.isDaily
                }}
              />
              <Button variant="danger" disabled={busyId === task.id} onClick={() => deleteTask(task.id)} type="button">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
