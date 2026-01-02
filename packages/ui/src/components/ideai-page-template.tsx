/**
 * @fileoverview Shared page template component for all IdeaI apps
 * 
 * @module IdeAIPageTemplate
 * @description
 * Provides a consistent page template with header and footer for all pages,
 * including 404 and error pages. Ensures all pages have the same structure.
 * 
 * Features:
 * - Automatic iframe detection
 * - Show/hide header, footer, nav based on iframe context
 * - Brand control (parent/child logos)
 * - Always shows main content (useful for embedding)
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
 * @see {@link ../lib/iframe-detection.ts} - IFrame detection system
 */

"use client";

import { ReactNode, useState, useEffect } from "react";
import { IdeaIHeader } from "./ideai-header";
import { IdeAIFooter } from "./ideai-footer";
import { getIFrameContext } from "@repo/ui";

interface IdeAIPageTemplateProps {
  siteName?: string;
  subtitle?: string;
  vercelProjectName?: string;
  vercelOrgId?: string;
  children: ReactNode;
  headerActions?: ReactNode;
  /** Override iframe detection - force hide header */
  forceHideHeader?: boolean;
  /** Override iframe detection - force hide footer */
  forceHideFooter?: boolean;
  /** Override iframe detection - force hide nav */
  forceHideNav?: boolean;
}

/**
 * Shared page template with header and footer
 * 
 * This component ensures all pages (including 404s and errors) have:
 * - Consistent header with site name (hidden in iframe by default)
 * - Main content area (always shown)
 * - Consistent footer (hidden in iframe by default)
 * 
 * When in iframe:
 * - Header, footer, and nav are hidden by default
 * - Main content is always shown (useful for embedding)
 * - Can be controlled via URL parameters or props
 */
export const IdeAIPageTemplate = ({
  siteName,
  subtitle: _subtitle = "Welcome to IdeaI",
  vercelProjectName,
  vercelOrgId: _vercelOrgId,
  children,
  headerActions: _headerActions,
  forceHideHeader,
  forceHideFooter,
  forceHideNav,
}: IdeAIPageTemplateProps) => {
  // Suppress unused variable warnings - these props are kept for backward compatibility
  void _subtitle;
  void _vercelOrgId;
  void _headerActions;

  // Use state to prevent hydration mismatches
  // Start with everything visible (matches server render)
  const [isInIFrame, setIsInIFrame] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [hideFooter, setHideFooter] = useState(false);
  const [hideNav, setHideNav] = useState(false);

  // Detect iframe context only after mount (prevents hydration mismatch)
  useEffect(() => {
    const context = getIFrameContext();
    setIsInIFrame(context.isInIFrame);
    setHideHeader(context.hideHeader);
    setHideFooter(context.hideFooter);
    setHideNav(context.hideNav);
  }, []);
  
  // Determine what to show/hide (with prop overrides)
  const shouldHideHeader = forceHideHeader ?? hideHeader;
  const shouldHideFooter = forceHideFooter ?? hideFooter;
  const shouldHideNav = forceHideNav ?? hideNav;

  // Always render everything, use CSS to hide (prevents hydration mismatch)
  return (
    <div 
      style={{ position: "relative", minHeight: "100vh" }}
      data-ideai-iframe={isInIFrame ? "true" : "false"}
    >
      {/* Header - always rendered, hidden via CSS in iframe */}
      <div style={{ display: shouldHideHeader ? "none" : "block" }}>
        <IdeaIHeader
          siteName={siteName}
          mainNav={shouldHideNav ? [] : [
            { label: "Home", href: "/" },
            { label: "Documentation", href: "/docs" },
            { 
              label: "Animations", 
              href: "/animations",
              children: [
                { label: "Framer Motion", href: "/animations/framer-motion" },
                { label: "React Spring", href: "/animations/react-spring" },
              ]
            },
            { label: "Apps", href: "/index" },
          ]}
          extraNav={shouldHideNav ? [] : [
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "Blog", href: "/blog" },
            { label: "Resources", href: "/resources" },
          ]}
          accountLinks={shouldHideNav ? [] : [
            { label: "Sign In", href: "/signin" },
            { label: "Sign Up", href: "/signup" },
          ]}
          sticky={true}
          shrinkOnScroll={true}
          fullWidth={true}
          diagnosticsAppName={vercelProjectName}
        />
      </div>
      
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Main content - ALWAYS shown (useful for embedding) */}
        <main style={{ flex: 1, padding: "20px", maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
          {children}
        </main>
        
        {/* Footer - always rendered, hidden via CSS in iframe */}
        <div style={{ display: shouldHideFooter ? "none" : "block" }}>
          <IdeAIFooter siteName={siteName} />
        </div>
      </div>
    </div>
  );
};
