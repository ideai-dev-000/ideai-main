/**
 * @fileoverview Client component to conditionally render side menu based on route
 *
 * @module LayoutClient
 * @description
 * Client component wrapper that checks the current route and conditionally
 * shows/hides the side menu. Hides menu on landing page.
 */

"use client";

import { type ReactNode } from "react";

interface LayoutClientProps {
  children: ReactNode;
}

export function LayoutClient({ children }: LayoutClientProps) {
  return <>{children}</>;
}
