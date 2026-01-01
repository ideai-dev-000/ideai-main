/**
 * @fileoverview UniFrame Card Component - Main Card Wrapper
 * 
 * @file uf-card.tsx
 * @module UniFrameCard
 * @description
 * Main card wrapper component for the UniFrame universal framework card system.
 * Combines header, body, and footer into a complete, semantic card component.
 * 
 * UniFrame allows runtime switching between CSS frameworks (Tailwind, Bootstrap,
 * Material UI, Chakra UI, Radix UI, Shadcn/UI) with secure class injection.
 * 
 * Architecture:
 * - Card wrapper: Semantic article element with framework-adaptive styling
 * - Header: Title and description section
 * - Body: Main content area (Bootstrap-specific structure)
 * - Footer: Metadata and framework information
 * - UI Elements: Button, Input, Badge, FormField, ButtonGroup
 * 
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 * 
 * @example
 * ```tsx
 * import { UniFrameCard } from "@repo/ui/components/uniframe/uf-card/uf-card";
 * 
 * <UniFrameCard
 *   framework="tailwind"
 *   title="Card Title"
 *   description="Card description"
 *   onPrimaryAction={handleSave}
 *   onSecondaryAction={handleCancel}
 * />
 * ```
 * 
 * @see {@link ./uf-card-types.ts} - TypeScript type definitions
 * @see {@link ./uf-header.tsx} - Card header component
 * @see {@link ./uf-body.tsx} - Card body component
 * @see {@link ./uf-footer.tsx} - Card footer component
 * @see {@link ./uf-button.tsx} - Button UI element
 * @see {@link ./uf-input.tsx} - Input UI element
 * @see {@link ./uf-badge.tsx} - Badge UI element
 * @see {@link ./uf-form-field.tsx} - Form field component
 * @see {@link ./uf-button-group.tsx} - Button group component
 * 
 * @todo Add support for custom card layouts
 * @todo Add animation transitions between framework switches
 * @todo Add theme customization per framework
 */

import { ReactNode } from "react";
import { cn } from "../../../lib/utils";
import { UniFrameCardHeader } from "./uf-header";
import { UniFrameCardBody } from "./uf-body";
import { UniFrameCardFooter } from "./uf-footer";
import { UniFrameCardButton } from "./uf-button";
import { UniFrameCardBadge } from "./uf-badge";
import { UniFrameCardFormField } from "./uf-form-field";
import { UniFrameCardButtonGroup } from "./uf-button-group";
import type { Framework, frameworkConfigs } from "./uf-card-types";

