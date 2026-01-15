/**
 * @fileoverview New Vibe Button Component for Side Menu
 *
 * @module VibeNewButton
 * @description
 * Button to create a new vibe chat, similar to IdeAISideMenuNewWorkflow
 */

"use client";

import React from "react";
import { Code, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface VibeNewButtonProps {
  onCreateVibe?: () => void | Promise<void>;
  className?: string;
}

/**
 * New Vibe Button Component
 * Button to navigate to vibe home page to start a new chat
 */
export function VibeNewButton({ onCreateVibe, className }: VibeNewButtonProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = React.useState(false);

  const handleClick = React.useCallback(async () => {
    if (onCreateVibe) {
      setIsCreating(true);
      try {
        await onCreateVibe();
      } finally {
        setIsCreating(false);
      }
    } else {
      // Default: navigate to vibe home
      router.push("/vibe");
    }
  }, [onCreateVibe, router]);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isCreating}
        className="ideai-side-menu-new-button"
      >
        <span className="ideai-side-menu-new-icon">
          <Plus className="h-4 w-4" />
        </span>
        <span className="ideai-side-menu-new-text">
          {isCreating ? "Creating..." : "New Vibe"}
        </span>
        <Code className="h-4 w-4 opacity-50" />
      </button>
    </div>
  );
}
