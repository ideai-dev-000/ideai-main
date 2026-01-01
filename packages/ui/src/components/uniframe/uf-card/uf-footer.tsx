/**
 * @fileoverview UniFrame Card Footer Component - Semantic Footer Element
 * 
 * @file uf-footer.tsx
 * @module UniFrameCardFooter
 * @description
 * Footer component for UniFrame framework cards.
 * Provides semantic footer structure for card metadata that adapts
 * styling based on the selected CSS framework.
 * 
 * Part of the UniFrame card system architecture:
 * - Card wrapper (uf-card.tsx)
 * - Header (uf-header.tsx)
 * - Body (uf-body.tsx)
 * - Footer (this component)
 * 
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 * 
 * @example
 * ```tsx
 * import { UniFrameCardFooter } from "@repo/ui/components/uniframe/uf-card/uf-footer";
 * 
 * <UniFrameCardFooter framework="tailwind">
 *   <p>Footer content</p>
 * </UniFrameCardFooter>
 * ```
 * 
 * @see {@link ./uf-card.tsx} - Main card wrapper component
 * @see {@link ./uf-card-types.ts} - TypeScript type definitions
 * @see {@link ./uf-header.tsx} - Card header component
 * @see {@link ./uf-body.tsx} - Card body component
 * 
 * @todo Add support for footer actions
 * @todo Add timestamp/date display options
 */

import { ReactNode, HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";
import type { Framework, frameworkConfigs } from "./uf-card-types";

interface UniFrameCardFooterProps extends HTMLAttributes<HTMLElement> {
  /** Framework to use for styling */
  framework: Framework;
  /** Footer content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * UniFrame Card Footer Component
 * 
 * Semantic footer element for card components.
 * Uses proper HTML footer element with framework-adaptive styling.
 * 
 * Features:
 * - Semantic HTML (footer element)
 * - Framework-adaptive styling
 * - Border separator (non-Bootstrap frameworks)
 * - Composable content area
 * 
 * @param props - UniFrame card footer component props
 * @returns React component
 */
export const UniFrameCardFooter = ({
  framework,
  children,
  className,
  ...props
}: UniFrameCardFooterProps) => {
  const config = frameworkConfigs[framework];
  const footerClasses = framework === "bootstrap"
    ? "card-footer bg-transparent border-top pt-3"
    : "pt-4 border-t border-slate-200 dark:border-slate-700";

  return (
    <footer className={cn(footerClasses, className)} {...props}>
      {children}
    </footer>
  );
};
