/**
 * @fileoverview 404 Not Found page for pico app
 */

"use client";

import { IdeAINotFound } from "@repo/ui";

export default function NotFound() {
  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "pico";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAINotFound
      siteName="IdeaI /pico"
      appName="pico"
      homeLabel="Go Home"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    />
  );
}
