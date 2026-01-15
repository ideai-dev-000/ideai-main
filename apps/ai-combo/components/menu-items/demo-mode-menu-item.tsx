/**
 * @fileoverview Demo Mode Menu Item for IdeaI Menu
 *
 * @module DemoModeMenuItem
 * @description
 * Demo mode toggle that can be used in IdeaI menus.
 */

"use client";

import { useAtom } from "jotai";
import { usePathname } from "next/navigation";
import { demoModeAtom } from "@/lib/workflow-store";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play } from "lucide-react";

export function DemoModeMenuItem() {
  const pathname = usePathname();
  const [demoMode, setDemoMode] = useAtom(demoModeAtom);

  // Only show on workflow pages
  const isWorkflowPage =
    pathname === "/workflow" || pathname.startsWith("/workflow/");

  if (!isWorkflowPage) {
    return null;
  }

  const handleDemoModeChange = (checked: boolean) => {
    setDemoMode(checked);
    if (typeof window !== "undefined") {
      localStorage.setItem("workflow-demo-mode", String(checked));
    }
  };

  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-2">
        <Play className="h-4 w-4" />
        <Label
          htmlFor="demo-mode-menu-toggle"
          className="text-sm font-medium cursor-pointer"
        >
          Demo Mode
        </Label>
      </div>
      <Switch
        id="demo-mode-menu-toggle"
        checked={demoMode}
        onCheckedChange={handleDemoModeChange}
      />
    </div>
  );
}
