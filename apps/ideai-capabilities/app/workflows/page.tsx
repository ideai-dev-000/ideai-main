/**
 * @fileoverview Workflows Landing Page - Shows card to start new workflow
 *
 * @module WorkflowsLandingPage
 * @description
 * Landing page for workflows - shows the card centered, user can click to create a new workflow
 * This is the entry point when clicking "Workflows" in the header
 */

"use client";

import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import {
  clearWorkflowAtom,
  currentWorkflowNameAtom,
  edgesAtom,
  hasSidebarBeenShownAtom,
  nodesAtom,
} from "@/lib/workflow-store";
import { AddNode } from "@/components/workflow/nodes/add-node";

export default function WorkflowsLandingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const clearWorkflow = useSetAtom(clearWorkflowAtom);
  const setNodes = useSetAtom(nodesAtom);
  const setEdges = useSetAtom(edgesAtom);
  const setCurrentWorkflowName = useSetAtom(currentWorkflowNameAtom);
  const setHasSidebarBeenShown = useSetAtom(hasSidebarBeenShownAtom);

  // Check if user is authenticated (not anonymous)
  const isAnonymous =
    !session?.user ||
    session.user.name === "Anonymous" ||
    session.user.email?.startsWith("temp-");

  // Redirect to landing page if not authenticated
  useEffect(() => {
    if (!isPending && isAnonymous) {
      router.replace("/");
    }
  }, [isPending, isAnonymous, router]);

  // Initialize landing page state
  useEffect(() => {
    if (isAnonymous) {
      return;
    }

    // Clear workflow state and reset sidebar
    clearWorkflow();
    setNodes([]);
    setEdges([]);
    setCurrentWorkflowName("New Workflow");
    setHasSidebarBeenShown(false);
  }, [isAnonymous, clearWorkflow, setNodes, setEdges, setCurrentWorkflowName, setHasSidebarBeenShown]);

  // Handler to navigate to workflow creation page
  const handleCreateWorkflow = (triggerType?: "Manual" | "Webhook" | "Schedule") => {
    // Navigate to /workflow which will handle creating the workflow with the trigger type
    router.push(triggerType ? `/workflow?trigger=${triggerType}` : "/workflow");
  };

  if (isPending || isAnonymous) {
    return null;
  }

  // Render card centered on landing page
  // z-[20] to be above canvas (z-[15]) but below header (z-[60])
  return (
    <div className="pointer-events-auto fixed inset-0 z-[20] flex items-center justify-center">
      <AddNode
        data={{
          onClick: handleCreateWorkflow,
        }}
      />
    </div>
  );
}
