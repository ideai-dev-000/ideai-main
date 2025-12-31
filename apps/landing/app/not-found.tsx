/**
 * @fileoverview 404 Not Found page for landing app
 * 
 * @module NotFound
 * @description
 * Custom 404 page that uses the shared IdeaI page template
 * to ensure consistent header and footer across all pages.
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import Link from "next/link";

export default function NotFound() {
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "landing";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI"
      subtitle="Page Not Found"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="landing">Open alert</IdeaIButton>}
    >
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>404</h1>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Page Not Found</h2>
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem", color: "rgb(100 116 139)" }}>
          The page you're looking for doesn't exist.
        </p>
        <Link href="/" style={{ textDecoration: "none" }}>
          <IdeaIButton appName="landing">Go to Landing Page</IdeaIButton>
        </Link>
      </div>
    </IdeAIPageTemplate>
  );
}

