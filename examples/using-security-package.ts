/**
 * Example: Using the Security Package
 *
 * Shows how to use @repo/security in different scenarios
 */

import { getSecurityHeaders, applySecurityHeaders } from "@repo/security"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Example 1: Basic usage in proxy.js
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Apply default security headers
  applySecurityHeaders(response.headers)

  return response
}

// Example 2: Custom configuration
export function customMiddleware(request: NextRequest) {
  const response = NextResponse.next()

  // Apply headers with custom config
  applySecurityHeaders(response.headers, {
    allowedDomains: ["https://vercel.com", "https://api.example.com"],
    enableCSP: true,
    enableHSTS: true,
  })

  return response
}

// Example 3: Get headers as object (for API routes)
export async function GET(request: Request) {
  const headers = getSecurityHeaders({
    allowedDomains: ["https://trusted-domain.com"],
  })

  return new Response("Hello", {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  })
}

// Example 4: With CSP nonce for inline scripts
export function middlewareWithNonce(request: NextRequest) {
  const response = NextResponse.next()

  // Generate nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64")

  // Apply headers with nonce
  applySecurityHeaders(response.headers, {
    nonce,
    enableCSP: true,
  })

  // Pass nonce to page via header (optional)
  response.headers.set("X-CSP-Nonce", nonce)

  return response
}
