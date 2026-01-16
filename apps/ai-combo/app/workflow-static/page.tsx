/**
 * @fileoverview Static Workflow Page
 *
 * @module StaticWorkflowPage
 * @description
 * Page to visualize and edit static workflows with card-based UI.
 * Shows workflow steps as cards in order, with editable action code.
 */

"use client";

import { StaticWorkflowStage } from "@/components/workflow-static/static-workflow-stage";
import { StaticWorkflowMenu } from "@/components/workflow-static/static-workflow-menu";

export default function StaticWorkflowPage() {
  return (
    <div className="pointer-events-auto w-full h-full">
      {/* Secondary Control Menu (Right Side) */}
      <StaticWorkflowMenu />

      {/* Main Stage - Workflow Cards */}
      <StaticWorkflowStage />
    </div>
  );
}
