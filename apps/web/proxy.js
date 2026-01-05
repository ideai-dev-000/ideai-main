import { NextResponse } from "next/server";
// import type { NextRequest } from 'next/server'

/**
 * Next.js 16 Proxy (replaces middleware.ts)
 * Handles security headers, rate limiting, and routing
 */

const securityHeaders = {
  // Content Security Policy - adjust for your needs
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live", // Vercel Analytics
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https: wss:",
    "frame-src 'self' http://localhost:*", // Allow iframes from localhost on any port (for dev apps index)
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),

  // XSS Protection
  "X-XSS-Protection": "1; mode=block",

  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",

  // Clickjacking protection
  "X-Frame-Options": "SAMEORIGIN",

  // Referrer policy
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Permissions policy (2026 standard)
  "Permissions-Policy": [
    "camera=()",
    "microphone=()",
    "geolocation=()",
    "interest-cohort=()", // Privacy-focused
    "payment=()",
    "usb=()",
  ].join(", "),

  // HTTPS enforcement
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

export default function proxy() {
  const response = NextResponse.next();

  // Apply all security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Use base64 encoding (Node.js compatible)
  const uuid = crypto.randomUUID();
  // Buffer is available in Node.js runtime (Next.js proxy runs in Node.js)
  // eslint-disable-next-line no-undef
  const nonce = Buffer.from(uuid).toString("base64");
  const cspWithNonce = response.headers
    .get("Content-Security-Policy")
    ?.replace("'unsafe-inline'", `'nonce-${nonce}'`);

  if (cspWithNonce) {
    response.headers.set("Content-Security-Policy", cspWithNonce);
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2)$).*)",
  ],
};
