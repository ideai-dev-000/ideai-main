/**
 * @fileoverview Navigation Item with Dropdown Menu
 *
 * @module NavItemWithMenu
 * @description
 * A reusable navigation item component that can display a dropdown menu
 * when active. Used for Workflow Builder, Lead Agent, App Builder, etc.
 */

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type NavMenuItem = {
  id: string;
  name: string;
  href: string;
  updatedAt?: string;
};

type NavItemWithMenuProps = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  basePath: string; // e.g., "/workflow" - used to detect if active
  items?: NavMenuItem[]; // Items to show in dropdown
  currentItemId?: string | null; // Currently active item ID
  onLoadItems?: () => Promise<void>; // Callback to load items
  onCreateNew?: () => void; // Callback for "New" action
  showNewOption?: boolean; // Whether to show "New" option
  newLabel?: string; // Label for "New" option (default: "New {label}")
};

export function NavItemWithMenu({
  label,
  href,
  icon,
  basePath,
  items = [],
  currentItemId,
  onLoadItems,
  onCreateNew,
  showNewOption = true,
  newLabel,
}: NavItemWithMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = pathname === href || pathname.startsWith(basePath);

  // Load items when menu opens
  const handleOpenChange = useCallback(
    (open: boolean) => {
      setMenuOpen(open);
      if (open && onLoadItems) {
        onLoadItems();
      }
    },
    [onLoadItems],
  );

  // Auto-open menu on login (only once)
  const hasAutoOpenedRef = useRef(false);
  useEffect(() => {
    if (isActive && !hasAutoOpenedRef.current && items.length > 0) {
      hasAutoOpenedRef.current = true;
      setTimeout(() => {
        setMenuOpen(true);
        onLoadItems?.();
      }, 300);
    }
    if (!isActive) {
      hasAutoOpenedRef.current = false;
    }
  }, [isActive, items.length, onLoadItems]);

  const handleNewClick = () => {
    if (onCreateNew) {
      onCreateNew();
    } else {
      router.push(href);
    }
    setMenuOpen(false);
  };

  const handleItemClick = (itemHref: string) => {
    router.push(itemHref);
    setMenuOpen(false);
  };

  // If not active or no items, show as simple link
  if (!isActive || items.length === 0) {
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-2 text-sm font-medium transition-colors",
          isActive
            ? "text-slate-900 dark:text-slate-100"
            : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100",
        )}
      >
        {icon}
        {label}
      </Link>
    );
  }

  // Active with dropdown
  const currentItem = items.find((item) => item.id === currentItemId);
  const displayLabel = currentItem?.name || label;

  // Remove duplicates by ID (keep first occurrence)
  const uniqueItems = items.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id),
  );

  return (
    <DropdownMenu open={menuOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 text-sm font-medium transition-colors",
            "text-slate-900 dark:text-slate-100",
            "hover:text-slate-900 dark:hover:text-slate-100",
          )}
        >
          {icon}
          <span>{displayLabel}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {showNewOption && (
          <>
            <DropdownMenuItem
              className="flex items-center justify-between"
              onClick={handleNewClick}
            >
              {newLabel || `New ${label}`}
              {!currentItemId && <Check className="size-4 shrink-0" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {uniqueItems.length === 0 ? (
          <DropdownMenuItem disabled>No items found</DropdownMenuItem>
        ) : (
          uniqueItems.map((item) => (
            <DropdownMenuItem
              className="flex items-center justify-between"
              key={item.id}
              onClick={() => handleItemClick(item.href)}
            >
              <span className="truncate">{item.name}</span>
              {item.id === currentItemId && (
                <Check className="size-4 shrink-0" />
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
