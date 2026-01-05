/**
 * @fileoverview Landing page for IdeaI Capabilities site
 *
 * @module CapabilitiesLanding
 * @description
 * Landing page explaining the capabilities site and its purpose as a test bed
 * for shared codebase architecture.
 */

// Landing page - no need for IdeAIPageTemplate as it's in layout
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Workflow,
  UserSearch,
  Code,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function CapabilitiesLanding() {
  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <Badge className="mb-4" variant="outline">
              Test Bed Site
            </Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              IdeaI Capabilities
            </h1>
            <p className="mb-8 text-xl text-slate-600 dark:text-slate-400">
              Shared Codebase Architecture Test Bed
            </p>
            <p className="mx-auto max-w-2xl text-slate-700 dark:text-slate-300">
              This site demonstrates how to build new sites using shared
              capabilities as components. It bridges the path from separate apps
              to shared packages, directly addressing the True Unified Mode
              TODO.
            </p>
          </div>

          {/* Purpose Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Purpose</CardTitle>
              <CardDescription>
                This site serves as a test bed and reference implementation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  <span>
                    <strong>Proves Concept</strong>: Demonstrates that
                    capabilities can be used as components
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  <span>
                    <strong>Bridges Gap</strong>: Shows path from separate apps
                    to shared packages
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  <span>
                    <strong>Test Bed</strong>: Safe environment to test
                    component extraction
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  <span>
                    <strong>Reference Implementation</strong>: Example for
                    future sites
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                  <span>
                    <strong>Closes TODOs</strong>: Directly addresses multiple
                    TODO items
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Capabilities Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <Workflow className="h-5 w-5 text-blue-600" />
                  <CardTitle>Workflow Builder</CardTitle>
                </div>
                <CardDescription>
                  Visual workflow automation with drag-and-drop builder
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/workflow">
                    Open Workflow Builder
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <UserSearch className="h-5 w-5 text-green-600" />
                  <CardTitle>Lead Agent</CardTitle>
                </div>
                <CardDescription>
                  AI-powered lead qualification and research agent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full" disabled>
                  <Link href="/lead-agent">
                    Coming Soon
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-600" />
                  <CardTitle>App Builder</CardTitle>
                </div>
                <CardDescription>
                  Build apps with AI using v0 SDK integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full" disabled>
                  <Link href="/app-builder">
                    Coming Soon
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Architecture Section */}
          <Card>
            <CardHeader>
              <CardTitle>Architecture</CardTitle>
              <CardDescription>
                How this site bridges to shared codebase architecture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Current Approach</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Capabilities are imported directly from existing apps as
                  components or via iframe bridge. This demonstrates the concept
                  before full package extraction.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Future Approach</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Once capabilities are extracted to packages (`@repo/workflow`,
                  `@repo/lead-agent`, `@repo/app-builder`), this site will
                  import from packages for true shared codebase architecture.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">TODOs Addressed</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Extract Capabilities to Packages (test bed created)</li>
                  <li>Refactor Apps to Use Packages (pattern demonstrated)</li>
                  <li>
                    Implement True Unified Mode (component imports, no iframes)
                  </li>
                  <li>Documentation (example site created)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
