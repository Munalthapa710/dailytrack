import { Task, TaskStatus } from "@prisma/client";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays
} from "date-fns";
import { withDbTimeout } from "@/lib/db-guard";
import { prisma } from "@/lib/prisma";
import { DailyBriefing, DailyBriefingItem, FilterKey } from "@/types";

function composeTaskDateTime(date: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const value = new Date(date);
  value.setHours(hours, minutes, 0, 0);
  return value;
}

function getMinutesBetween(startTime: string, endTime: string) {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);
  return Math.max((endHours * 60 + endMinutes) - (startHours * 60 + startMinutes), 0);
}

function rangesOverlap(startA: string, endA: string, startB: string, endB: string) {
  return startA < endB && startB < endA;
}

function isTaskMissed(task: Pick<Task, "date" | "endTime" | "status">, now: Date) {
  if (task.status === "completed") {
    return false;
  }
  return composeTaskDateTime(task.date, task.endTime) < now;
}

export async function syncMissedTasksForUser(userId: string) {
  const todayStart = startOfDay(new Date());
  await withDbTimeout(
    prisma.task.updateMany({
      where: {
        userId,
        isDaily: true,
        date: {
          lt: todayStart
        }
      },
      data: {
        date: todayStart,
        status: "pending",
        completedAt: null
      }
    })
  );

  const pendingTasks = await withDbTimeout(
    prisma.task.findMany({
      where: {
        userId,
        status: "pending"
      },
      select: {
        id: true,
        date: true,
        endTime: true,
        status: true
      }
    })
  );

  const now = new Date();
  const missedIds = pendingTasks.filter((task) => isTaskMissed(task, now)).map((task) => task.id);

  if (missedIds.length > 0) {
    // This keeps status aligned with the current clock without requiring a background job.
    await withDbTimeout(
      prisma.task.updateMany({
        where: {
          id: { in: missedIds }
        },
        data: {
          status: "missed"
        }
      })
    );
  }
}

function getFilterRange(filter: FilterKey, now: Date) {
  if (filter === "today") {
    return {
      start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      end: addDays(new Date(now.getFullYear(), now.getMonth(), now.getDate()), 1)
    };
  }

  if (filter === "week") {
    return {
      start: startOfWeek(now, { weekStartsOn: 1 }),
      end: addDays(endOfWeek(now, { weekStartsOn: 1 }), 1)
    };
  }

  if (filter === "month") {
    return {
      start: startOfMonth(now),
      end: addDays(endOfMonth(now), 1)
    };
  }

  return null;
}

export async function getTasksForUser(userId: string, filter: FilterKey = "all") {
  await syncMissedTasksForUser(userId);

  const now = new Date();
  const range = getFilterRange(filter, now);

  return withDbTimeout(
    prisma.task.findMany({
      where: {
        userId,
        ...(range
          ? {
              date: {
                gte: range.start,
                lt: range.end
              }
            }
          : {}),
        ...(["completed", "pending", "missed"].includes(filter) ? { status: filter as TaskStatus } : {})
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }]
    })
  );
}

export async function getChecklistTasksForUser(userId: string) {
  await syncMissedTasksForUser(userId);

  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);

  return withDbTimeout(
    prisma.task.findMany({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow
        }
      },
      orderBy: [{ status: "asc" }, { startTime: "asc" }]
    })
  );
}

export async function getDailyBriefingForUser(userId: string): Promise<DailyBriefing> {
  const tasks = await getChecklistTasksForUser(userId);
  const now = new Date();

  const items: DailyBriefingItem[] = tasks.map((task) => {
    const start = composeTaskDateTime(task.date, task.startTime);
    const end = composeTaskDateTime(task.date, task.endTime);
    const status = normalizeTaskStatus(task);

    let phase: DailyBriefingItem["phase"] = "later";
    if (status === "completed") {
      phase = "done";
    } else if (status === "missed") {
      phase = "missed";
    } else if (start <= now && now <= end) {
      phase = "now";
    } else if (start > now) {
      phase = "later";
    }

    return {
      id: task.id,
      title: task.title,
      description: task.description ?? null,
      startTime: task.startTime,
      endTime: task.endTime,
      status,
      isDaily: task.isDaily,
      phase
    };
  });

  const currentTask = items.find((item) => item.phase === "now") ?? null;
  const nextTask =
    currentTask ??
    items.find((item) => item.phase === "later" && item.status === "pending") ??
    null;

  const itemsWithNext: DailyBriefingItem[] = items.map((item) => {
    if (!currentTask && nextTask && item.id === nextTask.id && item.phase === "later") {
      return { ...item, phase: "up-next" };
    }

    return item;
  });

  const totalTasks = items.length;
  const completedTasks = items.filter((item) => item.status === "completed").length;
  const pendingTasks = items.filter((item) => item.status === "pending").length;
  const missedTasks = items.filter((item) => item.status === "missed").length;
  const scheduledMinutes = tasks.reduce((sum, task) => sum + getMinutesBetween(task.startTime, task.endTime), 0);
  const completedMinutes = tasks
    .filter((task) => normalizeTaskStatus(task) === "completed")
    .reduce((sum, task) => sum + getMinutesBetween(task.startTime, task.endTime), 0);

  return {
    dateLabel: format(now, "EEEE, MMMM d"),
    totalTasks,
    completedTasks,
    pendingTasks,
    missedTasks,
    completionRate: totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
    scheduledMinutes,
    completedMinutes,
    currentTask,
    nextTask: currentTask ? currentTask : nextTask,
    items: itemsWithNext
  };
}

