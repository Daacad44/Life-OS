import { z } from 'zod'

export const HealthMetricType = ['SLEEP', 'WATER', 'EXERCISE', 'MOOD', 'WEIGHT'] as const
export type HealthMetricType = (typeof HealthMetricType)[number]

export const createHealthLogSchema = z.object({
  type: z.enum(HealthMetricType),
  value: z.number().min(0).max(1000),
  date: z.coerce.date(),
})
export type CreateHealthLogInput = z.infer<typeof createHealthLogSchema>

export const healthTrendsQuerySchema = z.object({
  range: z.enum(['week', 'month']).default('week'),
})
export type HealthTrendsQuery = z.infer<typeof healthTrendsQuerySchema>

export interface HealthLog {
  id: string
  userId: string
  type: HealthMetricType
  value: number
  date: string
  createdAt: string
}

export interface HealthTrendPoint {
  date: string
  value: number
}

export interface HealthTrend {
  type: HealthMetricType
  points: HealthTrendPoint[]
}

export interface HealthTrendsResponse {
  trends: HealthTrend[]
  insights: string[]
}
