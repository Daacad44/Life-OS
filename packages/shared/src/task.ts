import { z } from 'zod'
import { Priority, TaskStatus } from './enums.js'

// Validation rules from docs/.../02-PRD/Task Manager.md, Section 9.
// Used on both the API (server-side enforcement) and the web app (form validation).
export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  priority: z.enum(Priority).default('MEDIUM'),
  status: z.enum(TaskStatus).default('TODO'),
  dueDate: z.coerce.date().optional(),
  goalId: z.string().uuid().optional(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().nullable().optional(),
  priority: z.enum(Priority).optional(),
  status: z.enum(TaskStatus).optional(),
  dueDate: z.coerce.date().nullable().optional(),
  goalId: z.string().uuid().nullable().optional(),
})

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>

// Query params for GET /tasks — see docs/.../03-Architecture/API.md, Section 7.
export const listTasksQuerySchema = z.object({
  status: z.enum(TaskStatus).optional(),
  priority: z.enum(Priority).optional(),
  goalId: z.string().uuid().optional(),
  q: z.string().optional(),
  sort: z.enum(['dueDate', 'priority', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>

export interface Task {
  id: string
  userId: string
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  dueDate: string | null
  order: number
  goalId: string | null
  createdAt: string
  updatedAt: string
}
