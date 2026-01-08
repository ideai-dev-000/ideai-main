/**
 * @fileoverview Dynamic Framework Showcase Page
 *
 * Displays a specific framework showcase based on the route parameter.
 */

"use client";

import { use } from "react";
import { lazy, Suspense } from "react";
import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAIHTMLTest } from "@repo/ui/components/ideai-html-test";
import { IdeAICSSSummary } from "@repo/ui/components/ideai-css-summary";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import { getFrameworkConfig, getAllFrameworkIds } from "../../lib/frameworks";
import { useRouter } from "next/navigation";

// Lazy load UF component to prevent compilation hang and memory issues
const UF = lazy(() =>
  import("@repo/ui/components/uf").then((module) => ({ default: module.UF })),
);

interface PageProps {
  params: Promise<{
    framework: string;
  }>;
}

export default function FrameworkPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const frameworkId = resolvedParams?.framework || "";
  const framework = getFrameworkConfig(frameworkId);
  const router = useRouter();

  if (!framework) {
    // Redirect to index if framework not found
    router.push("/");
    return null;
  }

  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "ideai-frameworks";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  // Determine CSS frameworks array based on framework type
  const cssFrameworks =
    framework.cssType === "allcss"
      ? ["MVP.css", "Tailwind CSS", "IdeaI Design System"]
      : framework.cssType === "shadcn"
        ? ["Tailwind CSS", "IdeaI Design System", "Shadcn/UI Components"]
        : framework.cssType === "radix"
          ? ["Tailwind CSS", "IdeaI Design System", "Radix UI"]
          : [framework.name];

  return (
    <IdeAIPageTemplate
      siteName={`IdeaI /${framework.name}`}
      subtitle={`${framework.name} - ${framework.cssType} Framework`}
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    >
      <div>
        <IdeAICSSSummary
          frameworks={cssFrameworks}
          description={framework.description}
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

// Note: generateStaticParams removed - using client component with dynamic routing
