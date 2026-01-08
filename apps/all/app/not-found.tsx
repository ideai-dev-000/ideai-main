/**
 * @fileoverview 404 Not Found page for all app
 */

"use client";

import { IdeAINotFound } from "@repo/ui";

export default function NotFound() {
  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "all";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAINotFound
      siteName="IdeaI /all"
      appName="all"
      homeLabel="Go Home"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    />
  );
}
