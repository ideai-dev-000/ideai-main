/**
 * @fileoverview 404 Not Found page for nocss app
 */

"use client";

import { IdeAINotFound } from "@repo/ui";

export default function NotFound() {
  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "nocss";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAINotFound
      siteName="IdeaI /nocss"
      appName="nocss"
      homeLabel="Go Home"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    />
  );
}
