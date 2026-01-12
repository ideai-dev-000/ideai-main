/**
 * @fileoverview Toggle component for switching between edge style presets
 *
 * @module EdgeAnimationToggle
 * @description
 * 5-button toggle group to switch between edge style presets.
 * Each preset has different color, width, and animation combinations.
 */

"use client";

import { useAtom } from "jotai";
import { Circle, Minus, Zap, TrendingUp, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  edgeStylePresetAtom,
  type EdgeStylePreset,
} from "@/lib/workflow-store";
import { EDGE_STYLE_PRESETS } from "@/lib/edge-styles";

const stylePresets: Array<{
  preset: EdgeStylePreset;
  icon: React.ComponentType<{ className?: string }>;
  color?: string; // Optional color override for icon
}> = [
  { preset: "flowing-dots", icon: Circle },
  { preset: "dashed-flow", icon: Minus },
  { preset: "solid-pulse", icon: Zap },
  { preset: "bold-success", icon: TrendingUp },
  { preset: "subtle-guide", icon: Eye },
  { preset: "green-dots", icon: Circle, color: "#22c55e" },
  { preset: "red-dots", icon: Circle, color: "#ef4444" },
];

export function EdgeAnimationToggle() {
  const [preset, setPreset] = useAtom(edgeStylePresetAtom);

  return (
    <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {stylePresets.map(({ preset: presetKey, icon: Icon, color }) => {
        const config = EDGE_STYLE_PRESETS[presetKey];
        return (
          <Button
            key={presetKey}
            variant={preset === presetKey ? "default" : "ghost"}
            size="sm"
            className="h-8 px-2.5 text-xs"
            onClick={() => setPreset(presetKey)}
            title={config.description}
            aria-label={config.description}
          >
            <Icon
              className="h-3.5 w-3.5"
              style={color ? { color } : undefined}
            />
          </Button>
        );
      })}
    </div>
  );
}
