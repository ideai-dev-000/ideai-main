/**
 * @fileoverview Child App Wrapper - Wraps child app pages for unified mode
 * 
 * @module ChildAppWrapper
 * @description
 * Wrapper component that renders child app pages in unified mode.
 * Since child app pages are server components, we need to fetch and render them.
 * 
 * For now, we'll use a simpler approach: render child app content directly
 * by importing their page components (which are server components).
 */

"use client";

import { ReactNode } from "react";

interface ChildAppWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper for child app content
 * This ensures child apps render correctly in unified mode
 */
export function ChildAppWrapper({ children }: ChildAppWrapperProps) {
  return <>{children}</>;
}








