import { z } from 'zod'

// Validation rules from docs/.../02-PRD/Calendar.md, Section 9.
export const createEventSchema = z
  .object({
    title: z.string().min(1).max(200),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    allDay: z.boolean().default(false),
    taskId: z.string().uuid().optional(),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'startTime must be before endTime',
    path: ['endTime'],
  })
export type CreateEventInput = z.infer<typeof createEventSchema>

export const updateEventSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),
    allDay: z.boolean().optional(),
    taskId: z.string().uuid().nullable().optional(),
  })
  .refine((data) => !data.startTime || !data.endTime || data.startTime < data.endTime, {
    message: 'startTime must be before endTime',
    path: ['endTime'],
  })
export type UpdateEventInput = z.infer<typeof updateEventSchema>

// Date range query for GET /events — see docs/.../03-Architecture/API.md, Section 7.
export const listEventsQuerySchema = z.object({
  start: z.coerce.date(),
  end: z.coerce.date(),
})
export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>

export interface CalendarEvent {
  id: string
  userId: string
  title: string
  startTime: string
  endTime: string
  allDay: boolean
  taskId: string | null
  createdAt: string
  updatedAt: string
}
