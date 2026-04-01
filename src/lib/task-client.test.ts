import { describe, expect, it } from "vitest";
import type { Task } from "@prisma/client";
import { hydrateTask, resolveTaskStatus, sortTasksBySchedule, taskMatchesFilter, upsertTaskInList } from "@/lib/task-client";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task_1",
    title: "Deep work",
    description: null,
    date: new Date("2026-04-01T00:00:00.000Z"),
    startTime: "09:00",
    endTime: "10:00",
    isDaily: false,
    status: "pending",
    completedAt: null,
    createdAt: new Date("2026-04-01T00:00:00.000Z"),
    updatedAt: new Date("2026-04-01T00:00:00.000Z"),
    userId: "user_1",
    ...overrides
  };
}

describe("task client helpers", () => {
  it("hydrates ISO date strings into Date objects", () => {
    const task = hydrateTask({
      ...makeTask(),
      date: "2026-04-01T00:00:00.000Z",
      createdAt: "2026-04-01T00:00:00.000Z",
      updatedAt: "2026-04-01T00:00:00.000Z",
      completedAt: null
    });

    expect(task.date).toBeInstanceOf(Date);
    expect(task.createdAt).toBeInstanceOf(Date);
  });

  it("marks overdue pending tasks as missed", () => {
    const status = resolveTaskStatus(makeTask(), new Date("2026-04-01T12:00:00.000Z"));

    expect(status).toBe("missed");
  });

  it("matches date-based filters", () => {
    const task = makeTask({
      date: new Date("2026-04-01T08:00:00.000Z")
    });

    expect(taskMatchesFilter(task, "today", new Date("2026-04-01T12:00:00.000Z"))).toBe(true);
    expect(taskMatchesFilter(task, "month", new Date("2026-04-01T12:00:00.000Z"))).toBe(true);
  });

  it("sorts tasks by date then start time", () => {
    const sorted = sortTasksBySchedule([
      makeTask({ id: "late", startTime: "13:00" }),
      makeTask({ id: "early", startTime: "08:00" })
    ]);

    expect(sorted.map((task) => task.id)).toEqual(["early", "late"]);
  });

  it("removes a task from the filtered list when it no longer matches", () => {
    const tasks = [makeTask({ id: "task_1" })];
    const updated = upsertTaskInList(
      tasks,
      makeTask({ id: "task_1", status: "completed" }),
      "pending",
      new Date("2026-04-01T08:30:00.000Z")
    );

    expect(updated).toHaveLength(0);
  });
});
