/**
 * @fileoverview Pipeline Flow Component
 * @module @repo/semantic-pipeline/flow/pipeline-flow
 * @description
 * React Flow component for visualizing the semantic pipeline.
 */

'use client';

import React from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { createFlowNodes, createFlowEdges } from './flow-config';

/**
 * Pipeline Flow Component Props
 */
export interface PipelineFlowProps {
  /** Custom nodes */
  nodes?: Node[];
  /** Custom edges */
  edges?: Edge[];
  /** On node click handler */
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  /** Flow direction */
  direction?: 'horizontal' | 'vertical';
}

/**
 * Pipeline Flow Component
 * 
 * Interactive React Flow visualization of the semantic pipeline.
 */
export function PipelineFlow({
  nodes = createFlowNodes(),
  edges = createFlowEdges(),
  onNodeClick,
  direction = 'horizontal',
}: PipelineFlowProps) {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

