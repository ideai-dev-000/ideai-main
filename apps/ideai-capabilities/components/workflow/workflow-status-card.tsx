/**
 * @fileoverview Workflow Status Card Component for Sidebar
 *
 * @module WorkflowStatusCard
 * @description
 * Status card that shows workflow status information at the top of the sidebar.
 * Uses the same code/logs as WorkflowStatusPanel for consistency.
 */

"use client";

import { useAtom } from "jotai";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  currentWorkflowIdAtom,
  currentWorkflowNameAtom,
  edgesAtom,
  nodesAtom,
} from "@/lib/workflow-store";
import { useRouter } from "next/navigation";

/**
 * Workflow Status Card - displays at top of sidebar
 * Shows current workflow info and provides workflow navigation
 */
export function WorkflowStatusCard() {
  const router = useRouter();
  const [nodes] = useAtom(nodesAtom);
  const [edges] = useAtom(edgesAtom);
  const [workflowName] = useAtom(currentWorkflowNameAtom);

  // Count real nodes (excluding "add" placeholder)
  const realNodes = nodes.filter((node) => node.type !== "add");
  const nodeCount = realNodes.length;
  const edgeCount = edges.length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="font-semibold text-sm">Workflow Status</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            router.push("/");
          }}
          className="h-7 text-xs"
          title="Go to landing page"
        >
          <Home className="h-3 w-3" />
        </Button>
      </div>

      {/* Current Workflow Info */}
      <div className="space-y-2 rounded-md border bg-muted/50 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Current Workflow
          </span>
        </div>
        <div className="space-y-1">
          <p className="font-medium text-sm truncate">
            {workflowName || "New Workflow"}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              {nodeCount} node{nodeCount !== 1 ? "s" : ""}
            </span>
            <span>
              {edgeCount} connection{edgeCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
