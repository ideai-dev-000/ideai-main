/**
 * @fileoverview Service Keys Settings Page
 *
 * @module ServiceKeysSettings
 * @description
 * UI for managing user service API keys (AI Gateway, OpenAI, etc.)
 * Allows users to view, add, update, and delete their service keys.
 */

"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Plus,
  Key,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

type ServiceType =
  | "ai_gateway"
  | "openai"
  | "v0"
  | "anthropic"
  | "firecrawl"
  | "exa";

interface ServiceKeyInfo {
  id: string;
  serviceType: ServiceType;
  keyPrefix: string | null;
  environment: string;
  isActive: boolean;
  lastUsedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  hasKey: boolean;
}

type Environment = "local" | "production";

interface ServiceStatus {
  serviceType: ServiceType;
  displayName: string;
  configured: boolean;
  source: "user" | "environment" | "none";
  hasLocal: boolean;
  hasProduction: boolean;
  activeEnvironment: "local" | "production" | null;
}

const SERVICE_DISPLAY_NAMES: Record<ServiceType, string> = {
  ai_gateway: "AI Gateway (Vercel)",
  openai: "OpenAI",
  v0: "V0.dev",
  anthropic: "Anthropic Claude",
  firecrawl: "Firecrawl",
  exa: "Exa",
};

const SERVICE_DESCRIPTIONS: Record<ServiceType, string> = {
  ai_gateway: "Vercel AI Gateway API key for AI workflows",
  openai: "OpenAI API key for GPT models",
  v0: "V0.dev API key for v0 code generation",
  anthropic: "Anthropic Claude API key",
  firecrawl: "Firecrawl API key for web scraping",
  exa: "Exa API key for semantic search",
};

// Default service types that should always be shown
const DEFAULT_SERVICES: ServiceType[] = [
  "ai_gateway",
  "openai",
  "v0",
  "anthropic",
  "firecrawl",
  "exa",
];

