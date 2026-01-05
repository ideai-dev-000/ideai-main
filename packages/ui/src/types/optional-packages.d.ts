/**
 * @fileoverview Type declarations for optional animation libraries
 *
 * @description
 * These are optional dependencies that may not be installed.
 * TypeScript declarations to prevent build errors when packages aren't installed.
 */

declare module "kute.js" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const KUTE: any;
  export default KUTE;
}

declare module "@motionone/dom" {
  export function animate(
    element: HTMLElement,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keyframes: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any;
  export function scroll(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    animation: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any;
}

declare module "@motionone/react" {
  export * from "@motionone/dom";
}

declare module "@tsparticles/react" {
  import { Component } from "react";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export default class Particles extends Component<any> {}
}

declare module "@tsparticles/slim" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function loadSlim(engine: any): Promise<void>;
}

declare module "@tsparticles/engine" {
  export class Engine {}
}

declare module "vivus" {
  interface VivusOptions {
    type?: "delayed" | "sync" | "oneByOne" | "scenario" | "scenario-sync";
    duration?: number;
    delay?: number;
    start?: "manual" | "autostart" | "inViewport";
    callback?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    animTimingFunction?: any;
  }

  class Vivus {
    constructor(
      element: string | HTMLElement | SVGElement,
      options?: VivusOptions,
    );
    destroy(): void;
    finish(): void;
    reset(): void;
    setFrameProgress(progress: number): void;
    getStatus(): string;
    play(speed?: number): void;
    stop(): void;
    pause(): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static EASE: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static EASE_OUT: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static EASE_IN: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static EASE_IN_OUT: any;
  }

  export default Vivus;
}
