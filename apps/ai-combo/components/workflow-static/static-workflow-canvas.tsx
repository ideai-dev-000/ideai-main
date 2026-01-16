/**
 * @fileoverview Static Workflow Canvas Component
 *
 * @module StaticWorkflowCanvas
 * @description
 * Simplified React Flow canvas for static workflows.
 * Reuses existing workflow components but with reduced complexity:
 * - No node/edge editing
 * - No adding nodes
 * - No context menus
 * - Just visualization and code editing per node
 */

"use client";

import {
  ConnectionMode,
  MiniMap,
  type OnConnect,
  useReactFlow,
} from "@xyflow/react";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@/components/ai-elements/canvas";
import { Connection } from "@/components/ai-elements/connection";
import { Controls } from "@/components/ai-elements/controls";
import { Panel } from "@/components/ai-elements/panel";
import { WorkflowToolbar } from "@/components/workflow/workflow-toolbar";
import "@xyflow/react/dist/style.css";

import {
  currentWorkflowIdAtom,
  edgesAtom,
  nodesAtom,
  selectedNodeAtom,
  showMinimapAtom,
  type WorkflowNode,
} from "@/lib/workflow-store";
import { Edge } from "@/components/ai-elements/edge";
import { ActionNode } from "@/components/workflow/nodes/action-node";
import { TriggerNode } from "@/components/workflow/nodes/trigger-node";
import { createStaticWorkflow } from "@/plugins/workflows-static/workflow-definition";
import { useSetAtom } from "jotai";

const edgeTypes = {
  animated: Edge.Animated,
  temporary: Edge.Temporary,
};

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
};

/**
 * Static Workflow Canvas
 * Simplified version of WorkflowCanvas for static workflows
 */
export function StaticWorkflowCanvas() {
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const [showMinimap] = useAtom(showMinimapAtom);
  const setSelectedNode = useSetAtom(selectedNodeAtom);
  const currentWorkflowId = useAtomValue(currentWorkflowIdAtom);
  const { fitView } = useReactFlow();
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const staticWorkflowLoaded = useRef(false);

  // Load static workflow definition on mount
  useEffect(() => {
    if (staticWorkflowLoaded.current) {
      return;
    }

    // Only load if no nodes exist (fresh page load)
    if (nodes.length === 0) {
      const { nodes: staticNodes, edges: staticEdges } = createStaticWorkflow();
      setNodes(staticNodes as WorkflowNode[]);
      setEdges(staticEdges);
      staticWorkflowLoaded.current = true;

      // Fit view after nodes are loaded
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 400 });
        setIsCanvasReady(true);
      }, 100);
    } else {
      setIsCanvasReady(true);
    }
  }, [nodes.length, setNodes, setEdges, fitView]);

  // Simplified connection handler (disabled for static workflow)
  const onConnect: OnConnect = useCallback(() => {
    // Static workflow: connections are fixed, no editing allowed
    // This is a no-op but required by React Flow
  }, []);

  // Node click handler - select node for code editing
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: WorkflowNode) => {
      setSelectedNode(node);
    },
    [setSelectedNode],
  );

  // Disable pane click (no node creation in static workflow)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div
      className="pointer-events-auto relative h-full bg-background"
      data-testid="static-workflow-canvas"
      style={{
        opacity: isCanvasReady ? 1 : 0,
        transition: "opacity 300ms",
      }}
    >
      {/* Toolbar */}
      <div className="pointer-events-auto">
        <WorkflowToolbar workflowId={currentWorkflowId ?? undefined} />
      </div>

      {/* React Flow Canvas */}
      <Canvas
        className="bg-background"
        connectionLineComponent={Connection}
        connectionMode={ConnectionMode.Strict}
        defaultEdgeOptions={{ type: "animated" }}
        edges={edges}
        edgeTypes={edgeTypes}
        elementsSelectable={true}
        isValidConnection={() => false} // Disable connections in static workflow
        nodes={nodes}
        nodesConnectable={false} // Disable connecting nodes
        nodesDraggable={true} // Allow dragging for layout
        nodeTypes={nodeTypes}
        onConnect={undefined} // Disable connections
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
      >
        <Panel
          className="workflow-controls-panel border-none bg-transparent p-0"
          position="bottom-left"
        >
          <Controls />
        </Panel>
        {showMinimap && (
          <MiniMap bgColor="var(--sidebar)" nodeStrokeColor="var(--border)" />
        )}
      </Canvas>
    </div>
  );
}
