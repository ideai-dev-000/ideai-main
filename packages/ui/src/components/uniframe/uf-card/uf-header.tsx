/**
 * @fileoverview UniFrame Card Header Component - Semantic Header Element
 * 
 * @file uf-header.tsx
 * @module UniFrameCardHeader
 * @description
 * Header component for UniFrame framework cards.
 * Provides semantic header structure with title and description that adapts
 * styling based on the selected CSS framework.
 * 
 * Part of the UniFrame card system architecture:
 * - Card wrapper (uf-card.tsx)
 * - Header (this component)
 * - Body (uf-body.tsx)
 * - Footer (uf-footer.tsx)
 * 
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 * 
 * @example
 * ```tsx
 * import { UniFrameCardHeader } from "@repo/ui/components/uniframe/uf-card/uf-header";
 * 
 * <UniFrameCardHeader
 *   framework="tailwind"
 *   title="Card Title"
 *   description="Card description"
 * />
 * ```
 * 
 * @see {@link ./uf-card.tsx} - Main card wrapper component
 * @see {@link ./uf-card-types.ts} - TypeScript type definitions
 * @see {@link ./uf-body.tsx} - Card body component
 * @see {@link ./uf-footer.tsx} - Card footer component
 * 
 * @todo Add support for custom header layouts
 * @todo Add icon support in header
 */

import { ReactNode, HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";
import type { Framework, frameworkConfigs } from "./uf-card-types";

interface UniFrameCardHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Framework to use for styling */
  framework: Framework;
  /** Header title */
  title: string;
  /** Header description */
  description?: string;
  /** Additional content */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * UniFrame Card Header Component
 * 
 * Semantic header element for card components.
 * Uses proper HTML header element with framework-adaptive styling.
 * 
 * Features:
 * - Semantic HTML (header element)
 * - Framework-adaptive typography
 * - Accessible heading structure
 * - Composable with additional children
 * 
 * @param props - UniFrame card header component props
 * @returns React component
 */
export const UniFrameCardHeader = ({
  framework,
  title,
  description,
  children,
  className,
  ...props
}: UniFrameCardHeaderProps) => {
  const config = frameworkConfigs[framework];
  const headerClasses = framework === "bootstrap" ? "mb-3" : "mb-6";

  return (
    <header className={cn(headerClasses, className)} {...props}>
      <h2 className={config.titleClasses}>{title}</h2>
      {description && <p className={config.descriptionClasses}>{description}</p>}
      {children}
    </header>
  );
};
