/**
 * @fileoverview IFrame Detection System for IdeaI Sites
 * 
 * @file iframe-detection.ts
 * @module IFrameDetection
 * @description
 * Standard way to detect if a site is viewed in an iframe and pass variables.
 * Allows IdeaI sites to show/hide UI elements easily when embedded.
 * 
 * Features:
 * - Detects if site is in iframe
 * - Reads URL parameters for iframe context
 * - Provides utilities for conditional rendering
 * - Supports parent/child site communication
 * - Compact URL parameter format for efficiency
 * 
 * @author IdeaI Development Team
 * @since 2026-01-01
 * @version 1.0.0
 * 
 * @example
 * ```tsx
 * import { useIFrameContext } from "@repo/ui/lib/iframe-detection";
 * 
 * const { isInIFrame, hideHeader, hideFooter, hideNav } = useIFrameContext();
 * 
 * {!hideHeader && <Header />}
 * ```
 * 
 * @example
 * Compact URL format:
 * ```
 * ?i=1&h=0&f=0&n=0
 * ```
 * 
 * @see {@link ../components/ideai-page-template.tsx} - Page template using iframe detection
 */

/**
 * IFrame Context Configuration
 */
export interface IFrameContext {
  /** Whether the site is currently in an iframe */
  isInIFrame: boolean;
  /** Hide header when in iframe */
  hideHeader: boolean;
  /** Hide footer when in iframe */
  hideFooter: boolean;
  /** Hide navigation when in iframe */
  hideNav: boolean;
  /** Hide CSS framework summary when in iframe */
  hideCSSSummary: boolean;
  /** Hide UniFrame demo section when in iframe */
  hideUniFrame: boolean;
  /** Parent site URL (if in iframe) */
  parentUrl?: string;
  /** Brand configuration from parent */
  brandConfig?: BrandConfig;
}

/**
 * Brand Configuration
 * Supports parent/child logos and shared props
 */
export interface BrandConfig {
  /** Parent site name */
  parentSiteName?: string;
  /** Parent site logo URL */
  parentLogoUrl?: string;
  /** Child site name */
  childSiteName?: string;
  /** Child site logo URL */
  childLogoUrl?: string;
  /** Show parent logo */
  showParentLogo?: boolean;
  /** Show child logo */
  showChildLogo?: boolean;
  /** Shared props from parent */
  sharedProps?: Record<string, unknown>;
}

/**
 * URL Parameter Rules for IFrame Detection
 * 
 * COMPACT FORMAT (Preferred):
 * - i=1          - In iframe (1 = yes, 0 = no)
 * - v=0|1        - Visibility (0 = hide all, 1 = show all)
 * - h=0|1        - Header (0 = hide, 1 = show)
 * - f=0|1        - Footer (0 = hide, 1 = show)
 * - n=0|1        - Nav (0 = hide, 1 = show)
 * - c=0|1        - CSS Summary (0 = hide, 1 = show)
 * - u=0|1        - UniFrame (0 = hide, 1 = show)
 * - p=<url>      - Parent URL
 * - b=<json>     - Brand config (JSON encoded)
 * 
 * VERBOSE FORMAT (Backward compatible):
 * - ideai-iframe=true|false
 * - ideai-hide-header=true|false
 * - ideai-hide-footer=true|false
 * - ideai-hide-nav=true|false
 * - ideai-parent-url=<url>
 * - ideai-brand-config=<json>
 * 
 * EXAMPLES:
 * - ?i=1&h=0&f=0&n=0          - In iframe, hide header/footer/nav
 * - ?i=1&v=0                   - In iframe, hide everything
 * - ?h=0&f=0                   - Hide header and footer (not in iframe)
 * - ?i=1&c=0&u=0               - In iframe, hide CSS summary and UniFrame
 * - ?i=1&h=0&f=0&n=0&c=0&u=0&p=https://parent.com  - Full example with parent URL
 * 
 * DEFAULT BEHAVIOR:
 * - If in iframe (detected): h=0, f=0, n=0, c=0, u=0 (hide header/footer/nav/CSS summary/UniFrame)
 * - If not in iframe: h=1, f=1, n=1, c=1, u=1 (show all)
 * - Main content always shown (v=1 for main content cannot be overridden)
 */

/**
 * Parse boolean from URL parameter
 * Supports: "1", "true", "yes" = true; "0", "false", "no" = false
 */
function parseBoolean(value: string | null, defaultValue: boolean): boolean {
  if (!value) return defaultValue;
  const lower = value.toLowerCase();
  return lower === "1" || lower === "true" || lower === "yes";
}

/**
 * Parse hide/show value (0 = hide, 1 = show)
 * Returns true if should hide, false if should show
 */
function parseHideShow(value: string | null, defaultHide: boolean): boolean {
  if (!value) return defaultHide;
  const lower = value.toLowerCase();
  // 0 = hide, 1 = show
  if (lower === "0") return true;
  if (lower === "1") return false;
  // Also support true/false for backward compatibility
  if (lower === "true") return true;
  if (lower === "false") return false;
  return defaultHide;
}

