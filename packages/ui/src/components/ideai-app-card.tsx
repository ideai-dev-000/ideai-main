/**
 * @fileoverview IdeaI App Card Component - Shared across landing and cloud manager
 *
 * @module IdeAIAppCard
 * @description
 * Unified app card component showing app metadata, status, and management actions.
 * Includes popover for Vercel/cloud management (dev only).
 * Supports both landing page (read-only) and cloud manager (full control) modes.
 *
 * @example
 * ```tsx
 * <IdeAIAppCard
 *   app={appMetadata}
 *   vercelProject={vercelProject}
 *   vercelDomains={domains}
 *   mode="landing" // or "cloud"
 *   showCloudActions={isDevelopment}
 * />
 * ```
 */

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  ExternalLink,
  Settings,
  Globe,
  Play,
  Square,
  GitBranch,
  Clock,
  Info,
} from "lucide-react";
import { cn } from "../lib/utils";

export interface AppMetadata {
  id: string;
  name: string;
  description: string;
  port: number;
  css: string[];
  capabilities: string[];
  path: string;
  category: string;
  status?: {
    running: boolean;
    port: number;
    url: string | null;
  };
}

export interface VercelProject {
  id: string;
  name: string;
  updatedAt?: number;
}

export interface VercelDomain {
  domain: string;
  verified: boolean;
}

export interface EnhancedAppMetadata extends AppMetadata {
  vercelProject?: VercelProject;
  vercelDomains?: VercelDomain[];
}

export interface IdeAIAppCardProps {
  app: AppMetadata;
  vercelProject?: VercelProject;
  vercelDomains?: VercelDomain[];
  mode?: "landing" | "cloud";
  showCloudActions?: boolean;
  onOpenLocal?: () => void;
  onOpenVercel?: () => void;
  onManageCloud?: () => void;
}

export function IdeAIAppCard({
  app,
  vercelProject,
  vercelDomains = [],
  mode = "landing",
  showCloudActions = false,
  onOpenLocal,
  onOpenVercel,
  onManageCloud,
}: IdeAIAppCardProps) {
  const [cloudPopoverOpen, setCloudPopoverOpen] = useState(false);
  const isDevelopment = process.env.NODE_ENV === "development";
  const showCloudButton = showCloudActions && isDevelopment;

  const statusBadge = app.status?.running ? (
    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
      🟢 Running
    </Badge>
  ) : (
    <Badge variant="destructive">🔴 Stopped</Badge>
  );

  const vercelUrl = vercelProject
    ? `https://vercel.com/idea-i/${vercelProject.name || app.id}`
    : undefined;

  return (
    <Card className="w-full hover:shadow-lg transition-all duration-200 border-2 border-slate-200 hover:border-slate-400 bg-white overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-xl font-bold text-slate-900">
                {app.name}
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-slate-600 line-clamp-2">
              {app.description}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">{statusBadge}</div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* CSS Tags */}
        {app.css.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {app.css.map((css) => (
              <Badge key={css} variant="outline" className="text-xs">
                {css}
              </Badge>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-2 text-xs text-slate-500 bg-slate-50 rounded-md p-3 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Port:</span>
            <span className="font-mono">{app.port || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Category:</span>
            <span>{app.category}</span>
          </div>
          {vercelProject && (
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Vercel:</span>
              <span className="text-green-600">✓ Deployed</span>
            </div>
          )}
          {vercelDomains.length > 0 && (
            <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-700">Domains:</span>
              {vercelDomains.map((domain) => (
                <a
                  key={domain.domain}
                  href={`https://${domain.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <Globe className="h-3 w-3" />
                  <span className="font-mono text-xs">{domain.domain}</span>
                  {domain.verified && (
                    <Badge variant="outline" className="text-xs">
                      ✓ Verified
                    </Badge>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2 pt-4 bg-slate-50/50">
        {/* Local App Actions */}
        {app.status?.url ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenLocal}
            className="flex-1 min-w-[100px]"
          >
            <Play className="h-3 w-3 mr-1" />
            Open Local
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="flex-1 min-w-[100px]"
          >
            <Square className="h-3 w-3 mr-1" />
            Start Server
          </Button>
        )}

        {/* Cloud Management Popover (Dev Only) */}
        {showCloudButton && (vercelProject || mode === "cloud") && (
          <Popover open={cloudPopoverOpen} onOpenChange={setCloudPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 min-w-[100px]"
              >
                <Settings className="h-3 w-3 mr-1" />
                Manage
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">
                    Cloud Management
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">
                    Quick actions for {app.name}
                  </p>
                </div>

                {vercelProject && (
                  <>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => {
                          window.open(vercelUrl, "_blank");
                          setCloudPopoverOpen(false);
                        }}
                      >
                        <ExternalLink className="h-3 w-3 mr-2" />
                        Open Vercel Dashboard
                      </Button>

                      {vercelDomains.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-xs font-semibold mb-2">
                            Live Domains:
                          </p>
                          {vercelDomains.map((domain) => (
                            <a
                              key={domain.domain}
                              href={`https://${domain.domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs text-blue-600 hover:underline mb-1"
                              onClick={() => setCloudPopoverOpen(false)}
                            >
                              <Globe className="h-3 w-3" />
                              {domain.domain}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {mode === "cloud" && onManageCloud && (
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          onManageCloud();
                          setCloudPopoverOpen(false);
                        }}
                      >
                        <Settings className="h-3 w-3 mr-2" />
                        Full Cloud Manager
                      </Button>
                    )}
                  </>
                )}

                {!vercelProject && (
                  <p className="text-xs text-slate-500">
                    Not deployed to Vercel yet. Go to Cloud Manager to set up.
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Vercel Link (always visible if deployed) */}
        {vercelProject && !showCloudButton && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 min-w-[100px]"
          >
            <a href={vercelUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1" />
              Vercel
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
