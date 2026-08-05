import { z } from 'zod'

// Reminders can be attached to any of these entities — see Notifications.md.
export const ReminderEntityType = ['task', 'event', 'habit', 'goal'] as const
export type ReminderEntityType = (typeof ReminderEntityType)[number]

export const createReminderSchema = z.object({
  entityType: z.enum(ReminderEntityType),
  entityId: z.string().uuid(),
  remindAt: z.coerce.date(),
  message: z.string().max(200).optional(),
})
export type CreateReminderInput = z.infer<typeof createReminderSchema>

export const listRemindersQuerySchema = z.object({
  entityType: z.enum(ReminderEntityType).optional(),
  entityId: z.string().uuid().optional(),
})
export type ListRemindersQuery = z.infer<typeof listRemindersQuerySchema>

export interface Reminder {
  id: string
  userId: string
  entityType: ReminderEntityType
  entityId: string
  remindAt: string
  message: string | null
  sentAt: string | null
  createdAt: string
}