function countStatuses(tasks: Task[]) {
  const completed = tasks.filter((task) => task.status === "completed").length;
  const pending = tasks.filter((task) => task.status === "pending").length;
  const missed = tasks.filter((task) => task.status === "missed").length;
  return {
    total: tasks.length,
    completed,
    pending,
    missed,
    completionRate: tasks.length === 0 ? 0 : (completed / tasks.length) * 100
  };
}

export async function getAnalyticsForUser(userId: string) {
  await syncMissedTasksForUser(userId);

  const allTasks = await withDbTimeout(
    prisma.task.findMany({
      where: { userId },
      orderBy: { date: "asc" }
    })
  );

  const now = new Date();
  const weeklyTasks = allTasks.filter((task) => task.date >= subDays(now, 6));
  const monthlyTasks = allTasks.filter((task) => task.date >= subDays(now, 34));
  const yearlyTasks = allTasks.filter((task) => task.date.getFullYear() === now.getFullYear());

  const weekly = Array.from({ length: 7 }, (_, index) => {
    const date = subDays(now, 6 - index);
    const matches = weeklyTasks.filter((task) => isSameDay(task.date, date));
    return {
      label: format(date, "EEE"),
      completed: matches.filter((task) => task.status === "completed").length,
      pending: matches.filter((task) => task.status === "pending").length,
      missed: matches.filter((task) => task.status === "missed").length
    };
  });

  const monthly = Array.from({ length: 5 }, (_, index) => {
    const rangeEnd = subDays(now, 28 - index * 7);
    const rangeStart = subDays(rangeEnd, 6);
    const matches = monthlyTasks.filter((task) => task.date >= rangeStart && task.date <= rangeEnd);
    return {
      label: `W${index + 1}`,
      completed: matches.filter((task) => task.status === "completed").length,
      pending: matches.filter((task) => task.status === "pending").length,
      missed: matches.filter((task) => task.status === "missed").length
    };
  });

  const yearly = Array.from({ length: 12 }, (_, index) => {
    const matches = yearlyTasks.filter((task) => task.date.getMonth() === index);
    return {
      label: format(new Date(now.getFullYear(), index, 1), "MMM"),
      completed: matches.filter((task) => task.status === "completed").length,
      pending: matches.filter((task) => task.status === "pending").length,
      missed: matches.filter((task) => task.status === "missed").length
    };
  });

  return {
    summary: countStatuses(allTasks),
    weekly,
    monthly,
    yearly
  };
}

export function normalizeTaskStatus(task: Pick<Task, "date" | "endTime" | "status">) {
  if (task.status === "completed") {
    return "completed";
  }

  return isTaskMissed(task, new Date()) ? "missed" : "pending";
}

export function parseTaskDate(date: string) {
  return parseISO(date);
}

export async function findTaskConflictsForUser({
  userId,
  date,
  startTime,
  endTime,
  excludeTaskId
}: {
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
  excludeTaskId?: string;
}) {
  const dayStart = startOfDay(date);
  const dayEnd = addDays(dayStart, 1);

  const sameDayTasks = await withDbTimeout(
    prisma.task.findMany({
      where: {
        userId,
        date: {
          gte: dayStart,
          lt: dayEnd
        },
        ...(excludeTaskId
          ? {
              id: {
                not: excludeTaskId
              }
            }
          : {})
      },
      orderBy: { startTime: "asc" },
      select: {
        id: true,
        title: true,
        startTime: true,
        endTime: true,
        status: true,
        isDaily: true
      }
    })
  );

  return sameDayTasks.filter((task) => rangesOverlap(startTime, endTime, task.startTime, task.endTime));
}
