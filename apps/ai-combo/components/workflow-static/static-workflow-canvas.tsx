/**
 * @fileoverview Static Workflow Canvas Component
 *
 * @module StaticWorkflowCanvas
 * @description
 * React Flow canvas for static workflows - IDENTICAL to regular workflow
 * but with static workflow definition loaded and no node/edge creation.
 * Reuses ALL existing workflow components and handlers.
 */

"use client";

import {
  ConnectionMode,
  MiniMap,
  type OnConnect,
  type OnSelectionChangeParams,
  useReactFlow,
} from "@xyflow/react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
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
  onEdgesChangeAtom,
  onNodesChangeAtom,
  selectedEdgeAtom,
  selectedNodeAtom,
  showMinimapAtom,
  type WorkflowNode,
} from "@/lib/workflow-store";
import { Edge } from "@/components/ai-elements/edge";
import { ActionNode } from "@/components/workflow/nodes/action-node";
import { TriggerNode } from "@/components/workflow/nodes/trigger-node";
import { createStaticWorkflow } from "@/plugins/workflows-static/workflow-definition";

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
 * IDENTICAL to WorkflowCanvas but loads static workflow and disables node/edge creation
 */
export function StaticWorkflowCanvas() {
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const [showMinimap] = useAtom(showMinimapAtom);
  const onNodesChange = useSetAtom(onNodesChangeAtom);
  const onEdgesChange = useSetAtom(onEdgesChangeAtom);
  const setSelectedNode = useSetAtom(selectedNodeAtom);
  const setSelectedEdge = useSetAtom(selectedEdgeAtom);
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

  // Connection handler - disabled for static workflow (connections are fixed)
  const onConnect: OnConnect = useCallback(() => {
    // Static workflow: connections are fixed, no editing allowed
    // This is a no-op but required by React Flow
  }, []);

  // Node click handler - select node for code editing
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: WorkflowNode) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode],
  );

  // Edge click handler
  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: { id: string }) => {
      setSelectedEdge(edge.id);
    },
    [setSelectedEdge],
  );

  // Selection change handler
  const onSelectionChange = useCallback(
    (params: OnSelectionChangeParams) => {
      if (params.nodes.length > 0) {
        setSelectedNode(params.nodes[0].id);
      } else if (params.edges.length > 0) {
        setSelectedEdge(params.edges[0].id);
      } else {
        setSelectedNode(null);
        setSelectedEdge(null);
      }
    },
    [setSelectedNode, setSelectedEdge],
  );

  // Pane click handler - deselect
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [setSelectedNode, setSelectedEdge]);

  // Disable connections in static workflow
  const isValidConnection = useCallback(() => false, []);

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

      {/* React Flow Canvas - IDENTICAL to regular workflow */}
      <Canvas
        className="bg-background"
        connectionLineComponent={Connection}
        connectionMode={ConnectionMode.Strict}
        defaultEdgeOptions={{ type: "animated" }}
        edges={edges}
        edgeTypes={edgeTypes}
        elementsSelectable={true}
        isValidConnection={isValidConnection} // Disable new connections
        nodes={nodes}
        nodesConnectable={false} // Disable connecting nodes
        nodesDraggable={true} // Allow dragging for layout
        nodeTypes={nodeTypes}
        onConnect={undefined} // Disable new connections
        onEdgeClick={onEdgeClick}
        onEdgesChange={onEdgesChange} // CRITICAL: Required for edges to work
        onNodeClick={onNodeClick}
        onNodesChange={onNodesChange} // CRITICAL: Required for dragging to work
        onPaneClick={onPaneClick}
        onSelectionChange={onSelectionChange}
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
