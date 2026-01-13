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
import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import {
  currentWorkflowIdAtom,
  currentWorkflowNameAtom,
} from "@/lib/workflow-store";
import type { NavMenuItem } from "./nav-item-with-menu";

export function useWorkflowNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [currentWorkflowId] = useAtom(currentWorkflowIdAtom);
  const [workflowName] = useAtom(currentWorkflowNameAtom);
  const [workflowListReloadTrigger] = useAtom(workflowListReloadTriggerAtom);
  const [workflows, setWorkflows] = useState<NavMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const prevWorkflowIdRef = useRef<string | null>(null);
  const prevPathnameRef = useRef<string | null>(null);

  // Check if user is authenticated
  const isAuthenticated =
    session?.user &&
    session.user.name !== "Anonymous" &&
    !session.user.email?.startsWith("temp-");

  const loadWorkflows = useCallback(async () => {
    // Don't try to load if not authenticated
    if (!isAuthenticated) {
      console.log("[useWorkflowNav] Not authenticated, skipping workflow load");
      setWorkflows([]);
      return;
    }

    setIsLoading(true);
    try {
      console.log("[useWorkflowNav] Loading workflows...");
      const allWorkflows = await api.workflow.getAll();
      // Filter out auto-save workflows (same as status panel and sidebar)
      const filtered = allWorkflows
        .filter((w) => w.name !== "__current__" && w.name !== "~~__CURRENT__~~")
        .map((w) => ({
          id: w.id,
          name: w.name,
          href: `/workflow/workflows/${w.id}`,
          updatedAt: w.updatedAt,
        }));
      console.log(
        `[useWorkflowNav] ✅ Loaded ${filtered.length} workflows (filtered from ${allWorkflows.length} total)`,
      );
      setWorkflows(filtered);
    } catch (error) {
      console.error("[useWorkflowNav] Failed to load workflows:", error);
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

  // Reload workflows when currentWorkflowId changes (new workflow created)
  useEffect(() => {
    const prevWorkflowId = prevWorkflowIdRef.current;
    prevWorkflowIdRef.current = currentWorkflowId;

    // If workflow ID changed from null to a value, or changed to a different workflow, reload
    if (
      isAuthenticated &&
      currentWorkflowId &&
      prevWorkflowId !== currentWorkflowId
    ) {
      // Small delay to ensure workflow is saved in database
      const timeoutId = setTimeout(() => {
        loadWorkflows();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkflowId, isAuthenticated]);

  // Reload workflows when navigating to workflow detail pages (to see updated names, etc.)
  useEffect(() => {
    const prevPathname = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    // If navigating to a workflow detail page, reload workflows to get latest data
    if (
      isAuthenticated &&
      pathname &&
      pathname.startsWith("/workflow/workflows/") &&
      prevPathname !== pathname
    ) {
      // Small delay to ensure workflow data is loaded
      const timeoutId = setTimeout(() => {
        loadWorkflows();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isAuthenticated]);

  // Reload workflows when reload trigger changes (triggered after saves, etc.)
  useEffect(() => {
    if (isAuthenticated && workflowListReloadTrigger > 0) {
      // Small delay to ensure database is updated
      const timeoutId = setTimeout(() => {
        loadWorkflows();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowListReloadTrigger, isAuthenticated]);

  return {
    workflows,
    currentWorkflowId,
    currentWorkflowName: workflowName,
    loadWorkflows,
    isLoading,
    router,
  };
}
