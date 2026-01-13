/**
 * @fileoverview Client component to adjust main content padding based on side menu visibility
 *
 * @module ContentWrapper
 * @description
 * Wraps main content and adjusts left padding when side menu is hidden (landing page).
 */

"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { shouldShowSideMenu } from "@/lib/route-config";

interface ContentWrapperProps {
  children: ReactNode;
  className?: string;
}

export function ContentWrapper({ children, className }: ContentWrapperProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Check if user is authenticated
  const isAuthenticated =
    session?.user &&
    session.user.name !== "Anonymous" &&
    !session.user.email?.startsWith("temp-");

  // Show menu if authenticated and route config says so
  const showMenu = shouldShowSideMenu(pathname || "") && isAuthenticated;

  // On workflow pages, we don't want to block canvas clicks
  // The canvas is at z-0, so content wrapper should not interfere
  const isWorkflowPage =
    pathname === "/workflow" || pathname?.startsWith("/workflow/workflows/");

  return (
    <div
      className={cn(
        className,
        !showMenu && "md:pl-0",
        isWorkflowPage && "pointer-events-none",
      )}
      style={isWorkflowPage ? { pointerEvents: "none" } : undefined}
    >
      {/* Only re-enable pointer events for actual page content (not on workflow pages with canvas) */}
      {isWorkflowPage ? (
        // On workflow pages, children handle their own pointer events
        children
      ) : (
        // On other pages, wrap in pointer-events-auto
        <div className="pointer-events-auto">{children}</div>
      )}
    </div>
  );
}
