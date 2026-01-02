/**
 * Rate Limiting Utilities
 * Simple in-memory rate limiting for Next.js
 */

interface RateLimitConfig {
  interval: number // Time window in ms
  maxRequests: number // Max requests per window
}

interface RateLimitStore {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitStore>()

/**
 * Check if request should be rate limited
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { interval: 60000, maxRequests: 60 },
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now()
  const { interval, maxRequests } = config

  const current = store.get(identifier)

  // No entry or expired window
  if (!current || now > current.resetTime) {
    store.set(identifier, {
      count: 1,
      resetTime: now + interval,
    })

    return {
      success: true,
      remaining: maxRequests - 1,
      reset: now + interval,
    }
  }

  // Within window
  if (current.count < maxRequests) {
    current.count++
    return {
      success: true,
      remaining: maxRequests - current.count,
      reset: current.resetTime,
    }
  }

  // Rate limited
  return {
    success: false,
    remaining: 0,
    reset: current.resetTime,
  }
}

/**
 * Clean up expired entries (call periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now()

  for (const [key, value] of store.entries()) {
    if (now > value.resetTime) {
      store.delete(key)
    }
  }
}

// Auto cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000)
}
