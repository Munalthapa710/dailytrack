import { PageTransitionShell } from "@/components/navigation/page-transition-shell";

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransitionShell>{children}</PageTransitionShell>;
}
