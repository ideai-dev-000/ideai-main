/**
 * Architecture Mode - Node Components
 *
 * Example architecture mode with diagram shapes.
 * This demonstrates how to create a child mode with different node types.
 */

import type { NodeProps } from "@xyflow/react";
import {
  Circle,
  Diamond,
  Hexagon,
  RectangleHorizontal,
  Square,
} from "lucide-react";
import { AddNode } from "@/components/workflow/nodes/add-node";
import type { WorkflowNodeType } from "@/lib/workflow-store";

// Placeholder components - these would be custom architecture node components
// For now, we'll use a simple wrapper that shows the shape type
function ArchitectureShapeNode({ data }: NodeProps) {
  const shapeType = (data as { shapeType?: string }).shapeType || "shape";
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded border bg-background">
      <span className="text-xs">{shapeType}</span>
    </div>
  );
}

export const architectureNodeTypes = {
  rectangle: ArchitectureShapeNode,
  circle: ArchitectureShapeNode,
  diamond: ArchitectureShapeNode,
  square: ArchitectureShapeNode,
  hexagon: ArchitectureShapeNode,
  add: AddNode,
};

// Define architecture node templates
export const architectureNodeTemplates = [
  {
    type: "rectangle" as WorkflowNodeType,
    label: "",
    description: "",
    displayLabel: "Rectangle",
    icon: RectangleHorizontal,
    defaultConfig: { shapeType: "rectangle" },
  },
  {
    type: "circle" as WorkflowNodeType,
    label: "",
    description: "",
    displayLabel: "Circle",
    icon: Circle,
    defaultConfig: { shapeType: "circle" },
  },
  {
    type: "diamond" as WorkflowNodeType,
    label: "",
    description: "",
    displayLabel: "Diamond",
    icon: Diamond,
    defaultConfig: { shapeType: "diamond" },
  },
  {
    type: "square" as WorkflowNodeType,
    label: "",
    description: "",
    displayLabel: "Square",
    icon: Square,
    defaultConfig: { shapeType: "square" },
  },
  {
    type: "hexagon" as WorkflowNodeType,
    label: "",
    description: "",
    displayLabel: "Hexagon",
    icon: Hexagon,
    defaultConfig: { shapeType: "hexagon" },
  },
];
