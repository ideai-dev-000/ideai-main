/**
 * @fileoverview IdeaI Card Header Component
 * 
 * @module IdeAICardHeader
 * @description
 * Header component for IdeaI framework cards.
 * Provides semantic header structure with title and description.
 * 
 * @example
 * ```tsx
 * <IdeAICardHeader
 *   framework="tailwind"
 *   title="Card Title"
 *   description="Card description"
 * />
 * ```
 */

import { ReactNode, HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";
import type { Framework, frameworkConfigs } from "./ideai-card-types";

interface IdeAICardHeaderProps extends HTMLAttributes<HTMLElement> {
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
 * IdeaI Card Header Component
 * 
 * Semantic header element for card components.
 * Uses proper HTML header element with framework-adaptive styling.
 */
export const IdeAICardHeader = ({
  framework,
  title,
  description,
  children,
  className,
  ...props
}: IdeAICardHeaderProps) => {
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


