"use client";

import type { Task, TaskStatus } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { hydrateTask, type TaskPayload } from "@/lib/task-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";

interface TaskFormValues {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isDaily: boolean;
}

interface TaskConflict {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: TaskStatus;
  isDaily: boolean;
}

interface TaskFormDialogProps {
  mode: "create" | "edit";
  initialValues?: Partial<TaskFormValues> & { id?: string };
  onTaskSaved?: (task: Task) => void;
}

export function TaskFormDialog({ mode, initialValues, onTaskSaved }: TaskFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [conflicts, setConflicts] = useState<TaskConflict[]>([]);
  const { showToast } = useToast();
  const baseValues: TaskFormValues = {
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    isDaily: false,
    ...initialValues
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormValues>({
    defaultValues: baseValues
  });

  async function onSubmit(values: TaskFormValues) {
    setConflicts([]);
    const response = await fetch(mode === "create" ? "/api/tasks" : `/api/tasks/${initialValues?.id}`, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const payload = await response.json();
    if (!response.ok) {
      if (response.status === 409 && Array.isArray(payload.conflicts)) {
        setConflicts(payload.conflicts);
      }
      showToast(payload.error ?? "Unable to save task.");
      return;
    }

    const savedTask = hydrateTask((payload as { task: TaskPayload }).task);
    showToast(mode === "create" ? "Task created successfully." : "Task updated successfully.", "success");
    setOpen(false);
    setConflicts([]);
    reset();
    onTaskSaved?.(savedTask);
  }

  return (
    <>
      <Button
        variant={mode === "create" ? "primary" : "ghost"}
        onClick={() => {
          setConflicts([]);
          reset(baseValues);
          setOpen(true);
        }}
        type="button"
      >
        {mode === "create" ? "Add task" : "Edit"}
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(17,30,38,0.38)] p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-2xl rounded-[32px] border border-[rgba(23,59,66,0.12)] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(249,241,228,0.94))] p-6 shadow-[0_28px_80px_rgba(20,33,52,0.24)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Task editor</p>
                <h3 className="title-display mt-3 text-4xl">{mode === "create" ? "Create task" : "Edit task"}</h3>
              </div>
              <button
                className="rounded-2xl bg-[rgba(255,252,247,0.78)] px-4 py-2 text-sm font-medium text-slate-500 ring-1 ring-[rgba(23,59,66,0.12)] transition hover:bg-white hover:text-primary"
                onClick={() => {
                  setConflicts([]);
                  setOpen(false);
                }}
                type="button"
              >
                Close
              </button>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {conflicts.length > 0 ? (
                <div className="rounded-[24px] border border-[rgba(210,154,58,0.24)] bg-[rgba(255,243,222,0.92)] px-4 py-4 text-sm text-[#946316]">
                  <p className="font-semibold">That time slot is already occupied.</p>
                  <div className="mt-2 space-y-1">
                    {conflicts.map((conflict) => (
                      <p key={conflict.id}>
                        {conflict.startTime}-{conflict.endTime} {conflict.title}
                        {conflict.isDaily ? " (daily)" : ""}
                      </p>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Task title</label>
                <Input className="h-12" placeholder="Prepare client presentation" {...register("title", { required: "Title is required." })} />
                {errors.title ? <p className="rounded-xl bg-danger/8 px-3 py-2 text-sm text-danger">{errors.title.message}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Description</label>
                <Textarea placeholder="Add notes, outcomes, or context for this task." {...register("description")} />
              </div>
              <div className="inset-panel p-4">
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Schedule</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Start time</label>
                    <Input className="h-12" type="time" {...register("startTime", { required: "Start time is required." })} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">End time</label>
                    <Input className="h-12" type="time" {...register("endTime", { required: "End time is required." })} />
                  </div>
                </div>
              </div>
              <label className="inset-panel flex items-center gap-3 px-4 py-4 text-sm text-slate-700">
                <input className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" {...register("isDaily")} />
                <span>
                  <span className="block font-semibold text-ink">Repeat this task every day</span>
                  <span className="block text-xs text-slate-500">Resets to pending on the next day</span>
                </span>
              </label>
              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setConflicts([]);
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button className="min-w-[148px]" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : mode === "create" ? "Create task" : "Save changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
