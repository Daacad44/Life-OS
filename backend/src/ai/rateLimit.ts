import { redis } from '../config/redis.js'
import { ApiError } from '../middleware/errorHandler.js'

// Per-user, per-feature limits — see AI Architecture.md Section 7 (Token & Cost Management).
const LIMITS: Record<string, { max: number; windowSeconds: number }> = {
  coach: { max: 30, windowSeconds: 60 * 60 },
  memory_extract: { max: 60, windowSeconds: 60 * 60 },
  goal_breakdown: { max: 10, windowSeconds: 60 * 60 },
  habit_insight: { max: 20, windowSeconds: 60 * 60 },
  reflection: { max: 10, windowSeconds: 24 * 60 * 60 },
  search: { max: 60, windowSeconds: 60 * 60 },
  weekly_review: { max: 10, windowSeconds: 24 * 60 * 60 },
  analytics_insight: { max: 20, windowSeconds: 60 * 60 },
  health_insight: { max: 20, windowSeconds: 60 * 60 },
}

export async function enforceRateLimit(userId: string, feature: string): Promise<void> {
  const limit = LIMITS[feature]
  if (!limit) return

  const key = `ai:ratelimit:${feature}:${userId}`
  const count = await redis.incr(key)
  if (count === 1) {
    await redis.expire(key, limit.windowSeconds)
  }
  if (count > limit.max) {
    throw new ApiError(
      429,
      'RATE_LIMITED',
      'You have hit the AI usage limit for this feature — try again later',
    )
  }
}
