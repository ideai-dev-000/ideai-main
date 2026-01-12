/**
 * @fileoverview Toggle component for switching between edge animation modes
 *
 * @module EdgeAnimationToggle
 * @description
 * 3-button toggle group to switch between different edge animation modes:
 * - Flowing Dots: Animated dots flowing along the edge
 * - Dashed Flow: Animated dashed lines
 * - Solid Pulse: Pulsing solid line
 */

"use client";

import { useAtom } from "jotai";
import { Circle, Minus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { edgeAnimationModeAtom, type EdgeAnimationMode } from "@/lib/workflow-store";

const animationModes: Array<{
  mode: EdgeAnimationMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    mode: "flowing-dots",
    label: "Dots",
    icon: Circle,
    description: "Flowing dots animation",
  },
  {
    mode: "dashed-flow",
    label: "Dash",
    icon: Minus,
    description: "Animated dashed flow",
  },
  {
    mode: "solid-pulse",
    label: "Pulse",
    icon: Zap,
    description: "Solid pulsing line",
  },
];

export function EdgeAnimationToggle() {
  const [animationMode, setAnimationMode] = useAtom(edgeAnimationModeAtom);

  return (
    <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {animationModes.map(({ mode, label, icon: Icon, description }) => (
        <Button
          key={mode}
          variant={animationMode === mode ? "default" : "ghost"}
          size="sm"
          className="h-8 px-3 text-xs"
          onClick={() => setAnimationMode(mode)}
          title={description}
          aria-label={description}
        >
          <Icon className="mr-1.5 h-3.5 w-3.5" />
          {label}
        </Button>
      ))}
    </div>
  );
}
