/**
 * @fileoverview Cloud Manager UI Component
 *
 * @module CloudManagerUI
 * @description
 * Main UI component for managing cloud provider configurations.
 * Supports multiple providers with tabbed interface.
 */

"use client";

import { useState } from "react";
import { VercelManager } from "./vercel/vercel-manager";

export type CloudProvider = "vercel" | "aws" | "gcp" | "azure" | "hostinger";

interface CloudManagerUIProps {
  defaultProvider?: CloudProvider;
  className?: string;
}

export function CloudManagerUI({
  defaultProvider = "vercel",
  className,
}: CloudManagerUIProps) {
  const [activeProvider, setActiveProvider] =
    useState<CloudProvider>(defaultProvider);

  const providers: Array<{
    id: CloudProvider;
    name: string;
    status: "active" | "planned";
  }> = [
    { id: "vercel", name: "Vercel", status: "active" },
    { id: "aws", name: "AWS", status: "planned" },
    { id: "gcp", name: "GCP", status: "planned" },
    { id: "azure", name: "Azure", status: "planned" },
    { id: "hostinger", name: "Hostinger", status: "planned" },
  ];

  return (
    <div className={className}>
      {/* Provider Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
        <nav className="flex space-x-4" aria-label="Cloud Providers">
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setActiveProvider(provider.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeProvider === provider.id
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              } ${
                provider.status === "planned"
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              disabled={provider.status === "planned"}
            >
              {provider.name}
              {provider.status === "planned" && (
                <span className="ml-2 text-xs text-slate-400">
                  (Coming Soon)
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Provider Content */}
      <div>
        {activeProvider === "vercel" && <VercelManager />}
        {activeProvider === "aws" && (
          <div className="text-center py-12 text-slate-500">
            AWS provider coming soon
          </div>
        )}
        {activeProvider === "gcp" && (
          <div className="text-center py-12 text-slate-500">
            GCP provider coming soon
          </div>
        )}
        {activeProvider === "azure" && (
          <div className="text-center py-12 text-slate-500">
            Azure provider coming soon
          </div>
        )}
        {activeProvider === "hostinger" && (
          <div className="text-center py-12 text-slate-500">
            Hostinger provider coming soon
          </div>
        )}
      </div>
    </div>
  );
}
