import { z } from 'zod'

// AI Personal Coach — see docs/.../02-PRD/AI Coach.md
export const CoachRole = ['USER', 'ASSISTANT'] as const
export type CoachRole = (typeof CoachRole)[number]

export const sendCoachMessageSchema = z.object({
  message: z.string().min(1).max(4000),
})
export type SendCoachMessageInput = z.infer<typeof sendCoachMessageSchema>

export interface CoachMessage {
  id: string
  userId: string
  role: CoachRole
  content: string
  createdAt: string
}

// AI Reflection — see docs/.../02-PRD/Reflection.md
export const ReflectionPeriod = ['daily', 'weekly'] as const
export type ReflectionPeriod = (typeof ReflectionPeriod)[number]

export const reflectionPromptQuerySchema = z.object({
  period: z.enum(ReflectionPeriod).default('daily'),
})
export type ReflectionPromptQuery = z.infer<typeof reflectionPromptQuerySchema>

export const createReflectionSchema = z.object({
  period: z.enum(ReflectionPeriod),
  prompt: z.string().min(1).max(500),
  content: z.string().min(1).max(4000),
})
export type CreateReflectionInput = z.infer<typeof createReflectionSchema>

export interface Reflection {
  id: string
  userId: string
  period: string
  prompt: string
  content: string
  insights: string | null
  createdAt: string
}

// AI Goal Engine breakdown — see docs/.../02-PRD/Goal Engine.md
export interface GoalBreakdownResult {
  createdSubGoals: { id: string; title: string }[]
  createdTasks: { id: string; title: string }[]
  advice: string
}

// AI Habit System insight — see docs/.../02-PRD/Habit System.md
export interface HabitInsight {
  atRisk: boolean
  message: string
}
