/**
 * @fileoverview IdeaI Dev Menu - Quick actions for managing dev servers
 *
 * @module IdeAIDevMenu
 * @description
 * Menu component for starting/stopping dev servers from the landing page.
 * Shows running apps count and provides quick actions.
 * Dev only - hidden in production.
 *
 * Safety Features:
 * - Only renders in development mode (NODE_ENV === "development")
 * - Validates apps array (always ensures array, never null/undefined)
 * - Validates onRefresh callback (safe null checks)
 * - Filters out invalid apps (missing IDs, null/undefined)
 * - Try-catch around all refresh callbacks
 * - Safe property access with optional chaining
 * - Prevents decoupling/breaking with multiple safety layers
 *
 * Usage:
 * - Should only be shown in header on home page (/) in development
 * - Pass via headerActions prop to IdeAIPageTemplate
 * - Never show on left side - only in header right side
 */

"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Play, Square, RefreshCw, Server } from "lucide-react";

// Simple notifications (console-based for now)
const notify = {
  success: (message: string) => {
    console.log(`✅ ${message}`);
  },
  error: (message: string) => {
    console.error(`❌ ${message}`);
  },
};

export interface IdeAIDevMenuProps {
  apps: Array<{
    id: string;
    name: string;
    status?: { running: boolean; port: number };
  }>;
  onRefresh?: () => void;
}

export function IdeAIDevMenu({ apps, onRefresh }: IdeAIDevMenuProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const isDevelopment = process.env.NODE_ENV === "development";

  // CRITICAL: Multiple safety checks to prevent decoupling
  // 1. Only show in development mode
  if (!isDevelopment) return null;

  // 2. Ensure apps is always an array (prevent runtime errors)
  const safeApps = Array.isArray(apps) ? apps : [];

  // 3. Ensure onRefresh is a function or null (prevent runtime errors)
  const safeOnRefresh = typeof onRefresh === "function" ? onRefresh : null;

  // 4. Filter apps safely with null checks
  const runningApps = safeApps.filter((app) => app?.status?.running === true);
  const stoppedApps = safeApps.filter((app) => !app?.status?.running);

  const handleStart = async (appId: string) => {
    setLoading(appId);
    try {
      const response = await fetch(`/api/apps/${appId}/start`, {
        method: "POST",
      });
      const data = await response.json();

      if (data.error) {
        notify.error(`Failed to start ${appId}: ${data.error}`);
      } else {
        notify.success(`Starting ${appId}...`);
        // Safe refresh with null check
        if (safeOnRefresh) {
          setTimeout(() => {
            try {
              safeOnRefresh();
            } catch (err) {
              console.error("Error refreshing apps:", err);
            }
          }, 2000);
        }
      }
    } catch (error) {
      notify.error(`Failed to start ${appId}`);
    } finally {
      setLoading(null);
    }
  };

  const handleStop = async (appId: string) => {
    setLoading(appId);
    try {
      const response = await fetch(`/api/apps/${appId}/stop`, {
        method: "POST",
      });
      const data = await response.json();

      if (data.error) {
        notify.error(`Failed to stop ${appId}: ${data.error}`);
      } else {
        notify.success(`Stopped ${appId}`);
        // Safe refresh with null check
        if (safeOnRefresh) {
          setTimeout(() => {
            try {
              safeOnRefresh();
            } catch (err) {
              console.error("Error refreshing apps:", err);
            }
          }, 1000);
        }
      }
    } catch (error) {
      notify.error(`Failed to stop ${appId}`);
    } finally {
      setLoading(null);
    }
  };

  const handleStartAll = async () => {
    setLoading("all");
    try {
      // Safety check: filter out apps without valid IDs
      const validStoppedApps = stoppedApps.filter((app) => app?.id);
      const promises = validStoppedApps.map((app) =>
        fetch(`/api/apps/${app.id}/start`, { method: "POST" }),
      );
      await Promise.all(promises);
      notify.success(`Starting ${validStoppedApps.length} apps...`);
      // Safe refresh with null check
      if (safeOnRefresh) {
        setTimeout(() => {
          try {
            safeOnRefresh();
          } catch (err) {
            console.error("Error refreshing apps:", err);
          }
        }, 3000);
      }
    } catch (error) {
      notify.error("Failed to start some apps");
    } finally {
      setLoading(null);
    }
  };

  const handleStopAll = async () => {
    setLoading("all");
    try {
      // Safety check: filter out apps without valid IDs
      const validRunningApps = runningApps.filter((app) => app?.id);
      const promises = validRunningApps.map((app) =>
        fetch(`/api/apps/${app.id}/stop`, { method: "POST" }),
      );
      await Promise.all(promises);
      notify.success(`Stopped ${validRunningApps.length} apps`);
      // Safe refresh with null check
      if (safeOnRefresh) {
        setTimeout(() => {
          try {
            safeOnRefresh();
          } catch (err) {
            console.error("Error refreshing apps:", err);
          }
        }, 1000);
      }
    } catch (error) {
      notify.error("Failed to stop some apps");
    } finally {
      setLoading(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Server className="h-4 w-4" />
          <span className="hidden sm:inline">Dev Server</span>
          <span className="text-xs text-muted-foreground">
            ({runningApps.length}/{safeApps.length})
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          Dev Servers
          <div className="text-xs font-normal text-muted-foreground mt-1">
            {runningApps.length} running, {stoppedApps.length} stopped
            {safeApps.length === 0 && " (no apps loaded)"}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleStartAll}
          disabled={
            loading === "all" ||
            stoppedApps.length === 0 ||
            safeApps.length === 0
          }
        >
          <Play className="h-4 w-4 mr-2" />
          Start All ({stoppedApps.length})
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleStopAll}
          disabled={
            loading === "all" ||
            runningApps.length === 0 ||
            safeApps.length === 0
          }
        >
          <Square className="h-4 w-4 mr-2" />
          Stop All ({runningApps.length})
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            if (safeOnRefresh) {
              try {
                safeOnRefresh();
              } catch (err) {
                console.error("Error refreshing apps:", err);
              }
            }
          }}
          disabled={!safeOnRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Status
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs">Running Apps</DropdownMenuLabel>
        {runningApps.length === 0 ? (
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            No apps running
          </div>
        ) : (
          runningApps
            .filter((app) => app?.id) // Safety: filter out apps without IDs
            .map((app) => (
              <DropdownMenuItem
                key={app.id}
                onClick={() => handleStop(app.id)}
                disabled={loading === app.id || !app.id}
              >
                <Square className="h-3 w-3 mr-2" />
                <span className="flex-1">{app?.name || "Unknown App"}</span>
                <span className="text-xs text-muted-foreground">
                  :{app?.status?.port || "?"}
                </span>
              </DropdownMenuItem>
            ))
        )}

        {stoppedApps.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs">
              Stopped Apps
            </DropdownMenuLabel>
            {stoppedApps
              .filter((app) => app?.id) // Safety: filter out apps without IDs
              .slice(0, 5)
              .map((app) => (
                <DropdownMenuItem
                  key={app.id}
                  onClick={() => handleStart(app.id)}
                  disabled={loading === app.id || !app.id}
                >
                  <Play className="h-3 w-3 mr-2" />
                  <span className="flex-1">{app?.name || "Unknown App"}</span>
                </DropdownMenuItem>
              ))}
            {stoppedApps.length > 5 && (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                +{stoppedApps.length - 5} more...
              </div>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
