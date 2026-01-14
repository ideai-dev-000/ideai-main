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
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { shouldShowSideMenu } from "@/lib/route-config";

interface LayoutClientProps {
  children: ReactNode;
}

export function LayoutClient({ children }: LayoutClientProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Check if user is authenticated
  const isAuthenticated =
    session?.user &&
    session.user.name !== "Anonymous" &&
    !session.user.email?.startsWith("temp-");

  // Show menu only if authenticated AND route config says to show it
  // Only vibe and workflow routes should show the sidebar
  const showMenu = isAuthenticated && shouldShowSideMenu(pathname);

  // Conditionally render side menu
  if (!showMenu) {
    return null;
  }

  return <>{children}</>;
}
