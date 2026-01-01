/**
 * @fileoverview IdeaI Card Body Component
 * 
 * @module IdeAICardBody
 * @description
 * Body component for IdeaI framework cards.
 * Provides semantic body structure for card content.
 * 
 * @example
 * ```tsx
 * <IdeAICardBody framework="tailwind">
 *   <p>Card body content</p>
 * </IdeAICardBody>
 * ```
 */

import { ReactNode, HTMLAttributes } from "react";
import { cn } from "../../../lib/utils";
import type { Framework } from "./ideai-card-types";

interface IdeAICardBodyProps extends HTMLAttributes<HTMLElement> {
  /** Framework to use for styling */
  framework: Framework;
  /** Body content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * IdeaI Card Body Component
 * 
 * Semantic body element for card components.
 * Uses proper HTML structure with framework-adaptive styling.
 */
export const IdeAICardBody = ({
  framework,
  children,
  className,
  ...props
}: IdeAICardBodyProps) => {
  const bodyClasses = framework === "bootstrap" ? "card-body" : "";

  return (
    <div className={cn(bodyClasses, className)} {...props}>
      {children}
    </div>
  );
};


