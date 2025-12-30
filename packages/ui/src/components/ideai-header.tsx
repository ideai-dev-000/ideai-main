/**
 * @fileoverview IdeaI header/branding component
 * 
 * @module IdeaIHeader
 * @description
 * Shared header component for all IdeaI applications.
 * Displays the IdeaI branding with logo and site name.
 * Uses ONLY centralized CSS classes - NO app-specific CSS.
 * Guaranteed identical rendering across all apps.
 * 
 * @example
 * ```tsx
 * import { IdeaIHeader } from "@repo/ui/components/ideai-header";
 * 
 * <IdeaIHeader siteName="/web" subtitle="Welcome to IdeaI" />
 * ```
 * 
 * @see {@link ./ideai-logo.tsx} - Logo component
 * @see {@link ./ideai-footer.tsx} - Footer component
 */

import { ReactNode } from "react";
import { IdeAILogo } from "./ideai-logo";

interface IdeaIHeaderProps {
  siteName?: string;
  subtitle?: string;
  children?: ReactNode;
}

export const IdeaIHeader = ({ 
  siteName,
  subtitle = "Welcome to IdeaI",
  children 
}: IdeaIHeaderProps) => {
  return (
    <div className="ideai-header">
      <IdeAILogo siteName={siteName} />
      <p className="ideai-header__subtitle">{subtitle}</p>
      <div className="ideai-header__actions">
        {children}
      </div>
    </div>
  );
};
