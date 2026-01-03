/**
 * @fileoverview Type declarations for dev-check.mjs
 */

export function isDevelopment(): boolean;
export function assertDevelopment(): void;
export function devOnly<T>(fn: () => T): T | null;
