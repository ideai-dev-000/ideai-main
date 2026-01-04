/**
 * @fileoverview Copy Button Tool
 * 
 * @module CopyButton
 * @description
 * Utility tool component demonstrating interactive functionality.
 * This is a "tool" - a utility component with behavior.
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = "Copy" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleCopy}
      className="gap-2"
    >
      {copied ? "✓ Copied!" : label}
    </Button>
  );
}

