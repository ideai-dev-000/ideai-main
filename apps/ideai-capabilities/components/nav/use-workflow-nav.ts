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
import { useSession } from "@/lib/auth-client";
import {
  currentWorkflowIdAtom,
  currentWorkflowNameAtom,
} from "@/lib/workflow-store";
import type { NavMenuItem } from "./nav-item-with-menu";

export function useWorkflowNav() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentWorkflowId] = useAtom(currentWorkflowIdAtom);
  const [workflowName] = useAtom(currentWorkflowNameAtom);
  const [workflows, setWorkflows] = useState<NavMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is authenticated
  const isAuthenticated =
    session?.user &&
    session.user.name !== "Anonymous" &&
    !session.user.email?.startsWith("temp-");

  const loadWorkflows = useCallback(async () => {
    // Don't try to load if not authenticated
    if (!isAuthenticated) {
      setWorkflows([]);
      return;
    }

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
      // Don't clear workflows on error - keep existing ones
      // This prevents clearing the list if API temporarily fails
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load workflows once on mount and when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      loadWorkflows();
    } else {
      setWorkflows([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // Reload when auth status changes

  return {
    workflows,
    currentWorkflowId,
    currentWorkflowName: workflowName,
    loadWorkflows,
    isLoading,
    router,
  };
}
