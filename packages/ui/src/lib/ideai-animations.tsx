/**
 * @fileoverview IdeaI Animation System - Performance-Aware Animations
 *
 * @module IdeAIAnimations
 * @description
 * Core IdeaI animation system that can be toggled on/off based on device performance.
 * Uses Framer Motion (React Fiber-based) for performant animations.
 * Automatically detects device performance and reduces/removes animations on low-end devices.
 *
 * @example
 * ```tsx
 * import { useIdeAIAnimations, AnimatedDiv } from "@repo/ui/lib/ideai-animations";
 *
 * const { animationsEnabled } = useIdeAIAnimations();
 *
 * <AnimatedDiv
 *   initial={{ opacity: 0 }}
 *   animate={{ opacity: 1 }}
 *   transition={{ duration: 0.3 }}
 * >
 *   Content
 * </AnimatedDiv>
 * ```
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, type MotionProps, type Variants } from "framer-motion";

/**
 * Device performance detection
 * Uses various heuristics to determine if device can handle animations
 */
export function detectDevicePerformance(): {
  canAnimate: boolean;
  prefersReducedMotion: boolean;
  hardwareAccelerated: boolean;
  performanceScore: number;
} {
  if (typeof window === "undefined") {
    return {
      canAnimate: true,
      prefersReducedMotion: false,
      hardwareAccelerated: true,
      performanceScore: 1,
    };
  }

  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Check for hardware acceleration (GPU)
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  const hardwareAccelerated = !!gl;

  // Performance heuristics
  let performanceScore = 1;

  // Check device memory (if available)
  if ("deviceMemory" in navigator) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const memory = (navigator as any).deviceMemory;
    if (memory < 2) performanceScore -= 0.3; // Low memory
    if (memory < 4) performanceScore -= 0.1; // Medium memory
  }

  // Check connection speed (if available)
  if ("connection" in navigator) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const connection = (navigator as any).connection;
    if (
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g"
    ) {
      performanceScore -= 0.2;
    }
  }

  // Check CPU cores (if available)
  if ("hardwareConcurrency" in navigator) {
    const cores = navigator.hardwareConcurrency;
    if (cores < 2) performanceScore -= 0.2;
  }

  // Check if device is mobile (generally less performant)
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  if (isMobile) performanceScore -= 0.1;

  // Final decision
  const canAnimate =
    !prefersReducedMotion && hardwareAccelerated && performanceScore > 0.3;

  return {
    canAnimate,
    prefersReducedMotion,
    hardwareAccelerated,
    performanceScore: Math.max(0, Math.min(1, performanceScore)),
  };
}

/**
 * Hook to use IdeaI animations with performance detection
 */
export function useIdeAIAnimations() {
  const [performance, setPerformance] = useState(() =>
    detectDevicePerformance(),
  );
  const [animationsEnabled, setAnimationsEnabled] = useState(
    performance.canAnimate,
  );

  useEffect(() => {
    // Re-check on mount (in case of SSR)
    const perf = detectDevicePerformance();
    setPerformance(perf);
    setAnimationsEnabled(perf.canAnimate);
  }, []);

  // Allow manual override
  const toggleAnimations = () => {
    setAnimationsEnabled((prev) => !prev);
  };

  return {
    animationsEnabled,
    performance,
    toggleAnimations,
    setAnimationsEnabled,
  };
}

/**
 * Performance-aware animation variants
 * Automatically reduces to instant transitions if animations disabled
 */
export function createAnimationVariants(
  variants: Variants,
  animationsEnabled: boolean,
): Variants {
  if (!animationsEnabled) {
    // Return instant variants (no animation)
    return Object.keys(variants).reduce((acc, key) => {
      acc[key] = { ...variants[key], transition: { duration: 0 } };
      return acc;
    }, {} as Variants);
  }
  return variants;
}

/**
 * Performance-aware transition
 * Returns instant transition if animations disabled
 */
export function createAnimationTransition(
  transition: MotionProps["transition"],
  animationsEnabled: boolean,
): MotionProps["transition"] {
  if (!animationsEnabled) {
    return { duration: 0 };
  }
  return transition;
}

/**
 * Animated Div Component
 * Wrapper around motion.div with performance awareness
 */
export function AnimatedDiv({
  children,
  animationsEnabled = true,
  ...props
}: MotionProps & {
  children: React.ReactNode;
  animationsEnabled?: boolean;
}) {
  const transition = useMemo(
    () => createAnimationTransition(props.transition, animationsEnabled),
    [props.transition, animationsEnabled],
  );

  return (
    <motion.div {...props} transition={transition}>
      {children}
    </motion.div>
  );
}

/**
 * Side Menu Animation Variants
 * Pre-configured variants for side menu animations
 * Slides in from the right
 */
export const sideMenuVariants: Variants = {
  closed: {
    x: "100%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

/**
 * Panel Animation Variants
 * For the default panel view (not side menu)
 */
export const panelVariants: Variants = {
  closed: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Overlay Animation Variants
 * For backdrop/overlay animations
 */
export const overlayVariants: Variants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Fade Animation Variants
 * Simple fade in/out
 */
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Slide Animation Variants
 * Slide from direction
 */
export function createSlideVariants(
  direction: "left" | "right" | "up" | "down" = "left",
): Variants {
  const directions = {
    left: { x: "-100%" },
    right: { x: "100%" },
    up: { y: "-100%" },
    down: { y: "100%" },
  };

  return {
    closed: {
      ...directions[direction],
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };
}
