"use client";

import type { Route } from "next";
import { startTransition, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavigationContextValue {
  isNavigating: boolean;
  navigate: (href: Route, options?: { replace?: boolean }) => void;
  startNavigation: (href?: string) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isNavigating) {
      return;
    }

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setIsNavigating(false);
      resetTimerRef.current = null;
    }, 260);
  }, [isNavigating, pathname]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  function startNavigation(href?: string) {
    if (href && href === pathname) {
      return;
    }

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    setIsNavigating(true);
    resetTimerRef.current = window.setTimeout(() => {
      setIsNavigating(false);
      resetTimerRef.current = null;
    }, 4000);
  }

  function navigate(href: Route, options: { replace?: boolean } = {}) {
    startNavigation(href);

    startTransition(() => {
      if (options.replace) {
        router.replace(href);
        return;
      }

      router.push(href);
    });
  }

  const value = useMemo(
    () => ({
      isNavigating,
      navigate,
      startNavigation
    }),
    [isNavigating, pathname]
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-0 z-[120] transition-opacity duration-300",
          isNavigating ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="absolute inset-x-0 top-0 h-1 overflow-hidden bg-transparent">
          <div
            className={cn(
              "h-full w-full origin-left bg-[linear-gradient(90deg,#D29A3A_0%,#173B42_52%,#D29A3A_100%)] transition-transform duration-500 ease-out",
              isNavigating ? "scale-x-100" : "scale-x-0"
            )}
          />
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              "absolute inset-y-0 -left-[42%] w-[55%] bg-[linear-gradient(120deg,rgba(210,154,58,0)_0%,rgba(210,154,58,0.14)_32%,rgba(23,59,66,0.16)_65%,rgba(23,59,66,0)_100%)] blur-3xl transition-transform duration-500 ease-out",
              isNavigating ? "translate-x-[210%]" : "translate-x-0"
            )}
          />
        </div>
      </div>
    </NavigationContext.Provider>
  );
}

export function useNavigationProgress() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigationProgress must be used inside NavigationProvider.");
  }

  return context;
}
