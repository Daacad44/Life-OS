import { z } from 'zod'
import type { Task } from './task.js'

// Validation rules from docs/.../02-PRD/Goal Engine.md, Section 9.
export const createGoalSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  startDate: z.coerce.date().optional(),
  targetDate: z.coerce.date().optional(),
})
export type CreateGoalInput = z.infer<typeof createGoalSchema>

export const updateGoalSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().nullable().optional(),
  startDate: z.coerce.date().nullable().optional(),
  targetDate: z.coerce.date().nullable().optional(),
})
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>

export const createSubGoalSchema = z.object({
  title: z.string().min(1).max(200),
  dueDate: z.coerce.date().nullable().optional(),
})
export type CreateSubGoalInput = z.infer<typeof createSubGoalSchema>

export const updateSubGoalSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  done: z.boolean().optional(),
  dueDate: z.coerce.date().nullable().optional(),
})
export type UpdateSubGoalInput = z.infer<typeof updateSubGoalSchema>

export interface SubGoal {
  id: string
  goalId: string
  title: string
  done: boolean
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface Goal {
  id: string
  userId: string
  title: string
  description: string | null
  progress: number
  startDate: string | null
  targetDate: string | null
  createdAt: string
  updatedAt: string
  subGoals: SubGoal[]
}

export interface GoalWithTasks extends Goal {
  tasks: Task[]
}
