/**
 * @fileoverview Demo Button UI Component
 * 
 * @module DemoButton
 * @description
 * Simple button component demonstrating correct import patterns for v0.
 * Uses shadcn Button from @/components/ui/button
 */

"use client";

import { Button } from "@/components/ui/button";

interface DemoButtonProps {
  label?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onClick?: () => void;
}

export function DemoButton({ 
  label = "Click me", 
  variant = "default",
  onClick 
}: DemoButtonProps) {
  return (
    <Button variant={variant} onClick={onClick}>
      {label}
    </Button>
  );
}

