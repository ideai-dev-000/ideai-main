/**
 * @fileoverview Framework Selector Page
 *
 * Shows all available frameworks with links to their showcase pages.
 */

"use client";

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getAllFrameworks } from "../lib/frameworks";

export default function FrameworksIndex() {
  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "ideai-frameworks";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";
  const frameworks = getAllFrameworks();

  return (
    <IdeAIPageTemplate
      siteName="IdeaI Frameworks"
      subtitle="Unified CSS Framework Showcase"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
    >
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">CSS Framework Showcase</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Explore all CSS frameworks available in IdeaI. Each framework is
            showcased in a unified app with dynamic routing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {frameworks.map((framework) => (
            <Card key={framework.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{framework.name}</CardTitle>
                <CardDescription>{framework.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <Badge variant="outline" className="mb-2">
                  {framework.cssType}
                </Badge>
                {framework.oldPort && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Previously: Port {framework.oldPort}
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/${framework.id}`}>View {framework.name} →</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">About This Showcase</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            This unified showcase replaces 8 separate framework apps, reducing
            code duplication by 87.5%. All frameworks are now accessible through
            dynamic routing in a single app.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Each framework maintains its own CSS loading strategy while sharing
            the same component code and structure.
          </p>
        </div>
      </div>
    </IdeAIPageTemplate>
  );
}
