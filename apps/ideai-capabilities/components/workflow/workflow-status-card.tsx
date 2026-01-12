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
import { Check, Home, WorkflowIcon, ChevronDown, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  currentWorkflowIdAtom,
  currentWorkflowNameAtom,
  edgesAtom,
  nodesAtom,
} from "@/lib/workflow-store";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";

/**
 * Workflow Status Card - displays at top of sidebar
 * Shows current workflow info and provides workflow navigation
 */
export function WorkflowStatusCard() {
  const router = useRouter();
  const [nodes] = useAtom(nodesAtom);
  const [edges] = useAtom(edgesAtom);
  const [currentWorkflowId] = useAtom(currentWorkflowIdAtom);
  const [workflowName] = useAtom(currentWorkflowNameAtom);
  const [menuOpen, setMenuOpen] = useState(false);
  const [allWorkflows, setAllWorkflows] = useState<
    Array<{
      id: string;
      name: string;
      updatedAt: string;
    }>
  >([]);

  // Load workflows function (same as status panel)
  const loadWorkflows = useCallback(async () => {
    try {
      console.log("[WorkflowStatusCard] Loading workflows...");
      const workflows = await api.workflow.getAll();
      // Filter out auto-save workflows (same as status panel)
      const filtered = workflows.filter(
        (w) => w.name !== "__current__" && w.name !== "~~__CURRENT__~~",
      );
      console.log(
        `[WorkflowStatusCard] ✅ Loaded ${filtered.length} workflows (filtered from ${workflows.length} total)`,
      );
      setAllWorkflows(filtered);
    } catch (error) {
      console.error("[WorkflowStatusCard] Failed to load workflows:", error);
    }
  }, []);

  // Load workflows on mount
  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  // Count real nodes (excluding "add" placeholder)
  const realNodes = nodes.filter((node) => node.type !== "add");
  const nodeCount = realNodes.length;
  const edgeCount = edges.length;

  return (
    <div className="space-y-3 border-b border-slate-200 pb-3 dark:border-slate-700">
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

      {/* Workflow Navigation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium text-muted-foreground">
            Switch Workflow
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadWorkflows}
            className="h-6 w-6 p-0"
            title="Reload workflows"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
        <div className="flex h-9 max-w-full items-center overflow-hidden rounded-md border bg-secondary text-secondary-foreground">
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger className="flex h-full w-full cursor-pointer items-center gap-2 px-3 font-medium text-sm transition-all hover:bg-black/5 dark:hover:bg-white/5">
              <WorkflowIcon className="size-4 shrink-0" />
              <p className="truncate font-medium text-sm">
                {currentWorkflowId ? (
                  workflowName || "Current Workflow"
                ) : (
                  "New Workflow"
                )}
              </p>
              <ChevronDown className="ml-auto size-3 shrink-0 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuItem
                asChild
                className="flex items-center justify-between"
              >
                <a href="/workflow">
                  New Workflow{" "}
                  {!currentWorkflowId && <Check className="size-4 shrink-0" />}
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {allWorkflows.length === 0 ? (
                <DropdownMenuItem disabled>
                  No workflows found
                </DropdownMenuItem>
              ) : (
                allWorkflows.map((workflow) => (
                  <DropdownMenuItem
                    className="flex items-center justify-between"
                    key={workflow.id}
                    onClick={() => {
                      router.push(`/workflow/workflows/${workflow.id}`);
                      setMenuOpen(false);
                    }}
                  >
                    <span className="truncate">{workflow.name}</span>
                    {workflow.id === currentWorkflowId && (
                      <Check className="size-4 shrink-0" />
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
