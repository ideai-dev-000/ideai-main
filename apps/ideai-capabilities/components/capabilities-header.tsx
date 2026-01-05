/**
 * @fileoverview Standalone navigation header for Capabilities site
 *
 * @module CapabilitiesHeader
 * @description
 * Custom header component based on IdeaIHeader but customized for capabilities site.
 * Demonstrates how to create standalone navigation using IdeaI components.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IdeAILogo } from "@repo/ui";
import { ThemeToggle } from "@repo/ui";
import { MobileNav } from "@repo/ui";
import { Workflow, UserSearch, Code, Home } from "lucide-react";
import { UserMenu } from "@/components/workflow/user-menu";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const mainNav: NavItem[] = [
  { label: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
  {
    label: "Workflow Builder",
    href: "/workflow",
    icon: <Workflow className="h-4 w-4" />,
  },
  {
    label: "Lead Agent",
    href: "/lead-agent",
    icon: <UserSearch className="h-4 w-4" />,
  },
  {
    label: "App Builder",
    href: "/app-builder",
    icon: <Code className="h-4 w-4" />,
  },
];

export function CapabilitiesHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b bg-white/95 backdrop-blur-sm transition-all dark:bg-slate-950/95 ${
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
          <div className="relative z-50 flex items-center gap-4">
            <UserMenu />
            <ThemeToggle />
            <MobileNav navItems={mainNav} />
          </div>
        </div>
      </div>
    </header>
  );
}
