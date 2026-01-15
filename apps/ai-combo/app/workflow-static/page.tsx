/**
 * @fileoverview Static Workflow Page
 *
 * @module StaticWorkflowPage
 * @description
 * Page to create and manage static workflows.
 * Loads the pre-defined static workflow structure.
 */

"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import {
  currentWorkflowNameAtom,
  edgesAtom,
  nodesAtom,
  type WorkflowNode,
} from "@/lib/workflow-store";
import { createStaticWorkflow } from "@/plugins/workflows-static/workflow-definition";
import { Button } from "@repo/ui";

export default function StaticWorkflowPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const setNodes = useSetAtom(nodesAtom);
  const setEdges = useSetAtom(edgesAtom);
  const setCurrentWorkflowName = useSetAtom(currentWorkflowNameAtom);
  const currentWorkflowName = useAtomValue(currentWorkflowNameAtom);

  // Check if user is authenticated
  const isAnonymous =
    !session?.user ||
    session.user.name === "Anonymous" ||
    session.user.email?.startsWith("temp-");

  // Create static workflow
  const handleCreateStaticWorkflow = useCallback(async () => {
    if (isAnonymous) {
      toast.error("Please sign in to create workflows");
      return;
    }

    try {
      // Get the static workflow structure
      const { nodes: staticNodes, edges: staticEdges } = createStaticWorkflow();

      // Generate unique IDs for nodes (keep the semantic IDs as base)
      const nodesWithIds: WorkflowNode[] = staticNodes.map((node) => ({
        ...node,
        id: `${node.id}-${nanoid(6)}`, // Keep semantic ID prefix
      }));

      // Update edge IDs to match new node IDs
      const edgesWithIds = staticEdges.map((edge) => {
        const sourceNode = nodesWithIds.find((n) =>
          n.id.startsWith(edge.source),
        );
        const targetNode = nodesWithIds.find((n) =>
          n.id.startsWith(edge.target),
        );
        if (!sourceNode || !targetNode) {
          throw new Error(`Could not find node for edge ${edge.id}`);
        }
        return {
          ...edge,
          id: `e-${nanoid(6)}`,
          source: sourceNode.id,
          target: targetNode.id,
        };
      });

      // Create workflow in database
      const workflowName = `Static Workflow ${new Date().toLocaleDateString()}`;
      const workflow = await api.workflow.create({
        name: workflowName,
        nodes: nodesWithIds,
        edges: edgesWithIds,
      });

      // Set atoms to load the workflow
      setNodes(nodesWithIds);
      setEdges(edgesWithIds);
      setCurrentWorkflowName(workflowName);

      toast.success("Static workflow created!");

      // Navigate to workflow builder
      router.push(`/workflow/workflows/${workflow.id}`);
    } catch (error) {
      console.error("Failed to create static workflow:", error);
      toast.error("Failed to create static workflow");
    }
  }, [isAnonymous, setNodes, setEdges, setCurrentWorkflowName, router]);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Static Workflows</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Create a pre-defined static workflow with hardcoded actions that
          always work. No configuration needed - just run the workflow.
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Workflow Structure</h2>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <div>
              1. <strong>Trigger</strong> - Start the workflow
            </div>
            <div>
              2. <strong>Requirement Taker</strong> - Capture requirements
            </div>
            <div>
              3. <strong>Task Generator</strong> - Generate tasks
            </div>
            <div>
              4. <strong>Development, Design, Data</strong> - Parallel phases
            </div>
            <div>
              5. <strong>Build</strong> - Combine all phases
            </div>
            <div>
              6. <strong>QA</strong> - Quality assurance
            </div>
            <div>
              7. <strong>Deploy</strong> - Deploy to production
            </div>
            <div>
              8. <strong>Maintain</strong> - Ongoing maintenance
            </div>
            <div>
              9. <strong>Archive</strong> - Archive completed workflow
            </div>
          </div>
        </div>

        <Button
          onClick={handleCreateStaticWorkflow}
          disabled={isAnonymous}
          className="w-full"
        >
          Create Static Workflow
        </Button>

        {isAnonymous && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-center">
            Please sign in to create workflows
          </p>
        )}
      </div>
    </div>
  );
}
