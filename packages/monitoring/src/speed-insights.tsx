"use client"

import { SpeedInsights as VercelSpeedInsights } from "@vercel/speed-insights/next"

/**
 * Vercel Speed Insights Wrapper
 * Add to root layout for Web Vitals tracking
 */
export function SpeedInsights() {
  return <VercelSpeedInsights />
}
