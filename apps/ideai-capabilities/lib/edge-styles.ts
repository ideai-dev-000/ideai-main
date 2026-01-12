/**
 * @fileoverview Edge style presets for workflow canvas
 * @module EdgeStyles
 * @description
 * Configurable edge style system with 7 distinct presets.
 * Each preset defines color, width, animation, and dash pattern.
 */

export type EdgeStylePreset =
  | "flowing-dots"
  | "dashed-flow"
  | "solid-pulse"
  | "bold-success"
  | "subtle-guide"
  | "green-dots"
  | "red-dots";

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
 * Edge style presets - 7 distinct combinations
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
  "green-dots": {
    name: "Green Dots",
    description: "Green flowing dots",
    normal: {
      color: "#22c55e",
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
    className: "edge-green-dots",
  },
  "red-dots": {
    name: "Red Dots",
    description: "Red flowing dots",
    normal: {
      color: "#ef4444",
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
    className: "edge-red-dots",
  },
};

/**
 * Edge state type: normal, success, or error
 */
export type EdgeState = "normal" | "success" | "error";

/**
 * Get edge style config for a given preset and state
 */
export function getEdgeStyle(
  preset: EdgeStylePreset,
  state: EdgeState,
  isSelected: boolean,
): {
  stroke: string;
  strokeWidth: number;
  strokeDasharray: string;
  animation?: string;
  className: string;
} {
  const config = EDGE_STYLE_PRESETS[preset];

  let finalColor: string;
  let finalWidth: number;
  let finalDashArray: string;
  let finalAnimation: string | undefined;

  if (state === "success") {
    // Green for successful edges
    finalColor = "#22c55e";
    finalWidth = config.success.width;
    finalDashArray = config.success.dashArray;
    finalAnimation = config.success.animation;
  } else if (state === "error") {
    // Red for edges that can't run
    finalColor = "#ef4444";
    // Use flowing dots animation for error state (matches dot presets)
    const isDotPreset = preset.includes("dots");
    finalWidth = isDotPreset ? 2.5 : config.normal.width;
    finalDashArray = isDotPreset ? "3 9" : config.normal.dashArray;
    finalAnimation = isDotPreset
      ? "flowing-dots 2s linear infinite"
      : config.normal.animation;
  } else {
    // Normal state - use preset defaults
    const style = config.normal;
    finalColor = isSelected ? "#8b949e" : style.color;
    finalWidth = style.width;
    finalDashArray = style.dashArray;
    finalAnimation = style.animation;
  }

  return {
    stroke: finalColor,
    strokeWidth: finalWidth,
    strokeDasharray: finalDashArray,
    animation: finalAnimation,
    className: config.className,
  };
}
