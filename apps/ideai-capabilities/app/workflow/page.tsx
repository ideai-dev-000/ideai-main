/**
 * @fileoverview Workflow Builder page - Direct component integration (no iframe)
 *
 * @module WorkflowPage
 * @description
 * Workflow builder page using direct component integration.
 * This is the merged version - workflow functionality is part of this app.
 */

"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import {
  currentWorkflowNameAtom,
  edgesAtom,
  hasSidebarBeenShownAtom,
  isTransitioningFromHomepageAtom,
  nodesAtom,
  type WorkflowNode,
} from "@/lib/workflow-store";
import { AddNode } from "@/components/workflow/nodes/add-node";

// Helper function to create a default trigger node
function createDefaultTriggerNode(triggerType: "Manual" | "Webhook" | "Schedule" = "Manual") {
  return {
    id: nanoid(),
    type: "trigger" as const,
    position: { x: 0, y: 0 },
    data: {
      label: "",
      description: "",
      type: "trigger" as const,
      config: { triggerType },
      status: "idle" as const,
    },
  };
}

export default function WorkflowPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession(); // Use reactive session hook
  const nodes = useAtomValue(nodesAtom);
  const edges = useAtomValue(edgesAtom);
  const setNodes = useSetAtom(nodesAtom);
  const setEdges = useSetAtom(edgesAtom);
  const setCurrentWorkflowName = useSetAtom(currentWorkflowNameAtom);
  const setHasSidebarBeenShown = useSetAtom(hasSidebarBeenShownAtom);
  const setIsTransitioningFromHomepage = useSetAtom(
    isTransitioningFromHomepageAtom,
  );
  const hasCreatedWorkflowRef = useRef(false);
  const currentWorkflowName = useAtomValue(currentWorkflowNameAtom);

  // Check if user is authenticated (not anonymous)
  const isAnonymous =
    !session?.user ||
    session.user.name === "Anonymous" ||
    session.user.email?.startsWith("temp-");

  // Handler to add the first node (creates workflow)
  const handleAddNode = useCallback((triggerType: "Manual" | "Webhook" | "Schedule" = "Manual") => {
    const newNode: WorkflowNode = createDefaultTriggerNode(triggerType);
    // Set nodes - this will trigger workflow creation
    setNodes([newNode]);
  }, [setNodes]);

  // Check for trigger type from URL param (from landing page)
  useEffect(() => {
    const triggerParam = searchParams?.get("trigger");
    if (triggerParam && ["Manual", "Webhook", "Schedule"].includes(triggerParam)) {
      const newNode = createDefaultTriggerNode(triggerParam as "Manual" | "Webhook" | "Schedule");
      setNodes([newNode]);
      // Remove trigger param from URL
      router.replace("/workflow", { scroll: false });
    }
  }, [searchParams, setNodes, router]);

  // Redirect to landing page if not authenticated
  useEffect(() => {
    if (!isPending && isAnonymous) {
      router.replace("/");
    }
  }, [isPending, isAnonymous, router]);

  // Reset sidebar animation state when on workflow page
  useEffect(() => {
    if (!isAnonymous) {
      setHasSidebarBeenShown(false);
    }
  }, [setHasSidebarBeenShown, isAnonymous]);

  // Update page title when workflow name changes
  useEffect(() => {
    if (!isAnonymous) {
      document.title = `${currentWorkflowName} - IdeaI Capabilities`;
    }
  }, [currentWorkflowName, isAnonymous]);

  // Track previous node count to detect when first real node is added
  const prevNodeCountRef = useRef(0);
  const hasInitializedRef = useRef(false);

  // Initialize workflow state on mount (only once)
  useEffect(() => {
    if (isAnonymous || hasInitializedRef.current) {
      return;
    }
    
    // Clear any existing nodes/edges and set name
    setNodes([]);
    setEdges([]);
    setCurrentWorkflowName("New Workflow");
    hasCreatedWorkflowRef.current = false;
    prevNodeCountRef.current = 0;
    hasInitializedRef.current = true;
  }, [isAnonymous, setNodes, setEdges, setCurrentWorkflowName]);

  // Create workflow when first real node is added (only once)
  useEffect(() => {
    if (isAnonymous) {
      return;
    }

    // Filter out the placeholder "add" node
    const realNodes = nodes.filter((node) => node.type !== "add");
    const currentNodeCount = realNodes.length;
    const prevNodeCount = prevNodeCountRef.current;

    // Update ref for next comparison
    prevNodeCountRef.current = currentNodeCount;

    // Only create when transitioning from 0 to 1+ nodes AND haven't created yet
    const shouldCreate =
      prevNodeCount === 0 &&
      currentNodeCount > 0 &&
      !hasCreatedWorkflowRef.current;

    if (!shouldCreate) {
      return;
    }

    // Mark as created immediately to prevent race conditions
    hasCreatedWorkflowRef.current = true;

    const createWorkflowAndRedirect = async () => {
      try {
        // Check if user is authenticated (not anonymous)
        const isAnonymousCheck =
          !session?.user ||
          session.user.name === "Anonymous" ||
          session.user.email?.startsWith("temp-");

        if (isAnonymousCheck) {
          toast.error("Please sign in to create workflows");
          // Reset the flag so user can try again after signing in
          hasCreatedWorkflowRef.current = false;
          prevNodeCountRef.current = 0;
          return;
        }

        // Create workflow with all real nodes
        const newWorkflow = await api.workflow.create({
          name: "Untitled Workflow",
          description: "",
          nodes: realNodes,
          edges,
        });

        // Set flags to indicate we're coming from workflow page (for sidebar animation)
        sessionStorage.setItem("animate-sidebar", "true");
        setIsTransitioningFromHomepage(true);

        // Redirect to the workflow detail page
        console.log("[WorkflowPage] Navigating to workflow detail page");
        router.replace(`/workflow/workflows/${newWorkflow.id}`);
      } catch (error) {
        console.error("Failed to create workflow:", error);
        toast.error("Failed to create workflow");
        // Reset flags on error so user can try again
        hasCreatedWorkflowRef.current = false;
        prevNodeCountRef.current = 0;
      }
    };

    createWorkflowAndRedirect();
    // Only depend on node count change, not the full nodes array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    nodes.length, // Only track length, not full array
    edges.length, // Only track length, not full array
    router,
    setIsTransitioningFromHomepage,
    session?.user?.id,
    session?.user?.name,
    session?.user?.email,
    isAnonymous,
  ]);

  // Show card directly when no nodes exist (not as React Flow node)
  const realNodes = nodes.filter((node) => node.type !== "add");
  const showCard = realNodes.length === 0;

  if (isPending || isAnonymous) {
    return null;
  }

  // Render card directly on page when empty (bypasses React Flow)
  // z-[20] to be above canvas (z-[15]) but below header (z-[60])
  if (showCard) {
    return (
      <div className="pointer-events-auto fixed inset-0 z-[20] flex items-center justify-center">
        <AddNode
          data={{
            onClick: handleAddNode,
          }}
        />
      </div>
    );
  }

  // Canvas and toolbar are rendered by PersistentCanvas in the layout
  return null;
}
