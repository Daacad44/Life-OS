import { Redis } from 'ioredis'
import { env } from './env.js'
import { logger } from './logger.js'

// Single shared Redis client — sessions, cache, rate limits (see Security.md).
export const redis = new Redis(env.REDIS_URL ?? 'redis://localhost:6379', {
  lazyConnect: true,
  maxRetriesPerRequest: 2,
})

redis.on('error', (err: Error) => {
  logger.error({ err }, 'Redis connection error')
})
