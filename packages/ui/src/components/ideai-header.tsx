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
  vercelProjectName?: string;
  vercelOrgId?: string;
  children?: ReactNode;
}

/**
 * Get Vercel project URL from project name and org ID
 */
function getVercelProjectUrl(projectName?: string, orgId?: string): string | null {
  if (!projectName) return null;
  const org = orgId || process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "idea-i";
  return `https://vercel.com/${org}/${projectName}`;
}

export const IdeaIHeader = ({ 
  siteName,
  subtitle = "Welcome to IdeaI",
  vercelProjectName,
  vercelOrgId,
  children 
}: IdeaIHeaderProps) => {
  const vercelUrl = getVercelProjectUrl(vercelProjectName, vercelOrgId);
  
  return (
    <div className="ideai-header">
      <IdeAILogo siteName={siteName} />
      <p className="ideai-header__subtitle">{subtitle}</p>
      {vercelProjectName && (
        <div className="ideai-header__project">
          <span className="ideai-header__project-label">Project:</span>
          {vercelUrl ? (
            <a 
              href={vercelUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ideai-header__project-link"
            >
              {vercelProjectName}
            </a>
          ) : (
            <span className="ideai-header__project-name">{vercelProjectName}</span>
          )}
        </div>
      )}
      <div className="ideai-header__actions">
        {children}
      </div>
    </div>
  );
};
