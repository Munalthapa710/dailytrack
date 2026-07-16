"use client";

import { useState } from "react";
import { useNavigationProgress } from "@/components/navigation/navigation-provider";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils";

export function LogoutButton({ compact = false, iconOnly = false }: { compact?: boolean; iconOnly?: boolean }) {
  const { navigate } = useNavigationProgress();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  async function handleLogout() {
    setLoading(true);
    const response = await fetch("/api/auth/logout", { method: "POST" });

    if (!response.ok) {
      showToast("Unable to sign out right now.");
      setLoading(false);
      return;
    }

    navigate("/login", { replace: true });
  }

  return (
    <Button className={cn(compact ? "icon-button !min-h-10 !w-10 !p-0" : "btn-secondary w-full")} variant="secondary" onClick={handleLogout} disabled={loading} aria-label="Logout">
      {compact || iconOnly ? <LogOut className="h-[18px] w-[18px]" /> : loading ? "Signing out..." : "Logout"}
    </Button>
  );
}
