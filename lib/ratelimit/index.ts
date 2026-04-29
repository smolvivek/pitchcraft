/**
 * Distributed rate limiter backed by Vercel KV (Upstash Redis).
 *
 * Falls back gracefully to a no-op when KV env vars are absent (local dev
 * without KV provisioned). Set KV_REST_API_URL + KV_REST_API_TOKEN in
 * Vercel dashboard → Storage → KV → your database → .env.local.
 */

const KV_AVAILABLE =
  !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN

interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

/**
 * Sliding-window rate limiter using Redis INCR + EXPIRE.
 *
 * @param key      Unique key (e.g. `rl:pw:${ip}:${pitchId}`)
 * @param max      Max requests allowed in the window
 * @param windowMs Window duration in milliseconds
 */
export async function rateLimit(
  key: string,
  max: number,
  windowMs: number
): Promise<RateLimitResult> {
  if (!KV_AVAILABLE) {
    // Dev fallback: always allow
    return { allowed: true, remaining: max - 1, retryAfterSeconds: 0 }
  }

  const { kv } = await import('@vercel/kv')
  const windowSec = Math.ceil(windowMs / 1000)

  const current = await kv.incr(key)

  if (current === 1) {
    // First hit in this window — set TTL
    await kv.expire(key, windowSec)
  }

  if (current > max) {
    const ttl = await kv.ttl(key)
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: ttl > 0 ? ttl : windowSec,
    }
  }

  return {
    allowed: true,
    remaining: max - current,
    retryAfterSeconds: 0,
  }
}
