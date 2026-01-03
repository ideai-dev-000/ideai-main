/**
 * @fileoverview Type declarations for vivus library
 * @module vivus
 */

declare module "vivus" {
  export interface VivusOptions {
    type?: "delayed" | "sync" | "oneByOne" | "scenario" | "scenario-sync";
    duration?: number;
    animTimingFunction?: (input: number) => number;
    start?: "inViewport" | "manual" | "autostart";
    delay?: number;
    file?: string;
    onReady?: (vivus: Vivus) => void;
  }

  export default class Vivus {
    constructor(element: string | HTMLElement, options?: VivusOptions);
    play(speed?: number): Vivus;
    stop(): Vivus;
    reset(): Vivus;
    finish(): Vivus;
    setFrameProgress(progress: number): Vivus;
    getStatus(): "start" | "progress" | "end";
    destroy(): void;
    static EASE: (input: number) => number;
    static EASE_OUT: (input: number) => number;
    static EASE_IN: (input: number) => number;
    static EASE_IN_OUT: (input: number) => number;
    static LINEAR: (input: number) => number;
  }
}
