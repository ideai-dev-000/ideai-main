/**
 * @fileoverview Workflow Status Panel Component
 *
 * @module WorkflowStatusPanel
 * @description
 * A popover panel that shows workflow status information and provides
 * navigation to the landing page and other workflows.
 * Uses the same state management as WorkflowMenuComponent for consistency.
 */

"use client";

import { useAtom } from "jotai";
import { Check, Home, WorkflowIcon, ChevronDown, Info } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  currentWorkflowIdAtom,
  currentWorkflowNameAtom,
  edgesAtom,
  nodesAtom,
} from "@/lib/workflow-store";

// Import types from workflow-toolbar (these are internal functions, so we'll define compatible types)
type WorkflowState = {
  nodes: any[];
  edges: any[];
  currentWorkflowId: string | null;
  workflowName: string;
  allWorkflows: Array<{
    id: string;
    name: string;
    updatedAt: string;
  }>;
  router: any;
};

type WorkflowActions = {
  loadWorkflows: () => Promise<void>;
};

type WorkflowStatusPanelProps = {
  workflowId?: string;
  state: WorkflowState;
  actions: WorkflowActions;
};

export function WorkflowStatusPanel({
  workflowId,
  state,
  actions,
}: WorkflowStatusPanelProps) {
  const [nodes] = useAtom(nodesAtom);
  const [edges] = useAtom(edgesAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Load workflows when popover opens
  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (open) {
        actions.loadWorkflows();
      }
    },
    [actions],
  );

  // Count real nodes (excluding "add" placeholder)
  const realNodes = nodes.filter((node) => node.type !== "add");
  const nodeCount = realNodes.length;
  const edgeCount = edges.length;

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="pointer-events-auto"
          title="Workflow status and navigation"
        >
          <Info className="h-4 w-4" />
          <span className="hidden sm:inline">Status</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 pointer-events-auto" align="start">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Workflow Status</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                state.router.push("/");
                setIsOpen(false);
              }}
              className="h-7 text-xs"
            >
              <Home className="h-3 w-3 mr-1" />
              Landing
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
              <p className="font-medium text-sm">
                {state.workflowName || "New Workflow"}
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

          {/* Workflow Menu */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                All Workflows
              </span>
            </div>
            <div className="flex h-9 max-w-full items-center overflow-hidden rounded-md border bg-secondary text-secondary-foreground">
              <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger className="flex h-full w-full cursor-pointer items-center gap-2 px-3 font-medium text-sm transition-all hover:bg-black/5 dark:hover:bg-white/5">
                  <WorkflowIcon className="size-4 shrink-0" />
                  <p className="truncate font-medium text-sm">
                    {workflowId ? (
                      state.workflowName || "Current Workflow"
                    ) : (
                      <>
                        <span className="sm:hidden">New</span>
                        <span className="hidden sm:inline">New Workflow</span>
                      </>
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
                      {!workflowId && <Check className="size-4 shrink-0" />}
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {state.allWorkflows.length === 0 ? (
                    <DropdownMenuItem disabled>
                      No workflows found
                    </DropdownMenuItem>
                  ) : (
                    state.allWorkflows
                      .filter(
                        (w) =>
                          w.name !== "__current__" &&
                          w.name !== "~~__CURRENT__~~",
                      )
                      .map((workflow) => (
                        <DropdownMenuItem
                          className="flex items-center justify-between"
                          key={workflow.id}
                          onClick={() => {
                            state.router.push(
                              `/workflow/workflows/${workflow.id}`,
                            );
                            setIsOpen(false);
                            setMenuOpen(false);
                          }}
                        >
                          <span className="truncate">{workflow.name}</span>
                          {workflow.id === state.currentWorkflowId && (
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
      </PopoverContent>
    </Popover>
  );
}
