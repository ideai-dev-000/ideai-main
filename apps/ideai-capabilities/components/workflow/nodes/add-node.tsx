"use client";

import type { NodeProps } from "@xyflow/react";
import { Clock, Play, Plus, Webhook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AddNodeData = {
  onClick?: (triggerType?: "Manual" | "Webhook" | "Schedule") => void;
};

export function AddNode({ data }: NodeProps & { data?: AddNodeData }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 rounded-lg border border-border border-dashed bg-background/50 p-8 backdrop-blur-sm">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold">IdeaI Workflow</h1>
        <p className="text-muted-foreground text-sm">
          Powered by{" "}
          <a
            className="underline underline-offset-2 transition duration-200 ease-out hover:text-foreground"
            href="https://useworkflow.dev/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Workflow
          </a>
          ,{" "}
          <a
            className="underline underline-offset-2 transition duration-200 ease-out hover:text-foreground"
            href="https://ai-sdk.dev/"
            rel="noopener noreferrer"
            target="_blank"
          >
            AI SDK
          </a>
          ,{" "}
          <a
            className="underline underline-offset-2 transition duration-200 ease-out hover:text-foreground"
            href="https://vercel.com/ai-gateway"
            rel="noopener noreferrer"
            target="_blank"
          >
            AI Gateway
          </a>{" "}
          and{" "}
          <a
            className="underline underline-offset-2 transition duration-200 ease-out hover:text-foreground"
            href="https://ai-sdk.dev/elements"
            rel="noopener noreferrer"
            target="_blank"
          >
            AI Elements
          </a>
        </p>
      </div>
      <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
        <Button
          className="gap-2 shadow-lg"
          onClick={() => data.onClick?.()}
          size="default"
        >
          <Plus className="size-4" />
          Add a Step
        </Button>
        <div className="w-full">
          <p className="text-center text-sm text-muted-foreground mb-4">
            Or start with a trigger:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Manual Trigger Card */}
            <button
              onClick={() => data.onClick?.("Manual")}
              className={cn(
                "group relative flex flex-col items-center gap-3 rounded-lg border-2 border-border bg-background p-6 text-center transition-all",
                "hover:border-primary hover:bg-accent hover:shadow-md",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              )}
            >
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                <Play className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-base">Manual</h3>
                <p className="text-xs text-muted-foreground">
                  Run your workflow manually on demand. Perfect for testing and
                  one-off executions.
                </p>
              </div>
            </button>

            {/* Webhook Trigger Card */}
            <button
              onClick={() => data.onClick?.("Webhook")}
              className={cn(
                "group relative flex flex-col items-center gap-3 rounded-lg border-2 border-border bg-background p-6 text-center transition-all",
                "hover:border-primary hover:bg-accent hover:shadow-md",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              )}
            >
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                <Webhook className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-base">Webhook</h3>
                <p className="text-xs text-muted-foreground">
                  Trigger your workflow via HTTP requests. Ideal for integrating
                  with external services and APIs.
                </p>
              </div>
            </button>

            {/* Schedule Trigger Card */}
            <button
              onClick={() => data.onClick?.("Schedule")}
              className={cn(
                "group relative flex flex-col items-center gap-3 rounded-lg border-2 border-border bg-background p-6 text-center transition-all",
                "hover:border-primary hover:bg-accent hover:shadow-md",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              )}
            >
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-base">Schedule</h3>
                <p className="text-xs text-muted-foreground">
                  Run your workflow on a recurring schedule. Great for automated
                  tasks, reports, and maintenance jobs.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
