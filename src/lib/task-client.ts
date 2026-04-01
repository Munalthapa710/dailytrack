import type { Task } from "@prisma/client";
import { addDays, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import type { FilterKey, TaskStatus } from "@/types";

type TaskPayloadDate = string | Date | null;

export type TaskPayload = Omit<Task, "date" | "createdAt" | "updatedAt" | "completedAt"> & {
  date: TaskPayloadDate;
  createdAt: TaskPayloadDate;
  updatedAt: TaskPayloadDate;
  completedAt: TaskPayloadDate;
};

function toDate(value: TaskPayloadDate) {
  if (!value) {
    return null;
  }

  return value instanceof Date ? value : new Date(value);
}

function composeTaskDateTime(date: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const value = new Date(date);
  value.setHours(hours, minutes, 0, 0);
  return value;
}

function getFilterRange(filter: FilterKey, now: Date) {
  if (filter === "today") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return {
      start,
      end: addDays(start, 1)
    };
  }

  if (filter === "week") {
    const start = startOfWeek(now, { weekStartsOn: 1 });
    return {
      start,
      end: addDays(endOfWeek(now, { weekStartsOn: 1 }), 1)
    };
  }

  if (filter === "month") {
    const start = startOfMonth(now);
    return {
      start,
      end: addDays(endOfMonth(now), 1)
    };
  }

  return null;
}

export function hydrateTask(task: TaskPayload): Task {
  return {
    ...task,
    date: toDate(task.date) ?? new Date(),
    createdAt: toDate(task.createdAt) ?? new Date(),
    updatedAt: toDate(task.updatedAt) ?? new Date(),
    completedAt: toDate(task.completedAt)
  };
}

export function resolveTaskStatus(task: Pick<Task, "date" | "endTime" | "status">, now = new Date()): TaskStatus {
  if (task.status === "completed") {
    return "completed";
  }

  return composeTaskDateTime(task.date, task.endTime) < now ? "missed" : "pending";
}

export function taskMatchesFilter(task: Task, filter: FilterKey, now = new Date()) {
  if (filter === "all") {
    return true;
  }

  if (filter === "completed" || filter === "pending" || filter === "missed") {
    return resolveTaskStatus(task, now) === filter;
  }

  const range = getFilterRange(filter, now);
  if (!range) {
    return true;
  }

  return task.date >= range.start && task.date < range.end;
}

export function sortTasksBySchedule(tasks: Task[]) {
  return [...tasks].sort((left, right) => {
    const dateDiff = left.date.getTime() - right.date.getTime();
    if (dateDiff !== 0) {
      return dateDiff;
    }

    return left.startTime.localeCompare(right.startTime);
  });
}

export function upsertTaskInList(tasks: Task[], task: Task, filter: FilterKey, now = new Date()) {
  const withoutTask = tasks.filter((current) => current.id !== task.id);

  if (!taskMatchesFilter(task, filter, now)) {
    return sortTasksBySchedule(withoutTask);
  }

  return sortTasksBySchedule([...withoutTask, task]);
}
