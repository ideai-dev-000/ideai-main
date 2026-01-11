/**
 * @fileoverview IdeAI Assets Component
 *
 * @module IdeAIAssets
 * @description
 * Shared component for displaying and managing extracted assets from projects.
 * Used by chat preview panels and workflow builders to show extracted assets
 * (images, fonts, etc.) in a unified assets folder.
 *
 * Features:
 * - Display extracted assets from public/assets folder
 * - File type icons
 * - Download individual assets
 * - Copy asset URLs
 * - Refresh asset list
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  File,
  Image,
  FileText,
  Folder,
  Download,
  Copy,
  RefreshCw,
  Loader2,
  Package,
  X,
  Check,
} from "lucide-react";
import { cn } from "../lib/utils";

export interface AssetItem {
  name: string;
  path: string;
  url: string;
  type: "image" | "document" | "font" | "other";
  size?: number;
}

export interface IdeAIAssetsProps {
  /** Source identifier (chat ID, workflow ID, etc.) */
  sourceId: string;
  /** Source type (chat, workflow, etc.) */
  sourceType: "chat" | "workflow";
  /** Callback when assets are loaded */
  onAssetsLoaded?: (assets: AssetItem[]) => void;
  /** Show close button */
  showClose?: boolean;
  /** Callback when closed */
  onClose?: () => void;
  /** Custom className */
  className?: string;
}

/**
 * IdeAI Assets Component
 *
 * Displays extracted assets in a collapsible panel with file management options.
 */
export function IdeAIAssets({
  sourceId,
  sourceType,
  onAssetsLoaded,
  showClose = false,
  onClose,
  className,
}: IdeAIAssetsProps) {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Load assets from API
  const loadAssets = useCallback(async () => {
    if (!sourceId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/${sourceType}s/${sourceId}/assets`);
      if (response.ok) {
        const data = await response.json();
        const loadedAssets = data.assets || [];
        setAssets(loadedAssets);
        onAssetsLoaded?.(loadedAssets);
      } else {
        setAssets([]);
      }
    } catch (error) {
      console.error("[IdeAIAssets] Error loading assets:", error);
      setAssets([]);
    } finally {
      setIsLoading(false);
    }
  }, [sourceId, sourceType, onAssetsLoaded]);

  // Load assets on mount and when sourceId changes
  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  // Copy asset URL to clipboard
  const copyAssetUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error("[IdeAIAssets] Failed to copy URL:", error);
    }
  };

  // Download asset
  const downloadAsset = (asset: AssetItem) => {
    const a = document.createElement("a");
    a.href = asset.url;
    a.download = asset.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Get file type icon
  const getFileIcon = (type: AssetItem["type"]) => {
    switch (type) {
      case "image":
        return <Image className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      case "font":
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  // Format file size
  const formatSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn("ideai-assets", className)}>
      <div className="ideai-assets-header">
        <div className="ideai-assets-header-left">
          <Package className="h-5 w-5" />
          <h3 className="ideai-assets-title">IdeAI Assets</h3>
          {assets.length > 0 && (
            <span className="ideai-assets-count">{assets.length}</span>
          )}
        </div>
        <div className="ideai-assets-header-actions">
          <button
            type="button"
            onClick={loadAssets}
            disabled={isLoading}
            className="ideai-assets-button"
            title="Refresh assets"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </button>
          {showClose && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="ideai-assets-button"
              title="Close assets panel"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="ideai-assets-content">
        {isLoading && assets.length === 0 ? (
          <div className="ideai-assets-empty">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Loading assets...</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="ideai-assets-empty">
            <Folder className="h-6 w-6" />
            <p>No assets extracted yet</p>
            <p className="ideai-assets-empty-hint">
              Extract assets from your project to see them here
            </p>
          </div>
        ) : (
          <ul className="ideai-assets-list">
            {assets.map((asset) => (
              <li key={asset.path} className="ideai-assets-item">
                <div className="ideai-assets-item-icon">
                  {getFileIcon(asset.type)}
                </div>
                <div className="ideai-assets-item-info">
                  <div className="ideai-assets-item-name">{asset.name}</div>
                  <div className="ideai-assets-item-meta">
                    <span className="ideai-assets-item-path">{asset.path}</span>
                    {asset.size && (
                      <span className="ideai-assets-item-size">
                        {formatSize(asset.size)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ideai-assets-item-actions">
                  <button
                    type="button"
                    onClick={() => copyAssetUrl(asset.url)}
                    className="ideai-assets-item-button"
                    title="Copy URL"
                  >
                    {copiedUrl === asset.url ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadAsset(asset)}
                    className="ideai-assets-item-button"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
