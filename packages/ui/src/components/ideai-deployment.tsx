/**
 * @fileoverview IdeaI Deployment Component - Deployment options and testing widget
 * 
 * @module IdeAIDeployment
 * @description
 * A comprehensive deployment status and options component that displays:
 * - Current deployment status for each app
 * - Available deployment strategies (standalone, subdomain, sub-folder, Vercel project)
 * - Testing tools for each deployment mode
 * - Logs and debugging information
 * - Quick actions to test/deploy each option
 * 
 * Designed to help test and debug deployment strategies before full automation.
 * 
 * @example
 * ```tsx
 * <IdeAIDeployment 
 *   appName="docs"
 *   appConfig={appConfig}
 *   currentPath="/apps/docs"
 * />
 * ```
 */

"use client";

import { useState, useEffect } from "react";
import { IdeaIButton } from "./ideai-button";

export interface DeploymentOption {
  id: string;
  name: string;
  description: string;
  url?: string;
  status: "available" | "configured" | "testing" | "error" | "not-configured";
  testUrl?: string;
  logs?: string[];
}

export interface IdeAIDeploymentProps {
  /** App name (e.g., "docs", "all") */
  appName: string;
  /** App configuration */
  appConfig: {
    name: string;
    description: string;
    standaloneUrl?: string;
    localPort?: number;
  };
  /** Current path */
  currentPath: string;
  /** Show logs panel */
  showLogs?: boolean;
}

/**
 * IdeaI Deployment Component
 * 
 * Displays deployment options and allows testing each strategy.
 */
