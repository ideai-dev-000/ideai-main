/**
 * @fileoverview Wrapper component for IdeAISiteCard with status fetching
 * 
 * @module SiteCardWrapper
 * @description
 * Fetches status from APIs and passes to IdeAISiteCard component.
 * Handles loading states and errors.
 */

"use client";

import { useEffect, useState, useRef } from "react";
import { IdeAISiteCard, type SiteStatus } from "@repo/ui";
import { defaultRoutingConfig, type AppConfig } from "./config/routing";
import { getAppUrl, getAppIframeUrl } from "./config/routing";

interface StatusData {
  local?: Record<string, "running" | "stopped" | "unknown">;
  vercel?: Record<string, "deployed" | "building" | "failed" | "unknown">;
  github?: Record<string, { branch: string; lastCommit?: string }>;
}

interface SiteCardWrapperProps {
  app: AppConfig;
}

export function SiteCardWrapper({ app }: SiteCardWrapperProps) {
  const [status, setStatus] = useState<SiteStatus>({});
  const [githubBranch, setGithubBranch] = useState<string | undefined>();
  const [lastDeployed, setLastDeployed] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  
  // Use ref to track if component is mounted and prevent state updates after unmount
  const isMountedRef = useRef(true);
  const lastDeployedRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function fetchStatus() {
      // Prevent fetch if component unmounted or cancelled
      if (!isMountedRef.current || isCancelled) {
        return;
      }

      try {
        // Fetch all statuses in parallel - but only once on mount
        // DISABLED AUTO-REFRESH to prevent memory leaks
        const [localRes, vercelRes, githubRes] = await Promise.allSettled([
          fetch("/api/status/local"),
          fetch("/api/status/vercel"),
          fetch("/api/status/github"),
        ]);

        // Check again after async operations
        if (!isMountedRef.current || isCancelled) {
          return;
        }

        const statusData: StatusData = {};

        if (localRes.status === "fulfilled") {
          const data = await localRes.value.json();
          statusData.local = data.statuses;
        }

        if (vercelRes.status === "fulfilled") {
          const data = await vercelRes.value.json();
          statusData.vercel = data.statuses;
          if (data.deployments?.[app.id]?.createdAt) {
            const newDeployed = data.deployments[app.id].createdAt;
            // Only update if different to prevent unnecessary re-renders
            if (newDeployed !== lastDeployedRef.current) {
              lastDeployedRef.current = newDeployed;
              if (isMountedRef.current && !isCancelled) {
                setLastDeployed(newDeployed);
              }
            }
          }
        }

        if (githubRes.status === "fulfilled") {
          const data = await githubRes.value.json();
          statusData.github = data.branches;
          if (data.branches?.[app.id]) {
            const branch = data.branches[app.id].branch;
            if (isMountedRef.current && !isCancelled) {
              setGithubBranch(branch);
            }
            
            if (data.branches[app.id].lastCommit) {
              // Use GitHub commit time if no Vercel deployment time
              const commitTime = data.branches[app.id].lastCommit;
              if (!lastDeployedRef.current && commitTime !== lastDeployedRef.current) {
                lastDeployedRef.current = commitTime;
                if (isMountedRef.current && !isCancelled) {
                  setLastDeployed(commitTime);
                }
              }
            }
          }
        }

        // Update status only if still mounted
        if (isMountedRef.current && !isCancelled) {
          setStatus({
            local: statusData.local?.[app.id],
            vercel: statusData.vercel?.[app.id],
          });
        }
      } catch (error) {
        if (isMountedRef.current && !isCancelled) {
          console.error("Error fetching status:", error);
        }
      } finally {
        if (isMountedRef.current && !isCancelled) {
          setLoading(false);
        }
      }
    }

    // Initial fetch only - NO AUTO-REFRESH to prevent memory leaks
    fetchStatus();

    // Cleanup function
    return () => {
      isCancelled = true;
    };
  }, [app.id]); // CRITICAL: Removed lastDeployed from dependencies to prevent infinite loop

  const vercelUrl = `https://vercel.com/idea-i/${app.id === "web" ? "ideai-main" : app.id}`;
  const githubUrl = githubBranch
    ? `https://github.com/ideai-dev-000/ideai-main/tree/${githubBranch}`
    : `https://github.com/ideai-dev-000/ideai-main`;

  const handleOpenLocal = () => {
    const localUrl = `http://localhost:${app.port}`;
    window.open(localUrl, "_blank");
  };

  const handleOpenVercel = () => {
    window.open(vercelUrl, "_blank");
  };

  const handleOpenGitHub = () => {
    window.open(githubUrl, "_blank");
  };

  const handleCardClick = () => {
    // Dispatch custom event to open modal (popup) - same as old AppCard
    window.dispatchEvent(
      new CustomEvent("openAppModal", { detail: { app } })
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="w-full border rounded-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const localUrl = `http://localhost:${app.port}`;
  // Use local URL for preview if app is running, otherwise show placeholder
  const previewUrl = status.local === "running" ? localUrl : undefined;

  return (
    <div onClick={handleCardClick} className="cursor-pointer">
      <IdeAISiteCard
        app={app}
        status={status}
        vercelUrl={vercelUrl}
        githubBranch={githubBranch}
        lastDeployed={lastDeployed}
        localUrl={localUrl}
        previewUrl={previewUrl}
        onOpenLocal={(e) => {
          e?.stopPropagation();
          handleOpenLocal();
        }}
        onOpenVercel={(e) => {
          e?.stopPropagation();
          handleOpenVercel();
        }}
        onOpenGitHub={(e) => {
          e?.stopPropagation();
          handleOpenGitHub();
        }}
      />
    </div>
  );
}

