/**
 * @fileoverview IdeaI React Flow Node - Custom node component with IdeaI styling
 *
 * @file ideai-reactflow-node.tsx
 * @module IdeaIReactFlowNode
 * @description
 * Custom React Flow node component with IdeaI design system styling.
 * Provides consistent node appearance across all flow diagrams.
 *
 * @author IdeaI Development Team
 * @since 2026-01-05
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * import { IdeaIReactFlowNode } from "@repo/ui/components/reactflow/ideai-reactflow-node";
 *
 * const nodeTypes = {
 *   ideai: IdeaIReactFlowNode,
 * };
 * ```
 */

"use client";

import { Handle, Position, type NodeProps } from "reactflow";
import { cn } from "../../lib/utils";

/**
 * Props for IdeaI React Flow Node
 */
export interface IdeaIReactFlowNodeData {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}

/**
 * IdeaI React Flow Node Component
 *
 * Custom node with IdeaI design system styling.
 * Supports multiple variants and includes handles for connections.
 */
export function IdeaIReactFlowNode({
  data,
  selected,
}: NodeProps<IdeaIReactFlowNodeData>) {
  const variantStyles = {
    default: "bg-white border-slate-300 text-slate-900",
    primary:
      "bg-blue-50 border-blue-300 text-blue-900 dark:bg-blue-950 dark:border-blue-700 dark:text-blue-100",
    success:
      "bg-green-50 border-green-300 text-green-900 dark:bg-green-950 dark:border-green-700 dark:text-green-100",
    warning:
      "bg-yellow-50 border-yellow-300 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-700 dark:text-yellow-100",
    danger:
      "bg-red-50 border-red-300 text-red-900 dark:bg-red-950 dark:border-red-700 dark:text-red-100",
  };

  const variant = data.variant || "default";

  return (
    <div
      className={cn(
        "min-w-[150px] rounded-lg border-2 px-4 py-3 shadow-sm transition-all",
        variantStyles[variant],
        selected && "ring-2 ring-blue-500 ring-offset-2",
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-400" />
      <div className="flex items-center gap-2">
        {data.icon && <div className="flex-shrink-0">{data.icon}</div>}
        <div className="flex-1">
          <div className="font-semibold">{data.label}</div>
          {data.description && (
            <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {data.description}
            </div>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-slate-400"
      />
    </div>
  );
}
