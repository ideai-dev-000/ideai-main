/**
 * @fileoverview IdeaI brand logo component with SEO metadata
 * 
 * @module IdeAILogo
 * @description
 * Shared semantic logo component for all IdeaI applications.
 * Includes structured data for SEO and Google listings.
 * Uses centralized CSS classes for perfect consistency.
 * 
 * @example
 * ```tsx
 * import { IdeAILogo } from "@repo/ui/components/ideai-logo";
 * 
 * <IdeAILogo siteName="/all" />
 * ```
 * 
 * @see {@link ./ideai-header.tsx} - Header component
 */

interface IdeAILogoProps {
  siteName?: string;
}

export const IdeAILogo = ({ siteName }: IdeAILogoProps) => {
  const displayName = siteName ? `IdeaI ${siteName}` : "IdeaI";
  
  return (
    <div className="ideai-logo" itemScope itemType="https://schema.org/Organization">
      {/* Structured data for SEO */}
      <meta itemProp="name" content="IdeaI" />
      <meta itemProp="url" content="https://ideai.space" />
      
      {/* Logo text - semantic and accessible */}
      <h1 className="ideai-logo__text" itemProp="brand">
        <span className="ideai-logo__brand">IdeaI</span>
        {siteName && (
          <span className="ideai-logo__site" aria-label={`Site: ${siteName}`}>
            {" "}{siteName}
          </span>
        )}
      </h1>
      
      {/* Hidden structured data for search engines */}
      <div style={{ display: "none" }} itemProp="description">
        IdeaI - An AI idea engine. {siteName ? `IdeaI ${siteName} site.` : "IdeaI platform."}
      </div>
    </div>
  );
};

