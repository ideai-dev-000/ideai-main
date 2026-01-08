/**
 * @fileoverview Database Manager Component
 *
 * @module DatabaseManager
 * @description
 * UI component for managing IdeaI databases (local and production).
 * Supports migrations, status checks, and connection management.
 */

"use client";

import { useState, useCallback } from "react";

interface DatabaseStatus {
  connected: boolean;
  version?: string;
  database?: string;
  tableCount?: number;
  displayUrl?: string;
}

export function DatabaseManager() {
  const [selectedApp, setSelectedApp] = useState("ideai-capabilities");
  const [selectedEnv, setSelectedEnv] = useState<
    "local" | "production" | "preview"
  >("local");
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [databaseUrl, setDatabaseUrl] = useState<string | null>(null);
  const [migrationOutput, setMigrationOutput] = useState<string | null>(null);

  const apps = [
    { id: "ideai-capabilities", name: "IdeaI Capabilities" },
    { id: "ideai-workflow", name: "IdeaI Workflow" },
  ];

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const params = new URLSearchParams({
        env: selectedEnv,
        app: selectedApp,
      });

      if (selectedEnv !== "local" && databaseUrl) {
        params.append("url", databaseUrl);
      }

      const response = await fetch(`/api/database/status?${params}`);
      const result = await response.json();

      if (result.error) {
        setError(result.error.message);
        setStatus(null);
      } else {
        setStatus(result.data);
        setSuccess("Database connection successful");
      }
    } catch (err) {
      setError(
        `Network error: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, [selectedEnv, selectedApp, databaseUrl]);

  const connectToVercel = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const params = new URLSearchParams({
        env: selectedEnv,
        app: selectedApp,
      });

      const response = await fetch(`/api/database/connect?${params}`);
      const result = await response.json();

      if (result.error) {
        setError(result.error.message);
      } else {
        setDatabaseUrl(result.data.url);
        setSuccess(`Connected to ${selectedEnv} database`);
        // Auto-load status after connecting
        setTimeout(() => loadStatus(), 500);
      }
    } catch (err) {
      setError(
        `Network error: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  }, [selectedEnv, selectedApp, loadStatus]);

  const runMigration = useCallback(async () => {
    if (selectedEnv === "production") {
      if (
        !confirm(
          "⚠️ Are you sure you want to run migrations on PRODUCTION database?",
        )
      ) {
        return;
      }
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setMigrationOutput(null);

    try {
      const response = await fetch("/api/database/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          env: selectedEnv,
          app: selectedApp,
          url: databaseUrl || undefined,
        }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error.message);
        if (result.error.output) {
          setMigrationOutput(result.error.output);
        }
      } else {
        setSuccess("Migrations completed successfully");
        setMigrationOutput(result.data.output);
        // Refresh status after migration
        setTimeout(() => loadStatus(), 1000);
      }
    } catch (err) {
      setError(
        `Network error: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  }, [selectedEnv, selectedApp, databaseUrl, loadStatus]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Database Manager
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Manage IdeaI databases, run migrations, and check connection status.
        </p>
      </div>

      {/* Configuration */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              App
            </label>
            <select
              value={selectedApp}
              onChange={(e) => {
                setSelectedApp(e.target.value);
                setStatus(null);
                setDatabaseUrl(null);
              }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {apps.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Environment
            </label>
            <select
              value={selectedEnv}
              onChange={(e) => {
                setSelectedEnv(
                  e.target.value as "local" | "production" | "preview",
                );
                setStatus(null);
                if (e.target.value === "local") {
                  setDatabaseUrl(null);
                }
              }}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="local">Local</option>
              <option value="production">Production</option>
              <option value="preview">Preview</option>
            </select>
          </div>
        </div>

        {/* Connection Actions */}
        <div className="flex gap-2 flex-wrap">
          {selectedEnv !== "local" && (
            <button
              onClick={connectToVercel}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connecting..." : "Connect to Vercel"}
            </button>
          )}
          <button
            onClick={loadStatus}
            disabled={loading || (selectedEnv !== "local" && !databaseUrl)}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Check Status"}
          </button>
          <button
            onClick={runMigration}
            disabled={loading || (selectedEnv !== "local" && !databaseUrl)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Running..." : "Run Migrations"}
          </button>
        </div>

        {selectedEnv !== "local" && databaseUrl && (
          <div className="text-xs text-slate-500 dark:text-slate-400">
            ✓ Connected to {selectedEnv} database
          </div>
        )}
      </div>

      {/* Status Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-1">
            ⚠️ Error
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

      {status && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Database Status
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  status.connected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-slate-600 dark:text-slate-400">
                Status:{" "}
                <span className="font-medium">
                  {status.connected ? "Connected" : "Disconnected"}
                </span>
              </span>
            </div>
            {status.version && (
              <div>
                <span className="text-slate-600 dark:text-slate-400">
                  PostgreSQL Version:{" "}
                </span>
                <span className="font-mono text-slate-900 dark:text-slate-100">
                  {status.version}
                </span>
              </div>
            )}
            {status.database && (
              <div>
                <span className="text-slate-600 dark:text-slate-400">
                  Database:{" "}
                </span>
                <span className="font-mono text-slate-900 dark:text-slate-100">
                  {status.database}
                </span>
              </div>
            )}
            {status.tableCount !== undefined && (
              <div>
                <span className="text-slate-600 dark:text-slate-400">
                  Tables:{" "}
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {status.tableCount}
                </span>
              </div>
            )}
            {status.displayUrl && (
              <div>
                <span className="text-slate-600 dark:text-slate-400">
                  Connection:{" "}
                </span>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  {status.displayUrl}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Migration Output */}
      {migrationOutput && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">
            Migration Output
          </h3>
          <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap overflow-x-auto">
            {migrationOutput}
          </pre>
        </div>
      )}

      {/* Help */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
          💡 Tips
        </h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
          <li>
            For local: Set DATABASE_URL in{" "}
            <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">
              apps/{selectedApp}/.env.local
            </code>
          </li>
          <li>
            For production: Click "Connect to Vercel" to fetch DATABASE_URL from
            Vercel
          </li>
          <li>Always test migrations locally before running on production</li>
          <li>
            Use CLI for advanced operations:{" "}
            <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">
              node scripts/ideai-db-manager.mjs
            </code>
          </li>
        </ul>
      </div>
    </div>
  );
}
