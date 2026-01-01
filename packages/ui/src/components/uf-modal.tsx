/**
 * @fileoverview UniFrame Modal/Popover Component
 * 
 * @file uf-modal.tsx
 * @module UFModal
 * @description
 * Modal/popover wrapper for UniFrame demo that displays the iframe in isolation.
 * Features:
 * - Centered in viewport
 * - Backdrop that blocks clicks and hides content below header
 * - Can be opened/closed
 * - Prevents click-throughs
 * 
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 * 
 * @example
 * ```tsx
 * import { UFModal } from "@repo/ui/components/uf-modal";
 * 
 * <UFModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
 * ```
 * 
 * @see {@link ./uf-iframe-wrapper.tsx} - IFrame wrapper component
 */

"use client";

import { useEffect } from "react";
import { UFIFrameWrapper } from "./uf-iframe-wrapper";

/**
 * UniFrame Modal Component Props
 */
export interface UFModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Initial framework selection */
  defaultFramework?: string;
  /** Modal title */
  title?: string;
}

/**
 * UniFrame Modal Component
 * 
 * Displays the UniFrame demo in a centered modal with backdrop.
 * Blocks all interactions outside the modal.
 */
export const UFModal = ({
  isOpen,
  onClose,
  defaultFramework = "tailwind",
  title = "UniFrame Demo - Isolated CSS",
}: UFModalProps) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Backdrop - blocks clicks and hides content */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className="relative z-10 w-full max-w-6xl mx-4 max-h-[90vh] bg-white dark:bg-slate-900 rounded-lg shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* IFrame Content */}
        <div className="flex-1 overflow-hidden rounded-b-lg">
          <UFIFrameWrapper
            defaultFramework={defaultFramework}
            height="calc(90vh - 80px)"
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};


