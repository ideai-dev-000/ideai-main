/**
 * @fileoverview Code component from the shared UI library
 * 
 * @module Code
 * @description
 * A reusable code component for displaying inline code snippets.
 * This component is part of the shared UI package and can be used
 * across all applications in the monorepo.
 * 
 * @example
 * ```tsx
 * import { Code } from "@repo/ui/code";
 * 
 * <Code className="my-code">
 *   const example = "code";
 * </Code>
 * ```
 * 
 * @see {@link ../button.tsx} - Button component
 * @see {@link ../card.tsx} - Card component
 */

import { type JSX } from "react";

export function Code({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  return <code className={className}>{children}</code>;
}
