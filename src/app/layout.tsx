import type { Metadata } from "next";
import "@/app/globals.css";
import { NavigationProvider } from "@/components/navigation/navigation-provider";
import { ToastProvider } from "@/components/ui/toast-provider";

export const metadata: Metadata = {
  title: "DailyRoutine",
  description: "Responsive task planner with analytics, authentication, and missed-task tracking."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <NavigationProvider>
          <ToastProvider>{children}</ToastProvider>
        </NavigationProvider>
      </body>
    </html>
  );
}
