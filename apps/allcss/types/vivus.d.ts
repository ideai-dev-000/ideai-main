/**
 * @fileoverview Type declarations for vivus library
 */

declare module "vivus" {
  export interface VivusOptions {
    type?:
      | "delayed"
      | "sync"
      | "async"
      | "oneByOne"
      | "scenario"
      | "scenario-sync";
    duration?: number;
    animTimingFunction?: string;
    pathTimingFunction?: string;
    file?: string;
    start?: "inViewport" | "manual" | "autostart";
    dashGap?: number;
    forceRender?: boolean;
    reverseStack?: boolean;
    selfDestroy?: boolean;
    onReady?: (vivus: Vivus) => void;
  }

  export default class Vivus {
    constructor(
      element: string | HTMLElement | SVGElement,
      options?: VivusOptions,
      callback?: (vivus: Vivus) => void,
    );
    play(speed?: number): Vivus;
    stop(): Vivus;
    reset(): Vivus;
    finish(): Vivus;
    setFrameProgress(progress: number): Vivus;
    getStatus(): "start" | "progress" | "end";
    destroy(): void;
  }
}
