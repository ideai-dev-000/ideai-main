/**
 * @fileoverview UniFrame Card Component Exports - Centralized Exports
 * 
 * @file uf-index.ts
 * @module UniFrameCardExports
 * @description
 * Centralized exports for all UniFrame card components.
 * Provides clean import paths for all card system components.
 * 
 * UniFrame Card System Structure:
 * - Card wrapper: uf-card.tsx
 * - Header: uf-header.tsx
 * - Body: uf-body.tsx
 * - Footer: uf-footer.tsx
 * - UI Elements: uf-button.tsx, uf-input.tsx, uf-badge.tsx, uf-form-field.tsx, uf-button-group.tsx
 * 
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 * 
 * @example
 * ```tsx
 * // Import all components
 * import {
 *   UniFrameCard,
 *   UniFrameCardHeader,
 *   UniFrameCardButton,
 *   type Framework
 * } from "@repo/ui/components/uniframe/uf-card";
 * 
 * // Or import from main package
 * import { UniFrameCard, Framework } from "@repo/ui";
 * ```
 * 
 * @see {@link ./uf-card.tsx} - Main card wrapper
 * @see {@link ./uf-card-types.ts} - TypeScript types
 */

export { UniFrameCard } from "./uf-card";
export { UniFrameCardHeader } from "./uf-header";
export { UniFrameCardBody } from "./uf-body";
export { UniFrameCardFooter } from "./uf-footer";
export { UniFrameCardButton } from "./uf-button";
export { UniFrameCardInput } from "./uf-input";
export { UniFrameCardBadge } from "./uf-badge";
export { UniFrameCardFormField } from "./uf-form-field";
export { UniFrameCardButtonGroup } from "./uf-button-group";
export type { Framework, FrameworkConfig } from "./uf-card-types";
export { frameworkConfigs } from "./uf-card-types";
