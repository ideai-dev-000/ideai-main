/**
 * Workflow Mode - Node Components
 *
 * This is the default/parent mode. All existing node components are used here.
 */

import { PlayCircle, Zap } from "lucide-react";
import { ActionNode } from "@/components/workflow/nodes/action-node";
import { AddNode } from "@/components/workflow/nodes/add-node";
import { TriggerNode } from "@/components/workflow/nodes/trigger-node";
import type { WorkflowNodeType } from "@/lib/workflow-store";

export const workflowNodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  add: AddNode,
};

export const workflowNodeTemplates = [
  {
    type: "trigger" as WorkflowNodeType,
    label: "",
    description: "",
    displayLabel: "Trigger",
    icon: PlayCircle,
    defaultConfig: { triggerType: "Manual" },
  },
  {
    type: "action" as WorkflowNodeType,
    label: "",
    description: "",
    displayLabel: "Action",
    icon: Zap,
    defaultConfig: {},
  },
];
