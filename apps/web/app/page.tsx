/**
 * @fileoverview Main landing page for the IdeaI web application
 * 
 * @module WebAppPage
 * @description
 * The home page component for the IdeaI web application.
 * Landing page is empty - ready for UI components to be added.
 * 
 * @example
 * This page is automatically rendered at the root route (/)
 * 
 * @see {@link ../layout.tsx} - Root layout component
 * @see {@link @repo/ui/components/ideai-page-template} - Shared page template
 */

import { lazy, Suspense } from "react";
import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAICSSSummary } from "@repo/ui/components/ideai-css-summary";
// Lazy load UF component to prevent compilation hang
const UF = lazy(() => import("@repo/ui/components/uf").then(module => ({ default: module.UF })));
import { IdeaIButton } from "@repo/ui/components/ideai-button";

export default function Home() {
  // Get Vercel project name from environment or default
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="web">Open alert</IdeaIButton>}
    >
      <IdeAICSSSummary
        frameworks={["MVP.css", "Tailwind CSS", "IdeaI Design System"]}
        description="Full styling stack with semantic HTML styling, utility classes, and custom design tokens."
      />
      
      {/* UniFrame - Lazy loaded to prevent compilation hang */}
      <div className="mt-6">
        <Suspense fallback={<div className="text-center p-4">Loading UniFrame...</div>}>
          <UF />
        </Suspense>
      </div>
    </IdeAIPageTemplate>
  );
}
