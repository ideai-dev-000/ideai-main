/**
 * @fileoverview Static Workflow Page
 *
 * @module StaticWorkflowPage
 * @description
 * Page to visualize and edit static workflows using React Flow.
 * Reuses existing workflow components with simplified editing.
 */

"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { StaticWorkflowCanvas } from "@/components/workflow-static/static-workflow-canvas";
import { StaticWorkflowMenu } from "@/components/workflow-static/static-workflow-menu";

export default function StaticWorkflowPage() {
  return (
    <ReactFlowProvider>
      {/* Secondary Control Menu (Right Side) */}
      <StaticWorkflowMenu />

      {/* React Flow Canvas - Reuses existing workflow components */}
      <div className="fixed top-16 inset-x-0 bottom-0 z-[15] pointer-events-none">
        <StaticWorkflowCanvas />
      </div>
    </ReactFlowProvider>
  );
}
