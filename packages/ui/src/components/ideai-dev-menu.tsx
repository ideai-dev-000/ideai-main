/**
 * @fileoverview IdeaI Dev Menu - Quick actions for managing dev servers
 *
 * @module IdeAIDevMenu
 * @description
 * Menu component for starting/stopping dev servers from the landing page.
 * Shows running apps count and provides quick actions.
 * Dev only - hidden in production.
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

  if (!isDevelopment) return null;

  const runningApps = apps.filter((app) => app.status?.running);
  const stoppedApps = apps.filter((app) => !app.status?.running);

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
        setTimeout(() => onRefresh?.(), 2000);
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
        setTimeout(() => onRefresh?.(), 1000);
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
      const promises = stoppedApps.map((app) =>
        fetch(`/api/apps/${app.id}/start`, { method: "POST" }),
      );
      await Promise.all(promises);
      notify.success(`Starting ${stoppedApps.length} apps...`);
      setTimeout(() => onRefresh?.(), 3000);
    } catch (error) {
      notify.error("Failed to start some apps");
    } finally {
      setLoading(null);
    }
  };

  const handleStopAll = async () => {
    setLoading("all");
    try {
      const promises = runningApps.map((app) =>
        fetch(`/api/apps/${app.id}/stop`, { method: "POST" }),
      );
      await Promise.all(promises);
      notify.success(`Stopped ${runningApps.length} apps`);
      setTimeout(() => onRefresh?.(), 1000);
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
            ({runningApps.length}/{apps.length})
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          Dev Servers
          <div className="text-xs font-normal text-muted-foreground mt-1">
            {runningApps.length} running, {stoppedApps.length} stopped
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleStartAll}
          disabled={loading === "all" || stoppedApps.length === 0}
        >
          <Play className="h-4 w-4 mr-2" />
          Start All ({stoppedApps.length})
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleStopAll}
          disabled={loading === "all" || runningApps.length === 0}
        >
          <Square className="h-4 w-4 mr-2" />
          Stop All ({runningApps.length})
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onRefresh}>
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
          runningApps.map((app) => (
            <DropdownMenuItem
              key={app.id}
              onClick={() => handleStop(app.id)}
              disabled={loading === app.id}
            >
              <Square className="h-3 w-3 mr-2" />
              <span className="flex-1">{app.name}</span>
              <span className="text-xs text-muted-foreground">
                :{app.status?.port}
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
            {stoppedApps.slice(0, 5).map((app) => (
              <DropdownMenuItem
                key={app.id}
                onClick={() => handleStart(app.id)}
                disabled={loading === app.id}
              >
                <Play className="h-3 w-3 mr-2" />
                <span className="flex-1">{app.name}</span>
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
