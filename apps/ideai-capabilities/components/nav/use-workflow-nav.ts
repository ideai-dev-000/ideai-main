/**
 * @fileoverview Lightweight hook for workflow navigation
 *
 * @module useWorkflowNav
 * @description
 * Provides workflow list and current workflow info for navigation.
 * Lighter weight than full workflow state for header use.
 */

"use client";

import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import {
  currentWorkflowIdAtom,
  currentWorkflowNameAtom,
} from "@/lib/workflow-store";
import type { NavMenuItem } from "./nav-item-with-menu";

export function useWorkflowNav() {
  const router = useRouter();
  const [currentWorkflowId] = useAtom(currentWorkflowIdAtom);
  const [workflowName] = useAtom(currentWorkflowNameAtom);
  const [workflows, setWorkflows] = useState<NavMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadWorkflows = useCallback(async () => {
    setIsLoading(true);
    try {
      const allWorkflows = await api.workflow.getAll();
      const filtered = allWorkflows
        .filter((w) => w.name !== "__current__" && w.name !== "~~__CURRENT__~~")
        .map((w) => ({
          id: w.id,
          name: w.name,
          href: `/workflow/workflows/${w.id}`,
          updatedAt: w.updatedAt,
        }));
      setWorkflows(filtered);
    } catch (error) {
      console.error("Failed to load workflows:", error);
      setWorkflows([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load workflows on mount
  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  return {
    workflows,
    currentWorkflowId,
    currentWorkflowName: workflowName,
    loadWorkflows,
    isLoading,
    router,
  };
}
