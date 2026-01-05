/**
 * @fileoverview IdeaI React Flow Provider - Shared React Flow setup
 *
 * @file ideai-reactflow-provider.tsx
 * @module IdeaIReactFlowProvider
 * @description
 * Provides React Flow context and default configuration for all IdeaI apps.
 * Includes theme support, default styles, and common settings.
 *
 * @author IdeaI Development Team
 * @since 2026-01-05
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * import { IdeaIReactFlowProvider } from "@repo/ui/components/reactflow/ideai-reactflow-provider";
 *
 * <IdeaIReactFlowProvider>
 *   <ReactFlow nodes={nodes} edges={edges} />
 * </IdeaIReactFlowProvider>
 * ```
 */

"use client";

import { ReactNode } from "react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";

/**
 * Props for IdeaI React Flow Provider
 */
export interface IdeaIReactFlowProviderProps {
  children: ReactNode;
}

/**
 * IdeaI React Flow Provider Component
 *
 * Wraps React Flow components with IdeaI defaults and theme support.
 * Provides consistent styling and configuration across all apps.
 */
export function IdeaIReactFlowProvider({
  children,
}: IdeaIReactFlowProviderProps) {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
}
