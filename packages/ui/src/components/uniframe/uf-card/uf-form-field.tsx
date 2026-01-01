/**
 * @fileoverview UniFrame Card Form Field Component - Label + Input Combination
 * 
 * @file uf-form-field.tsx
 * @module UniFrameCardFormField
 * @description
 * Form field component for UniFrame framework cards.
 * Combines label and input into a complete, accessible form field that adapts
 * styling based on framework configuration.
 * 
 * Part of the UniFrame card system UI elements:
 * - Button (uf-button.tsx)
 * - Input (uf-input.tsx)
 * - Badge (uf-badge.tsx)
 * - FormField (this component)
 * - ButtonGroup (uf-button-group.tsx)
 * 
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 * 
 * @example
 * ```tsx
 * import { UniFrameCardFormField } from "@repo/ui/components/uniframe/uf-card/uf-form-field";
 * 
 * <UniFrameCardFormField
 *   framework="tailwind"
 *   id="email"
 *   label="Email Address"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   helperText="Enter your email address"
 * />
 * ```
 * 
 * @see {@link ./uf-card.tsx} - Main card wrapper component
 * @see {@link ./uf-card-types.ts} - TypeScript type definitions
 * @see {@link ./uf-input.tsx} - Input element
 * @see {@link ./uf-button.tsx} - Button element
 * 
 * @todo Add support for textarea
 * @todo Add support for select dropdown
 * @todo Add support for checkbox/radio groups
 */

import { InputHTMLAttributes } from "react";
import { UniFrameCardInput } from "./uf-input";
import { cn } from "../../../lib/utils";
import type { Framework } from "./uf-card-types";

interface UniFrameCardFormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  /** Framework to use for styling */
  framework: Framework;
  /** Input ID (required for accessibility) */
  id: string;
  /** Label text */
  label: string;
  /** Additional label classes */
  labelClassName?: string;
  /** Additional container classes */
  className?: string;
  /** Helper text */
  helperText?: string;
  /** Error message */
  error?: string;
}

/**
 * UniFrame Card Form Field Component
 * 
 * Combines label and input into a complete, accessible form field.
 * Uses semantic HTML with proper label-input association.
 * 
 * Features:
 * - Semantic HTML (label + input association)
 * - Framework-adaptive styling
 * - Accessible (ARIA labels, error states)
 * - Helper text support
 * - Error message display
 * - Proper form associations
 * 
 * @param props - UniFrame card form field component props
 * @returns React component
 */
export const UniFrameCardFormField = ({
  framework,
  id,
  label,
  labelClassName,
  className,
  helperText,
  error,
  ...inputProps
}: UniFrameCardFormFieldProps) => {
  const labelClasses = framework === "bootstrap" 
    ? "form-label" 
    : "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2";

  return (
    <div className={cn("mb-4", className)}>
      <label
        htmlFor={id}
        className={cn(labelClasses, labelClassName)}
      >
        {label}
      </label>
      <UniFrameCardInput
        framework={framework}
        id={id}
        aria-describedby={helperText ? `${id}-helper` : undefined}
        aria-invalid={error ? "true" : undefined}
        aria-errormessage={error ? `${id}-error` : undefined}
        {...inputProps}
      />
      {helperText && !error && (
        <p
          id={`${id}-helper`}
          className="mt-1 text-xs text-slate-500 dark:text-slate-400"
        >
          {helperText}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1 text-xs text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};
