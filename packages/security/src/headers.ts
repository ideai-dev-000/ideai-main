/**
 * Security Headers Package
 * Centralized security configuration for all apps
 */

export interface SecurityHeadersConfig {
  enableCSP?: boolean
  enableHSTS?: boolean
  allowedDomains?: string[]
  nonce?: string
}

/**
 * Generate comprehensive security headers
 */
export function getSecurityHeaders(config: SecurityHeadersConfig = {}): Record<string, string> {
  const { enableCSP = true, enableHSTS = true, allowedDomains = [], nonce } = config

  const headers: Record<string, string> = {
    // XSS Protection
    "X-XSS-Protection": "1; mode=block",

    // Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",

    // Clickjacking protection
    "X-Frame-Options": "SAMEORIGIN",

    // Referrer policy
    "Referrer-Policy": "strict-origin-when-cross-origin",

    // Permissions policy (2026+)
    "Permissions-Policy": [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()",
      "payment=()",
      "usb=()",
      "bluetooth=()",
    ].join(", "),
  }

  if (enableCSP) {
    headers["Content-Security-Policy"] = generateCSP({
      allowedDomains,
      nonce,
    })
  }

  if (enableHSTS) {
    headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
  }

  return headers
}

/**
 * Generate Content Security Policy
 */
function generateCSP(options: {
  allowedDomains?: string[]
  nonce?: string
}): string {
  const { allowedDomains = [], nonce } = options

  const domains = allowedDomains.length > 0 ? allowedDomains.join(" ") : ""

  const scriptSrc = nonce
    ? `'self' 'nonce-${nonce}' ${domains}`.trim()
    : `'self' 'unsafe-eval' 'unsafe-inline' ${domains}`.trim()

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    `connect-src 'self' https: wss: ${domains}`.trim(),
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ")
}

/**
 * Apply headers to Next.js response
 */
export function applySecurityHeaders(headers: Headers, config?: SecurityHeadersConfig): void {
  const securityHeaders = getSecurityHeaders(config)

  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value)
  })
}
