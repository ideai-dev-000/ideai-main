/**
 * @fileoverview IdeaI Side Menu Wrapper for Capabilities App
 *
 * @module IdeAISideMenuWrapper
 * @description
 * Wrapper component that integrates IdeAISideMenu with workflow navigation
 * for the capabilities app. Connects to useWorkflowNav hook and provides
 * workflow access in the side menu.
 */

"use client";

import { useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAtomValue } from "jotai";
import { toast } from "sonner";
import {
  IdeAISideMenu,
  IdeAISideMenuCards,
  IdeAISideMenuControls,
  IdeAISideMenuNewWorkflow,
  type WorkflowItem,
} from "@repo/ui";
import { useWorkflowNav } from "@/components/nav/use-workflow-nav";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api-client";
import {
  currentWorkflowNameAtom,
  currentWorkflowIdAtom,
  clearWorkflowAtom,
  hasUnsavedChangesAtom,
} from "@/lib/workflow-store";
import { useSetAtom } from "jotai";
import { WorkflowStatusCard } from "@/components/workflow/workflow-status-card";

/**
 * IdeaI Side Menu Wrapper
 *
 * Integrates IdeAISideMenu with capabilities app workflow navigation.
 * Shows workflows from API and provides slots for custom cards and controls.
 */
export function IdeAISideMenuWrapper() {
  const { data: session } = useSession();
  const workflowNav = useWorkflowNav();
  const router = useRouter();
  const pathname = usePathname();
  const currentWorkflowName = useAtomValue(currentWorkflowNameAtom);
  const currentWorkflowId = useAtomValue(currentWorkflowIdAtom);
  const clearWorkflow = useSetAtom(clearWorkflowAtom);
  const setHasUnsavedChanges = useSetAtom(hasUnsavedChangesAtom);

  // Determine menu title
  const workflowsTitle = "Workflows";

  // Check if user is authenticated
  const isAuthenticated = useMemo(
    () =>
      session?.user &&
      session.user.name !== "Anonymous" &&
      !session.user.email?.startsWith("temp-"),
    [session?.user?.name, session?.user?.email],
  );

  // Memoize workflows array, but update current workflow name from atom if it changed
  // Only update the name in the array, don't trigger full refresh to prevent flickering
  const workflows: WorkflowItem[] = useMemo(() => {
    return workflowNav.workflows.map((w) => {
      // If this is the current workflow, use the name from the atom (most up-to-date)
      if (w.id === currentWorkflowId && currentWorkflowName) {
        return {
          id: w.id,
          name: currentWorkflowName, // Use the updated name from atom
          href: w.href,
          updatedAt: w.updatedAt,
        };
      }
      return {
        id: w.id,
        name: w.name,
        href: w.href,
        updatedAt: w.updatedAt,
      };
    });
  }, [workflowNav.workflows, currentWorkflowId, currentWorkflowName]);

  // Use the same loadWorkflows function from hook - ensures same code/logs as status panel
  // The hook already has the same filtering logic (filters __current__ and ~~__CURRENT__~~)
  // and now includes matching console logs for consistency
  const loadWorkflows = workflowNav.loadWorkflows;

  // Handler to create a new workflow
  const handleCreateWorkflow = useCallback(async () => {
    try {
      const newWorkflow = await api.workflow.create({
        name: "Untitled Workflow",
        description: "",
        nodes: [],
        edges: [],
      });

      toast.success("Workflow created");

      // Reload workflows list
      await loadWorkflows();

      // Navigate to the new workflow
      router.push(`/workflow/workflows/${newWorkflow.id}`);
    } catch (error) {
      console.error("Failed to create workflow:", error);
      toast.error("Failed to create workflow");
    }
  }, [loadWorkflows, router]);

  // Handler to clone a workflow
  const handleCloneWorkflow = useCallback(
    async (workflowId: string, workflowName: string) => {
      try {
        // First duplicate the workflow
        const duplicatedWorkflow = await api.workflow.duplicate(workflowId);

        // Get all workflows to check existing names
        const allWorkflows = await api.workflow.getAll();

        // Extract base name (remove any existing -001, -002 suffix)
        const baseName = workflowName.replace(/-\d{3}$/, "");

        // Find all workflows with the same base name
        const matchingWorkflows = allWorkflows.filter(
          (w) => w.name === baseName || w.name.startsWith(`${baseName}-`),
        );

        // Find the next available suffix number
        let suffixNumber = 1;
        const usedSuffixes = new Set<number>();

        matchingWorkflows.forEach((w) => {
          if (w.name === baseName) {
            usedSuffixes.add(0); // Base name counts as suffix 0
          } else {
            const match = w.name.match(/^(.+)-(\d{3})$/);
            if (match && match[1] === baseName && match[2]) {
              usedSuffixes.add(parseInt(match[2], 10));
            }
          }
        });

        // Find next available number
        while (usedSuffixes.has(suffixNumber)) {
          suffixNumber++;
        }

        // Generate new name with zero-padded suffix
        const newName = `${baseName}-${String(suffixNumber).padStart(3, "0")}`;

        // Update the duplicated workflow with the new name
        await api.workflow.update(duplicatedWorkflow.id, { name: newName });

        toast.success(`Workflow cloned as "${newName}"`);

        // Reload workflows list
        await loadWorkflows();

        // Navigate to the cloned workflow
        router.push(`/workflow/workflows/${duplicatedWorkflow.id}`);
      } catch (error) {
        console.error("Failed to clone workflow:", error);
        toast.error("Failed to clone workflow");
        throw error;
      }
    },
    [loadWorkflows, router],
  );

  // Handler to delete a workflow
  const handleDeleteWorkflow = useCallback(
    async (workflowId: string, workflowName: string) => {
      try {
        await api.workflow.delete(workflowId);
        toast.success(`Workflow "${workflowName}" deleted`);

        // Reload workflows list
        await loadWorkflows();

        // If we deleted the current workflow, navigate to home
        if (workflowNav.currentWorkflowId === workflowId) {
          router.push("/workflow");
        }
      } catch (error) {
        console.error("Failed to delete workflow:", error);
        toast.error("Failed to delete workflow");
        throw error; // Re-throw so confirmation dialog knows it failed
      }
    },
    [loadWorkflows, router, workflowNav.currentWorkflowId],
  );


  // Handler to clear the current workflow (clears all nodes and edges)
  const handleClearWorkflow = useCallback(async () => {
    if (!currentWorkflowId) {
      clearWorkflow();
      toast.success("Workflow cleared");
      return;
    }

    try {
      // Immediately save the empty state to the database first
      await api.workflow.update(currentWorkflowId, { nodes: [], edges: [] });

      // Then clear the workflow in memory
      clearWorkflow();

      // Clear the unsaved changes flag since we just saved
      setHasUnsavedChanges(false);

      toast.success("Workflow cleared");
    } catch (error) {
      console.error("Failed to clear workflow:", error);
      toast.error("Failed to clear workflow. Please try again.");
    }
  }, [clearWorkflow, currentWorkflowId, setHasUnsavedChanges]);

  // Always render component but hide when not authenticated (prevents remounting)
  return (
    <div style={{ display: isAuthenticated ? "block" : "none" }}>
      <IdeAISideMenu
        workflows={workflows}
        onLoadWorkflows={loadWorkflows}
        currentWorkflowId={workflowNav.currentWorkflowId}
        onCreateWorkflow={handleCreateWorkflow}
        onCloneWorkflow={handleCloneWorkflow}
        onDeleteWorkflow={handleDeleteWorkflow}
        onClearWorkflow={handleClearWorkflow}
        workflowsTitle={workflowsTitle}
      >
        {/* Area 1: Status card at top - shows workflow status - sticky */}
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 -mx-0 px-4 py-3">
          <WorkflowStatusCard />
        </div>

        {/* Area 2: New Workflow section - above the list */}
        <IdeAISideMenuNewWorkflow onCreateWorkflow={handleCreateWorkflow} />

        {/* Area 3: Workflows list section */}
        {/* Workflows list is auto-populated by IdeAISideMenu component */}
      </IdeAISideMenu>
    </div>
  );
}