export const IdeAIDeployment = ({
  appName,
  appConfig,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentPath: _currentPath,
  showLogs = true,
}: IdeAIDeploymentProps) => {
  const [deploymentOptions, setDeploymentOptions] = useState<DeploymentOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState<string | null>(null);

  useEffect(() => {
    // Initialize deployment options based on current configuration
    // Use a function to ensure we get fresh values
    const initializeOptions = () => {
      if (typeof window === "undefined") {
        // Server-side: set empty options, will be initialized on client
        setDeploymentOptions([]);
        return;
      }

      const hostname = window.location.hostname;
      const origin = window.location.origin;
      const baseDomain = hostname.replace("www.", "");

      const options: DeploymentOption[] = [
        {
          id: "standalone",
          name: "Standalone Domain",
          description: "Deploy as independent app with its own domain (e.g., docs.myui.space)",
          url: appConfig.standaloneUrl,
          status: appConfig.standaloneUrl ? "configured" : "not-configured",
          testUrl: appConfig.standaloneUrl,
        },
        {
          id: "subdomain",
          name: "Subdomain (Parent Domain)",
          description: `Deploy as subdomain of parent domain (e.g., ${appName}.${baseDomain})`,
          url: `https://${appName}.${baseDomain}`,
          status: "not-configured",
          testUrl: `https://${appName}.${baseDomain}`,
        },
        {
          id: "subfolder",
          name: "Sub-Folder (Parent Domain)",
          description: `Deploy as sub-folder of parent domain (e.g., ${origin}/apps/${appName})`,
          url: `${origin}/apps/${appName}`,
          status: "available",
          testUrl: `${origin}/apps/${appName}`,
        },
        {
          id: "vercel-project",
          name: "Vercel Project",
          description: "Deploy as separate Vercel project with its own configuration",
          status: "not-configured",
        },
      ];

      setDeploymentOptions(options);
      addLog(`📋 Initialized ${options.length} deployment options for ${appName}`);
    };

    // Initialize immediately on client
    initializeOptions();
  }, [appName, appConfig.standaloneUrl]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setLogs((prev) => {
      // Keep last 100 logs to prevent memory issues
      const newLogs = [...prev, logMessage];
      return newLogs.slice(-100);
    });
    // Also log to console for debugging
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      console.log(`[IdeAIDeployment] ${logMessage}`);
    }
  };

  const testDeployment = async (optionId: string) => {
    const option = deploymentOptions.find((opt) => opt.id === optionId);
    if (!option) {
      addLog(`❌ Deployment option not found: ${optionId}`);
      return;
    }
    if (!option.testUrl) {
      addLog(`❌ No test URL available for ${option.name}`);
      return;
    }

    setIsTesting(optionId);
    addLog(`🧪 Testing ${option.name}...`);
    addLog(`📍 Test URL: ${option.testUrl}`);

    // Update status to testing
    setDeploymentOptions((prev) =>
      prev.map((opt) =>
        opt.id === optionId ? { ...opt, status: "testing" as const } : opt
      )
    );

    try {
      // Use a more robust testing approach
      // Try multiple methods to verify the URL
      const testMethods = [
        async () => {
          // Method 1: Try HEAD request with CORS (gives us status code)
          const response = await fetch(option.testUrl!, {
            method: "HEAD",
            mode: "cors",
            cache: "no-store",
            signal: AbortSignal.timeout(5000), // 5 second timeout
          });
          return { 
            success: response.ok, 
            status: response.status, 
            method: "HEAD (CORS)",
            headers: Object.fromEntries(response.headers.entries()),
          };
        },
        async () => {
          // Method 2: Try GET request with no-cors (always succeeds but doesn't give details)
          await fetch(option.testUrl!, {
            method: "GET",
            mode: "no-cors",
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
          });
          return { success: true, status: null, method: "GET (no-cors)", headers: {} };
        },
      ];

      let lastError: Error | null = null;
      let testResult: { success: boolean; status: number | null; method: string; headers: Record<string, string> } | null = null;

      // Try each method until one succeeds
      for (const testMethod of testMethods) {
        try {
          testResult = await testMethod();
          if (testResult.success) {
            break;
          }
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          // Continue to next method
          continue;
        }
      }

      if (testResult && testResult.success) {
        const statusText = testResult.status ? ` (HTTP ${testResult.status})` : "";
        const serverInfo = testResult.headers["server"] ? ` [Server: ${testResult.headers["server"]}]` : "";
        addLog(`✅ ${option.name} is reachable${statusText}${serverInfo} [${testResult.method}]`);
        
        // Check if it's a Next.js app
        if (testResult.headers["x-powered-by"] === "Next.js") {
          addLog(`   ✓ Detected Next.js application`);
        }
        
        // Update option status
        setDeploymentOptions((prev) =>
          prev.map((opt) =>
            opt.id === optionId
              ? { 
                  ...opt, 
                  status: "available" as const, 
                  logs: [`✅ Reachable at ${option.testUrl}${statusText}${serverInfo}`] 
                }
              : opt
          )
        );
      } else {
        throw lastError || new Error("All test methods failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      addLog(`❌ ${option.name} test failed: ${errorMessage}`);
      addLog(`💡 Tip: Check if the URL is accessible and CORS is configured correctly`);
      
      setDeploymentOptions((prev) =>
        prev.map((opt) =>
          opt.id === optionId
            ? { 
                ...opt, 
                status: "error" as const, 
                logs: [`❌ Error: ${errorMessage}`] 
              }
            : opt
        )
      );
    } finally {
      setIsTesting(null);
    }
  };

  const getStatusColor = (status: DeploymentOption["status"]) => {
    switch (status) {
      case "configured":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "available":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "testing":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "error":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "not-configured":
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
    }
  };

  const getStatusIcon = (status: DeploymentOption["status"]) => {
    switch (status) {
      case "configured":
        return "✅";
      case "available":
        return "🔵";
      case "testing":
        return "⏳";
      case "error":
        return "❌";
      case "not-configured":
        return "⚪";
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Deployment Options for {appConfig.name}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Test and configure deployment strategies. All options can be automated once tested.
        </p>
      </div>

      {/* Deployment Options Grid */}
      {deploymentOptions.length === 0 ? (
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
          <p className="text-slate-600 dark:text-slate-400">Loading deployment options...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deploymentOptions.map((option) => (
          <div
            key={option.id}
            className={`p-4 border-2 rounded-lg transition-all ${
              selectedOption === option.id
                ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            }`}
            onClick={() => setSelectedOption(option.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{getStatusIcon(option.status)}</span>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {option.name}
                </h3>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(option.status)}`}
              >
                {option.status.replace("-", " ")}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              {option.description}
            </p>
            {option.url && (
              <p className="text-xs text-slate-500 dark:text-slate-500 mb-3 font-mono break-all">
                {option.url}
              </p>
            )}
            <div className="flex gap-2">
              {option.testUrl && (
                <IdeaIButton
                  appName={appName}
                  onClick={() => testDeployment(option.id)}
                  disabled={isTesting === option.id}
                  className="text-xs"
                >
                  {isTesting === option.id ? "Testing..." : "Test"}
                </IdeaIButton>
              )}
              {option.url && (
                <a
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Open →
                </a>
              )}
            </div>
            {option.logs && option.logs.length > 0 && (
              <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded text-xs font-mono">
                {option.logs.map((log, idx) => (
                  <div key={idx} className="text-slate-600 dark:text-slate-400">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
          ))}
        </div>
      )}

      {/* Logs Panel */}
      {showLogs && logs.length > 0 && (
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Deployment Logs
            </h3>
            <button
              onClick={() => setLogs([])}
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Clear
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className="text-xs font-mono text-slate-600 dark:text-slate-400"
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <IdeaIButton
            appName={appName}
            onClick={async () => {
              addLog("📋 Testing all deployment options...");
              // Test each option sequentially with delays to avoid rate limiting
              for (const opt of deploymentOptions) {
                if (opt.testUrl) {
                  await testDeployment(opt.id);
                  // Wait 500ms between tests
                  await new Promise((resolve) => setTimeout(resolve, 500));
                }
              }
              addLog("✅ All tests completed");
            }}
            disabled={isTesting !== null}
          >
            Test All Options
          </IdeaIButton>
          <IdeaIButton
            appName={appName}
            onClick={() => {
              const config = {
                app: appName,
                timestamp: new Date().toISOString(),
                options: deploymentOptions.map((opt) => ({
                  id: opt.id,
                  name: opt.name,
                  status: opt.status,
                  url: opt.url,
                  testUrl: opt.testUrl,
                })),
              };
              const configJson = JSON.stringify(config, null, 2);
              console.log("Deployment Config:", config);
              
              // Copy to clipboard if available
              if (typeof navigator !== "undefined" && navigator.clipboard) {
                navigator.clipboard.writeText(configJson).then(() => {
                  addLog("📋 Configuration copied to clipboard");
                }).catch(() => {
                  addLog("📋 Configuration logged to console (clipboard failed)");
                });
              } else {
                addLog("📋 Configuration logged to console");
              }
            }}
          >
            Export Config
          </IdeaIButton>
        </div>
      </div>
    </div>
  );
};

