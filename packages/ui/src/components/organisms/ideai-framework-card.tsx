/**
 * @fileoverview IdeaI Framework Card Organism
 * 
 * @module IdeAIFrameworkCard
 * @description
 * Organism component that combines atoms and molecules into a complete card.
 * Uses semantic HTML article element for the card container.
 * 
 * Follows atomic design principles:
 * - Atoms: Button, Input, Badge
 * - Molecules: FormField, ButtonGroup
 * - Organism: FrameworkCard (this component)
 * 
 * @example
 * ```tsx
 * <IdeAIFrameworkCard
 *   framework="tailwind"
 *   title="Card Title"
 *   description="Card description"
 *   onPrimaryAction={handleSave}
 *   onSecondaryAction={handleCancel}
 * />
 * ```
 */

import { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { IdeAIFrameworkButton } from "../atoms/ideai-framework-button";
import { IdeAIFrameworkBadge } from "../atoms/ideai-framework-badge";
import { IdeAIFrameworkFormField } from "../molecules/ideai-framework-form-field";
import { IdeAIFrameworkButtonGroup } from "../molecules/ideai-framework-button-group";
import type { Framework, frameworkConfigs } from "./ideai-framework-card-types";

interface IdeAIFrameworkCardProps {
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
 * IdeaI Framework Card Organism
 * 
 * A complete, semantic card component built from atomic design principles.
 * Uses article element for semantic HTML structure.
 */
export const IdeAIFrameworkCard = ({
  framework,
  title,
  description,
  inputValue,
  onInputChange,
  inputLabel = "Input Field:",
  inputId = "framework-card-input",
  primaryActionText = "Primary Action",
  onPrimaryAction,
  secondaryActionText = "Clear Input",
  onSecondaryAction,
  badges = [],
  children,
  className,
  isLoading = false,
}: IdeAIFrameworkCardProps) => {
  const config = frameworkConfigs[framework];

  // Bootstrap uses different HTML structure
  if (framework === "bootstrap") {
    return (
      <article className={cn(config.cardClasses, className)}>
        <div className="card-body">
          <header className="mb-3">
            <h2 className={config.titleClasses}>{title}</h2>
            <p className={config.descriptionClasses}>{description}</p>
          </header>

          {badges.length > 0 && (
            <div className="mb-3">
              {badges.map((badge, index) => (
                <IdeAIFrameworkBadge
                  key={index}
                  framework={framework}
                  variant={badge.variant}
                  className={index > 0 ? "ms-2" : ""}
                >
                  {badge.label}
                </IdeAIFrameworkBadge>
              ))}
            </div>
          )}

          {inputValue !== undefined && onInputChange && (
            <IdeAIFrameworkFormField
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
            <IdeAIFrameworkButtonGroup framework={framework} className="mb-3">
              {onPrimaryAction && (
                <IdeAIFrameworkButton
                  framework={framework}
                  onClick={onPrimaryAction}
                  disabled={isLoading}
                  className={isLoading ? "disabled" : ""}
                >
                  {isLoading ? "Loading..." : primaryActionText}
                </IdeAIFrameworkButton>
              )}
              {onSecondaryAction && (
                <IdeAIFrameworkButton
                  framework={framework}
                  variant="secondary"
                  onClick={onSecondaryAction}
                >
                  {secondaryActionText}
                </IdeAIFrameworkButton>
              )}
            </IdeAIFrameworkButtonGroup>
          )}

          <footer className="card-footer bg-transparent border-top pt-3">
            <div className="d-flex justify-content-between align-items-center">
              <p className={cn(config.textClasses, "mb-0 small")}>
                Framework: <span className="fw-bold">{config.name}</span>
              </p>
              <div className="d-flex gap-2">
                <IdeAIFrameworkBadge framework={framework} variant="secondary">
                  React
                </IdeAIFrameworkBadge>
                <IdeAIFrameworkBadge framework={framework} variant="secondary">
                  Next.js
                </IdeAIFrameworkBadge>
              </div>
            </div>
          </footer>
        </div>
      </article>
    );
  }

  // Standard structure for other frameworks
  return (
    <article className={cn(config.cardClasses, className)}>
      <header className="mb-6">
        <h2 className={config.titleClasses}>{title}</h2>
        <p className={config.descriptionClasses}>{description}</p>
      </header>

      {badges.length > 0 && (
        <div className="mb-4">
          {badges.map((badge, index) => (
            <IdeAIFrameworkBadge
              key={index}
              framework={framework}
              variant={badge.variant}
              className={index > 0 ? "ml-2" : ""}
            >
              {badge.label}
            </IdeAIFrameworkBadge>
          ))}
        </div>
      )}

      {inputValue !== undefined && onInputChange && (
        <IdeAIFrameworkFormField
          framework={framework}
          id={inputId}
          label={inputLabel}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
        />
      )}

      {children && <div className="mb-4">{children}</div>}

      {(onPrimaryAction || onSecondaryAction) && (
        <IdeAIFrameworkButtonGroup framework={framework} className="mb-4">
          {onPrimaryAction && (
            <IdeAIFrameworkButton
              framework={framework}
              onClick={onPrimaryAction}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : primaryActionText}
            </IdeAIFrameworkButton>
          )}
          {onSecondaryAction && (
            <IdeAIFrameworkButton
              framework={framework}
              variant="secondary"
              onClick={onSecondaryAction}
            >
              {secondaryActionText}
            </IdeAIFrameworkButton>
          )}
        </IdeAIFrameworkButtonGroup>
      )}

      <footer className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <p className={cn(config.textClasses, "text-sm")}>
            Framework: <span className="font-semibold">{config.name}</span>
          </p>
          <div className="flex gap-2">
            <IdeAIFrameworkBadge framework={framework} variant="secondary">
              React
            </IdeAIFrameworkBadge>
            <IdeAIFrameworkBadge framework={framework} variant="secondary">
              Next.js
            </IdeAIFrameworkBadge>
          </div>
        </div>
      </footer>
    </article>
  );
};


