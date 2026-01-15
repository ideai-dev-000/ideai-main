/**
 * @fileoverview IdeaI Menu Section Component
 *
 * @module IdeAIMenuSection
 * @description
 * Collapsible section component for menu content
 */

"use client";

import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import type { IdeAIMenuSectionProps } from "./types";
import { IdeAIMenuContext, useIdeAIMenuContext } from "./context";

/**
 * Menu Section Component
 */
export function IdeAIMenuSection({
  id,
  title,
  defaultOpen = false,
  isCompleted: isCompletedProp = false,
  autoOpenNext = false,
  children,
  className,
}: IdeAIMenuSectionProps) {
  const context = React.useContext(IdeAIMenuContext);
  const [localIsOpen, setLocalIsOpen] = React.useState(defaultOpen);
  const [localIsCompleted, setLocalIsCompleted] =
    React.useState(isCompletedProp);

  // Use context if available, otherwise use local state
  const isOpen = context
    ? (context.sections.get(id)?.isOpen ?? localIsOpen)
    : localIsOpen;
  const isCompleted = context
    ? (context.sections.get(id)?.isCompleted ?? localIsCompleted)
    : localIsCompleted;

  const contextRef = React.useRef(context);
  React.useEffect(() => {
    contextRef.current = context;
  }, [context]);

  const hasRegisteredRef = React.useRef(false);
  const defaultOpenSetRef = React.useRef(false);

  React.useEffect(() => {
    if (contextRef.current && !hasRegisteredRef.current) {
      contextRef.current.registerSection(id, autoOpenNext);
      hasRegisteredRef.current = true;
    }
    if (
      contextRef.current &&
      defaultOpen &&
      !defaultOpenSetRef.current &&
      !contextRef.current.sections.get(id)?.isOpen
    ) {
      contextRef.current.setSectionOpen(id, true);
      defaultOpenSetRef.current = true;
    }
  }, [id, autoOpenNext, defaultOpen]);

  React.useEffect(() => {
    if (!context) {
      setLocalIsOpen(defaultOpen);
      setLocalIsCompleted(isCompletedProp);
    }
  }, [context, defaultOpen, isCompletedProp]);

  const handleToggle = () => {
    if (context) {
      context.setSectionOpen(id, !isOpen);
    } else {
      setLocalIsOpen(!localIsOpen);
    }
  };

  return (
    <div className={cn("ideai-menu-section", className)} data-section-id={id}>
      <button
        type="button"
        className="ideai-menu-section-header"
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <span className="ideai-menu-section-title">{title}</span>
        <div className="ideai-menu-section-actions">
          {isCompleted && (
            <span
              className="ideai-menu-section-completed"
              aria-label="Completed"
            >
              ✓
            </span>
          )}
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      </button>
      {isOpen && <div className="ideai-menu-section-content">{children}</div>}
    </div>
  );
}

// Re-export context hook for convenience
export { useIdeAIMenuContext } from "./context";
