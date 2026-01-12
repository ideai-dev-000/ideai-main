/**
 * @fileoverview Edge style presets for workflow canvas
 * @module EdgeStyles
 * @description
 * Configurable edge style system with 5 distinct presets.
 * Each preset defines color, width, animation, and dash pattern.
 */

export type EdgeStylePreset =
  | "flowing-dots"
  | "dashed-flow"
  | "solid-pulse"
  | "bold-success"
  | "subtle-guide";

export interface EdgeStyleConfig {
  name: string;
  description: string;
  normal: {
    color: string;
    width: number;
    dashArray: string;
    animation?: string;
  };
  success: {
    color: string;
    width: number;
    dashArray: string;
    animation?: string;
  };
  className: string;
}

/**
 * Edge style presets - 5 distinct combinations
 */
export const EDGE_STYLE_PRESETS: Record<
  EdgeStylePreset,
  EdgeStyleConfig
> = {
  "flowing-dots": {
    name: "Flowing Dots",
    description: "Animated dots flowing along the edge",
    normal: {
      color: "#d0d7de",
      width: 2,
      dashArray: "3 9",
      animation: "flowing-dots 2s linear infinite",
    },
    success: {
      color: "#22c55e",
      width: 3.5,
      dashArray: "10 4",
      animation: "flowing-dots 2s linear infinite",
    },
    className: "edge-flowing-dots",
  },
  "dashed-flow": {
    name: "Dashed Flow",
    description: "Green animated dashes",
    normal: {
      color: "#22c55e",
      width: 3.5,
      dashArray: "10 4",
      animation: "dashdraw 1s linear infinite",
    },
    success: {
      color: "#22c55e",
      width: 3.5,
      dashArray: "10 4",
      animation: "dashdraw 1s linear infinite",
    },
    className: "edge-dashed-flow",
  },
  "solid-pulse": {
    name: "Solid Pulse",
    description: "Pulsing solid line",
    normal: {
      color: "#d0d7de",
      width: 2.5,
      dashArray: "none",
      animation: "solid-pulse 1.5s ease-in-out infinite",
    },
    success: {
      color: "#22c55e",
      width: 4,
      dashArray: "none",
      animation: "solid-pulse 1.5s ease-in-out infinite",
    },
    className: "edge-solid-pulse",
  },
  "bold-success": {
    name: "Bold Success",
    description: "Thick green solid line",
    normal: {
      color: "#d0d7de",
      width: 2,
      dashArray: "none",
    },
    success: {
      color: "#22c55e",
      width: 4,
      dashArray: "none",
    },
    className: "edge-bold-success",
  },
  "subtle-guide": {
    name: "Subtle Guide",
    description: "Minimal thin guide lines",
    normal: {
      color: "#8b949e",
      width: 1.5,
      dashArray: "5 5",
    },
    success: {
      color: "#22c55e",
      width: 2.5,
      dashArray: "5 5",
    },
    className: "edge-subtle-guide",
  },
};

/**
 * Get edge style config for a given preset and success state
 */
export function getEdgeStyle(
  preset: EdgeStylePreset,
  isSuccess: boolean,
  isSelected: boolean,
): {
  stroke: string;
  strokeWidth: number;
  strokeDasharray: string;
  animation?: string;
  className: string;
} {
  const config = EDGE_STYLE_PRESETS[preset];
  const style = isSuccess ? config.success : config.normal;

  // Override with selected color if selected and not in success state
  const finalColor =
    isSelected && !isSuccess ? "#8b949e" : style.color;

  return {
    stroke: finalColor,
    strokeWidth: style.width,
    strokeDasharray: style.dashArray,
    animation: style.animation,
    className: config.className,
  };
}
