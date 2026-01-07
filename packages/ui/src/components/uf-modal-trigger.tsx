/**
 * @fileoverview UniFrame Modal Trigger Component
 *
 * @file uf-modal-trigger.tsx
 * @module UFModalTrigger
 * @description
 * Complete solution that includes both the trigger button and the modal.
 * Opens the UniFrame demo in an isolated modal when clicked.
 *
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 *
 * @example
 * ```tsx
 * import { UFModalTrigger } from "@repo/ui/components/uf-modal-trigger";
 *
 * <UFModalTrigger defaultFramework="tailwind" />
 * ```
 *
 * @see {@link ./uf-modal.tsx} - Modal component
 * @see {@link ./uf-iframe-wrapper.tsx} - IFrame wrapper component
 */

"use client";

import { useState } from "react";
import { UFModal } from "./uf-modal";

/**
 * UniFrame Modal Trigger Component Props
 */
export interface UFModalTriggerProps {
  /** Initial framework selection */
  defaultFramework?: string;
  /** Button text */
  buttonText?: string;
  /** Button variant/style */
  variant?: "default" | "primary" | "outline";
  /** Additional CSS classes */
  className?: string;
}

/**
 * UniFrame Modal Trigger Component
 *
 * Provides a button that opens the UniFrame demo in a modal.
 * Includes the modal state management.
 */
export const UFModalTrigger = ({
  defaultFramework = "tailwind",
  buttonText = "Open UniFrame Demo",
  variant = "primary",
  className,
}: UFModalTriggerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const buttonClasses = {
    default:
      "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100",
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg",
    outline:
      "border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100",
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`px-6 py-3 rounded-lg font-medium transition-all ${buttonClasses[variant]} ${className || ""}`}
        type="button"
      >
        {buttonText}
      </button>

      <UFModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultFramework={defaultFramework}
      />
    </>
  );
};


