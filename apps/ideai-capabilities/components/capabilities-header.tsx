/**
 * @fileoverview Standalone navigation header for Capabilities site
 *
 * @module CapabilitiesHeader
 * @description
 * Enhanced header with dropdown menus for each section (Workflow Builder, App Builder).
 * Shows active state and provides quick access to items within each section.
 * Note: Lead Agent removed from header - will be added as module in future.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAtom } from "jotai";
import { IdeAILogo } from "@repo/ui";
import { ThemeToggle } from "@repo/ui";
import { IdeAIThemeSelector } from "@repo/ui";
import { MobileNav } from "@repo/ui";
import { Workflow, Code, Home } from "lucide-react";
import { UserMenu } from "@/components/workflow/user-menu";
import { useSession } from "@/lib/auth-client";
import { demoModeAtom } from "@/lib/workflow-store";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  basePath?: string; // For dropdown detection
  showMenu?: boolean; // Whether to show dropdown when active
}

const mainNav: NavItem[] = [
  { label: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
  {
    label: "Workflows",
    href: "/workflow",
    icon: <Workflow className="h-4 w-4" />,
    basePath: "/workflow",
    showMenu: true,
  },
  {
    label: "Vibe",
    href: "/vibe",
    icon: <Code className="h-4 w-4" />,
    basePath: "/vibe",
    showMenu: false,
  },
  {
    label: "App Builder",
    href: "/app-builder",
    icon: <Code className="h-4 w-4" />,
    basePath: "/app-builder",
    showMenu: false, // Can be enabled when App Builder has items
  },
];

export function CapabilitiesHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const [demoMode, setDemoMode] = useAtom(demoModeAtom);
  
  // Show demo mode toggle only on workflow pages
  const isWorkflowPage = pathname === "/workflow" || pathname.startsWith("/workflow/");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDemoModeChange = (checked: boolean) => {
    setDemoMode(checked);
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("workflow-demo-mode", String(checked));
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[60] border-b bg-white/95 backdrop-blur-sm transition-all dark:bg-slate-950/95 ${
        isScrolled
          ? "border-slate-200 dark:border-slate-800"
          : "border-transparent"
      }`}
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <IdeAILogo siteName="Capabilities" />
            </Link>
          </div>

          {/* Navigation */}
          <nav
            className="hidden md:flex md:items-center md:gap-6"
            aria-label="Main navigation"
          >
            <ul className="flex items-center gap-6">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side */}
          <div className="relative z-[60] flex items-center gap-2">
            {/* Demo Mode Toggle - only show on workflow pages */}
            {isWorkflowPage && (
              <div className="hidden md:flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <Switch
                  checked={demoMode}
                  onCheckedChange={handleDemoModeChange}
                  id="demo-mode-toggle"
                />
                <Label
                  htmlFor="demo-mode-toggle"
                  className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Demo Mode
                </Label>
              </div>
            )}
            <UserMenu />
            <IdeAIThemeSelector />
            <ThemeToggle />
            <MobileNav navItems={mainNav} />
          </div>
        </div>
      </div>
    </header>
  );
}
