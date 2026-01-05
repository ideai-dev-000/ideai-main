"use client"

import { Analytics as VercelAnalytics } from "@vercel/analytics/react"

/**
 * Vercel Analytics Wrapper
 * Add to root layout for automatic tracking
 */
export function Analytics() {
  return <VercelAnalytics />
}
