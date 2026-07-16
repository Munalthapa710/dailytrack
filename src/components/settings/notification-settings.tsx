"use client";

import { Bell, BellOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const storageKey = "dailytrack.notifications.enabled";

export function NotificationSettings() {
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    setEnabled(localStorage.getItem(storageKey) === "true");
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  async function enable() {
    if (!("Notification" in window)) {
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    const nextEnabled = result === "granted";
    localStorage.setItem(storageKey, String(nextEnabled));
    setEnabled(nextEnabled);
  }

  function disable() {
    localStorage.setItem(storageKey, "false");
    setEnabled(false);
  }

  return (
    <section className="panel p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Notifications</p>
          <h2 className="mt-2 text-xl font-black text-[var(--app-text)]">Task Reminders</h2>
          <p className="mt-1 text-sm text-slate-500">
            Browser reminders use each task&apos;s reminder setting and only run while the app is open or installed.
          </p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Permission: {permission}</p>
        </div>
        {enabled ? (
          <Button type="button" variant="secondary" onClick={disable}>
            <BellOff className="mr-2 h-4 w-4" />
            Disable
          </Button>
        ) : (
          <Button type="button" onClick={enable}>
            <Bell className="mr-2 h-4 w-4" />
            Enable
          </Button>
        )}
      </div>
    </section>
  );
}
