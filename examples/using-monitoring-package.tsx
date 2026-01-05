/**
 * Example: Using the Monitoring Package
 *
 * Shows how to use @repo/monitoring for analytics
 */

import { Analytics } from "@repo/monitoring/analytics"
import { SpeedInsights } from "@repo/monitoring/speed-insights"

// Example 1: Basic usage in root layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

// Example 2: With custom configuration
export function CustomLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Only load analytics in production */}
        {process.env.NODE_ENV === "production" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}
// Example 3: Track custom events (after user interaction)
;("use client")

import type React from "react"

import { trackEvent } from "@repo/monitoring/analytics"

export function CustomButton() {
  const handleClick = () => {
    // Track custom event
    trackEvent("button_click", {
      button_name: "signup",
      page: "/homepage",
    })
  }

  return <button onClick={handleClick}>Sign Up</button>
}
