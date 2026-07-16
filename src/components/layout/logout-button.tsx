"use client";

import { useState } from "react";
import { useNavigationProgress } from "@/components/navigation/navigation-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-provider";

export function LogoutButton() {
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
    <Button className="min-w-[104px] lg:flex-1" variant="secondary" onClick={handleLogout} disabled={loading}>
      {loading ? "Signing out..." : "Logout"}
    </Button>
  );
}
