/**
 * @fileoverview Workflow List Control Component
 *
 * @module WorkflowListControl
 * @description
 * Workflow list component for use in IdeAIControlMenu sections.
 * Displays workflows with clone, delete, and clear actions.
 */

"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Workflow, Copy, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@repo/ui";
import type { WorkflowItem } from "@repo/ui";

interface WorkflowListControlProps {
  workflows: WorkflowItem[];
  currentWorkflowId?: string | null;
  onCloneWorkflow?: (
    workflowId: string,
    workflowName: string,
  ) => void | Promise<void>;
  onDeleteWorkflow?: (
    workflowId: string,
    workflowName: string,
  ) => void | Promise<void>;
  onClearWorkflow?: () => void | Promise<void>;
  className?: string;
}

export function WorkflowListControl({
  workflows,
  currentWorkflowId,
  onCloneWorkflow,
  onDeleteWorkflow,
  onClearWorkflow,
  className,
}: WorkflowListControlProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [cloningId, setCloningId] = useState<string | null>(null);

  const workflowItems = useMemo(() => {
    return workflows.map((workflow) => ({
      ...workflow,
      isActive: currentWorkflowId === workflow.id,
    }));
  }, [workflows, currentWorkflowId]);

  const handleClone = async (workflowId: string, workflowName: string) => {
    if (onCloneWorkflow) {
      setCloningId(workflowId);
      try {
        await onCloneWorkflow(workflowId, workflowName);
      } finally {
        setCloningId(null);
      }
    }
  };

  const handleDelete = async (workflowId: string, workflowName: string) => {
    if (onDeleteWorkflow) {
      setDeletingId(workflowId);
      try {
        await onDeleteWorkflow(workflowId, workflowName);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleClick = (href: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("lastActiveWorkflowId");
    }
    router.push(href);
  };

  if (workflowItems.length === 0) {
    return (
      <div
        className={cn(
          "text-sm text-slate-500 dark:text-slate-400 py-4",
          className,
        )}
      >
        No workflows found
      </div>
    );
  }

  return (
    <ul className={cn("space-y-1", className)}>
      {workflowItems.map((workflow) => (
        <li key={workflow.id}>
          <div className="group flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleClick(workflow.href)}
              className={cn(
                "flex-1 text-left px-3 py-2 rounded-md text-sm",
                "hover:bg-slate-100 dark:hover:bg-slate-800",
                "transition-colors",
                workflow.isActive &&
                  "bg-slate-100 dark:bg-slate-800 font-medium",
              )}
            >
              <div className="flex items-center gap-2">
                <Workflow className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
                <span className="truncate">{workflow.name}</span>
              </div>
              {workflow.updatedAt && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-6">
                  {new Date(workflow.updatedAt).toLocaleDateString()}
                </div>
              )}
            </button>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onCloneWorkflow && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleClone(workflow.id, workflow.name)}
                  disabled={cloningId === workflow.id}
                  aria-label="Clone workflow"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
              {onClearWorkflow && workflow.isActive && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onClearWorkflow()}
                  aria-label="Clear workflow"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {onDeleteWorkflow && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(workflow.id, workflow.name)}
                  disabled={deletingId === workflow.id}
                  aria-label="Delete workflow"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
