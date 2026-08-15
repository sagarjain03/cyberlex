import "server-only";

import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from "@/lib/ai/config";

/**
 * Fixed-window per-IP limiter.
 *
 * ⚠️ **In-memory, therefore per-instance.** On a multi-instance deployment the
 * effective limit is `RATE_LIMIT_MAX × instances`. This is a rough-abuse brake,
 * not a security control, and is an accepted v1 limitation — swap for a shared
 * store (Upstash/Redis) before this matters. docs/rules.md §4.2.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

/** Bound the map so a spray of spoofed IPs cannot grow it without limit. */
const MAX_TRACKED_IPS = 10_000;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();

  // Opportunistic sweep — cheap, and avoids a background timer that would keep
  // a serverless instance alive.
  if (buckets.size > MAX_TRACKED_IPS) {
    for (const [key, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(key);
    }
    // Still oversized after sweeping: drop everything rather than leak.
    if (buckets.size > MAX_TRACKED_IPS) buckets.clear();
  }

  const bucket = buckets.get(ip);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX - 1,
      retryAfterSeconds: 0,
    };
  }

  if (bucket.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - bucket.count,
    retryAfterSeconds: 0,
  };
}

/**
 * Best-effort client identity.
 *
 * Trusting `x-forwarded-for` is only safe behind a proxy that overwrites it —
 * which is the deployment assumption here. It is not an authentication signal
 * and is used solely for coarse throttling.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}
