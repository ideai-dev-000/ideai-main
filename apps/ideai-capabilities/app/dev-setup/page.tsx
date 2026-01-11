/**
 * @fileoverview Dev Setup Check Page
 *
 * @module DevSetupPage
 * @description
 * Onboarding page that validates all dev setup is correct.
 * Runs automatically on first visit, shows setup status.
 */

"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
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
  SkipForward,
  Loader2,
  ArrowRight,
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
  skip: SkipForward,
};

const STATUS_COLORS = {
  pass: "text-green-600 dark:text-green-400",
  fail: "text-red-600 dark:text-red-400",
  warning: "text-amber-600 dark:text-amber-400",
  skip: "text-gray-400 dark:text-gray-500",
};

export default function DevSetupPage() {
  const { data: session } = useSession();
  const [status, setStatus] = useState<SetupStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const runChecks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/dev-setup/check");
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      } else {
        console.error("Failed to run setup checks");
      }
    } catch (error) {
      console.error("Error running setup checks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runChecks();
  }, [session?.user?.id]);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dev Setup Check</h1>
        <p className="text-muted-foreground mt-2">
          Automated validation of your IdeaI development environment. Ensures
          everything is configured correctly for local and production
          development.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Running setup checks...</span>
        </div>
      ) : status ? (
        <>
          {/* Overall Status */}
          <Card
            className={
              status.canProceed ? "border-green-500" : "border-red-500"
            }
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {status.canProceed ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    Setup Complete - Ready to Develop
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-red-600" />
                    Setup Issues Found
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {status.canProceed
                  ? "All critical checks passed. You can start developing."
                  : "Please fix the issues below before proceeding."}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Individual Checks */}
          <div className="mt-6 space-y-4">
            {status.checks.map((check, index) => {
              const Icon = STATUS_ICONS[check.status];
              const colorClass = STATUS_COLORS[check.status];

              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${colorClass}`} />
                        <div>
                          <CardTitle className="text-lg">
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
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-4">
            <Button onClick={runChecks} variant="outline">
              Re-run Checks
            </Button>
            {status.checks.some(
              (c) => c.status === "fail" && c.check === "Database Migration",
            ) && (
              <Button
                onClick={async () => {
                  if (confirm("Run database migration now?")) {
                    try {
                      const response = await fetch("/api/dev-setup/migrate", {
                        method: "POST",
                      });
                      if (response.ok) {
                        alert("Migration completed! Re-running checks...");
                        await runChecks();
                      } else {
                        const error = await response.json();
                        alert(
                          `Migration failed: ${error.details || error.error}`,
                        );
                      }
                    } catch (error) {
                      alert(
                        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
                      );
                    }
                  }
                }}
              >
                Run Migration
              </Button>
            )}
            {status.canProceed && (
              <Link href="/settings/service-keys">
                <Button>
                  Go to Service Keys
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Failed to run setup checks</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
