/**
 * Minimal in-memory rate limiter for the /api/lead route.
 * LIMITATION: on serverless platforms (Vercel) each function instance has
 * its own memory, so this only throttles bursts hitting the same warm
 * instance - it is a basic abuse deterrent, not a hard guarantee. For
 * stricter protection at scale, swap this for a shared store such as
 * Upstash Redis (a few lines: see README "Hardening rate limiting").
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > MAX_REQUESTS_PER_WINDOW;
}
