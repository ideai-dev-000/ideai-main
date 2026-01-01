/**
 * @fileoverview UniFrame Card Body Component - Semantic Body Element
 * 
 * @file uf-body.tsx
 * @module UniFrameCardBody
 * @description
 * Body component for UniFrame universal framework cards.
 * Provides semantic body structure for card content that adapts
 * styling based on the selected CSS framework.
 * 
 * Part of the UniFrame card system architecture:
 * - Card wrapper (uf-card.tsx)
 * - Header (uf-header.tsx)
 * - Body (this component)
 * - Footer (uf-footer.tsx)
 * 
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 * 
 * @example
 * ```tsx
 * import { UniFrameCardBody } from "@repo/ui/components/uniframe/uf-card/uf-body";
 * 
 * <UniFrameCardBody framework="tailwind">
 *   <p>Card body content</p>
 * </UniFrameCardBody>
 * ```
 * 
 * @see {@link ./uf-card.tsx} - Main card wrapper component
 * @see {@link ./uf-card-types.ts} - TypeScript type definitions
 * @see {@link ./uf-header.tsx} - Card header component
 * @see {@link ./uf-footer.tsx} - Card footer component
 * 
 * @todo Add support for custom body layouts
 * @todo Add grid/flex layout options
 */

import { ReactNode, HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";
import type { Framework } from "./uf-card-types";

interface UniFrameCardBodyProps extends HTMLAttributes<HTMLElement> {
  /** Framework to use for styling */
  framework: Framework;
  /** Body content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * UniFrame Card Body Component
 * 
 * Semantic body element for card components.
 * Uses proper HTML structure with framework-adaptive styling.
 * 
 * Features:
 * - Semantic HTML structure
 * - Framework-adaptive styling (Bootstrap uses card-body class)
 * - Composable content area
 * - Accessible structure
 * 
 * @param props - UniFrame card body component props
 * @returns React component
 */
export const UniFrameCardBody = ({
  framework,
  children,
  className,
  ...props
}: UniFrameCardBodyProps) => {
  const bodyClasses = framework === "bootstrap" ? "card-body" : "";

  return (
    <div className={cn(bodyClasses, className)} {...props}>
      {children}
    </div>
  );
};
