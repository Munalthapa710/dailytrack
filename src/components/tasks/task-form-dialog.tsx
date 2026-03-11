"use client";

import type { TaskStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast-provider";

interface TaskFormValues {
  title: string;
  description?: string;
  date?: string;
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
}

export function TaskFormDialog({ mode, initialValues }: TaskFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [conflicts, setConflicts] = useState<TaskConflict[]>([]);
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormValues>({
    defaultValues: {
      date: "",
      isDaily: false,
      ...initialValues
    }
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

    showToast(mode === "create" ? "Task created successfully." : "Task updated successfully.", "success");
    setOpen(false);
    setConflicts([]);
    reset();
    router.refresh();
  }

  return (
    <>
      <Button
        variant={mode === "create" ? "primary" : "ghost"}
        onClick={() => {
          setConflicts([]);
          setOpen(true);
        }}
        type="button"
      >
        {mode === "create" ? "Add task" : "Edit"}
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/35 p-4 sm:items-center">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Task editor</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{mode === "create" ? "Create task" : "Edit task"}</h3>
              </div>
              <button className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-200" onClick={() => setOpen(false)} type="button">
                Close
              </button>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {conflicts.length > 0 ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
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
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Schedule</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Date</label>
                      <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-slate-400">Optional</span>
                    </div>
                    <Input className="h-12" type="date" {...register("date")} />
                    <p className="text-xs text-slate-500">Leave blank to use today.</p>
                  </div>
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
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
                <input className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" {...register("isDaily")} />
                <span>
                  <span className="block font-semibold text-ink">Repeat this task every day</span>
                  <span className="block text-xs text-slate-500">Resets to pending on the next day</span>
                </span>
              </label>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
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
