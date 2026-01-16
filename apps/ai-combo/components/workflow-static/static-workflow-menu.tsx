/**
 * @fileoverview Static Workflow Menu Component
 *
 * @module StaticWorkflowMenu
 * @description
 * Secondary control menu for static workflow visualization and editing.
 * Uses ideai-menu-control-2 pattern for the static workflow app.
 * Includes play button and static workflow actions only.
 */

"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Play, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { IdeAIMenuControls, IdeAIMenuSection } from "@repo/ui";
import { useMenuState } from "@/components/menu-state-provider";
import { getEffectiveTrigger, MENU_SETTINGS } from "@/lib/menu-settings";
import { StaticWorkflowStepsList } from "./static-workflow-steps-list";
import { Button } from "@/components/ui/button";
import {
  nodesAtom,
  edgesAtom,
  isExecutingAtom,
  updateNodeDataAtom,
} from "@/lib/workflow-store";
import { executeStaticWorkflow } from "@/lib/static-workflow-executor";

/**
 * Play Button Component for Static Workflow
 */
function StaticWorkflowPlayButton() {
  const [nodes] = useAtom(nodesAtom);
  const [edges] = useAtom(edgesAtom);
  const [isExecuting, setIsExecuting] = useAtom(isExecutingAtom);
  const updateNodeData = useSetAtom(updateNodeDataAtom);

  const handlePlay = async () => {
    if (isExecuting) {
      return;
    }

    if (nodes.length === 0) {
      toast.error("No workflow steps to execute");
      return;
    }

    setIsExecuting(true);

    try {
      await executeStaticWorkflow(nodes, edges, (update) => {
        updateNodeData(update);
      });

      setIsExecuting(false);
      toast.success("Static workflow executed successfully!");
    } catch (error) {
      console.error("Failed to execute static workflow:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to execute static workflow",
      );
      setIsExecuting(false);
    }
  };

  return (
    <Button
      className="w-full"
      disabled={isExecuting || nodes.length === 0}
      onClick={handlePlay}
      variant="default"
    >
      {isExecuting ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Executing...
        </>
      ) : (
        <>
          <Play className="mr-2 size-4" />
          Play Workflow
        </>
      )}
    </Button>
  );
}

export function StaticWorkflowMenu() {
  const menuState = useMenuState();
  const effectiveTrigger = getEffectiveTrigger(menuState.rightMenuSettings);

  return (
    <IdeAIMenuControls
      className="ideai-control ideai-control-secondary"
      position="right"
      trigger={effectiveTrigger}
      size={320}
      title="Static Workflow"
      open={menuState.rightMenuOpen}
      onOpenChange={menuState.setRightMenuOpen}
      animationMode={MENU_SETTINGS.animationMode || "overlay"}
      swipeToClose={menuState.rightMenuSettings.swipeToClose ?? true}
    >
      {/* Play Button Section */}
      <IdeAIMenuSection id="play-controls" title="Controls" defaultOpen>
        <div className="p-2">
          <StaticWorkflowPlayButton />
        </div>
      </IdeAIMenuSection>

      {/* Workflow Steps Section */}
      <IdeAIMenuSection id="workflow-steps" title="Workflow Steps" defaultOpen>
        <StaticWorkflowStepsList />
      </IdeAIMenuSection>
    </IdeAIMenuControls>
  );
}
