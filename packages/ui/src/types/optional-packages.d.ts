/**
 * @fileoverview Type declarations for optional animation libraries
 * 
 * @description
 * These are optional dependencies that may not be installed.
 * TypeScript declarations to prevent build errors when packages aren't installed.
 */

declare module 'kute.js' {
  const KUTE: any;
  export default KUTE;
}

declare module '@motionone/dom' {
  export function animate(
    element: HTMLElement,
    keyframes: any,
    options?: any
  ): any;
  export function scroll(animation: any, options?: any): any;
}

declare module '@motionone/react' {
  export * from '@motionone/dom';
}

declare module '@tsparticles/react' {
  import { Component } from 'react';
  export default class Particles extends Component<any> {}
}

declare module '@tsparticles/slim' {
  export function loadSlim(engine: any): Promise<void>;
}

declare module '@tsparticles/engine' {
  export class Engine {}
}

declare module 'vivus' {
  interface VivusOptions {
    type?: 'delayed' | 'sync' | 'oneByOne' | 'scenario' | 'scenario-sync';
    duration?: number;
    delay?: number;
    start?: 'manual' | 'autostart' | 'inViewport';
    callback?: () => void;
    animTimingFunction?: any;
  }

  class Vivus {
    constructor(element: string | HTMLElement | SVGElement, options?: VivusOptions);
    destroy(): void;
    finish(): void;
    reset(): void;
    setFrameProgress(progress: number): void;
    getStatus(): string;
    play(speed?: number): void;
    stop(): void;
    pause(): void;
    static EASE: any;
    static EASE_OUT: any;
    static EASE_IN: any;
    static EASE_IN_OUT: any;
  }

  export default Vivus;
}

