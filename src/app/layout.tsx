import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ToastProvider } from "@/components/ui/toast-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "DailyRoutine",
  description: "Responsive task planner with analytics, authentication, and missed-task tracking."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
