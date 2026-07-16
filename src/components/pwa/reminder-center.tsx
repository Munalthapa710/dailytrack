"use client";

import { useEffect } from "react";
import { hydrateTask, type TaskPayload } from "@/lib/task-client";

const enabledKey = "dailytrack.notifications.enabled";
const sentKey = "dailytrack.notifications.sent";

function readSent(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(sentKey) || "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

export function ReminderCenter() {
  useEffect(() => {
    if (!("Notification" in window)) {
      return;
    }

    async function checkReminders() {
      if (localStorage.getItem(enabledKey) !== "true" || Notification.permission !== "granted") {
        return;
      }

      const response = await fetch("/api/tasks?filter=today");
      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { tasks: TaskPayload[] };
      const tasks = payload.tasks.map(hydrateTask);
      const now = new Date();
      const sent = readSent();

      for (const task of tasks) {
        if (task.status !== "pending" || task.reminderMinutes === null) {
          continue;
        }

        const [hours, minutes] = task.startTime.split(":").map(Number);
        const start = new Date(task.date);
        start.setHours(hours, minutes, 0, 0);
        const remindAt = new Date(start.getTime() - task.reminderMinutes * 60_000);
        const key = `${task.id}:${task.date.toDateString()}:${task.reminderMinutes}`;

        if (!sent[key] && now >= remindAt && now <= start) {
          new Notification(task.title, {
            body: task.reminderMinutes === 0 ? "This task starts now." : `Starts in ${task.reminderMinutes} minutes.`,
            tag: key
          });
          sent[key] = new Date().toISOString();
        }
      }

      localStorage.setItem(sentKey, JSON.stringify(sent));
    }

    checkReminders();
    const timer = window.setInterval(checkReminders, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return null;
}
