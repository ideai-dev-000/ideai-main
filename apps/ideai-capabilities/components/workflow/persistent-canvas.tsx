/**
 * @fileoverview Persistent Canvas Component
 *
 * @module PersistentCanvas
 * @description
 * Persistent canvas that renders behind all content on workflow pages.
 * Uses standardized IdeaI canvas classes for consistent z-index behavior.
 *
 * Z-Index: Canvas sits at z-[0] (bottom layer), below header (z-[100])
 * and side menu (z-30), ensuring it never overlaps UI elements.
 */

"use client";

import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { WorkflowCanvas } from "./workflow-canvas";

export function PersistentCanvas() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Check if user is authenticated (not anonymous)
  const isAnonymous =
    !session?.user ||
    session.user.name === "Anonymous" ||
    session.user.email?.startsWith("temp-");

  // Show canvas on workflow pages, but only if user is authenticated
  // Don't show canvas on /workflows (landing page) - just show the card
  const showCanvas =
    !isAnonymous &&
    (pathname === "/workflow" || pathname.startsWith("/workflow/workflows/"));

  if (!showCanvas) {
    return null;
  }

  return (
    <div className="ideai-canvas--below-header">
      <div className="ideai-canvas-content">
        <WorkflowCanvas />
      </div>
    </div>
  );
}
