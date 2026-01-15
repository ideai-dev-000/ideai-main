/**
 * @fileoverview IdeaI Side Menu Wrapper for Capabilities App
 *
 * @module IdeAISideMenuWrapper
 * @description
 * Wrapper component that renders IdeAIMenuControls on the LEFT side.
 *
 * **Menu Configuration (Settings)**:
 * - LEFT MENU = Controls (always visible) - uses IdeAIMenuControls
 * - RIGHT MENU = Main Menu (always visible) - uses IdeAIMenuMain (in layout.tsx)
 *
 * This component uses IdeAIMenuControls to demonstrate pattern inheritance -
 * both menu variants inherit from the base ideai-menu, ensuring consistent UX
 * (hover, mobile swipe, pop-out animations) while allowing different styling.
 *
 * This component is contextual - it only renders when the route needs
 * IdeaI-level controls. Controls abstract app functionality into shared UI
 * that benefits from patterns, composability, and semantic parent-child couplings.
 *
 * Controls and functions are decoupled but come together per feature
 * (e.g., workflow or vibe). Each page has an ideaiControls boolean in
 * route-config.ts to control visibility.
 */

"use client";

import { useMemo, useCallback, useEffect } from "react";
import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAtomValue } from "jotai";
import { toast } from "sonner";
import {
  IdeAIMenuControls,
  IdeAIMenuSection,
  type WorkflowItem,
} from "@repo/ui";
import { useWorkflowNav } from "@/components/nav/use-workflow-nav";
import { VibeChatsList } from "@/components/vibe/vibe-chats-list";
import { VibePromptInput } from "@/components/vibe/vibe-prompt-input";
import { VibeChatSideMenuPanel } from "@/components/vibe/vibe-chat-side-menu-panel";
import { api } from "@/lib/api-client";
import { getToolContext, needsIdeaiControls } from "@/lib/route-config";
import {
  currentWorkflowNameAtom,
  currentWorkflowIdAtom,
  clearWorkflowAtom,
  hasUnsavedChangesAtom,
} from "@/lib/workflow-store";
import { useSetAtom } from "jotai";
import { WorkflowStatusCard } from "@/components/workflow/workflow-status-card";
import { WorkflowListControl } from "@/components/workflow/workflow-list-control";
// Note: IdeAISideMenuNewWorkflow is a simple component - we can inline it or create a local version
import { useMenuState } from "@/components/menu-state-provider";
import { getEffectiveTrigger, MENU_SETTINGS } from "@/lib/menu-settings";

/**
 * IdeaI Side Menu Wrapper
 *
 * Integrates IdeAISideMenu with capabilities app workflow navigation.
 * Shows workflows from API and provides slots for custom cards and controls.
 */
export function IdeAISideMenuWrapper() {
  const workflowNav = useWorkflowNav();
  const router = useRouter();
  const pathname = usePathname();
  const toolContext = getToolContext(pathname);
  const isVibeTool = toolContext === "vibe";
  const isVibeHome = pathname === "/vibe";
  const currentWorkflowName = useAtomValue(currentWorkflowNameAtom);
  const currentWorkflowId = useAtomValue(currentWorkflowIdAtom);
  const clearWorkflow = useSetAtom(clearWorkflowAtom);
  const setHasUnsavedChanges = useSetAtom(hasUnsavedChangesAtom);

  // Check if this route needs IdeaI-level controls (contextual menu)
  // Controls are contextual - only appear when page needs IdeaI-level abstraction
  const hasIdeaiControls = needsIdeaiControls(pathname);

  // Determine menu title
  const workflowsTitle = "Workflows";

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

  // Handler to create a new workflow - navigate to /workflow to show card
  const handleCreateWorkflow = useCallback(() => {
    // Navigate to /workflow to show the card, workflow will be created when user selects trigger type
    router.push("/workflow");
  }, [router]);

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

  // Load workflows when component mounts (only for workflow tool)
  // This must be before any conditional returns to follow Rules of Hooks
  useEffect(() => {
    if (!isVibeTool) {
      loadWorkflows();
    }
  }, [loadWorkflows, isVibeTool]);

  // If route doesn't need IdeaI controls, don't render menu
  // Controls are contextual - only appear when page needs IdeaI-level abstraction
  if (!hasIdeaiControls) {
    return null;
  }

  // Get menu state and settings
  // CRITICAL: This hook ensures menu is ALWAYS connected to state
  // If MenuStateProvider is missing, this will throw (preventing broken menus)
  const menuState = useMenuState();
  const effectiveTrigger = getEffectiveTrigger(menuState.leftMenuSettings);

  // Safety check: Ensure menu state is valid
  if (!menuState || !menuState.setLeftMenuOpen) {
    console.error(
      "MenuStateProvider is missing or invalid! Left menu will not work.",
    );
    return null; // Don't render menu if state is broken
  }

  // Determine menu title based on tool context
  const menuTitle = isVibeTool ? "Vibe Controls" : "Workflow Controls";

  // LEFT MENU = CONTROLS (settings-controlled)
  if (isVibeTool) {
    return (
      <IdeAIMenuControls
        position="left"
        trigger={effectiveTrigger}
        size={280}
        title={menuTitle}
        open={menuState.leftMenuOpen}
        onOpenChange={menuState.setLeftMenuOpen}
        animationMode={MENU_SETTINGS.animationMode || "overlay"}
        swipeToClose={menuState.leftMenuSettings.swipeToClose ?? true}
      >
        {/* New chat input (vibe home only) */}
        {isVibeHome && (
          <IdeAIMenuSection id="vibe-prompt" title="New Chat" defaultOpen>
            <VibePromptInput compact />
          </IdeAIMenuSection>
        )}

        {/* Vibe chat list */}
        <IdeAIMenuSection id="vibe-chats" title="Vibe Chats" defaultOpen>
          <VibeChatsList />
        </IdeAIMenuSection>

        {/* Chat UI module (detail page only) */}
        <IdeAIMenuSection id="vibe-chat" title="Chat" defaultOpen>
          <VibeChatSideMenuPanel />
        </IdeAIMenuSection>
      </IdeAIMenuControls>
    );
  }

  return (
    <IdeAIMenuControls
      className="ideai-control ideai-control-primary"
      position="left"
      trigger={effectiveTrigger}
      size={280}
      title={menuTitle}
      open={menuState.leftMenuOpen}
      onOpenChange={menuState.setLeftMenuOpen}
      animationMode={MENU_SETTINGS.animationMode || "overlay"}
      swipeToClose={menuState.leftMenuSettings.swipeToClose ?? true}
    >
      {/* Status card section */}
      <IdeAIMenuSection id="workflow-status" title="Status" defaultOpen>
        <WorkflowStatusCard />
      </IdeAIMenuSection>

      {/* New Workflow section */}
      <IdeAIMenuSection id="new-workflow" title="New Workflow" defaultOpen>
        <div className="p-2">
          <button
            type="button"
            onClick={handleCreateWorkflow}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium transition-colors"
          >
            <span className="text-lg">+</span>
            <span>New Workflow</span>
          </button>
        </div>
      </IdeAIMenuSection>

      {/* Workflows list section */}
      <IdeAIMenuSection id="workflows" title={workflowsTitle} defaultOpen>
        <WorkflowListControl
          workflows={workflows}
          currentWorkflowId={workflowNav.currentWorkflowId}
          onCloneWorkflow={handleCloneWorkflow}
          onDeleteWorkflow={handleDeleteWorkflow}
          onClearWorkflow={handleClearWorkflow}
        />
      </IdeAIMenuSection>
    </IdeAIMenuControls>
  );
}
