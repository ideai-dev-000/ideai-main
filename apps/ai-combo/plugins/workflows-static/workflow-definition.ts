/**
 * @fileoverview Static Workflow Definition
 *
 * @module StaticWorkflowDefinition
 * @description
 * Pre-defined workflow structure that follows the specified flow:
 * Trigger → Requirement Taker → Task Generator →
 * (Development, Design, Data in parallel) →
 * Build → QA → Deploy → Maintain → Archive
 */

import type { WorkflowNode, WorkflowEdge } from "@/lib/workflow-store";

/**
 * Create the default static workflow structure
 */
export function createStaticWorkflow(): {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
} {
  const nodes: WorkflowNode[] = [
    // Trigger
    {
      id: "trigger",
      type: "action",
      position: { x: 100, y: 100 },
      data: {
        actionType: "workflows-static/trigger",
        label: "Trigger",
        config: {},
      },
    },
    // Requirement Taker
    {
      id: "requirement-taker",
      type: "action",
      position: { x: 300, y: 100 },
      data: {
        actionType: "workflows-static/requirement-taker",
        label: "Requirement Taker",
        config: {},
      },
    },
    // Task Generator
    {
      id: "task-generator",
      type: "action",
      position: { x: 500, y: 100 },
      data: {
        actionType: "workflows-static/task-generator",
        label: "Task Generator",
        config: {},
      },
    },
    // Parallel: Development
    {
      id: "development",
      type: "action",
      position: { x: 700, y: 0 },
      data: {
        actionType: "workflows-static/development",
        label: "Development",
        config: {},
      },
    },
    // Parallel: Design
    {
      id: "design",
      type: "action",
      position: { x: 700, y: 100 },
      data: {
        actionType: "workflows-static/design",
        label: "Design",
        config: {},
      },
    },
    // Parallel: Data
    {
      id: "data",
      type: "action",
      position: { x: 700, y: 200 },
      data: {
        actionType: "workflows-static/data",
        label: "Data",
        config: {},
      },
    },
    // Build (converges the three)
    {
      id: "build",
      type: "action",
      position: { x: 900, y: 100 },
      data: {
        actionType: "workflows-static/build",
        label: "Build",
        config: {},
      },
    },
    // QA
    {
      id: "qa",
      type: "action",
      position: { x: 1100, y: 100 },
      data: {
        actionType: "workflows-static/qa",
        label: "QA",
        config: {},
      },
    },
    // Deploy
    {
      id: "deploy",
      type: "action",
      position: { x: 1300, y: 100 },
      data: {
        actionType: "workflows-static/deploy",
        label: "Deploy",
        config: {},
      },
    },
    // Maintain
    {
      id: "maintain",
      type: "action",
      position: { x: 1500, y: 100 },
      data: {
        actionType: "workflows-static/maintain",
        label: "Maintain",
        config: {},
      },
    },
    // Archive
    {
      id: "archive",
      type: "action",
      position: { x: 1700, y: 100 },
      data: {
        actionType: "workflows-static/archive",
        label: "Archive",
        config: {},
      },
    },
  ];

  const edges: WorkflowEdge[] = [
    // Linear flow: Trigger → Requirement Taker → Task Generator
    {
      id: "e1",
      source: "trigger",
      target: "requirement-taker",
      sourceHandle: "output",
      targetHandle: "input",
    },
    {
      id: "e2",
      source: "requirement-taker",
      target: "task-generator",
      sourceHandle: "output",
      targetHandle: "input",
    },
    // Parallel: Task Generator → Development, Design, Data
    {
      id: "e3",
      source: "task-generator",
      target: "development",
      sourceHandle: "output",
      targetHandle: "input",
    },
    {
      id: "e4",
      source: "task-generator",
      target: "design",
      sourceHandle: "output",
      targetHandle: "input",
    },
    {
      id: "e5",
      source: "task-generator",
      target: "data",
      sourceHandle: "output",
      targetHandle: "input",
    },
    // Converge: Development, Design, Data → Build
    {
      id: "e6",
      source: "development",
      target: "build",
      sourceHandle: "output",
      targetHandle: "input",
    },
    {
      id: "e7",
      source: "design",
      target: "build",
      sourceHandle: "output",
      targetHandle: "input",
    },
    {
      id: "e8",
      source: "data",
      target: "build",
      sourceHandle: "output",
      targetHandle: "input",
    },
    // Linear flow: Build → QA → Deploy → Maintain → Archive
    {
      id: "e9",
      source: "build",
      target: "qa",
      sourceHandle: "output",
      targetHandle: "input",
    },
    {
      id: "e10",
      source: "qa",
      target: "deploy",
      sourceHandle: "output",
      targetHandle: "input",
    },
    {
      id: "e11",
      source: "deploy",
      target: "maintain",
      sourceHandle: "output",
      targetHandle: "input",
    },
    {
      id: "e12",
      source: "maintain",
      target: "archive",
      sourceHandle: "output",
      targetHandle: "input",
    },
  ];

  return { nodes, edges };
}
