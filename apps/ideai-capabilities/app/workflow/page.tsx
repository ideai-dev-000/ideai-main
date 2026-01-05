/**
 * @fileoverview Workflow Builder page for Capabilities site
 *
 * @module WorkflowPage
 * @description
 * Page that demonstrates workflow builder as a component.
 * Currently uses iframe bridge, will be replaced with direct component import
 * once workflow is extracted to @repo/workflow package.
 */

"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Loader2 } from "lucide-react";

export default function WorkflowPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if workflow app is running
    const checkWorkflowApp = async () => {
      try {
        // Try to fetch the workflow app
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch("http://localhost:3013", {
          method: "HEAD",
          mode: "no-cors",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        setIsLoading(false);
        setError(
          "Workflow app is not running. Start it with: pnpm --filter ideai-workflow dev",
        );
      }
    };

    // Check immediately and then every 5 seconds
    checkWorkflowApp();
    const interval = setInterval(checkWorkflowApp, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <h1 className="text-3xl font-bold">Workflow Builder</h1>
          <Badge variant="outline">Component Test</Badge>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          This page demonstrates the workflow builder as a component. Currently
          using iframe bridge, will be replaced with direct component import
          once extracted to @repo/workflow package.
        </p>
      </div>

      {error && (
        <Alert className="mb-6" variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Workflow App Not Running</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      )}

      {!isLoading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Workflow Canvas</CardTitle>
            <CardDescription>
              Interactive workflow builder running automatically
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-[800px] w-full overflow-hidden rounded-lg border">
              <iframe
                src="http://localhost:3013?i=1&h=0&f=0&n=0"
                className="h-full w-full border-0"
                title="Workflow Builder"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Architecture Note */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Architecture Note</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <strong>Current</strong>: Using iframe bridge to workflow app (port
            3013). This demonstrates the concept while workflow extraction is in
            progress.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            <strong>Future</strong>: Once workflow is extracted to
            `@repo/workflow` package, this page will import `WorkflowBuilder`
            component directly:
          </p>
          <pre className="mt-2 rounded bg-slate-100 p-3 text-xs dark:bg-slate-900">
            {`import { WorkflowBuilder } from "@repo/workflow";

export default function WorkflowPage() {
  return <WorkflowBuilder />;
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
