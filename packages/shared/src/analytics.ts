import { z } from 'zod'

export const AnalyticsRange = ['week', 'month', 'year'] as const
export type AnalyticsRange = (typeof AnalyticsRange)[number]

export const analyticsRangeQuerySchema = z.object({
  range: z.enum(AnalyticsRange).default('week'),
})
export type AnalyticsRangeQuery = z.infer<typeof analyticsRangeQuerySchema>

export interface AnalyticsOverview {
  range: AnalyticsRange
  tasksCompleted: number
  tasksCreated: number
  taskCompletionRate: number
  habits: { title: string; checkins: number; expected: number }[]
  goals: { title: string; progress: number }[]
  notesCreated: number
  focusMinutes: number
  focusSessions: number
  reflectionsLogged: number
}

export interface AnalyticsInsights {
  insights: string[]
}
