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

import { useMemo, useRef, useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAtomValue } from "jotai";
import { toast } from "sonner";
import {
  IdeAISideMenu,
  IdeAISideMenuCards,
  IdeAISideMenuControls,
  type WorkflowItem,
  type VibeItem,
  type ContentMode,
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

  // State for vibes (vibe coded chats)
  const [vibes, setVibes] = useState<VibeItem[]>([]);
  const [isLoadingVibes, setIsLoadingVibes] = useState(false);
  const [contentMode, setContentMode] = useState<ContentMode>("workflows");

  // Determine content mode based on current route
  useEffect(() => {
    if (pathname?.startsWith("/vibe") || pathname?.startsWith("/chats/")) {
      setContentMode("vibes");
    } else if (pathname?.startsWith("/workflow")) {
      setContentMode("workflows");
    }
  }, [pathname]);

  // Get current vibe ID from pathname
  const currentVibeId = useMemo(() => {
    if (pathname?.startsWith("/chats/")) {
      return pathname.split("/")[2] || null;
    }
    return null;
  }, [pathname]);

  // Determine menu title based on current route
  const workflowsTitle = useMemo(() => {
    if (pathname?.startsWith("/vibe")) {
      return "Vibes";
    }
    return "Workflows";
  }, [pathname]);

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

  // Use the same loadWorkflows as status panel - ensure same filtering and logs
  const loadWorkflows = useCallback(async () => {
    // Use the same logic as WorkflowStatusPanel - load from API and filter
    if (!isAuthenticated) {
      console.log("[IdeAISideMenuWrapper] Not authenticated, skipping workflow load");
      return;
    }

    try {
      console.log("[IdeAISideMenuWrapper] Loading workflows...");
      const allWorkflows = await api.workflow.getAll();
      // Filter out auto-save workflows (same as status panel)
      const filtered = allWorkflows.filter(
        (w) => w.name !== "__current__" && w.name !== "~~__CURRENT__~~",
      );
      console.log(
        `[IdeAISideMenuWrapper] ✅ Loaded ${filtered.length} workflows (filtered from ${allWorkflows.length} total)`,
      );

      // Update workflows via hook's loadWorkflows to sync state
      await workflowNav.loadWorkflows();
    } catch (error) {
      console.error("[IdeAISideMenuWrapper] Failed to load workflows:", error);
      // Fallback to hook's loadWorkflows
      await workflowNav.loadWorkflows().catch((err) => {
        console.error("[IdeAISideMenuWrapper] Hook loadWorkflows also failed:", err);
      });
    }
  }, [isAuthenticated, workflowNav]);

  // Load vibes (chats) from API
  const loadVibes = useCallback(async () => {
    if (!session?.user?.id) {
      setVibes([]);
      return;
    }

    setIsLoadingVibes(true);
    try {
      // Use proxy API route to avoid CORS issues
      // The proxy handles authentication and forwards to vibecoder API
      const response = await fetch("/api/vibes", {
        credentials: "include",
      }).catch((err) => {
        console.error("[loadVibes] Fetch error:", err);
        return null;
      });

      if (response && response.ok) {
        const data = await response.json();
        const chats = (data.data || []).map((chat: any) => ({
          id: chat.id,
          name: chat.name || undefined,
          // Route to internal vibe chat detail page
          href: `/vibe/chats/${chat.id}`,
          createdAt: chat.createdAt,
          privacy: chat.privacy,
        }));
        console.log(
          "[loadVibes] ✅ Loaded",
          chats.length,
          "vibes:",
          chats.map((c) => ({ id: c.id, name: c.name })),
        );
        setVibes(chats);
      } else if (response) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error(
          "[loadVibes] ❌ API error:",
          response.status,
          response.statusText,
          errorData,
        );
      } else {
        console.log("[loadVibes] ❌ No response from API");
      }
    } catch (error) {
      console.error("[loadVibes] Failed to load vibes:", error);
      // Silently fail - vibes section will just be empty
    } finally {
      setIsLoadingVibes(false);
    }
  }, [session?.user?.id]);

  // Load vibes on mount and when session changes
  useEffect(() => {
    if (session?.user?.id) {
      console.log(
        "[IdeAISideMenuWrapper] Loading vibes for user:",
        session.user.id,
      );
      loadVibes();
    } else {
      console.log("[IdeAISideMenuWrapper] No session, skipping vibes load");
      setVibes([]);
    }
  }, [session?.user?.id, loadVibes]);

  // Debug: Log vibes state changes
  useEffect(() => {
    console.log("[IdeAISideMenuWrapper] Vibes state changed:", {
      count: vibes.length,
      vibes: vibes.map((v) => ({ id: v.id, name: v.name })),
      isLoading: isLoadingVibes,
    });
  }, [vibes, isLoadingVibes]);

  // Also reload vibes when content mode changes to vibes
  useEffect(() => {
    if (
      contentMode === "vibes" &&
      session?.user?.id &&
      vibes.length === 0 &&
      !isLoadingVibes
    ) {
      console.log(
        "[IdeAISideMenuWrapper] Content mode changed to vibes, loading...",
      );
      loadVibes();
    }
  }, [contentMode, session?.user?.id, vibes.length, isLoadingVibes, loadVibes]);

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

  // Handler to create a new vibe
  const handleCreateVibe = useCallback(async () => {
    // Navigate to vibe creation page (internal route)
    router.push("/vibe");
  }, [router]);

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
        vibes={vibes}
        onLoadWorkflows={loadWorkflows}
        onLoadVibes={loadVibes}
        currentWorkflowId={workflowNav.currentWorkflowId}
        currentVibeId={currentVibeId}
        onCreateWorkflow={handleCreateWorkflow}
        onCreateVibe={handleCreateVibe}
        onCloneWorkflow={handleCloneWorkflow}
        onDeleteWorkflow={handleDeleteWorkflow}
        onClearWorkflow={handleClearWorkflow}
        workflowsTitle={workflowsTitle}
        contentMode={contentMode}
        onContentModeChange={setContentMode}
      >
        {/* Cards section - ready for custom cards */}
        <IdeAISideMenuCards title="Quick Actions">
          {/* Custom cards can be added here */}
        </IdeAISideMenuCards>

        {/* Controls section - ready for customization controls */}
        <IdeAISideMenuControls title="Controls">
          {/* Custom controls can be added here */}
        </IdeAISideMenuControls>
      </IdeAISideMenu>
    </div>
  );
}
