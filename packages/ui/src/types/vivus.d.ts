/**
 * @fileoverview Type declarations for vivus module
 */

declare module "vivus" {
  export interface VivusOptions {
    type?: string;
    duration?: number;
    animTimingFunction?: string;
    pathTimingFunction?: string;
    start?: string;
    delay?: number;
    onReady?: (vivus: Vivus) => void;
    file?: string;
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
    getStatus(): string;
    destroy(): void;
  }
}
