"use client";

import Link from "next/link";
import * as React from "react";
import { useNavigationProgress } from "@/components/navigation/navigation-provider";

type TransitionLinkProps = React.ComponentProps<typeof Link>;

export function TransitionLink({ href, onClick, ...props }: TransitionLinkProps) {
  const { startNavigation } = useNavigationProgress();

  return (
    <Link
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);

        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        startNavigation(typeof href === "string" ? href : undefined);
      }}
    />
  );
}
