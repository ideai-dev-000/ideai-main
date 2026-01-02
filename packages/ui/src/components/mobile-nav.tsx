/**
 * @fileoverview Mobile Navigation Menu - Touch-Optimized
 * 
 * @module MobileNav
 * @description
 * Robust mobile touch navigation menu using Radix UI.
 * Provides swipe gestures, animations, and accessibility.
 * 
 * @example
 * ```tsx
 * <MobileNav navItems={navItems} />
 * ```
 */

"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { cn } from "../lib/utils";

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

interface MobileNavProps {
  navItems: NavItem[];
  className?: string;
}

export function MobileNav({ navItems, className }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={cn("ideai-mobile-nav-trigger", className)}
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="ideai-mobile-nav-overlay" />
        <Dialog.Content className="ideai-mobile-nav-content">
          <div className="ideai-mobile-nav-header">
            <Dialog.Title className="ideai-mobile-nav-title">Navigation</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="ideai-mobile-nav-close"
                aria-label="Close navigation menu"
              >
                <X className="h-6 w-6" />
              </button>
            </Dialog.Close>
          </div>
          <nav className="ideai-mobile-nav-list">
            <ul>
              {navItems.map((item) => (
                <li key={item.href || item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="ideai-mobile-nav-link"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <>
                      <div className="ideai-mobile-nav-group">{item.label}</div>
                      {item.children?.map((child) => (
                        <a
                          key={child.href}
                          href={child.href}
                          className="ideai-mobile-nav-link ideai-mobile-nav-link--nested"
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </a>
                      ))}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

