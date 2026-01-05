/**
 * @fileoverview App Builder page for Capabilities site
 *
 * @module AppBuilderPage
 * @description
 * Placeholder page for app builder component integration.
 * Will be updated once app builder is extracted to @repo/app-builder package.
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function AppBuilderPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <h1 className="text-3xl font-bold">App Builder</h1>
          <Badge variant="outline">Coming Soon</Badge>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Build apps with AI using v0 SDK integration. This page will be updated
          once the app builder is extracted to @repo/app-builder package.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Component Integration Pending</AlertTitle>
        <AlertDescription>
          App builder component integration will be added once extracted to
          @repo/app-builder package. This demonstrates the pattern for future
          component integration.
        </AlertDescription>
      </Alert>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Architecture</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Once app builder is extracted to `@repo/app-builder` package, this
            page will import the component directly:
          </p>
          <pre className="mt-2 rounded bg-slate-100 p-3 text-xs dark:bg-slate-900">
            {`import { AppBuilder } from "@repo/app-builder";

export default function AppBuilderPage() {
  return <AppBuilder />;
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
