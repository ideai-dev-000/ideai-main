"use client";
/**
 * @fileoverview UnoCSS page - Atomic CSS styling only
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
import { useIFrameContext } from "@repo/ui";

export default function Home() {
  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "unocss";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI /unocss"
      subtitle="UnoCSS Only - Atomic CSS Styling"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="unocss">Open alert</IdeaIButton>}
    >
      <div>
        <IdeAICSSSummary
          frameworks={["UnoCSS"]}
          description="Atomic CSS engine with on-demand generation. No Tailwind, no MVP.css - just UnoCSS for utility-first styling with instant compilation."
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
