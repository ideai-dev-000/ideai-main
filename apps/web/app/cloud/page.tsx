/**
 * @fileoverview Cloud Manager Page (DEVELOPMENT ONLY)
 *
 * @module CloudManagerPage
 * @description
 * Page for managing cloud provider configurations (Vercel, AWS, GCP, Azure, Hostinger).
 * Provides UI for querying, updating, and auto-configuring deployment settings.
 *
 * ⚠️ SECURITY: This page is DEVELOPMENT ONLY and must NEVER be accessible in production.
 * It contains sensitive cloud provider management functionality.
 *
 * @security
 * - Only available when NODE_ENV === "development"
 * - Returns 404 in production builds
 * - Navigation link hidden in production
 * - Never deployed to production
 */

import { notFound } from "next/navigation";
import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { CloudManagerUI } from "@repo/cloud-manager";
import { IdeaIButton } from "@repo/ui/components/ideai-button";

/**
 * Cloud Manager Page - Development Only
 *
 * ⚠️ SECURITY: This page is DEVELOPMENT ONLY and must NEVER be accessible in production.
 *
 * Protection layers:
 * 1. Runtime check: Returns 404 (notFound()) if NODE_ENV !== "development"
 * 2. Navigation: Link only appears when NODE_ENV === "development"
 * 3. Documentation: Security warnings in code and UI
 *
 * The route will be built in production, but will return 404 when accessed.
 * This ensures it's never accessible in production while allowing the build to succeed.
 */
export default function CloudManagerPage() {
  // SECURITY: Runtime check - only allow in development
  // In production, this will return 404 (notFound())
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!isDevelopment) {
    // Return 404 in production - page should never be accessible
    notFound();
  }

  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI / Cloud Manager (Dev Only)"
      subtitle="Manage Cloud Provider Configurations - Development Only"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ <strong>Development Only:</strong> This Cloud Manager is only
            available in development mode for security reasons.
          </p>
        </div>
        <CloudManagerUI />
      </div>
    </IdeAIPageTemplate>
  );
}
