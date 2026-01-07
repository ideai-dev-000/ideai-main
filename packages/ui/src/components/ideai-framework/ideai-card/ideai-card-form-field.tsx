/**
 * @fileoverview IdeaI Card Form Field Component
 *
 * @module IdeAICardFormField
 * @description
 * Form field component combining label and input into a complete form field.
 * Part of the IdeaI framework card system.
 *
 * @example
 * ```tsx
 * <IdeAICardFormField
 *   framework="tailwind"
 *   id="email"
 *   label="Email Address"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 * ```
 */

import { InputHTMLAttributes } from "react";
import { IdeAICardInput } from "./ideai-card-input";
import { cn } from "../../../lib/utils";
import type { Framework } from "./ideai-card-types";

interface IdeAICardFormFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id"
> {
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
 * IdeaI Card Form Field Component
 *
 * Combines label and input into a complete, accessible form field.
 * Uses semantic HTML with proper label-input association.
 */
export const IdeAICardFormField = ({
  framework,
  id,
  label,
  labelClassName,
  className,
  helperText,
  error,
  ...inputProps
}: IdeAICardFormFieldProps) => {
  const labelClasses =
    framework === "bootstrap"
      ? "form-label"
      : "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2";

  return (
    <div className={cn("mb-4", className)}>
      <label htmlFor={id} className={cn(labelClasses, labelClassName)}>
        {label}
      </label>
      <IdeAICardInput
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


