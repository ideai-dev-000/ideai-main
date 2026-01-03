/**
 * @fileoverview Main export file for @repo/ui package
 * 
 * @module UIExports
 * @description
 * Centralized exports for all IdeaI UI components and utilities.
 * This allows clean imports: import { Button, IdeaIHeader } from "@repo/ui"
 */

export { Button } from "./button";
export { IdeaIHeader } from "./components/ideai-header";
export { IdeAIFooter } from "./components/ideai-footer";
export { IdeAIContent } from "./components/ideai-content";
export { IdeaIButton } from "./components/ideai-button";
export { IdeAILogo } from "./components/ideai-logo";
export { IdeAIHTMLTest } from "./components/ideai-html-test";
export { IdeAIPageTemplate } from "./components/ideai-page-template";
export { useIFrameContext, detectIFrame, getIFrameContext, type IFrameContext, type BrandConfig } from "./lib/iframe-detection";
export { IdeAISiteCard } from "./components/ideai-site-card";
export type { IdeAISiteCardProps, SiteStatus } from "./components/ideai-site-card";
export { IdeAIDiagnostics } from "./components/ideai-diagnostics";
export type { IdeAIDiagnosticsProps } from "./components/ideai-diagnostics";
export { IdeAIDeployment } from "./components/ideai-deployment";
export type { IdeAIDeploymentProps, DeploymentOption } from "./components/ideai-deployment";
export { IdeAIDocsViewer } from "./components/ideai-docs-viewer";
export type { IdeAIDocsViewerProps } from "./components/ideai-docs-viewer";
export { IdeAIHero } from "./components/ideai-hero";
export type { IdeAIHeroProps } from "./components/ideai-hero";
export { IdeAIFeatureGrid } from "./components/ideai-feature-grid";
export type { IdeAIFeatureGridProps, Feature } from "./components/ideai-feature-grid";
export { IdeAICTASection } from "./components/ideai-cta-section";
export type { IdeAICTASectionProps } from "./components/ideai-cta-section";
export { UniFrameShowcase } from "./components/uf-showcase";
export { UF, type UFProps } from "./components/uf";
// Note: Framework type from UF component is same as from uf-card-types, using uf-card-types version
export { UFCodeViewer } from "./components/uf-code-viewer";
export { UFIFrameWrapper, type UFIFrameWrapperProps } from "./components/uf-iframe-wrapper";
export { UFModal, type UFModalProps } from "./components/uf-modal";
export { UFModalTrigger, type UFModalTriggerProps } from "./components/uf-modal-trigger";
// UniFrame Card Components
export { UniFrameCard } from "./components/uniframe/uf-card/uf-card";
export { UniFrameCardHeader } from "./components/uniframe/uf-card/uf-header";
export { UniFrameCardBody } from "./components/uniframe/uf-card/uf-body";
export { UniFrameCardFooter } from "./components/uniframe/uf-card/uf-footer";
export { UniFrameCardButton } from "./components/uniframe/uf-card/uf-button";
export { UniFrameCardInput } from "./components/uniframe/uf-card/uf-input";
export { UniFrameCardBadge } from "./components/uniframe/uf-card/uf-badge";
export { UniFrameCardFormField } from "./components/uniframe/uf-card/uf-form-field";
export { UniFrameCardButtonGroup } from "./components/uniframe/uf-card/uf-button-group";
export type { Framework, FrameworkConfig } from "./components/uniframe/uf-card/uf-card-types";
export { frameworkConfigs } from "./components/uniframe/uf-card/uf-card-types";

// shadcn/ui components - DEPRECATED: Use @/components/ui/* in apps/web instead
// These are kept for internal use in packages/ui components only
// For v0 compatibility, use apps/web/components/ui/* with @/components/ui/* imports

// Theme Components
export { ThemeProvider } from "./components/theme-provider";
export { ThemeToggle } from "./components/theme-toggle";
export { MobileNav } from "./components/mobile-nav";

// Animation System
export {
  useIdeAIAnimations,
  AnimatedDiv,
  sideMenuVariants,
  panelVariants,
  overlayVariants,
  fadeVariants,
  createSlideVariants,
  createAnimationVariants,
  createAnimationTransition,
} from "./lib/ideai-animations";

// Animation Demos (lazy-loaded)
// Animation components - all driven by JSON files
export { 
  AnimationCard, 
  framerMotionExamples, 
  reactSpringExamples,
  kuteExamples,
  motionOneExamples,
  tsparticlesExamples,
  vivusExamples
} from "./components/animations";
export { AnimationsShowcase } from "./components/animations/animations-showcase";

// Drawing Animations
export { VivusDraw, SVGArtistaDraw, DrawingsShowcase } from "./components/drawings";

// Page templates - all driven by JSON files
export { PageTemplatesShowcase, pageTemplates } from "./components/page-templates";
export type { PageTemplate, TemplateType } from "./components/page-templates";

// Utilities
export { getIdeAIFaviconMetadata } from "./lib/favicon-metadata";
export { readIdeAIConfig, readIdeAIConfigSync, getChildAppConfig, getChildApps, type IdeAIConfig, type VercelProjectConfig } from "./lib/ideai-config";
export { getAppMode, loadChildAppPage, shouldUseUnifiedMode, type AppMode } from "./lib/ideai-app-loader";
export { getVercelProjectConfig, getVercelProjectName, shouldForkToNewProject, type VercelProjectConfig as IdeAIVercelProjectConfig } from "./lib/ideai-vercel";

// V0 Components - Auto-exported from v0-staging
// Available immediately in all apps via: import { ComponentName } from "@repo/ui"
export { TestButton } from "./components/v0/test-button";
// End V0 Components
export { getAllDependencies, verifyDependencies, generateBuildMetadata, checkSecurity, readPackageDependencies, type IdeAIBuildConfig, type ChildDependency, type BuildMetadata } from "./lib/ideai-build";
