/**
 * @fileoverview Card component from the shared UI library
 * 
 * @module Card
 * @description
 * A reusable card component that renders as a link with title and content.
 * This component is part of the shared UI package and can be used
 * across all applications in the monorepo.
 * 
 * @example
 * ```tsx
 * import { Card } from "@repo/ui/card";
 * 
 * <Card
 *   title="Card Title"
 *   href="https://example.com"
 *   className="my-card"
 * >
 *   Card content here
 * </Card>
 * ```
 * 
 * @see {@link ../button.tsx} - Button component
 * @see {@link ../code.tsx} - Code component
 */

import { type JSX } from "react";

export function Card({
  className,
  title,
  children,
  href,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  href: string;
}): JSX.Element {
  return (
    <a
      className={className}
      href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo"`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <h2>
        {title} <span>-&gt;</span>
      </h2>
      <p>{children}</p>
    </a>
  );
}
