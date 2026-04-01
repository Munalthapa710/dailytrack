"use client";

import type { Task } from "@prisma/client";
import { startTransition, useEffect, useState } from "react";
import type { FilterKey } from "@/types";
import { sortTasksBySchedule, upsertTaskInList } from "@/lib/task-client";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/tasks/filter-bar";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { TaskList } from "@/components/tasks/task-list";
import { useToast } from "@/components/ui/toast-provider";

export function TasksWorkspace({ initialTasks, filter }: { initialTasks: Task[]; filter: FilterKey }) {
  const [tasks, setTasks] = useState(() => sortTasksBySchedule(initialTasks));
  const [busyId, setBusyId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    setTasks(sortTasksBySchedule(initialTasks));
  }, [initialTasks]);

  function handleTaskSaved(task: Task) {
    startTransition(() => {
      setTasks((current) => upsertTaskInList(current, task, filter));
    });
  }

  async function handleDeleteTask(taskId: string) {
    const previousTasks = tasks;
    startTransition(() => {
      setTasks((current) => current.filter((task) => task.id !== taskId));
    });
    setBusyId(taskId);

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const payload = await response.json();
      showToast(payload.error ?? "Unable to delete task.");
      startTransition(() => {
        setTasks(previousTasks);
      });
    } else {
      showToast("Task deleted successfully.", "success");
    }

    setBusyId(null);
  }

  return (
    <div className="space-y-6">
      <div className="panel flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="eyebrow">Tasks</p>
          <h2 className="title-display mt-3 text-4xl">Add and manage tasks</h2>
        </div>
        <TaskFormDialog mode="create" onTaskSaved={handleTaskSaved} />
      </div>

      <FilterBar />

      {tasks.length === 0 ? (
        <EmptyState title="No tasks found" description="Create a task or switch filters to see your scheduled work." />
      ) : (
        <TaskList tasks={tasks} busyId={busyId} onDeleteTask={handleDeleteTask} onTaskSaved={handleTaskSaved} />
      )}
    </div>
  );
}
