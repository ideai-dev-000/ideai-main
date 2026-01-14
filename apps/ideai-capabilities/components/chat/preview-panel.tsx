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
  Monitor,
  Maximize,
  Minimize,
  Download,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface Chat {
  id: string;
  demo?: string;
  url?: string;
}

interface PreviewPanelProps {
  currentChat: Chat | null;
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  refreshKey: number;
  setRefreshKey: (key: number | ((prev: number) => number)) => void;
}

export function PreviewPanel({
  currentChat,
  isFullscreen,
  setIsFullscreen,
  refreshKey,
  setRefreshKey,
}: PreviewPanelProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!currentChat?.id) {
      toast.error("No chat selected");
      return;
    }

    setIsDownloading(true);
    toast.info("Preparing project files for download...");

    try {
      // Fetch download data from API
      const response = await fetch(`/api/chats/${currentChat.id}/download`);

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

  return (
    <div
      className={cn(
        "flex flex-col h-full transition-all duration-300",
        isFullscreen ? "fixed inset-0 z-50 bg-white dark:bg-black" : "flex-1",
      )}
    >
      <WebPreview
        defaultUrl={currentChat?.demo || ""}
        onUrlChange={(url) => {
          // Optional: Handle URL changes if needed
          console.log("Preview URL changed:", url);
        }}
      >
        <WebPreviewNavigation>
          <WebPreviewNavigationButton
            onClick={() => {
              // Force refresh the iframe by updating the refresh key
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
          <WebPreviewUrl
            readOnly
            placeholder="Your app will appear here..."
            value={currentChat?.demo || ""}
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
        {/* Always show iframe - load demo URL if available, otherwise show empty/placeholder */}
        <WebPreviewBody
          key={refreshKey}
          src={currentChat?.demo || "about:blank"}
        />
      </WebPreview>
    </div>
  );
}
