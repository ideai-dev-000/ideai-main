/**
 * @fileoverview About IdeaI Page
 *
 * @module AboutPage
 * @description
 * Comprehensive overview of the IdeaI monorepo framework, its architecture,
 * features, and capabilities. Uses shadcn components for professional formatting.
 *
 * @see {@link ../layout.tsx} - Root layout component
 * @see {@link @repo/ui/components/ideai-page-template} - Shared page template
 */

import Link from "next/link";
import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const vercelProjectName =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "web";
  const vercelOrgId =
    process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="About IdeaI"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="web">Open alert</IdeaIButton>}
    >
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About IdeaI</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A production-ready monorepo framework with advanced tooling,
            composable architecture, and a focus on developer experience.
          </p>
        </div>

        <Separator />

        {/* Core Architecture */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Core Architecture</CardTitle>
            <CardDescription>
              Parent-child app system with iframe embedding and unified
              deployment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Parent-Child App System</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  Parent app (<code className="text-foreground">web</code>)
                  serves at root, embeds child apps via iframes
                </li>
                <li>
                  13+ showcase apps (docs, all, nocss, mvp, tailwind, allcss,
                  bootstrap, unocss, shadcn, material, chakra, radix, pico)
                </li>
                <li>
                  Additional apps: ideai-builder, ideai-designer,
                  ideai-workflow, lead-processing-agent
                </li>
                <li>
                  Configuration via{" "}
                  <code className="text-foreground">.ideai.json</code> files
                  (optional — defaults work)
                </li>
                <li>Automatic iframe detection with URL parameter control</li>
                <li>Complete CSS isolation per child app</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Cloud Manager */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Cloud Manager Package</CardTitle>
            <CardDescription>
              Advanced Vercel management system with UI for configuring projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="default">Vercel MVP</Badge>
              <Badge variant="outline">AWS Planned</Badge>
              <Badge variant="outline">GCP Planned</Badge>
              <Badge variant="outline">Azure Planned</Badge>
              <Badge variant="outline">Hostinger Planned</Badge>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Features:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  Full Vercel API integration (
                  <code className="text-foreground">VercelClient</code>)
                </li>
                <li>
                  UI for project management (
                  <code className="text-foreground">VercelManager</code>{" "}
                  component)
                </li>
                <li>Auto-configuration for new projects</li>
                <li>
                  Settings query/update (Root Directory, Build Command, etc.)
                </li>
                <li>Validation for monorepo structure</li>
                <li>Provider-agnostic UI with provider-specific clients</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Shared UI Package */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Shared UI Package</CardTitle>
            <CardDescription>
              Comprehensive component library with animations, templates, and
              utilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold mb-2">Page Templates</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>Dashboard, Blog, Social, E-commerce</li>
                  <li>Landing, Portfolio, Docs, Admin</li>
                  <li>JSON-driven configuration</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Animation System</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>Framer Motion, React Spring</li>
                  <li>Kute, Motion One, tsparticles, Vivus</li>
                  <li>JSON-driven examples</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">UniFrame Components</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>Composable card system</li>
                  <li>UF, UFCodeViewer, UFModal</li>
                  <li>Full component library</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Core Components</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>Header, Footer, Content, Button</li>
                  <li>Logo, Site Card, Diagnostics</li>
                  <li>Theme system with dark mode</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Build System */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Build System</CardTitle>
            <CardDescription>
              Comprehensive build verification and management tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="font-semibold">Key Features:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  <code className="text-foreground">ideai-build.mjs</code>: Main
                  CLI (setup, verify, update, rules)
                </li>
                <li>
                  Dependency checking: Auto-detects child app dependencies
                </li>
                <li>Dependency sync: Auto-syncs child deps to parent</li>
                <li>
                  Build tracking: Metadata saved to{" "}
                  <code className="text-foreground">.ideai/builds/</code>
                </li>
                <li>Documentation verification: Ensures docs match code</li>
                <li>
                  Rules management: Propose/approve/sync development rules
                </li>
                <li>Memory monitoring: Tracks build memory usage</li>
                <li>Cold refresh: Clean rebuild system</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Developer Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Developer Tools</CardTitle>
            <CardDescription>
              Centralized dev-only tools in @repo/ideai-developer package
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Tight coupling: Scripts route to package functions</li>
                <li>Port management: Status, start, stop dev servers</li>
                <li>Script runner: Execute build scripts</li>
                <li>Build status: Get current build state</li>
                <li>
                  Dev-only safety:{" "}
                  <code className="text-foreground">assertDevelopment()</code>{" "}
                  guards
                </li>
                <li>
                  Single entry point:{" "}
                  <code className="text-foreground">
                    scripts/ideai-developer.mjs
                  </code>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Configuration System */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Configuration System</CardTitle>
            <CardDescription>
              Flexible .ideai.json configuration files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="font-semibold">Configuration Options:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  App role: <code className="text-foreground">parent</code> or{" "}
                  <code className="text-foreground">child</code>
                </li>
                <li>Child apps list (for parents)</li>
                <li>
                  Vercel project config (project name, org ID, fork settings)
                </li>
                <li>Animation libraries available</li>
                <li>Metadata (port, CSS, capabilities, path, category)</li>
                <li>
                  Build settings (include child deps, verify, security check,
                  track builds)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Documentation System */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Documentation System</CardTitle>
            <CardDescription>
              ContentLayer-based documentation with type-safe content access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  MDX content in{" "}
                  <code className="text-foreground">apps/docs/content/</code>
                </li>
                <li>Type-safe content access</li>
                <li>SEO metadata generation</li>
                <li>Sitemap generation</li>
                <li>Semantic URLs</li>
                <li>
                  Docs viewer component (
                  <code className="text-foreground">IdeAIDocsViewer</code>)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Deployment Architecture */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Deployment Architecture</CardTitle>
            <CardDescription>Multi-strategy deployment support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold mb-2">Current</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>
                    Sub-folders:{" "}
                    <code className="text-foreground">
                      myui.space/apps/{`{name}`}
                    </code>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Planned</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>
                    Subdomains:{" "}
                    <code className="text-foreground">
                      {`{app}`}.myui.space
                    </code>
                  </li>
                  <li>Self-sovereign apps: Individual deployments</li>
                  <li>
                    Mother-child apps: Self-compiled with embedded children
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-semibold mb-2">Unified Deployment</p>
              <p className="text-sm text-muted-foreground">
                Single command via{" "}
                <code className="text-foreground">deploy.sh</code>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Standards and Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Standards and Rules</CardTitle>
            <CardDescription>
              Strict development standards for code quality and consistency
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="font-semibold mb-2">Brand Standards</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>
                    Brand name: Always &quot;IdeaI&quot; (capital I, lowercase
                    dea, capital I)
                  </li>
                  <li>Semantic file naming: kebab-case, descriptive</li>
                  <li>
                    UniFrame naming:{" "}
                    <code className="text-foreground">uf-</code> prefix for
                    files, <code className="text-foreground">UF</code> for
                    components
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Code Quality</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>
                    TypeScript strict mode, no{" "}
                    <code className="text-foreground">any</code> types
                  </li>
                  <li>Rich JSDoc headers</li>
                  <li>
                    Centralized CSS: All apps use{" "}
                    <code className="text-foreground">@repo/ui</code> styles
                  </li>
                  <li>
                    No legacy support: Future-focused, 2026+ practices only
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">Commit Standards</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>Detailed messages with ticket references</li>
                  <li>
                    Structured format:{" "}
                    <code className="text-foreground">
                      type(scope): subject
                    </code>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Current Status</CardTitle>
            <CardDescription>
              What&apos;s completed and what&apos;s in progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold mb-2 text-green-600 dark:text-green-400">
                  ✅ Completed
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>UI consistency across all 13 apps</li>
                  <li>Shared page templates and components</li>
                  <li>Brand assets and favicons</li>
                  <li>Build system working</li>
                  <li>Cloud Manager Vercel MVP</li>
                  <li>Documentation system</li>
                  <li>Parent-child architecture</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2 text-yellow-600 dark:text-yellow-400">
                  ⏳ In Progress
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  <li>Multi-strategy deployment plan</li>
                  <li>Sub-folder route fixes</li>
                  <li>Enhanced status dashboard</li>
                  <li>Submodule management</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-4 pt-8">
          <Separator />
          <h2 className="text-2xl font-semibold">Get Started</h2>
          <p className="text-muted-foreground">
            Explore the IdeaI framework and start building your next
            application.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/docs">View Documentation</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/index">Browse Apps</Link>
            </Button>
          </div>
        </div>
      </div>
    </IdeAIPageTemplate>
  );
}
