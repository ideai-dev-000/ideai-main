/**
 * @fileoverview IdeaI Framework Button Group Molecule
 * 
 * @module IdeAIFrameworkButtonGroup
 * @description
 * Molecular component that groups multiple button atoms together.
 * Provides consistent spacing and layout for button groups.
 * 
 * @example
 * ```tsx
 * <IdeAIFrameworkButtonGroup framework="tailwind">
 *   <IdeAIFrameworkButton framework="tailwind">Save</IdeAIFrameworkButton>
 *   <IdeAIFrameworkButton framework="tailwind" variant="secondary">Cancel</IdeAIFrameworkButton>
 * </IdeAIFrameworkButtonGroup>
 * ```
 */

import { ReactNode, HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import type { Framework } from "../organisms/ideai-framework-card-types";

interface IdeAIFrameworkButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
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
 * IdeaI Framework Button Group Molecule
 * 
 * Groups multiple buttons together with consistent spacing.
 * Uses semantic div with role="group" for accessibility.
 */
export const IdeAIFrameworkButtonGroup = ({
  framework,
  children,
  className,
  direction = "horizontal",
  ...props
}: IdeAIFrameworkButtonGroupProps) => {
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


