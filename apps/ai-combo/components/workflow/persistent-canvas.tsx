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
    <div className="fixed top-16 inset-x-0 bottom-0 z-[15] pointer-events-none">
      {/* Canvas container - toolbar inside uses absolute positioning relative to this */}
      <div className="relative h-full w-full">
        <WorkflowCanvas />
      </div>
    </div>
  );
}
