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
export { IdeAISiteCard } from "./components/ideai-site-card";
export type { IdeAISiteCardProps, SiteStatus } from "./components/ideai-site-card";
export { IdeAIDiagnostics } from "./components/ideai-diagnostics";
export type { IdeAIDiagnosticsProps } from "./components/ideai-diagnostics";
export { UniversalFrameworkCard } from "./components/universal-framework-card";

// shadcn/ui components
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./components/ui/card";
export { Badge } from "./components/ui/badge";
export { Button as ShadcnButton } from "./components/ui/button";
export { Separator } from "./components/ui/separator";
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./components/ui/tooltip";

// Utilities
export { getIdeAIFaviconMetadata } from "./lib/favicon-metadata";

