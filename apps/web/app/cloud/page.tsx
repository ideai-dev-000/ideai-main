/**
 * @fileoverview Cloud Manager Page
 *
 * @module CloudManagerPage
 * @description
 * Page for managing cloud provider configurations (Vercel, AWS, GCP, Azure, Hostinger).
 * Provides UI for querying, updating, and auto-configuring deployment settings.
 */

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { CloudManagerUI } from "@repo/cloud-manager/components/cloud-manager-ui";
import { IdeaIButton } from "@repo/ui/components/ideai-button";

export default function CloudManagerPage() {
  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI / Cloud Manager"
      subtitle="Manage Cloud Provider Configurations"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="web">Open alert</IdeaIButton>}
    >
      <div className="max-w-7xl mx-auto">
        <CloudManagerUI />
      </div>
    </IdeAIPageTemplate>
  );
}
