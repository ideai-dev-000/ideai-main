/**
 * @fileoverview IdeaI MetaFramework Page
 *
 * @module MetaFrameworkPage
 * @description
 * The MetaFramework page showcasing IdeaI's framework capabilities and design system.
 * Previously the homepage, now moved to /metaframework for better structure.
 *
 * @see {@link ../layout.tsx} - Root layout component
 * @see {@link @repo/ui/components/ideai-page-template} - Shared page template
 */

import { lazy, Suspense } from "react";
import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAICSSSummary } from "@repo/ui/components/ideai-css-summary";
// Lazy load UF component to prevent compilation hang
const UF = lazy(() =>
  import("@repo/ui/components/uf").then((module) => ({ default: module.UF })),
);
import { IdeaIButton } from "@repo/ui/components/ideai-button";

export default function MetaFrameworkPage() {
  // Get Vercel project name from environment or default
  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI MetaFramework"
      subtitle="Production-Ready Framework with Advanced Tooling"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    >
      <IdeAICSSSummary
        frameworks={["MVP.css", "Tailwind CSS", "IdeaI Design System"]}
        description="Full styling stack with semantic HTML styling, utility classes, and custom design tokens."
      />

      {/* UniFrame - Lazy loaded to prevent compilation hang */}
      <div className="mt-6">
        <Suspense
          fallback={<div className="text-center p-4">Loading UniFrame...</div>}
        >
          <UF />
        </Suspense>
      </div>
    </IdeAIPageTemplate>
  );
}
