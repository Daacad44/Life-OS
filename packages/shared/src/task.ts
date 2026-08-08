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
  tags: z.array(z.string().min(1).max(30)).max(20).optional(),
  goalId: z.string().uuid().optional(),
  // A task linked to a Project is a business task — see Business Workspace.md.
  projectId: z.string().uuid().optional(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().nullable().optional(),
  priority: z.enum(Priority).optional(),
  status: z.enum(TaskStatus).optional(),
  dueDate: z.coerce.date().nullable().optional(),
  tags: z.array(z.string().min(1).max(30)).max(20).optional(),
  goalId: z.string().uuid().nullable().optional(),
  projectId: z.string().uuid().nullable().optional(),
})

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>

// Query params for GET /tasks — see docs/.../03-Architecture/API.md, Section 7.
export const listTasksQuerySchema = z.object({
  status: z.enum(TaskStatus).optional(),
  priority: z.enum(Priority).optional(),
  goalId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  q: z.string().optional(),
  sort: z.enum(['dueDate', 'priority', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>

export interface Subtask {
  id: string
  taskId: string
  title: string
  done: boolean
  order: number
}

export interface Task {
  id: string
  userId: string
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  dueDate: string | null
  tags: string[]
  order: number
  goalId: string | null
  projectId: string | null
  recurringTaskId: string | null
  createdAt: string
  updatedAt: string
  subtasks?: Subtask[]
}

// --- Subtasks ---------------------------------------------------------------

export const createSubtaskSchema = z.object({
  title: z.string().min(1).max(200),
})
export type CreateSubtaskInput = z.infer<typeof createSubtaskSchema>

export const updateSubtaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  done: z.boolean().optional(),
})
export type UpdateSubtaskInput = z.infer<typeof updateSubtaskSchema>

// --- Recurring tasks --------------------------------------------------------

export const RecurrenceFreq = ['DAILY', 'WEEKLY', 'MONTHLY'] as const
export type RecurrenceFreq = (typeof RecurrenceFreq)[number]

export const createRecurringTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  priority: z.enum(Priority).default('MEDIUM'),
  tags: z.array(z.string().min(1).max(30)).max(20).optional(),
  goalId: z.string().uuid().optional(),
  freq: z.enum(RecurrenceFreq),
  interval: z.number().int().min(1).max(52).default(1),
  // 0=Sunday .. 6=Saturday — required (non-empty) for WEEKLY.
  byWeekday: z.array(z.number().int().min(0).max(6)).max(7).optional(),
  // "HH:mm" wall-clock time of day in the user's timezone.
  timeOfDay: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'timeOfDay must be HH:mm'),
  reminderMinutesBefore: z.number().int().min(0).max(10080).nullable().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
})
export type CreateRecurringTaskInput = z.infer<typeof createRecurringTaskSchema>

export const updateRecurringTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().nullable().optional(),
  priority: z.enum(Priority).optional(),
  tags: z.array(z.string().min(1).max(30)).max(20).optional(),
  freq: z.enum(RecurrenceFreq).optional(),
  interval: z.number().int().min(1).max(52).optional(),
  byWeekday: z.array(z.number().int().min(0).max(6)).max(7).optional(),
  timeOfDay: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'timeOfDay must be HH:mm')
    .optional(),
  reminderMinutesBefore: z.number().int().min(0).max(10080).nullable().optional(),
  endDate: z.coerce.date().nullable().optional(),
  active: z.boolean().optional(),
})
export type UpdateRecurringTaskInput = z.infer<typeof updateRecurringTaskSchema>

export interface RecurringTask {
  id: string
  userId: string
  title: string
  description: string | null
  priority: Priority
  tags: string[]
  goalId: string | null
  freq: RecurrenceFreq
  interval: number
  byWeekday: number[]
  timeOfDay: string
  reminderMinutesBefore: number | null
  startDate: string
  endDate: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}
