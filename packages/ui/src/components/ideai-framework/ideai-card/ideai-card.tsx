/**
 * @fileoverview IdeaI Card Component
 * 
 * @module IdeAICard
 * @description
 * Main card wrapper component for the IdeaI framework card system.
 * Combines header, body, and footer into a complete card.
 * 
 * @example
 * ```tsx
 * <IdeAICard
 *   framework="tailwind"
 *   title="Card Title"
 *   description="Card description"
 *   onPrimaryAction={handleSave}
 *   onSecondaryAction={handleCancel}
 * />
 * ```
 */

import { ReactNode } from "react";
import { cn } from "../../../lib/utils";
import { IdeAICardHeader } from "./ideai-card-header";
import { IdeAICardBody } from "./ideai-card-body";
import { IdeAICardFooter } from "./ideai-card-footer";
import { IdeAICardButton } from "./ideai-card-button";
import { IdeAICardBadge } from "./ideai-card-badge";
import { IdeAICardFormField } from "./ideai-card-form-field";
import { IdeAICardButtonGroup } from "./ideai-card-button-group";
import type { Framework } from "./ideai-card-types";
import { frameworkConfigs } from "./ideai-card-types";

interface IdeAICardProps {
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
 * IdeaI Card Component
 * 
 * A complete, semantic card component built with IdeaI framework system.
 * Uses article element for semantic HTML structure.
 */
export const IdeAICard = ({
  framework,
  title,
  description,
  inputValue,
  onInputChange,
  inputLabel = "Input Field:",
  inputId = "ideai-card-input",
  primaryActionText = "Primary Action",
  onPrimaryAction,
  secondaryActionText = "Clear Input",
  onSecondaryAction,
  badges = [],
  children,
  className,
  isLoading = false,
}: IdeAICardProps) => {
  const config = frameworkConfigs[framework];

  // Bootstrap uses different HTML structure
  if (framework === "bootstrap") {
    return (
      <article className={cn(config.cardClasses, className)}>
        <IdeAICardBody framework={framework}>
          <IdeAICardHeader framework={framework} title={title} description={description} />

          {badges.length > 0 && (
            <div className="mb-3">
              {badges.map((badge, index) => (
                <IdeAICardBadge
                  key={index}
                  framework={framework}
                  variant={badge.variant}
                  className={index > 0 ? "ms-2" : ""}
                >
                  {badge.label}
                </IdeAICardBadge>
              ))}
            </div>
          )}

          {inputValue !== undefined && onInputChange && (
            <IdeAICardFormField
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
            <IdeAICardButtonGroup framework={framework} className="mb-3">
              {onPrimaryAction && (
                <IdeAICardButton
                  framework={framework}
                  onClick={onPrimaryAction}
                  disabled={isLoading}
                  className={isLoading ? "disabled" : ""}
                >
                  {isLoading ? "Loading..." : primaryActionText}
                </IdeAICardButton>
              )}
              {onSecondaryAction && (
                <IdeAICardButton
                  framework={framework}
                  variant="secondary"
                  onClick={onSecondaryAction}
                >
                  {secondaryActionText}
                </IdeAICardButton>
              )}
            </IdeAICardButtonGroup>
          )}

          <IdeAICardFooter framework={framework}>
            <div className="d-flex justify-content-between align-items-center">
              <p className={cn(config.textClasses, "mb-0 small")}>
                Framework: <span className="fw-bold">{config.name}</span>
              </p>
              <div className="d-flex gap-2">
                <IdeAICardBadge framework={framework} variant="secondary">
                  React
                </IdeAICardBadge>
                <IdeAICardBadge framework={framework} variant="secondary">
                  Next.js
                </IdeAICardBadge>
              </div>
            </div>
          </IdeAICardFooter>
        </IdeAICardBody>
      </article>
    );
  }

  // Standard structure for other frameworks
  return (
    <article className={cn(config.cardClasses, className)}>
      <IdeAICardHeader framework={framework} title={title} description={description} />

      {badges.length > 0 && (
        <div className="mb-4">
          {badges.map((badge, index) => (
            <IdeAICardBadge
              key={index}
              framework={framework}
              variant={badge.variant}
              className={index > 0 ? "ml-2" : ""}
            >
              {badge.label}
            </IdeAICardBadge>
          ))}
        </div>
      )}

      {inputValue !== undefined && onInputChange && (
        <IdeAICardFormField
          framework={framework}
          id={inputId}
          label={inputLabel}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
        />
      )}

      {children && <div className="mb-4">{children}</div>}

      {(onPrimaryAction || onSecondaryAction) && (
        <IdeAICardButtonGroup framework={framework} className="mb-4">
          {onPrimaryAction && (
            <IdeAICardButton
              framework={framework}
              onClick={onPrimaryAction}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : primaryActionText}
            </IdeAICardButton>
          )}
          {onSecondaryAction && (
            <IdeAICardButton
              framework={framework}
              variant="secondary"
              onClick={onSecondaryAction}
            >
              {secondaryActionText}
            </IdeAICardButton>
          )}
        </IdeAICardButtonGroup>
      )}

      <IdeAICardFooter framework={framework}>
        <div className="flex items-center justify-between">
          <p className={cn(config.textClasses, "text-sm")}>
            Framework: <span className="font-semibold">{config.name}</span>
          </p>
          <div className="flex gap-2">
            <IdeAICardBadge framework={framework} variant="secondary">
              React
            </IdeAICardBadge>
            <IdeAICardBadge framework={framework} variant="secondary">
              Next.js
            </IdeAICardBadge>
          </div>
        </div>
      </IdeAICardFooter>
    </article>
  );
};
