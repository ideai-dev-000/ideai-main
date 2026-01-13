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
  const showCanvas =
    !isAnonymous &&
    (pathname === "/workflow" || pathname.startsWith("/workflow/workflows/"));

  if (!showCanvas) {
    return null;
  }

  return (
    <div className="ideai-canvas">
      <div className="ideai-canvas-content">
        <WorkflowCanvas />
      </div>
    </div>
  );
}
