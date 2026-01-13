/**
 * @fileoverview Client component to conditionally render side menu based on route
 *
 * @module LayoutClient
 * @description
 * Client component wrapper that checks the current route and conditionally
 * shows/hides the side menu. Hides menu on landing page.
 */

"use client";

import { type ReactNode } from "react";
import { useSession } from "@/lib/auth-client";

interface LayoutClientProps {
  children: ReactNode;
}

export function LayoutClient({ children }: LayoutClientProps) {
  const { data: session } = useSession();

  // Check if user is authenticated
  const isAuthenticated =
    session?.user &&
    session.user.name !== "Anonymous" &&
    !session.user.email?.startsWith("temp-");

  // Show menu if authenticated (including on landing page for workflow access)
  const showMenu = isAuthenticated;

  // Conditionally render side menu
  if (!showMenu) {
    return null;
  }

  return <>{children}</>;
}
