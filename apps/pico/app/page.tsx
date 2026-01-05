/**
 * @fileoverview Pico CSS page - Semantic HTML styling only
 */

import { lazy, Suspense } from "react";
import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAIHTMLTest } from "@repo/ui/components/ideai-html-test";
import { IdeAICSSSummary } from "@repo/ui/components/ideai-css-summary";
// Lazy load UF component to prevent compilation hang and memory issues
const UF = lazy(() =>
  import("@repo/ui/components/uf").then((module) => ({ default: module.UF })),
);
import { IdeaIButton } from "@repo/ui/components/ideai-button";

export default function Home() {
  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "pico";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI /pico"
      subtitle="Pico CSS Only - Semantic HTML Styling"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="pico">Open alert</IdeaIButton>}
    >
      <div>
        <IdeAICSSSummary
          frameworks={["Pico CSS"]}
          description="Minimalist stylesheet (~11KB) that styles semantic HTML elements. No utility classes, no Tailwind - just clean semantic styling with elegant defaults."
        />

        {/* UniFrame - Lazy loaded to prevent compilation hang and memory issues */}
        <div className="mt-6">
          <Suspense
            fallback={
              <div className="text-center p-4">Loading UniFrame...</div>
            }
          >
            <UF />
          </Suspense>
        </div>

        <IdeAIHTMLTest />
      </div>
    </IdeAIPageTemplate>
  );
}
