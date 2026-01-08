/**
 * @fileoverview Vercel Manager Component
 *
 * @module VercelManager
 * @description
 * UI component for managing Vercel projects, configurations,
 * and deployments.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { VercelClient } from "../../providers/vercel/vercel-client";
import { autoConfigureVercelProject } from "../../providers/vercel/vercel-config";
import type { VercelProjectSettings } from "../../providers/vercel/vercel-types";

interface VercelDomain {
  domain: string;
  verified: boolean;
}

export function VercelManager() {
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>(
    [],
  );
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [settings, setSettings] = useState<VercelProjectSettings | null>(null);
  const [localSettings, setLocalSettings] =
    useState<VercelProjectSettings | null>(null);
  const [domains, setDomains] = useState<VercelDomain[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [teamId] = useState("team_vhjzlMi6CfNow0IfBXnv2Yn2"); // Default org ID

  const client = new VercelClient();

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Use API route instead of direct client call
      const response = await fetch(`/api/vercel/projects?teamId=${teamId}`);
      const result = await response.json();

      if (result.error) {
        setError(`Failed to load projects: ${result.error.message}`);
      } else if (result.data) {
        setProjects(result.data);
        // Auto-select pico if it exists
        const picoProject = result.data.find(
          (p: { name: string; id: string }) => p.name === "pico",
        );
        if (picoProject) {
          setSelectedProject(picoProject.id);
        }
      } else {
        setError("No projects found or unable to fetch projects.");
      }
    } catch (err) {
      setError(
        `Network error: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  const loadProjectSettings = useCallback(
    async (projectId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/vercel/projects/${projectId}/settings?teamId=${teamId}`,
        );
        const result = await response.json();
        if (result.error) {
          setError(`Failed to load settings: ${result.error.message}`);
        } else if (result.data) {
          setSettings(result.data);
        }
      } catch (err) {
        setError(
          `Network error: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      } finally {
        setLoading(false);
      }
    },
    [teamId],
  );

  const loadProjectDomains = useCallback(
    async (projectId: string) => {
      try {
        const response = await fetch(
          `/api/vercel/projects/${projectId}/domains?teamId=${teamId}`,
        );
        const result = await response.json();
        if (result.error) {
          console.warn(`Failed to load domains: ${result.error.message}`);
          setDomains([]);
        } else if (result.data) {
          setDomains(result.data);
        } else {
          setDomains([]);
        }
      } catch (err) {
        console.warn(
          `Network error loading domains: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
        setDomains([]);
      }
    },
    [teamId],
  );

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (selectedProject) {
      loadProjectSettings(selectedProject);
      loadProjectDomains(selectedProject);
      setHasUnsavedChanges(false);
    } else {
      setDomains([]);
    }
  }, [selectedProject, loadProjectSettings, loadProjectDomains]);

  // Update local settings when server settings change
  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
      setHasUnsavedChanges(false);
    }
  }, [settings]);

  const handleAutoConfigure = async () => {
    if (!selectedProject) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    // Extract app name from project name (assuming project name matches app name)
    const project = projects.find((p) => p.id === selectedProject);
    if (!project) {
      setError("Project not found");
      setLoading(false);
      return;
    }

    const result = await autoConfigureVercelProject(
      client,
      selectedProject,
      teamId,
      project.name,
    );
    if (result.success) {
      setSuccess(result.message);
      await loadProjectSettings(selectedProject);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleLocalChange = (updates: Partial<VercelProjectSettings>) => {
    if (!localSettings) return;
    setLocalSettings({ ...localSettings, ...updates });
    setHasUnsavedChanges(true);
    setSuccess(null); // Clear success message when user makes changes
  };

  const handleSaveSettings = async () => {
    if (!selectedProject || !localSettings) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare the payload - Vercel API expects specific field names
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: Record<string, any> = {};
      if (
        localSettings.rootDirectory !== null &&
        localSettings.rootDirectory !== undefined
      ) {
        payload.rootDirectory = localSettings.rootDirectory;
      }
      if (
        localSettings.buildCommand !== null &&
        localSettings.buildCommand !== undefined
      ) {
        payload.buildCommand = localSettings.buildCommand;
      }
      if (
        localSettings.installCommand !== null &&
        localSettings.installCommand !== undefined
      ) {
        payload.installCommand = localSettings.installCommand;
      }
      if (
        localSettings.outputDirectory !== null &&
        localSettings.outputDirectory !== undefined
      ) {
        payload.outputDirectory = localSettings.outputDirectory;
      }
      if (
        localSettings.framework !== null &&
        localSettings.framework !== undefined
      ) {
        payload.framework = localSettings.framework;
      }
      // Vercel uses sourceFilesOutsideRootDirectory, not includeFilesOutsideRoot
      payload.sourceFilesOutsideRootDirectory =
        localSettings.includeFilesOutsideRoot;

      console.log("[Cloud Manager] Saving settings:", payload);

      const response = await fetch(
        `/api/vercel/projects/${selectedProject}/settings?teamId=${teamId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (result.error) {
        const errorMsg = result.error.details
          ? `${result.error.message} (Details: ${JSON.stringify(result.error.details)})`
          : result.error.message;
        setError(`Failed to update settings: ${errorMsg}`);
        console.error("[Cloud Manager] Save error:", result.error);
      } else if (result.data) {
        setSettings(result.data);
        setHasUnsavedChanges(false);
        setSuccess("Settings updated successfully on Vercel");
        // Reload settings to confirm
        setTimeout(() => loadProjectSettings(selectedProject), 500);
      } else {
        setError("Unexpected response from server");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setError(`Network error: ${errorMsg}`);
      console.error("[Cloud Manager] Save exception:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Vercel Project Manager
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Manage Vercel project configurations, verify settings, and
          auto-configure new projects.
        </p>
      </div>

      {/* Project Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Select Project
          </label>
          <button
            onClick={loadProjects}
            disabled={loading}
            className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          disabled={loading}
        >
          <option value="">
            {loading
              ? "Loading projects..."
              : projects.length === 0
                ? "-- No projects available --"
                : "-- Select a project --"}
          </option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        {projects.length > 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            ✓ Found {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        )}
        {!loading && projects.length === 0 && error && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">
            ⚠ {error}
          </p>
        )}
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-1">
            ⚠️ Error Loading Projects
          </p>
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-800 dark:text-green-200">
            {success}
          </p>
        </div>
      )}

      {/* Project Domains */}
      {selectedProject && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Live Domains
          </h3>
          {domains.length > 0 ? (
            <>
              <div className="space-y-2">
                {domains.map((domain) => (
                  <div
                    key={domain.domain}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          domain.verified ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      />
                      <a
                        href={`https://${domain.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {domain.domain}
                      </a>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {domain.verified ? "✓ Verified" : "⏳ Pending"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                💡 Click a domain to open it in a new tab
              </p>
            </>
          ) : (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {loading ? (
                <span>Loading domains...</span>
              ) : (
                <span>
                  No custom domains configured. This project uses Vercel's
                  default domain.
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Project Settings */}
      {selectedProject && localSettings && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Project Settings
              </h3>
              {hasUnsavedChanges && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  ⚠️ You have unsaved changes
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAutoConfigure}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Configuring..." : "Auto-Configure"}
              </button>
              {hasUnsavedChanges && (
                <button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Root Directory
              </label>
              <input
                type="text"
                value={localSettings.rootDirectory || ""}
                onChange={(e) =>
                  handleLocalChange({ rootDirectory: e.target.value || null })
                }
                onBlur={handleSaveSettings}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                placeholder="apps/pico"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Build Command
              </label>
              <input
                type="text"
                value={localSettings.buildCommand || ""}
                onChange={(e) =>
                  handleLocalChange({ buildCommand: e.target.value || null })
                }
                onBlur={handleSaveSettings}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                placeholder="next build"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Install Command
              </label>
              <input
                type="text"
                value={localSettings.installCommand || ""}
                onChange={(e) =>
                  handleLocalChange({ installCommand: e.target.value || null })
                }
                onBlur={handleSaveSettings}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                placeholder="pnpm install"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Output Directory
              </label>
              <input
                type="text"
                value={localSettings.outputDirectory || ""}
                onChange={(e) =>
                  handleLocalChange({ outputDirectory: e.target.value || null })
                }
                onBlur={handleSaveSettings}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                placeholder=".next"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeFiles"
              checked={localSettings.includeFilesOutsideRoot}
              onChange={(e) => {
                handleLocalChange({
                  includeFilesOutsideRoot: e.target.checked,
                });
                // Auto-save checkbox changes immediately
                setTimeout(() => handleSaveSettings(), 100);
              }}
              disabled={loading}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="includeFiles"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Include files outside root directory (Required for monorepo)
            </label>
          </div>

          {/* Configuration Status */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Configuration Status
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                {localSettings.rootDirectory?.startsWith("apps/") ? (
                  <span className="text-green-600 dark:text-green-400">✓</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">✗</span>
                )}
                <span className="text-slate-600 dark:text-slate-400">
                  Root Directory: {localSettings.rootDirectory || "Not set"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {localSettings.includeFilesOutsideRoot ? (
                  <span className="text-green-600 dark:text-green-400">✓</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">✗</span>
                )}
                <span className="text-slate-600 dark:text-slate-400">
                  Include files outside root:{" "}
                  {localSettings.includeFilesOutsideRoot
                    ? "Enabled"
                    : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && !selectedProject && (
        <div className="text-center py-8 text-slate-500">
          Loading projects...
        </div>
      )}

      {!loading && projects.length === 0 && !error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            No projects loaded. Click the refresh button or check your Vercel
            token configuration.
          </p>
        </div>
      )}

      {/* Show when dropdown is empty due to error */}
      {!loading && projects.length === 0 && error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-2">
            Unable to load projects
          </p>
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Token Configuration Help */}
      {error &&
        (error.includes("token") || error.includes("not configured")) && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              How to configure Vercel token:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>
                Get your token from:{" "}
                <a
                  href="https://vercel.com/account/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  vercel.com/account/tokens
                </a>
              </li>
              <li>
                Create a{" "}
                <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">
                  .env.local
                </code>{" "}
                file in{" "}
                <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">
                  apps/web/
                </code>
              </li>
              <li>
                Add:{" "}
                <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">
                  VERCEL_TOKEN=your_token_here
                </code>
              </li>
              <li>
                Restart the dev server:{" "}
                <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">
                  pnpm --filter web dev
                </code>
              </li>
            </ol>
          </div>
        )}
    </div>
  );
}
