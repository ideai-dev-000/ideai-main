/**
 * @fileoverview Button component from the shared UI library
 * 
 * @module Button
 * @description
 * A reusable button component that displays an alert when clicked.
 * This component is part of the shared UI package and can be used
 * across all applications in the monorepo.
 * 
 * @example
 * ```tsx
 * import { Button } from "@repo/ui/button";
 * 
 * <Button appName="web" className="my-button">
 *   Click me
 * </Button>
 * ```
 * 
 * @see {@link ../card.tsx} - Card component
 * @see {@link ../code.tsx} - Code component
 */

"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export const Button = ({ children, className, appName }: ButtonProps) => {
  return (
    <button
      className={className}
      onClick={() => alert(`Hello from your ${appName} app!`)}
      type="button"
    >
      {children}
    </button>
  );
};
