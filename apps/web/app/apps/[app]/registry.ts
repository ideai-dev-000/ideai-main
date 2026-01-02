/**
 * @fileoverview Child App Registry - Maps child app names to their page components
 * 
 * @module ChildAppRegistry
 * @description
 * Registry for unified mode. Maps child app names to their page components.
 * 
 * IMPORTANT: Child app pages are server components, so we can't directly
 * import them into a client component. Instead, we'll use dynamic imports
 * or create wrapper components.
 * 
 * For unified mode, we need a different approach - we'll use iframes
 * pointing to the same origin, or we need to make child app pages
 * client components.
 * 
 * TODO: Refactor child app pages to be client components, or use
 * a different approach for unified mode.
 */

import type { ComponentType } from "react";

// Registry map - currently empty as we can't import server components
const registry = new Map<string, ComponentType<Record<string, unknown>>>();

/**
 * Register a child app component
 */
export function registerChildApp(appName: string, component: ComponentType<Record<string, unknown>>): void {
  registry.set(appName, component);
}

/**
 * Get child app component from registry
 * Returns null for now - child apps are server components
 */
export function getChildAppComponent(appName: string): ComponentType<Record<string, unknown>> | null {
  // For now, return null - we can't use server components in client components
  // We'll need to use iframes or refactor child apps to be client components
  return registry.get(appName) || null;
}

/**
 * Check if child app is registered
 */
export function isChildAppRegistered(appName: string): boolean {
  return registry.has(appName);
}
