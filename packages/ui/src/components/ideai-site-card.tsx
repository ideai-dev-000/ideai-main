/**
 * @fileoverview IdeaI Site Card Component
 * 
 * @module IdeAISiteCard
 * @description
 * Displays a card for each IdeaI app/site showing:
 * - Local dev server status (running/stopped)
 * - Vercel deployment status (deployed/building/failed)
 * - Quick links to Vercel dashboard, GitHub branch, local URL
 * - Uses shadcn/ui components with Radix UI primitives
 * - Component-agnostic design for future library swaps
 * 
 * Architecture:
 * - Uses Radix UI primitives (@radix-ui/react-separator, @radix-ui/react-slot)
 * - shadcn/ui components (Card, Badge, Button, Separator, Tooltip)
 * - Agnostic interfaces allow swapping UI libraries in future
 * - 2026-facing: Modern React patterns, TypeScript strict, composable
 * 
 * @example
 * ```tsx
 * <IdeAISiteCard
 *   app={appConfig}
 *   status={{ local: "running", vercel: "deployed" }}
 *   vercelUrl="https://vercel.com/idea-i/web"
 *   githubBranch="main"
 *   lastDeployed="2025-12-31T10:00:00Z"
 * />
 * ```
 */

"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { ExternalLink, Play, Square, Clock, GitBranch, Info } from "lucide-react";
import { cn } from "../lib/utils";

export interface SiteStatus {
  local?: "running" | "stopped" | "unknown";
  vercel?: "deployed" | "building" | "failed" | "unknown";
}

export interface IdeAISiteCardProps {
  app: {
    id: string;
    name: string;
    path: string;
    description: string;
    port: number;
    subdomain?: string;
  };
  status?: SiteStatus;
  vercelUrl?: string;
  githubBranch?: string;
  lastDeployed?: string;
  localUrl?: string;
  previewUrl?: string; // URL for iframe preview (defaults to localUrl)
  onOpenLocal?: (e?: React.MouseEvent) => void;
  onOpenVercel?: (e?: React.MouseEvent) => void;
  onOpenGitHub?: (e?: React.MouseEvent) => void;
}

/**
 * Get status badge variant and icon
 */
function getStatusBadge(status: "running" | "stopped" | "deployed" | "building" | "failed" | "unknown") {
  switch (status) {
    case "running":
    case "deployed":
      return { variant: "default" as const, className: "bg-green-500 hover:bg-green-600", label: status === "running" ? "Running" : "Deployed" };
    case "building":
      return { variant: "secondary" as const, className: "bg-yellow-500 hover:bg-yellow-600", label: "Building" };
    case "failed":
      return { variant: "destructive" as const, className: "bg-red-500 hover:bg-red-600", label: "Failed" };
    case "stopped":
      return { variant: "outline" as const, className: "bg-gray-200 hover:bg-gray-300", label: "Stopped" };
    default:
      return { variant: "outline" as const, className: "bg-gray-100 hover:bg-gray-200", label: "Unknown" };
  }
}

/**
 * Format relative time
 */
function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "Never";
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  } catch {
    return "Unknown";
  }
}

export function IdeAISiteCard({
  app,
  status = {},
  vercelUrl,
  githubBranch,
  lastDeployed,
  localUrl,
  previewUrl,
  onOpenLocal,
  onOpenVercel,
  onOpenGitHub,
}: IdeAISiteCardProps) {
  const localStatus = status.local || "unknown";
  const vercelStatus = status.vercel || "unknown";
  
  const localBadge = getStatusBadge(localStatus);
  const vercelBadge = getStatusBadge(vercelStatus);
  
  const defaultLocalUrl = `http://localhost:${app.port}`;
  const defaultVercelUrl = vercelUrl || `https://vercel.com/idea-i/${app.id}`;
  const defaultGitHubUrl = githubBranch 
    ? `https://github.com/ideai-dev-000/ideai-main/tree/${githubBranch}`
    : `https://github.com/ideai-dev-000/ideai-main`;

  return (
    <TooltipProvider delayDuration={200}>
      <Card className="w-full hover:shadow-xl transition-all duration-200 border-2 border-slate-200 hover:border-slate-400 bg-white overflow-hidden group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-xl font-bold text-slate-900">{app.name}</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{app.description}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <CardDescription className="text-xs text-slate-500 font-mono">
                {app.path}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Badge 
                      variant={localBadge.variant}
                      className={cn("text-white text-xs px-2 py-0.5 cursor-help", localBadge.className)}
                    >
                      {localStatus === "running" ? "🟢" : "🔴"} {localBadge.label}
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Local dev server status: {localStatus}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Badge 
                      variant={vercelBadge.variant}
                      className={cn("text-white text-xs px-2 py-0.5 cursor-help", vercelBadge.className)}
                    >
                      {vercelStatus === "deployed" ? "🟢" : vercelStatus === "building" ? "🟡" : "🔴"} {vercelBadge.label}
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Vercel deployment status: {vercelStatus}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          {app.description}
        </p>
        
        {/* Site Preview Iframe */}
        {(previewUrl || localUrl) && (
          <div 
            className="mb-4 rounded-md overflow-hidden border-2 border-slate-200 bg-slate-50 shadow-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={previewUrl || localUrl}
              className="w-full h-48 border-0 pointer-events-none bg-white"
              title={`${app.name} preview`}
              loading="lazy"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </div>
        )}
        
        <div className="space-y-2 text-xs text-slate-500 bg-slate-50 rounded-md p-3 border border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Port:</span>
            <span className="font-mono">{app.port}</span>
          </div>
          {lastDeployed && (
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-slate-400" />
              <span>Deployed {formatRelativeTime(lastDeployed)}</span>
            </div>
          )}
          {githubBranch && (
            <div className="flex items-center gap-2">
              <GitBranch className="h-3 w-3 text-slate-400" />
              <span>Branch: <span className="font-mono">{githubBranch}</span></span>
            </div>
          )}
        </div>
      </CardContent>
      
      <Separator className="my-0" />
      
      <CardFooter className="flex flex-wrap gap-2 pt-4 pb-4 bg-slate-50/50">
        {onOpenLocal && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenLocal(e);
                }}
                className="flex-1 min-w-[100px] border-slate-300 hover:bg-slate-100"
              >
                {localStatus === "running" ? (
                  <>
                    <Play className="h-3 w-3" />
                    Open Local
                  </>
                ) : (
                  <>
                    <Square className="h-3 w-3" />
                    Start Local
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open {app.name} in new tab</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {onOpenVercel && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenVercel(e);
                }}
                className="flex-1 min-w-[100px] border-slate-300 hover:bg-slate-100"
              >
                <ExternalLink className="h-3 w-3" />
                Vercel
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Vercel dashboard</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {onOpenGitHub && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenGitHub(e);
                }}
                className="flex-1 min-w-[100px] border-slate-300 hover:bg-slate-100"
              >
                <GitBranch className="h-3 w-3" />
                GitHub
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View GitHub branch: {githubBranch || "main"}</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {!onOpenLocal && !onOpenVercel && !onOpenGitHub && (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1"
            >
              <a href={defaultLocalUrl} target="_blank" rel="noopener noreferrer">
                <Play className="h-3 w-3 mr-1" />
                Local
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1"
            >
              <a href={defaultVercelUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Vercel
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1"
            >
              <a href={defaultGitHubUrl} target="_blank" rel="noopener noreferrer">
                <GitBranch className="h-3 w-3 mr-1" />
                GitHub
              </a>
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
    </TooltipProvider>
  );
}