interface UniFrameCardProps {
  /** Framework to use for styling */
  framework: Framework;
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** Input field value */
  inputValue?: string;
  /** Input field onChange handler */
  onInputChange?: (value: string) => void;
  /** Input field label */
  inputLabel?: string;
  /** Input field ID */
  inputId?: string;
  /** Primary action button text */
  primaryActionText?: string;
  /** Primary action handler */
  onPrimaryAction?: () => void;
  /** Secondary action button text */
  secondaryActionText?: string;
  /** Secondary action handler */
  onSecondaryAction?: () => void;
  /** Badges to display */
  badges?: Array<{ label: string; variant?: "default" | "secondary" | "outline" }>;
  /** Additional content */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * UniFrame Card Component
 * 
 * A complete, semantic card component built with the UniFrame universal framework system.
 * Uses article element for semantic HTML structure with framework-adaptive styling.
 * 
 * Features:
 * - Semantic HTML (article, header, footer)
 * - Framework-adaptive styling
 * - Accessible (ARIA labels, proper form associations)
 * - Composable (header, body, footer, UI elements)
 * - Extensible (easy to add new frameworks)
 * 
 * @param props - UniFrame card component props
 * @returns React component
 */
export const UniFrameCard = ({
  framework,
  title,
  description,
  inputValue,
  onInputChange,
  inputLabel = "Input Field:",
  inputId = "uniframe-card-input",
  primaryActionText = "Primary Action",
  onPrimaryAction,
  secondaryActionText = "Clear Input",
  onSecondaryAction,
  badges = [],
  children,
  className,
  isLoading = false,
}: UniFrameCardProps) => {
  const config = frameworkConfigs[framework];

  // Bootstrap uses different HTML structure
  if (framework === "bootstrap") {
    return (
      <article className={cn(config.cardClasses, className)}>
        <UniFrameCardBody framework={framework}>
          <UniFrameCardHeader framework={framework} title={title} description={description} />

          {badges.length > 0 && (
            <div className="mb-3">
              {badges.map((badge, index) => (
                <UniFrameCardBadge
                  key={index}
                  framework={framework}
                  variant={badge.variant}
                  className={index > 0 ? "ms-2" : ""}
                >
                  {badge.label}
                </UniFrameCardBadge>
              ))}
            </div>
          )}

          {inputValue !== undefined && onInputChange && (
            <UniFrameCardFormField
              framework={framework}
              id={inputId}
              label={inputLabel}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              className="mb-3"
            />
          )}

          {children && <div className="mb-3">{children}</div>}

          {(onPrimaryAction || onSecondaryAction) && (
            <UniFrameCardButtonGroup framework={framework} className="mb-3">
              {onPrimaryAction && (
                <UniFrameCardButton
                  framework={framework}
                  onClick={onPrimaryAction}
                  disabled={isLoading}
                  className={isLoading ? "disabled" : ""}
                >
                  {isLoading ? "Loading..." : primaryActionText}
                </UniFrameCardButton>
              )}
              {onSecondaryAction && (
                <UniFrameCardButton
                  framework={framework}
                  variant="secondary"
                  onClick={onSecondaryAction}
                >
                  {secondaryActionText}
                </UniFrameCardButton>
              )}
            </UniFrameCardButtonGroup>
          )}

          <UniFrameCardFooter framework={framework}>
            <div className="d-flex justify-content-between align-items-center">
              <p className={cn(config.textClasses, "mb-0 small")}>
                Framework: <span className="fw-bold">{config.name}</span>
              </p>
              <div className="d-flex gap-2">
                <UniFrameCardBadge framework={framework} variant="secondary">
                  React
                </UniFrameCardBadge>
                <UniFrameCardBadge framework={framework} variant="secondary">
                  Next.js
                </UniFrameCardBadge>
              </div>
            </div>
          </UniFrameCardFooter>
        </UniFrameCardBody>
      </article>
    );
  }

  // Standard structure for other frameworks
  return (
    <article className={cn(config.cardClasses, className)}>
      <UniFrameCardHeader framework={framework} title={title} description={description} />

      {badges.length > 0 && (
        <div className="mb-4">
          {badges.map((badge, index) => (
            <UniFrameCardBadge
              key={index}
              framework={framework}
              variant={badge.variant}
              className={index > 0 ? "ml-2" : ""}
            >
              {badge.label}
            </UniFrameCardBadge>
          ))}
        </div>
      )}

      {inputValue !== undefined && onInputChange && (
        <UniFrameCardFormField
          framework={framework}
          id={inputId}
          label={inputLabel}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
        />
      )}

      {children && <div className="mb-4">{children}</div>}

      {(onPrimaryAction || onSecondaryAction) && (
        <UniFrameCardButtonGroup framework={framework} className="mb-4">
          {onPrimaryAction && (
            <UniFrameCardButton
              framework={framework}
              onClick={onPrimaryAction}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : primaryActionText}
            </UniFrameCardButton>
          )}
          {onSecondaryAction && (
            <UniFrameCardButton
              framework={framework}
              variant="secondary"
              onClick={onSecondaryAction}
            >
              {secondaryActionText}
            </UniFrameCardButton>
          )}
        </UniFrameCardButtonGroup>
      )}

      <UniFrameCardFooter framework={framework}>
        <div className="flex items-center justify-between">
          <p className={cn(config.textClasses, "text-sm")}>
            Framework: <span className="font-semibold">{config.name}</span>
          </p>
          <div className="flex gap-2">
            <UniFrameCardBadge framework={framework} variant="secondary">
              React
            </UniFrameCardBadge>
            <UniFrameCardBadge framework={framework} variant="secondary">
              Next.js
            </UniFrameCardBadge>
          </div>
        </div>
      </UniFrameCardFooter>
    </article>
  );
};
