/**
 * @fileoverview Static Workflow Executor
 *
 * @module StaticWorkflowExecutor
 * @description
 * Simple executor for static workflows that runs steps in order.
 * Updates node statuses as workflow executes.
 */

import type { WorkflowNode, WorkflowEdge } from "./workflow-store";

/**
 * Execute a static workflow step
 * For now, this is a simple function that simulates execution
 * In the future, this can run actual code from the step's action code
 */
async function executeStep(
  node: WorkflowNode,
  input: Record<string, unknown> = {},
): Promise<Record<string, unknown>> {
  // Simulate execution delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // For now, just return the input with a success status
  // In the future, this can execute the actual code from node.data.config.actionCode
  return {
    ...input,
    status: "success",
    stepId: node.id,
    stepLabel: node.data.label,
    message: `${node.data.label} completed successfully`,
  };
}

/**
 * Get the next nodes to execute based on edges
 */
function getNextNodes(
  currentNodeId: string,
  edges: WorkflowEdge[],
  allNodes: WorkflowNode[],
): WorkflowNode[] {
  const nextNodeIds = edges
    .filter((edge) => edge.source === currentNodeId)
    .map((edge) => edge.target);

  return allNodes.filter((node) => nextNodeIds.includes(node.id));
}

/**
 * Execute static workflow
 * Runs steps in topological order (respecting dependencies)
 */
export async function executeStaticWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  updateNodeData: (update: {
    id: string;
    data: { status?: "idle" | "running" | "success" | "error" };
  }) => void,
): Promise<void> {
  // Reset all nodes to idle
  nodes.forEach((node) => {
    updateNodeData({ id: node.id, data: { status: "idle" } });
  });

  // Find trigger node (first node in the flow)
  const triggerNode = nodes.find((node) => {
    // A trigger node has no incoming edges
    return !edges.some((edge) => edge.target === node.id);
  });

  if (!triggerNode) {
    console.error("No trigger node found in static workflow");
    return;
  }

  // Execute workflow using BFS (breadth-first search) to handle parallel steps
  const queue: Array<{ node: WorkflowNode; input: Record<string, unknown> }> = [
    { node: triggerNode, input: {} },
  ];
  const executed = new Set<string>();

  while (queue.length > 0) {
    const { node, input } = queue.shift()!;

    // Skip if already executed
    if (executed.has(node.id)) {
      continue;
    }

    // Mark as running
    updateNodeData({ id: node.id, data: { status: "running" } });

    try {
      // Execute step
      const output = await executeStep(node, input);

      // Mark as success
      updateNodeData({ id: node.id, data: { status: "success" } });
      executed.add(node.id);

      // Get next nodes
      const nextNodes = getNextNodes(node.id, edges, nodes);

      // For parallel steps (multiple next nodes), execute them all
      // For sequential steps (single next node), execute in order
      for (const nextNode of nextNodes) {
        // Check if all prerequisite nodes are executed
        const prerequisites = edges
          .filter((edge) => edge.target === nextNode.id)
          .map((edge) => edge.source);

        const allPrerequisitesExecuted = prerequisites.every((prereqId) =>
          executed.has(prereqId),
        );

        if (allPrerequisitesExecuted) {
          queue.push({ node: nextNode, input: output });
        }
      }
    } catch (error) {
      // Mark as error
      updateNodeData({ id: node.id, data: { status: "error" } });
      console.error(`Error executing step ${node.id}:`, error);
      // Stop execution on error
      break;
    }
  }
}
