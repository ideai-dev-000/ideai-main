/**
 * @fileoverview Vibe Preview Panel Component
 *
 * @module VibePreviewPanel
 * @description
 * Composable preview panel for vibe chats.
 * Uses vibe-specific API routes for download and assets.
 * Full custom implementation to ensure correct API routes.
 */

"use client";

import {
  WebPreview,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
  WebPreviewBody,
} from "@/components/ai-elements/web-preview";
import {
  RefreshCw,
  Maximize,
  Minimize,
  Download,
  Loader2,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IdeAIAssets } from "@repo/ui";
import type { VibeChat } from "@/lib/vibe/types/vibe-types";

interface VibePreviewPanelProps {
  currentChat: VibeChat | null;
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  refreshKey: number;
  setRefreshKey: (key: number | ((prev: number) => number)) => void;
}

/**
 * Vibe-specific preview panel component
 * Uses /api/vibe/* routes for all operations
 */
export function VibePreviewPanel({
  currentChat,
  isFullscreen,
  setIsFullscreen,
  refreshKey,
  setRefreshKey,
}: VibePreviewPanelProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAssets, setShowAssets] = useState(false);

  // Handle download using vibe API route
  const handleDownload = async () => {
    if (!currentChat?.id) {
      toast.error("No chat selected");
      return;
    }

    setIsDownloading(true);
    toast.info("Preparing project files for download...");

    try {
      // Use vibe API route
      const response = await fetch(
        `/api/vibe/chats/${currentChat.id}/download`,
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to download: ${response.statusText}`,
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to prepare download");
      }

      if (!result.files) {
        throw new Error("No files to download");
      }

      // Import JSZip dynamically
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Add all files to the zip
      for (const [path, content] of Object.entries(result.files)) {
        zip.file(path, content as string);
      }

      // Generate the zip file
      const blob = await zip.generateAsync({ type: "blob" });

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.projectName || "v0-project"}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Project downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to download project",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle asset extraction using vibe API routes
  const handleExtractAssets = async () => {
    if (!currentChat?.id) return;

    try {
      // First, download the chat files
      const downloadResponse = await fetch(
        `/api/vibe/chats/${currentChat.id}/download`,
      );
      if (!downloadResponse.ok) {
        throw new Error("Failed to download chat files");
      }

      const { files, projectName } = await downloadResponse.json();

      // Then, extract assets using vibe API
      const extractResponse = await fetch(
        `/api/vibe/chats/${currentChat.id}/assets/extract`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            files,
            projectName,
          }),
        },
      );

      if (!extractResponse.ok) {
        throw new Error("Failed to extract assets");
      }

      setShowAssets(true);
      toast.success("Assets extracted successfully!");
    } catch (error) {
      console.error("Failed to extract assets:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to extract assets",
      );
    }
  };

  // Show assets viewer if assets are extracted
  if (showAssets && currentChat?.id) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Extracted Assets</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAssets(false)}
          >
            Back to Preview
          </Button>
        </div>
        <IdeAIAssets
          sourceId={currentChat.id}
          sourceType="chat"
          showClose={false}
          onClose={() => setShowAssets(false)}
          className="flex-1"
        />
      </div>
    );
  }

  // Main preview panel
  return (
    <div
      className={cn(
        "flex flex-col h-full transition-all duration-300",
        isFullscreen ? "fixed inset-0 z-50 bg-white dark:bg-black" : "flex-1",
      )}
    >
      <WebPreview
        defaultUrl={currentChat?.demo || currentChat?.url || ""}
        onUrlChange={(url) => {
          console.log("Preview URL changed:", url);
        }}
      >
        <WebPreviewNavigation>
          <WebPreviewNavigationButton
            onClick={() => {
              setRefreshKey((prev) => prev + 1);
            }}
            tooltip="Refresh preview"
            disabled={!currentChat?.demo}
          >
            <RefreshCw className="h-4 w-4" />
          </WebPreviewNavigationButton>

          <WebPreviewNavigationButton
            onClick={handleDownload}
            tooltip={
              isDownloading
                ? "Preparing download..."
                : "Download project as ZIP"
            }
            disabled={!currentChat?.id || isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </WebPreviewNavigationButton>

          <WebPreviewNavigationButton
            onClick={handleExtractAssets}
            tooltip="Extract assets from project"
            disabled={!currentChat?.id}
          >
            <Package className="h-4 w-4" />
          </WebPreviewNavigationButton>

          <WebPreviewUrl
            readOnly
            placeholder="Your app will appear here..."
            value={currentChat?.demo || currentChat?.url || ""}
          />

          <WebPreviewNavigationButton
            onClick={() => setIsFullscreen(!isFullscreen)}
            tooltip={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            disabled={!currentChat?.demo}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </WebPreviewNavigationButton>
        </WebPreviewNavigation>

        {currentChat?.demo || currentChat?.url ? (
          <WebPreviewBody
            key={refreshKey}
            src={currentChat.demo || currentChat.url}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-black">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                No preview available
              </p>
              <p className="text-xs text-gray-700/50 dark:text-gray-200/50">
                Start a conversation to see your app here
              </p>
            </div>
          </div>
        )}
      </WebPreview>
    </div>
  );
}
