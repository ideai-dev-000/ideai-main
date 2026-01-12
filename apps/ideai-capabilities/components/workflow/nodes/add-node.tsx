"use client";

import type { NodeProps } from "@xyflow/react";
import { Clock, Play, Plus, Webhook } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AddNodeData = {
  onClick?: (triggerType?: "Manual" | "Webhook" | "Schedule") => void;
};

export function AddNode({ data }: NodeProps & { data?: AddNodeData }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 rounded-lg border border-border border-dashed bg-background/50 p-8 backdrop-blur-sm">
      <div className="text-center">
        <h1 className="mb-2 font-bold text-3xl">
          IdeaI Workflow
        </h1>
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
      <div className="flex flex-col items-center gap-3">
        <Button className="gap-2 shadow-lg" onClick={() => data.onClick?.()} size="default">
          <Plus className="size-4" />
          Add a Step
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              Start with:
              <Plus className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem
              onClick={() => data.onClick?.("Manual")}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Manual
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => data.onClick?.("Webhook")}
              className="gap-2"
            >
              <Webhook className="h-4 w-4" />
              Webhook
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => data.onClick?.("Schedule")}
              className="gap-2"
            >
              <Clock className="h-4 w-4" />
              Schedule
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
