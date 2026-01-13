/**
 * @fileoverview Client component to adjust main content padding based on side menu visibility
 *
 * @module ContentWrapper
 * @description
 * Wraps main content and adjusts left padding when side menu is hidden (landing page).
 */

"use client";

import { type ReactNode } from "react";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface ContentWrapperProps {
  children: ReactNode;
  className?: string;
}

export function ContentWrapper({ children, className }: ContentWrapperProps) {
  const { data: session } = useSession();

  // Check if user is authenticated
  const isAuthenticated =
    session?.user &&
    session.user.name !== "Anonymous" &&
    !session.user.email?.startsWith("temp-");

  // Show menu if authenticated (including on landing page for workflow access)
  const showMenu = isAuthenticated;

  return (
    <div className={cn(className, !showMenu && "md:pl-0")}>{children}</div>
  );
}
