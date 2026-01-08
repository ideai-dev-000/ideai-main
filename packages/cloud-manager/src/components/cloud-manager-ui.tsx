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
import { DatabaseManager } from "./database/database-manager";

export type CloudProvider = "vercel" | "aws" | "gcp" | "azure" | "hostinger";
export type ManagementSection = "cloud" | "database" | "packages";

interface CloudManagerUIProps {
  defaultSection?: ManagementSection;
  defaultProvider?: CloudProvider;
  className?: string;
}

export function CloudManagerUI({
  defaultSection = "cloud",
  defaultProvider = "vercel",
  className,
}: CloudManagerUIProps) {
  const [activeSection, setActiveSection] =
    useState<ManagementSection>(defaultSection);
  const [activeProvider, setActiveProvider] =
    useState<CloudProvider>(defaultProvider);

  const sections: Array<{
    id: ManagementSection;
    name: string;
    status: "active" | "planned";
  }> = [
    { id: "cloud", name: "Cloud Providers", status: "active" },
    { id: "database", name: "Database", status: "active" },
    { id: "packages", name: "Packages", status: "planned" },
  ];

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
      {/* Main Section Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
        <nav className="flex space-x-4" aria-label="Management Sections">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeSection === section.id
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              } ${
                section.status === "planned"
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              disabled={section.status === "planned"}
            >
              {section.name}
              {section.status === "planned" && (
                <span className="ml-2 text-xs text-slate-400">
                  (Coming Soon)
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Section Content */}
      <div>
        {activeSection === "cloud" && (
          <>
            {/* Cloud Provider Tabs */}
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

            {/* Cloud Provider Content */}
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
          </>
        )}

        {activeSection === "database" && <DatabaseManager />}

        {activeSection === "packages" && (
          <div className="text-center py-12 text-slate-500">
            Package management coming soon
          </div>
        )}
      </div>
    </div>
  );
}
