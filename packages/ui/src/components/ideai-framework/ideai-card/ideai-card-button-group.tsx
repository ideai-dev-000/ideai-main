/**
 * @fileoverview IdeaI Card Button Group Component
 *
 * @module IdeAICardButtonGroup
 * @description
 * Button group component that groups multiple buttons together.
 * Provides consistent spacing and layout for button groups.
 * Part of the IdeaI framework card system.
 *
 * @example
 * ```tsx
 * <IdeAICardButtonGroup framework="tailwind">
 *   <IdeAICardButton framework="tailwind">Save</IdeAICardButton>
 *   <IdeAICardButton framework="tailwind" variant="secondary">Cancel</IdeAICardButton>
 * </IdeAICardButtonGroup>
 * ```
 */

import { ReactNode, HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";
import type { Framework } from "./ideai-card-types";

interface IdeAICardButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
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
 * IdeaI Card Button Group Component
 *
 * Groups multiple buttons together with consistent spacing.
 * Uses semantic div with role="group" for accessibility.
 */
export const IdeAICardButtonGroup = ({
  framework,
  children,
  className,
  direction = "horizontal",
  ...props
}: IdeAICardButtonGroupProps) => {
  const baseClasses =
    framework === "bootstrap"
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


