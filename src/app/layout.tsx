import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { NavigationProvider } from "@/components/navigation/navigation-provider";
import { OfflineStatus } from "@/components/pwa/offline-status";
import { PWAInstallPrompt } from "@/components/pwa/pwa-install-prompt";
import { PWARegister } from "@/components/pwa/pwa-register";
import { ReminderCenter } from "@/components/pwa/reminder-center";
import { AppearanceProvider } from "@/components/theme/appearance-provider";
import { ToastProvider } from "@/components/ui/toast-provider";

export const metadata: Metadata = {
  title: "DailyRoutine",
  description: "Responsive task planner with analytics, authentication, and missed-task tracking.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DailyRoutine"
  }
};

export const viewport: Viewport = {
  themeColor: "#0f766e"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppearanceProvider>
          <NavigationProvider>
            <ToastProvider>
              {children}
              <PWARegister />
              <ReminderCenter />
              <PWAInstallPrompt />
              <OfflineStatus />
            </ToastProvider>
          </NavigationProvider>
        </AppearanceProvider>
      </body>
    </html>
  );
}
