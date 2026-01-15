/**
 * @fileoverview Unified Navigation Configuration
 *
 * @module NavConfig
 * @description
 * Single source of truth for all app navigation.
 * Maps to ideai-menu-main and can appear in header or standalone.
 */

import { Home, Workflow, Code, Info, FileCode } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
  badge?: string;
}

export interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

/**
 * Unified navigation configuration
 * This is the ONLY place to configure navigation
 * Icons are stored as component references, not JSX
 */
export const NAV_CONFIG: NavSection[] = [
  {
    id: "nav-main",
    title: "Main",
    defaultOpen: true,
    items: [
      {
        label: "Home",
        href: "/",
        icon: Home,
        description: "Dashboard and overview",
      },
      {
        label: "Workflows",
        href: "/workflows",
        icon: Workflow,
        description: "Dynamic workflow builder",
      },
      {
        label: "Static Workflows",
        href: "/workflow-static",
        icon: FileCode,
        description: "Pre-defined static workflows",
      },
      {
        label: "Vibe",
        href: "/vibe",
        icon: Code,
        description: "Vibe coding assistant",
      },
    ],
  },
  {
    id: "nav-tools",
    title: "Tools",
    defaultOpen: false,
    items: [
      {
        label: "App Builder",
        href: "/app-builder",
        icon: Code,
        description: "Build applications",
      },
      {
        label: "Menu Demo",
        href: "/menu-demo",
        icon: Code,
        description: "Menu system demo",
      },
    ],
  },
  {
    id: "nav-info",
    title: "Info",
    defaultOpen: false,
    items: [
      {
        label: "About",
        href: "/about",
        icon: Info,
        description: "About this app",
      },
    ],
  },
];

/**
 * Get all nav items flattened (for header nav if needed)
 * Compatible with MobileNav component
 */
export function getAllNavItems(): Array<{ label: string; href: string }> {
  return NAV_CONFIG.flatMap((section) => section.items).map((item) => ({
    label: item.label,
    href: item.href,
  }));
}

/**
 * Get nav item by href
 */
export function getNavItemByHref(href: string): NavItem | undefined {
  return getAllNavItems().find((item) => item.href === href);
}