export default function ServiceKeysPage() {
  const { data: session } = useSession();
  const [environment, setEnvironment] = useState<Environment>("production");
  const [localMode, setLocalMode] = useState(false);
  const [keys, setKeys] = useState<ServiceKeyInfo[]>([]);
  const [statuses, setStatuses] = useState<ServiceStatus[]>(() => {
    // Initialize with default services (unconfigured)
    return DEFAULT_SERVICES.map((serviceType) => ({
      serviceType,
      displayName: SERVICE_DISPLAY_NAMES[serviceType],
      configured: false,
      source: "none" as const,
    }));
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null,
  );
  const [keyValue, setKeyValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load keys and status
  const loadData = async () => {
    // Local mode: Read from .env.local only, no API calls
    if (localMode) {
      setIsLoading(true);
      try {
        // In local mode, just show services as "configured" if they exist in env
        // This is read-only mode for offline development
        const defaultStatuses: ServiceStatus[] = DEFAULT_SERVICES.map(
          (serviceType) => ({
            serviceType,
            displayName: SERVICE_DISPLAY_NAMES[serviceType],
            configured: false, // Can't verify without API
            source: "environment" as const,
            hasLocal: false,
            hasProduction: false,
            activeEnvironment: "local",
          }),
        );
        setStatuses(defaultStatuses);
        setKeys([]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Require authentication for online mode
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch keys for both environments
      const [keysResponse, prodStatusResponse, localStatusResponse] =
        await Promise.all([
          fetch("/api/user-keys").catch((err) => {
            console.error("[ServiceKeys] Failed to fetch keys:", err);
            return { ok: false };
          }),
          fetch("/api/user-keys/status?environment=production").catch((err) => {
            console.error("[ServiceKeys] Failed to fetch prod status:", err);
            return { ok: false };
          }),
          fetch("/api/user-keys/status?environment=local").catch((err) => {
            console.error("[ServiceKeys] Failed to fetch local status:", err);
            return { ok: false };
          }),
        ]);

      if (keysResponse.ok) {
        const keysData = await keysResponse.json();
        setKeys(keysData.keys || []);
      } else {
        console.error(
          "[ServiceKeys] Keys response not ok:",
          keysResponse.status,
        );
        setKeys([]);
      }

      // Merge status from both environments
      const prodStatus = prodStatusResponse.ok
        ? await prodStatusResponse.json()
        : { services: [] };
      const localStatus = localStatusResponse.ok
        ? await localStatusResponse.json()
        : { services: [] };

      const mergedStatuses: ServiceStatus[] = DEFAULT_SERVICES.map(
        (serviceType) => {
          const prod = prodStatus.services?.find(
            (s: any) => s.serviceType === serviceType,
          );
          const local = localStatus.services?.find(
            (s: any) => s.serviceType === serviceType,
          );

          const hasProduction = prod?.configured || false;
          const hasLocal = local?.configured || false;
          const configured = environment === "local" ? hasLocal : hasProduction;
          const activeEnvironment =
            hasLocal && environment === "local"
              ? "local"
              : hasProduction
                ? "production"
                : null;

          return {
            serviceType,
            displayName: SERVICE_DISPLAY_NAMES[serviceType],
            configured,
            source: prod?.source || local?.source || "none",
            hasLocal,
            hasProduction,
            activeEnvironment,
          };
        },
      );

      setStatuses(mergedStatuses);
    } catch (error) {
      console.error("[ServiceKeys] Failed to load service keys:", error);
      toast.error("Failed to load service keys");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [session?.user?.id, environment]);

  const handleAddKey = (serviceType: ServiceType) => {
    setSelectedService(serviceType);
    setKeyValue("");
    setShowKey(false);
    setIsDialogOpen(true);
  };

  const handleSaveKey = async () => {
    if (!selectedService || !keyValue.trim() || !session?.user?.id) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/user-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: selectedService,
          key: keyValue.trim(),
          environment: environment,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save key");
      }

      toast.success("Service key saved successfully!");
      setIsDialogOpen(false);
      setKeyValue("");
      setSelectedService(null);
      await loadData();
    } catch (error) {
      console.error("Failed to save key:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save key",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to delete this key?")) return;

    try {
      const response = await fetch(`/api/user-keys/${keyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete key");
      }

      toast.success("Service key deleted");
      await loadData();
    } catch (error) {
      console.error("Failed to delete key:", error);
      toast.error("Failed to delete key");
    }
  };

  // Show login prompt or local mode option if not authenticated
  if (!session?.user && !localMode) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Service Keys</h1>
          <p className="text-muted-foreground mt-2">
            Manage your API keys for AI services. Keys are encrypted and stored
            securely.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to manage service keys, or use local mode to view
              keys from .env.local
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={() => (window.location.href = "/api/auth/signin")}
              >
                Sign In
              </Button>
              <Button variant="outline" onClick={() => setLocalMode(true)}>
                Use Local Mode (Read-only)
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Local Mode:</strong> Read-only view of keys from{" "}
              <code>.env.local</code>. No API calls are made. Use{" "}
              <code>pnpm key-sync</code> CLI for syncing.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Service Keys</h1>
          <div className="flex items-center gap-4">
            {localMode && (
              <div className="px-3 py-1.5 rounded-md bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-sm font-medium">
                🔧 Local Mode (Read-only)
              </div>
            )}
            {!localMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocalMode(true)}
                title="Switch to local mode (no API calls)"
              >
                Local Mode
              </Button>
            )}
            {localMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLocalMode(false);
                  loadData();
                }}
                title="Switch back to online mode"
              >
                Online Mode
              </Button>
            )}
            <div className="flex items-center gap-2">
              <Label htmlFor="environment" className="text-sm font-medium">
                Environment:
              </Label>
              <select
                id="environment"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as Environment)}
                className="px-3 py-1.5 rounded-md border border-input bg-background text-sm"
                disabled={localMode}
              >
                <option value="production">Production</option>
                <option value="local">Local (Dev)</option>
              </select>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground">
          Manage your API keys for AI services. Keys are encrypted and stored
          securely.
          {environment === "local" && (
            <span className="ml-2 text-amber-600 dark:text-amber-400">
              💡 Local keys can be tested by editing{" "}
              <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                .env.local
              </code>{" "}
              and syncing with{" "}
              <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                pnpm key-sync push
              </code>
            </span>
          )}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {statuses.map((status) => {
            const keyInfo = keys.find(
              (k) =>
                k.serviceType === status.serviceType &&
                k.environment === environment,
            );
            const otherEnvKey = keys.find(
              (k) =>
                k.serviceType === status.serviceType &&
                k.environment !== environment,
            );

            return (
              <Card key={status.serviceType}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {status.configured ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                        {status.displayName}
                        {status.activeEnvironment && (
                          <span
                            className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                              status.activeEnvironment === "local"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            }`}
                          >
                            {status.activeEnvironment === "local"
                              ? "🔧 Local Active"
                              : "☁️ Production Active"}
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {SERVICE_DESCRIPTIONS[status.serviceType]}
                        {status.hasLocal && status.hasProduction && (
                          <span className="ml-2 text-xs">
                            • Has both local and production keys
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {keyInfo && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteKey(keyInfo.id)}
                            title="Delete this key"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {otherEnvKey && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                // Copy key from other environment
                                if (
                                  confirm(
                                    `Copy ${otherEnvKey.environment} key to ${environment}?`,
                                  )
                                ) {
                                  try {
                                    const response = await fetch(
                                      "/api/user-keys",
                                      {
                                        method: "POST",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                          serviceType: status.serviceType,
                                          environment: environment,
                                          copyFrom: otherEnvKey.environment,
                                        }),
                                      },
                                    );
                                    if (response.ok) {
                                      toast.success(
                                        `Key copied from ${otherEnvKey.environment}`,
                                      );
                                      await loadData();
                                    }
                                  } catch (error) {
                                    toast.error("Failed to copy key");
                                  }
                                }
                              }}
                              title={`Copy from ${otherEnvKey.environment}`}
                            >
                              📋 Copy from {otherEnvKey.environment}
                            </Button>
                          )}
                        </>
                      )}
                      <Button
                        variant={keyInfo ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleAddKey(status.serviceType)}
                      >
                        {keyInfo ? (
                          <>
                            <Key className="h-4 w-4 mr-2" />
                            Update {environment}
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Add {environment} Key
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {keyInfo && (
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium">
                          {environment === "local"
                            ? "🔧 Local Key"
                            : "☁️ Production Key"}
                          :
                        </span>
                        <span className="text-muted-foreground font-mono">
                          {keyInfo.keyPrefix || "...****"}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800">
                          {keyInfo.environment}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          Source:{" "}
                          {status.source === "user"
                            ? "Database"
                            : "Environment Variable"}
                        </span>
                        {keyInfo.lastUsedAt && (
                          <>
                            <span>•</span>
                            <span>
                              Last used:{" "}
                              {new Date(
                                keyInfo.lastUsedAt,
                              ).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                      {environment === "local" && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 rounded text-xs text-blue-700 dark:text-blue-300">
                          💡 To test a different local key: Edit{" "}
                          <code className="px-1 py-0.5 bg-white dark:bg-blue-900 rounded">
                            .env.local
                          </code>{" "}
                          then run{" "}
                          <code className="px-1 py-0.5 bg-white dark:bg-blue-900 rounded">
                            pnpm key-sync push
                          </code>{" "}
                          to sync back to DB
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
                {!keyInfo &&
                  status.hasProduction &&
                  environment === "local" && (
                    <CardContent>
                      <div className="p-2 bg-amber-50 dark:bg-amber-950 rounded text-xs text-amber-700 dark:text-amber-300">
                        ⚠️ No local key set. Using production key. Add a local
                        key to test changes safely.
                      </div>
                    </CardContent>
                  )}
                {!keyInfo &&
                  status.hasLocal &&
                  environment === "production" && (
                    <CardContent>
                      <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded text-xs text-blue-700 dark:text-blue-300">
                        ℹ️ Local key exists but won't be used in production.
                        Production key required.
                      </div>
                    </CardContent>
                  )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Key Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedService
                ? `Add ${SERVICE_DISPLAY_NAMES[selectedService]} Key`
                : "Add Service Key"}
            </DialogTitle>
            <DialogDescription>
              {selectedService && SERVICE_DESCRIPTIONS[selectedService]}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="key">API Key</Label>
              <div className="relative mt-2">
                <Input
                  id="key"
                  type={showKey ? "text" : "password"}
                  value={keyValue}
                  onChange={(e) => setKeyValue(e.target.value)}
                  placeholder={`Enter your ${selectedService ? SERVICE_DISPLAY_NAMES[selectedService] : ""} API key`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveKey}
                disabled={!keyValue.trim() || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Key"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
