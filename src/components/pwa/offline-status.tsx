"use client";

import { CalendarPlus2, CheckSquare, CloudOff, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { TransitionLink } from "@/components/navigation/transition-link";

export function OfflineStatus() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(navigator.onLine === false);

    const onOffline = () => setOffline(true);
    const onOnline = () => setOffline(false);

    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  if (!offline) {
    return null;
  }

  return (
    <aside aria-live="polite" className="offline-status" role="status">
      <div className="offline-status-icon">
        <CloudOff size={19} />
      </div>
      <div className="offline-status-copy">
        <strong>Offline mode</strong>
        <span>Cached screens are available. Live task changes need a connection.</span>
      </div>
      <nav aria-label="Offline shortcuts" className="offline-status-actions">
        <TransitionLink aria-label="Dashboard" href="/dashboard">
          <LayoutDashboard size={17} />
        </TransitionLink>
        <TransitionLink aria-label="Tasks" href="/tasks">
          <CalendarPlus2 size={17} />
        </TransitionLink>
        <TransitionLink aria-label="Checklist" href="/checklist">
          <CheckSquare size={17} />
        </TransitionLink>
      </nav>
    </aside>
  );
}
