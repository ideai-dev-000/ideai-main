/**
 * @fileoverview User Service Keys Status API
 *
 * @module UserKeysStatusAPI
 * @description
 * Quick status check for which services have keys configured
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  hasUserKey,
  type ServiceType,
  type Environment,
} from "@/lib/services/user-keys";

export type ServiceStatus = {
  serviceType: ServiceType;
  displayName: string;
  configured: boolean;
  source: "user" | "environment" | "none";
  hasLocal?: boolean;
  hasProduction?: boolean;
  activeEnvironment?: "local" | "production" | null;
};

const SERVICE_DISPLAY_NAMES: Record<ServiceType, string> = {
  ai_gateway: "AI Gateway (Vercel)",
  openai: "OpenAI",
  v0: "V0.dev",
  anthropic: "Anthropic Claude",
  firecrawl: "Firecrawl",
  exa: "Exa",
};

/**
 * GET /api/user-keys/status
 * Get status of all service keys for the user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const environment = (searchParams.get("environment") ||
      "production") as Environment;

    const serviceTypes: ServiceType[] = [
      "ai_gateway",
      "openai",
      "v0",
      "anthropic",
      "firecrawl",
      "exa",
    ];

    // Get status for both environments to show full picture
    const statuses: ServiceStatus[] = await Promise.all(
      serviceTypes.map(async (serviceType) => {
        const prodConfigured = await hasUserKey(
          session.user.id,
          serviceType,
          "production",
        );
        const localConfigured = await hasUserKey(
          session.user.id,
          serviceType,
          "local",
        );
        const configured =
          environment === "local" ? localConfigured : prodConfigured;

        // Check if it's from DB or env
        let source: "user" | "environment" | "none" = "none";
        if (configured) {
          // Check DB first
          const { getUserKeyInfo } = await import("@/lib/services/user-keys");
          const keyInfo = await getUserKeyInfo(
            session.user.id,
            serviceType,
            environment,
          );
          source = keyInfo ? "user" : "environment";
        }

        // Determine active environment (local if exists and requested, otherwise prod)
        let activeEnvironment: "local" | "production" | null = null;
        if (localConfigured && environment === "local") {
          activeEnvironment = "local";
        } else if (prodConfigured) {
          activeEnvironment = "production";
        }

        return {
          serviceType,
          displayName: SERVICE_DISPLAY_NAMES[serviceType],
          configured,
          source,
          hasLocal: localConfigured,
          hasProduction: prodConfigured,
          activeEnvironment,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      environment,
      services: statuses,
    });
  } catch (error) {
    console.error("[UserKeys Status API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check service key status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
