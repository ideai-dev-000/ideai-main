/**
 * @fileoverview IdeaI Framework Form Field Molecule
 * 
 * @module IdeAIFrameworkFormField
 * @description
 * Molecular component combining label and input atoms into a complete form field.
 * Follows atomic design principles - molecules are combinations of atoms.
 * 
 * @example
 * ```tsx
 * <IdeAIFrameworkFormField
 *   framework="tailwind"
 *   id="email"
 *   label="Email Address"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 * ```
 */

import { InputHTMLAttributes } from "react";
import { IdeAIFrameworkInput } from "../atoms/ideai-framework-input";
import { cn } from "../../lib/utils";
import type { Framework } from "../organisms/ideai-framework-card-types";

interface IdeAIFrameworkFormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
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
 * IdeaI Framework Form Field Molecule
 * 
 * Combines label and input atoms into a complete, accessible form field.
 * Uses semantic HTML with proper label-input association.
 */
export const IdeAIFrameworkFormField = ({
  framework,
  id,
  label,
  labelClassName,
  className,
  helperText,
  error,
  ...inputProps
}: IdeAIFrameworkFormFieldProps) => {
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
      <IdeAIFrameworkInput
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