/**
 * Detect if site is in an iframe
 * 
 * @returns true if site is in iframe, false otherwise
 */
export function detectIFrame(): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    // Method 1: Check window.self vs window.top
    return window.self !== window.top;
  } catch (e) {
    // Method 2: If cross-origin, try-catch will throw, so we're in iframe
    return true;
  }
}

/**
 * Get IFrame context from URL parameters
 * 
 * Supports both compact and verbose formats:
 * - Compact: ?i=1&h=0&f=0&n=0
 * - Verbose: ?ideai-iframe=true&ideai-hide-header=true
 * 
 * @returns IFrame context configuration
 */
export function getIFrameContext(): IFrameContext {
  if (typeof window === "undefined") {
    return {
      isInIFrame: false,
      hideHeader: false,
      hideFooter: false,
      hideNav: false,
      hideCSSSummary: false,
      hideUniFrame: false,
    };
  }

  const isInIFrame = detectIFrame();
  const searchParams = new URLSearchParams(window.location.search);

  // Check if we're being served as a child app in unified mode
  // Child apps are served at /apps/{name} in the parent app
  const pathname = window.location.pathname;
  const isChildAppRoute = pathname.startsWith("/apps/") && 
    pathname !== "/apps" &&
    !pathname.startsWith("/apps/["); // Not the catch-all route itself

  // COMPACT FORMAT (Preferred)
  // i=1 - In iframe
  const explicitIFrame = parseBoolean(searchParams.get("i"), false);
  // In unified mode, child apps should hide branding (like in iframe)
  const finalIsInIFrame = isInIFrame || explicitIFrame || isChildAppRoute;

  // v=0|1 - Visibility (0 = hide all, 1 = show all)
  const visibility = searchParams.get("v");
  const hideAll = visibility === "0";
  const showAll = visibility === "1";

  // h=0|1 - Header (0 = hide, 1 = show)
  const headerParam = searchParams.get("h");
  const hideHeader = hideAll || (headerParam !== null ? parseHideShow(headerParam, false) : (finalIsInIFrame && !showAll));

  // f=0|1 - Footer (0 = hide, 1 = show)
  const footerParam = searchParams.get("f");
  const hideFooter = hideAll || (footerParam !== null ? parseHideShow(footerParam, false) : (finalIsInIFrame && !showAll));

  // n=0|1 - Nav (0 = hide, 1 = show)
  const navParam = searchParams.get("n");
  const hideNav = hideAll || (navParam !== null ? parseHideShow(navParam, false) : (finalIsInIFrame && !showAll));

  // c=0|1 - CSS Summary (0 = hide, 1 = show)
  const cssSummaryParam = searchParams.get("c");
  const hideCSSSummary = hideAll || (cssSummaryParam !== null ? parseHideShow(cssSummaryParam, false) : (finalIsInIFrame && !showAll));

  // u=0|1 - UniFrame (0 = hide, 1 = show)
  const uniFrameParam = searchParams.get("u");
  const hideUniFrame = hideAll || (uniFrameParam !== null ? parseHideShow(uniFrameParam, false) : (finalIsInIFrame && !showAll));

  // p=<url> - Parent URL
  const parentUrl = searchParams.get("p") || undefined;

  // b=<json> - Brand config
  const brandConfigParam = searchParams.get("b");
  const brandConfig: BrandConfig | undefined = brandConfigParam
    ? JSON.parse(decodeURIComponent(brandConfigParam))
    : undefined;

  // VERBOSE FORMAT (Backward compatible)
  // Check verbose params only if compact params not set
  if (headerParam === null) {
    const verboseHideHeader = searchParams.get("ideai-hide-header");
    if (verboseHideHeader !== null) {
      const shouldHide = parseBoolean(verboseHideHeader, false);
      if (shouldHide || (finalIsInIFrame && verboseHideHeader !== "false")) {
        return {
          isInIFrame: finalIsInIFrame,
          hideHeader: true,
          hideFooter: hideFooter,
          hideNav: hideNav,
          hideCSSSummary: hideCSSSummary,
          hideUniFrame: hideUniFrame,
          parentUrl: parentUrl || searchParams.get("ideai-parent-url") || undefined,
          brandConfig: brandConfig || (searchParams.get("ideai-brand-config")
            ? JSON.parse(decodeURIComponent(searchParams.get("ideai-brand-config") || "{}"))
            : undefined),
        };
      }
    }
  }

  return {
    isInIFrame: finalIsInIFrame,
    hideHeader,
    hideFooter,
    hideNav,
    hideCSSSummary,
    hideUniFrame,
    parentUrl,
    brandConfig,
  };
}

/**
 * React hook for IFrame context
 * 
 * @returns IFrame context with reactive updates
 */
export function useIFrameContext(): IFrameContext {
  if (typeof window === "undefined") {
    return {
      isInIFrame: false,
      hideHeader: false,
      hideFooter: false,
      hideNav: false,
      hideCSSSummary: false,
      hideUniFrame: false,
    };
  }

  // For now, return static context (can be made reactive with useState/useEffect if needed)
  return getIFrameContext();
}
