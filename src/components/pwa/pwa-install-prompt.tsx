"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const dismissedKey = "dailytrack.install.dismissed";

function isStandalone() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function PWAInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(dismissedKey) === "true");
    setInstalled(isStandalone());
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));

    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    }

    function onInstalled() {
      setPromptEvent(null);
      setInstalled(true);
      localStorage.setItem(dismissedKey, "true");
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    localStorage.setItem(dismissedKey, "true");
    setDismissed(true);
  }

  async function install() {
    if (!promptEvent) {
      return;
    }

    await promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
    dismiss();
  }

  if ((!promptEvent && !isIos) || dismissed || installed) {
    return null;
  }

  return (
    <div className="pwa-install-prompt" role="status">
      <div>
        <strong>Install DailyRoutine</strong>
        <span>Open your planner faster from this device.</span>
      </div>
      {promptEvent ? (
        <button className="pwa-install-action" onClick={install} type="button">
          <Download size={16} />
          Install
        </button>
      ) : (
        <span className="max-w-[150px] text-xs font-bold text-slate-500">Use Share, then Add to Home Screen.</span>
      )}
      <button aria-label="Dismiss install prompt" className="pwa-install-close" onClick={dismiss} type="button">
        <X size={16} />
      </button>
    </div>
  );
}
