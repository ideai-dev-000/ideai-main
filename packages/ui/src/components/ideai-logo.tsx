/**
 * @fileoverview IdeaI brand logo component with SEO metadata
 * 
 * @module IdeAILogo
 * @description
 * Shared semantic logo component for all IdeaI applications.
 * Includes logo icon image and text, structured data for SEO and Google listings.
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
 * @see {@link ./ideai-logo-icon.tsx} - Logo icon component
 */

import { IdeAILogoIcon } from "./ideai-logo-icon";

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
      
      {/* Logo with icon and text - semantic and accessible */}
      <div className="ideai-logo__container">
        <IdeAILogoIcon 
          className="ideai-logo__icon" 
          width={64} 
          height={64}
          aria-label="IdeaI logo icon"
        />
        <h1 className="ideai-logo__text" itemProp="brand">
          <span className="ideai-logo__brand">IdeaI</span>
          {siteName && (
            <span className="ideai-logo__site" aria-label={`Site: ${siteName}`}>
              {" "}{siteName}
            </span>
          )}
        </h1>
      </div>
      
      {/* Hidden structured data for search engines */}
      <div style={{ display: "none" }} itemProp="description">
        IdeaI - An AI idea engine. {siteName ? `IdeaI ${siteName} site.` : "IdeaI platform."}
      </div>
    </div>
  );
};



