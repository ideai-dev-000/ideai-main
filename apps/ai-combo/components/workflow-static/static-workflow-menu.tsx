/**
 * @fileoverview Static Workflow Menu Component
 *
 * @module StaticWorkflowMenu
 * @description
 * Secondary control menu for static workflow visualization and editing.
 * Uses ideai-menu-control-2 pattern for the static workflow app.
 */

"use client";

import { IdeAIMenuControls, IdeAIMenuSection } from "@repo/ui";
import { useMenuState } from "@/components/menu-state-provider";
import { getEffectiveTrigger, MENU_SETTINGS } from "@/lib/menu-settings";
import { StaticWorkflowStepsList } from "./static-workflow-steps-list";

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
      <IdeAIMenuSection id="workflow-steps" title="Workflow Steps" defaultOpen>
        <StaticWorkflowStepsList />
      </IdeAIMenuSection>
    </IdeAIMenuControls>
  );
}
