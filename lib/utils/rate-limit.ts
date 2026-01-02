// Simple in-memory rate limiting for API routes
// For production, consider using Redis or a dedicated rate limiting service

interface RateLimitEntry {
  count: number
  resetTime: number
}

// Store rate limit data in memory
// Key format: "ip:endpoint" or "identifier:endpoint"
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  // Maximum number of requests allowed in the time window
  maxRequests: number
  // Time window in milliseconds
  windowMs: number
  // Unique identifier (IP address, user ID, etc.)
  identifier: string
  // Endpoint being rate limited
  endpoint: string
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: Date
}

/**
 * Check if a request should be rate limited
 * @returns RateLimitResult indicating if the request is allowed
 */
export function rateLimit(config: RateLimitConfig): RateLimitResult {
  const { maxRequests, windowMs, identifier, endpoint } = config
  const key = `${identifier}:${endpoint}`
  const now = Date.now()

  // Get or create rate limit entry
  let entry = rateLimitStore.get(key)

  // If entry doesn't exist or has expired, create a new one
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    }
    rateLimitStore.set(key, entry)
  }

  // Increment request count
  entry.count++

  // Calculate remaining requests
  const remaining = Math.max(0, maxRequests - entry.count)

  // Check if limit exceeded
  const success = entry.count <= maxRequests

  return {
    success,
    limit: maxRequests,
    remaining,
    reset: new Date(entry.resetTime),
  }
}

/**
 * Get client IP address from request headers
 */
export function getClientIp(request: Request): string {
  // Try various headers that might contain the real IP
  const headers = request.headers

  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  const cfConnectingIp = headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // Fallback to a generic identifier
  return 'unknown'
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  // For contact/inquiry forms: 5 requests per 15 minutes
  contactForm: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // For general API endpoints: 30 requests per minute
  api: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
  },
  // For auth endpoints: 5 requests per 15 minutes
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // For search/browse: 60 requests per minute
  search: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
  },
}
