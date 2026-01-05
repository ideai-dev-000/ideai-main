"use client";
/**
 * @fileoverview Shadcn Components Showcase Page
 *
 * Displays all shadcn/ui components from @repo/ui with design tokens
 */

import { lazy, Suspense } from "react";
import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAICSSSummary } from "@repo/ui/components/ideai-css-summary";
// Lazy load UF component to prevent compilation hang and memory issues
const UF = lazy(() =>
  import("@repo/ui/components/uf").then((module) => ({ default: module.UF })),
);
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import { useIFrameContext } from "@repo/ui";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button as ShadcnButton } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@repo/ui/components/ui/tooltip";

export default function Home() {
  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "shadcn";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI /shadcn"
      subtitle="Shadcn/UI Components Showcase with Design Tokens"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="shadcn">Open alert</IdeaIButton>}
    >
      <div className="max-w-6xl mx-auto p-8 space-y-12">
        <IdeAICSSSummary
          frameworks={[
            "Tailwind CSS",
            "IdeaI Design System",
            "Shadcn/UI Components",
          ]}
          description="Shadcn/UI component library built on Radix UI primitives, styled with Tailwind CSS and IdeaI design tokens. All components from shared @repo/ui package."
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

        <section>
          <h2 className="text-3xl font-bold mb-6">Shadcn/UI Components</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            All components use design tokens from the shared @repo/ui package.
          </p>
        </section>

        {/* Button Component */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Button</h3>
          <div className="flex flex-wrap gap-4">
            <ShadcnButton>Default</ShadcnButton>
            <ShadcnButton variant="destructive">Destructive</ShadcnButton>
            <ShadcnButton variant="outline">Outline</ShadcnButton>
            <ShadcnButton variant="secondary">Secondary</ShadcnButton>
            <ShadcnButton variant="ghost">Ghost</ShadcnButton>
            <ShadcnButton variant="link">Link</ShadcnButton>
            <ShadcnButton size="sm">Small</ShadcnButton>
            <ShadcnButton size="lg">Large</ShadcnButton>
            <ShadcnButton disabled>Disabled</ShadcnButton>
          </div>
        </section>

        <Separator />

        {/* Badge Component */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Badge</h3>
          <div className="flex flex-wrap gap-4">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </section>

        <Separator />

        {/* Card Component */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description text</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Card content goes here. This demonstrates the card component
                  with all its parts.
                </p>
              </CardContent>
              <CardFooter>
                <ShadcnButton>Action</ShadcnButton>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Another Card</CardTitle>
                <CardDescription>With different content</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  This card shows how multiple cards can be displayed in a grid
                  layout.
                </p>
              </CardContent>
              <CardFooter className="justify-between">
                <Badge>New</Badge>
                <ShadcnButton variant="outline">Learn More</ShadcnButton>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card with Badge</CardTitle>
                <CardDescription>Combining components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    This card demonstrates combining multiple components
                    together.
                  </p>
                  <div className="flex gap-2">
                    <Badge>React</Badge>
                    <Badge variant="secondary">Next.js</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <ShadcnButton className="w-full">
                  Full Width Button
                </ShadcnButton>
              </CardFooter>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Separator Component */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Separator</h3>
          <div className="space-y-4">
            <div>
              <p className="mb-2">Horizontal separator:</p>
              <Separator />
            </div>
            <div className="flex gap-4 h-20">
              <p>Vertical separator:</p>
              <Separator orientation="vertical" />
              <p>Content on the right</p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Tooltip Component */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Tooltip</h3>
          <div className="flex flex-wrap gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ShadcnButton variant="outline">Hover me</ShadcnButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is a tooltip</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ShadcnButton variant="outline">Another tooltip</ShadcnButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tooltips provide additional context</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge>Hover badge</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tooltips work with any element</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </section>

        <Separator />

        {/* Combined Example */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Combined Example</h3>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Component Showcase</CardTitle>
                <Badge variant="secondary">Example</Badge>
              </div>
              <CardDescription>
                This card combines multiple shadcn components together
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Here we demonstrate how all components work together:</p>
              <Separator />
              <div className="flex items-center gap-4">
                <ShadcnButton>Primary Action</ShadcnButton>
                <ShadcnButton variant="outline">Secondary</ShadcnButton>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ShadcnButton variant="ghost">With Tooltip</ShadcnButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This button has a tooltip</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex gap-2">
                <Badge>Design</Badge>
                <Badge variant="secondary">Tokens</Badge>
                <Badge variant="outline">Shared</Badge>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                All components from @repo/ui
              </p>
              <ShadcnButton>Get Started</ShadcnButton>
            </CardFooter>
          </Card>
        </section>
      </div>
    </IdeAIPageTemplate>
  );
}
