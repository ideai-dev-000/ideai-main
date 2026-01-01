/**
 * @fileoverview Shared page template component for all IdeaI apps
 * 
 * @module IdeAIPageTemplate
 * @description
 * Provides a consistent page template with header and footer for all pages,
 * including 404 and error pages. Ensures all pages have the same structure.
 * 
 * @example
 * ```tsx
 * <IdeAIPageTemplate siteName="IdeaI /web">
 *   <YourPageContent />
 * </IdeAIPageTemplate>
 * ```
 * 
 * @see {@link ./ideai-header.tsx} - Header component
 * @see {@link ./ideai-footer.tsx} - Footer component
 */

import { ReactNode } from "react";
import { IdeaIHeader } from "./ideai-header";
import { IdeAIFooter } from "./ideai-footer";

interface IdeAIPageTemplateProps {
  siteName?: string;
  subtitle?: string;
  vercelProjectName?: string;
  vercelOrgId?: string;
  children: ReactNode;
  headerActions?: ReactNode;
}

/**
 * Shared page template with header and footer
 * 
 * This component ensures all pages (including 404s and errors) have:
 * - Consistent header with site name
 * - Main content area
 * - Consistent footer
 */
export const IdeAIPageTemplate = ({
  siteName,
  subtitle: _subtitle = "Welcome to IdeaI",
  vercelProjectName: _vercelProjectName,
  vercelOrgId: _vercelOrgId,
  children,
  headerActions: _headerActions,
}: IdeAIPageTemplateProps) => {
  // Suppress unused variable warnings - these props are kept for backward compatibility
  void _subtitle;
  void _vercelProjectName;
  void _vercelOrgId;
  void _headerActions;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <IdeaIHeader
        siteName={siteName}
        mainNav={[
          { label: "Home", href: "/" },
          { label: "Documentation", href: "/docs" },
          { label: "Apps", href: "/index" },
        ]}
        extraNav={[
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
          { label: "Blog", href: "/blog" },
          { label: "Resources", href: "/resources" },
        ]}
        accountLinks={[
          { label: "Sign In", href: "/signin" },
          { label: "Sign Up", href: "/signup" },
        ]}
        sticky={true}
        shrinkOnScroll={true}
        fullWidth={true}
      />
      
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <main style={{ flex: 1, padding: "20px", maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
          {children}
        </main>
        
        <IdeAIFooter siteName={siteName} />
      </div>
    </div>
  );
};








