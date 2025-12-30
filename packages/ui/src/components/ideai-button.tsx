/**
 * @fileoverview IdeaI button component with centralized styling
 * 
 * @module IdeaIButton
 * @description
 * Shared button component that uses ONLY centralized CSS classes.
 * Guaranteed identical rendering across all apps.
 * NO app-specific CSS classes allowed.
 * 
 * @example
 * ```tsx
 * import { IdeaIButton } from "@repo/ui/components/ideai-button";
 * 
 * <IdeaIButton appName="web">Open alert</IdeaIButton>
 * ```
 * 
 * @see {@link ./ideai-header.tsx} - Header component
 */

"use client";

import { ReactNode } from "react";

interface IdeaIButtonProps {
  children: ReactNode;
  appName: string;
  onClick?: () => void;
}

export const IdeaIButton = ({ children, appName, onClick }: IdeaIButtonProps) => {
  const handleClick = onClick || (() => alert(`Hello from your ${appName} app!`));
  
  return (
    <button
      type="button"
      className="ideai-button-secondary"
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

