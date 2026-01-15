/**
 * @fileoverview IdeaI Developer Setup Modal
 *
 * @module DevSetupModal
 * @description
 * Modal that appears automatically when developer signs in if setup checks fail.
 * Always shows important setup status on first visit.
 */

"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

type CheckStatus = "pass" | "fail" | "warning" | "skip";

interface SetupCheck {
  check: string;
  status: CheckStatus;
  message: string;
  fixSteps?: string[];
}

interface SetupStatus {
  allPassed: boolean;
  checks: SetupCheck[];
  canProceed: boolean;
}

const STATUS_ICONS = {
  pass: CheckCircle2,
  fail: XCircle,
  warning: AlertCircle,
  skip: CheckCircle2,
};

const STATUS_COLORS = {
  pass: "text-green-600 dark:text-green-400",
  fail: "text-red-600 dark:text-red-400",
  warning: "text-amber-600 dark:text-amber-400",
  skip: "text-gray-400 dark:text-gray-500",
};

export function DevSetupModal() {
  const { data: session } = useSession();
  const [status, setStatus] = useState<SetupStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check if user is authenticated (not anonymous)
  const isAuthenticated =
    session?.user &&
    session.user.name !== "Anonymous" &&
    !session.user.email?.startsWith("temp-") &&
    !session.user.isAnonymous;

  // Check if we're in dev/local environment
  const isDevelopment =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_APP_URL?.includes("localhost");

  // Run checks when authenticated
  useEffect(() => {
    if (!isAuthenticated || !isDevelopment || dismissed) return;

    const runChecks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/dev-setup/check");
        if (response.ok) {
          const data = await response.json();
          setStatus(data);

          // Show modal if:
          // 1. Cannot proceed (has failures) - ALWAYS show, OR
          // 2. Has important warnings (not just "skip" statuses)
          const hasFailures = !data.canProceed;
          const hasImportantWarnings = data.checks.some(
            (c: SetupCheck) =>
              c.status === "warning" && c.fixSteps && c.fixSteps.length > 0,
          );

          // Always show on failures, show warnings if not dismissed
          if (hasFailures) {
            setIsOpen(true);
          } else if (hasImportantWarnings && !dismissed) {
            setIsOpen(true);
          }
        }
      } catch (error) {
        console.error("Error running setup checks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure session is fully loaded
    const timer = setTimeout(runChecks, 500);
    return () => clearTimeout(timer);
  }, [isAuthenticated, isDevelopment, dismissed, session?.user?.id]);

  // Check if dismissed in localStorage (only for warnings, not failures)
  useEffect(() => {
    if (typeof window !== "undefined" && status) {
      const dismissedKey = `ideai-dev-setup-dismissed-${session?.user?.id || "anon"}`;
      const wasDismissed = localStorage.getItem(dismissedKey) === "true";
      // Only respect dismissal if there are no failures
      // Failures always show to ensure devs fix critical issues
      const hasFailures = status.checks.some((c) => c.status === "fail");
      if (wasDismissed && !hasFailures) {
        setDismissed(true);
      } else if (hasFailures) {
        // Reset dismissed state if failures appear
        setDismissed(false);
      }
    }
  }, [session?.user?.id, status]);

  const handleDismiss = () => {
    setIsOpen(false);
    setDismissed(true);
    if (typeof window !== "undefined" && session?.user?.id) {
      const dismissedKey = `ideai-dev-setup-dismissed-${session?.user?.id}`;
      localStorage.setItem(dismissedKey, "true");
    }
  };

  const [isRunningMigration, setIsRunningMigration] = useState(false);
  const [migrationLogs, setMigrationLogs] = useState<string[]>([]);
  const [migrationSuccess, setMigrationSuccess] = useState<boolean | null>(
    null,
  );

  const handleRunMigration = async () => {
    setIsRunningMigration(true);
    setMigrationLogs([]);
    setMigrationSuccess(null);

    try {
      // Use streaming endpoint for real-time logs
      const response = await fetch("/api/dev-setup/migrate/stream", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("No response body - streaming not supported");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        // Keep incomplete line in buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              setMigrationLogs((prev) => [...prev, data.message]);

              if (data.type === "error") {
                setMigrationSuccess(false);
              } else if (
                data.type === "success" &&
                data.message.includes("Migration completed successfully")
              ) {
                setMigrationSuccess(true);
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }

      // Process remaining buffer
      if (buffer && buffer.startsWith("data: ")) {
        try {
          const data = JSON.parse(buffer.slice(6));
          setMigrationLogs((prev) => [...prev, data.message]);
        } catch (e) {
          // Skip invalid JSON
        }
      }

      // Refresh checks after successful completion
      // Check if we saw a success message in the logs
      const wasSuccessful = migrationLogs.some(
        (log) =>
          log.includes("Migration completed successfully") ||
          log.includes("All done!"),
      );

      if (wasSuccessful || migrationSuccess === true) {
        setMigrationSuccess(true);
        setMigrationLogs((prev) => [...prev, "🔄 Refreshing setup checks..."]);
        setTimeout(async () => {
          try {
            const checkResponse = await fetch("/api/dev-setup/check");
            if (checkResponse.ok) {
              const data = await checkResponse.json();
              setStatus(data);
              setMigrationLogs((prev) => [
                ...prev,
                "✅ Setup checks refreshed",
              ]);
            }
          } catch (err) {
            console.error("Failed to refresh checks:", err);
          }
        }, 1500);
      }
    } catch (error) {
      setMigrationSuccess(false);
      setMigrationLogs((prev) => [
        ...prev,
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        "💡 Check your connection and try again",
      ]);
      console.error("Migration error:", error);
    } finally {
      setIsRunningMigration(false);
    }
  };

  if (!isAuthenticated || !isDevelopment || !status) {
    return null;
  }

  const hasFailures = !status.canProceed;
  const criticalChecks = status.checks.filter(
    (c) => c.status === "fail" || (c.status === "warning" && c.fixSteps),
  );

  return (
    <Dialog open={isOpen && !dismissed} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">ID</span>
              </div>
              <div>
                <DialogTitle className="text-2xl">
                  IdeaI Developer Setup
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {hasFailures
                    ? "Critical setup issues detected - please fix before continuing"
                    : "Setup validation complete - review recommended"}
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Overall Status */}
          <Card className={hasFailures ? "border-red-500" : "border-amber-500"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {hasFailures ? (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    Action Required
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    Setup Review Recommended
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {hasFailures
                  ? "Some checks failed. Fix these issues to ensure a smooth development experience."
                  : "All critical checks passed. Review warnings for optimal setup."}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Critical Checks */}
          {criticalChecks.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">
                Important Checks ({criticalChecks.length})
              </h3>
              {criticalChecks.map((check, index) => {
                const Icon = STATUS_ICONS[check.status];
                const colorClass = STATUS_COLORS[check.status];

                return (
                  <Card
                    key={index}
                    className={check.status === "fail" ? "border-red-500" : ""}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${colorClass}`} />
                          <div>
                            <CardTitle className="text-base">
                              {check.check}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {check.message}
                            </CardDescription>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            check.status === "pass"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : check.status === "fail"
                                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                : check.status === "warning"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {check.status.toUpperCase()}
                        </span>
                      </div>
                    </CardHeader>
                    {check.fixSteps && check.fixSteps.length > 0 && (
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Fix steps:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {check.fixSteps.map((step, i) => (
                              <li
                                key={i}
                                className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded"
                              >
                                {step}
                              </li>
                            ))}
                          </ul>
                          {check.check === "Database Migration" && (
                            <div className="mt-3 space-y-2">
                              <Button
                                onClick={handleRunMigration}
                                className="mt-2"
                                size="sm"
                                disabled={isRunningMigration}
                              >
                                {isRunningMigration ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Running Migration...
                                  </>
                                ) : (
                                  "Run Migration Now"
                                )}
                              </Button>

                              {migrationLogs.length > 0 && (
                                <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-md max-h-64 overflow-y-auto">
                                  <div className="text-xs font-mono space-y-1">
                                    {migrationLogs.map((log, i) => {
                                      const isError =
                                        log.includes("❌") ||
                                        log.includes("error");
                                      const isSuccess =
                                        log.includes("✅") ||
                                        (log.includes("Step") &&
                                          log.includes("/5"));
                                      const isStep = log.includes("📍 Step");
                                      const isInfo =
                                        log.includes("📋") ||
                                        log.includes("💡");

                                      return (
                                        <div
                                          key={i}
                                          className={
                                            isError
                                              ? "text-red-600 dark:text-red-400 font-semibold"
                                              : isSuccess
                                                ? "text-green-600 dark:text-green-400"
                                                : isStep
                                                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                                                  : isInfo
                                                    ? "text-slate-600 dark:text-slate-400"
                                                    : "text-slate-700 dark:text-slate-300"
                                          }
                                        >
                                          {log}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {migrationSuccess === true && (
                                <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                                  ✅ Migration completed successfully!
                                </div>
                              )}

                              {migrationSuccess === false && (
                                <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                                  ❌ Migration failed. Check logs above.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          {/* All Checks Summary */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {status.checks.filter((c) => c.status === "pass").length}{" "}
                passed,{" "}
                {status.checks.filter((c) => c.status === "warning").length}{" "}
                warnings,{" "}
                {status.checks.filter((c) => c.status === "fail").length} failed
              </span>
              <Link
                href="/dev-setup"
                className="text-primary hover:underline flex items-center gap-1"
              >
                View Full Report
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleDismiss}
              variant={hasFailures ? "outline" : "default"}
            >
              {hasFailures ? "I'll Fix Later" : "Got It"}
            </Button>
            {hasFailures && (
              <Link href="/settings/service-keys">
                <Button>
                  Go to Settings
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
