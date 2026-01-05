/**
 * @fileoverview IdeaI React Flow Container - Styled container for flow diagrams
 *
 * @file ideai-reactflow-container.tsx
 * @module IdeaIReactFlowContainer
 * @description
 * Styled container component for React Flow diagrams with IdeaI design system.
 * Provides consistent sizing, borders, and responsive behavior.
 *
 * @author IdeaI Development Team
 * @since 2026-01-05
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * import { IdeaIReactFlowContainer } from "@repo/ui/components/reactflow/ideai-reactflow-container";
 *
 * <IdeaIReactFlowContainer>
 *   <ReactFlow nodes={nodes} edges={edges} />
 * </IdeaIReactFlowContainer>
 * ```
 */

"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

/**
 * Props for IdeaI React Flow Container
 */
export interface IdeaIReactFlowContainerProps {
  children: ReactNode;
  className?: string;
  height?: string;
}

/**
 * IdeaI React Flow Container Component
 *
 * Provides a styled container for React Flow diagrams with:
 * - Consistent borders and shadows
 * - Responsive sizing
 * - Dark mode support
 * - IdeaI design tokens
 */
export function IdeaIReactFlowContainer({
  children,
  className,
  height = "600px",
}: IdeaIReactFlowContainerProps) {
  return (
    <div
      className={cn(
        "w-full rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950",
        className,
      )}
      style={{ height }}
    >
      {children}
    </div>
  );
}
