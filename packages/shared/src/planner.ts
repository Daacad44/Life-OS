import { z } from 'zod'
import type { Task } from './task.js'

// YYYY-MM-DD — see docs/.../02-PRD/Daily Planner.md, Section 9.
export const plannerDateParamSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
})

export const reorderSchema = z.object({
  taskIds: z.array(z.string().uuid()).min(1),
})

export type ReorderInput = z.infer<typeof reorderSchema>

export interface PlannerResponse {
  date: string
  overdue: Task[]
  tasks: Task[]
}
