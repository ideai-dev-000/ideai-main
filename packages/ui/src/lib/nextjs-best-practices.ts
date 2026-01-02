/**
 * @fileoverview Next.js 16 Best Practices - Performance, Security, 2027-Facing
 * 
 * @module NextJSBestPractices
 * @description
 * Utilities and patterns for Next.js 16 best practices:
 * - Performance optimizations
 * - Security headers
 * - 2027-facing features
 * - SEO enhancements
 * 
 * @example
 * ```tsx
 * import { getSecurityHeaders, getPerformanceConfig } from "@repo/ui/lib/nextjs-best-practices";
 * 
 * export const headers = getSecurityHeaders();
 * export const config = getPerformanceConfig();
 * ```
 */

import type { NextRequest } from "next/server";

/**
 * Security Headers for Next.js 16
 * Implements 2027 security best practices
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    // Content Security Policy
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval in dev
      "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'self'",
    ].join("; "),
    
    // XSS Protection
    "X-XSS-Protection": "1; mode=block",
    
    // Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",
    
    // Clickjacking protection
    "X-Frame-Options": "SAMEORIGIN",
    
    // Referrer policy
    "Referrer-Policy": "strict-origin-when-cross-origin",
    
    // Permissions policy (2027 standard)
    "Permissions-Policy": [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()", // FLoC opt-out
    ].join(", "),
    
    // Strict Transport Security (HTTPS only)
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  };
}

/**
 * Performance Configuration
 * Next.js 16 performance optimizations
 */
export function getPerformanceConfig() {
  return {
    // Enable React Server Components
    experimental: {
      // Optimize for 2027
      optimizePackageImports: ["@repo/ui", "lucide-react"],
      // Enable partial prerendering
      ppr: true,
    },
  };
}

/**
 * SEO Metadata Helper
 * Generates comprehensive SEO metadata
 */
export function getSEOMetadata({
  title,
  description,
  keywords,
  image,
  url,
}: {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
}) {
  return {
    title,
    description,
    keywords: keywords?.join(", "),
    openGraph: {
      title,
      description,
      url,
      images: image ? [{ url: image }] : [],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * Request Middleware Helper
 * Adds security headers to requests
 */
export function middleware(_request: NextRequest) {
  const headers = new Headers();
  
  // Add security headers
  Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
    headers.set(key, value);
  });
  
  return {
    headers,
  };
}

/**
 * Resource Hints Helper
 * Generates resource hints for performance
 */
export function getResourceHints() {
  return {
    preconnect: [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
    ],
    dnsPrefetch: [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
    ],
  };
}

