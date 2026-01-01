/**
 * @fileoverview UniFrame Card Button Group Component - Button Container
 * 
 * @file uf-button-group.tsx
 * @module UniFrameCardButtonGroup
 * @description
 * Button group component for UniFrame universal framework cards.
 * Groups multiple buttons together with consistent spacing and layout
 * that adapts based on framework configuration.
 * 
 * Part of the UniFrame card system UI elements:
 * - Button (uf-button.tsx)
 * - Input (uf-input.tsx)
 * - Badge (uf-badge.tsx)
 * - FormField (uf-form-field.tsx)
 * - ButtonGroup (this component)
 * 
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 * 
 * @example
 * ```tsx
 * import { UniFrameCardButtonGroup } from "@repo/ui/components/uniframe/uf-card/uf-button-group";
 * 
 * <UniFrameCardButtonGroup framework="tailwind">
 *   <UniFrameCardButton framework="tailwind">Save</UniFrameCardButton>
 *   <UniFrameCardButton framework="tailwind" variant="secondary">Cancel</UniFrameCardButton>
 * </UniFrameCardButtonGroup>
 * ```
 * 
 * @see {@link ./uf-card.tsx} - Main card wrapper component
 * @see {@link ./uf-card-types.ts} - TypeScript type definitions
 * @see {@link ./uf-button.tsx} - Button element
 * 
 * @todo Add alignment options (left, center, right, justify)
 * @todo Add spacing variants
 */

import { ReactNode, HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";
import type { Framework } from "./uf-card-types";

interface UniFrameCardButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Framework to use for styling */
  framework: Framework;
  /** Button children */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Layout direction */
  direction?: "horizontal" | "vertical";
}

/**
 * UniFrame Card Button Group Component
 * 
 * Groups multiple buttons together with consistent spacing.
 * Uses semantic div with role="group" for accessibility.
 * 
 * Features:
 * - Semantic HTML (div with role="group")
 * - Framework-adaptive styling
 * - Flexible layout (horizontal/vertical)
 * - Accessible (ARIA group label)
 * - Consistent spacing
 * 
 * @param props - UniFrame card button group component props
 * @returns React component
 */
export const UniFrameCardButtonGroup = ({
  framework,
  children,
  className,
  direction = "horizontal",
  ...props
}: UniFrameCardButtonGroupProps) => {
  const baseClasses = framework === "bootstrap"
    ? "d-flex flex-wrap gap-2"
    : direction === "horizontal"
    ? "flex flex-wrap gap-3"
    : "flex flex-col gap-3";

  return (
    <div
      role="group"
      aria-label="Button group"
      className={cn(baseClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
};
