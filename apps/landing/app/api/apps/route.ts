/**
 * @fileoverview API route for runtime app discovery
 * 
 * @module AppsAPI
 * @description
 * Returns list of all available apps for runtime discovery.
 * In production, this could check deployment status, health, etc.
 */

import { NextResponse } from "next/server";
import { defaultRoutingConfig } from "../../config/routing";

export async function GET() {
  try {
    // In production, this could:
    // - Check deployment status from Vercel API
    // - Check health endpoints of each app
    // - Filter out unavailable apps
    // - Add real-time status information
    
    const config = {
      ...defaultRoutingConfig,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    };

    // For now, return all apps from config
    // In production, you could add status checks here
    const appsWithStatus = config.apps.map((app) => ({
      ...app,
      status: "available", // Could be "available", "unavailable", "deploying", etc.
      url: config.mode === "folders" 
        ? `${config.baseUrl}${app.path}`
        : app.subdomain 
          ? `https://${app.subdomain}.${config.baseUrl.replace(/^https?:\/\//, "").split("/")[0]}`
          : `${config.baseUrl}${app.path}`,
    }));

    return NextResponse.json({
      mode: config.mode,
      baseUrl: config.baseUrl,
      apps: appsWithStatus,
    });
  } catch (error) {
    console.error("Error fetching apps:", error);
    return NextResponse.json(
      { error: "Failed to fetch apps" },
      { status: 500 }
    );
  }
}


