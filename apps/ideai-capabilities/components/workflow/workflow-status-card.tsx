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
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Workflow Status
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            router.push("/");
          }}
          className="h-7 w-7 p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          title="Go to landing page"
        >
          <Home className="h-4 w-4" />
        </Button>
      </div>

      {/* Current Workflow Info */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Current Workflow
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
            {workflowName || "New Workflow"}
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium">
              {nodeCount} node{nodeCount !== 1 ? "s" : ""}
            </span>
            <span className="font-medium">
              {edgeCount} connection{edgeCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
