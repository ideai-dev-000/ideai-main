/**
 * @fileoverview 404 Not Found page for web app
 *
 * @module NotFound
 * @description
 * Custom 404 page using centralized IdeAINotFound component
 * for consistent styling and proper mobile centering.
 */

"use client";

import { IdeAINotFound } from "@repo/ui";

export default function NotFound() {
  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAINotFound
      siteName="IdeaI"
      appName="web"
      homeLabel="Go Home"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    />
  );
}
