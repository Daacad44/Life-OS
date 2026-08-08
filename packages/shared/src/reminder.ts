import { z } from 'zod'

// Reminders can be attached to any of these entities — see Notifications.md.
export const ReminderEntityType = ['task', 'event', 'habit', 'goal', 'subgoal'] as const
export type ReminderEntityType = (typeof ReminderEntityType)[number]

export const createReminderSchema = z.object({
  entityType: z.enum(ReminderEntityType),
  entityId: z.string().uuid(),
  remindAt: z.coerce.date(),
  message: z.string().max(200).optional(),
  offsetLabel: z.string().max(40).optional(),
})
export type CreateReminderInput = z.infer<typeof createReminderSchema>

export const listRemindersQuerySchema = z.object({
  entityType: z.enum(ReminderEntityType).optional(),
  entityId: z.string().uuid().optional(),
})
export type ListRemindersQuery = z.infer<typeof listRemindersQuerySchema>

// Snooze pushes the reminder forward by N minutes and re-arms it.
export const snoozeReminderSchema = z.object({
  minutes: z.number().int().min(1).max(1440).default(10),
})
export type SnoozeReminderInput = z.infer<typeof snoozeReminderSchema>

export interface Reminder {
  id: string
  userId: string
  entityType: ReminderEntityType
  entityId: string
  remindAt: string
  message: string | null
  offsetLabel: string | null
  sentAt: string | null
  acknowledgedAt: string | null
  createdAt: string
}

// A reminder that has fired but not yet been dismissed by the user — the client
// polls these, plays the audible alarm, and shows the dismiss/snooze alert.
export interface PendingAlarm {
  id: string
  entityType: ReminderEntityType
  entityId: string
  remindAt: string
  message: string | null
  offsetLabel: string | null
  /** Resolved title of the target item, for the alert copy. */
  entityTitle: string
}

// Selectable alarm chimes (synthesized client-side — no binary asset needed).
export const AlarmSound = ['chime', 'bell', 'digital', 'pulse', 'marimba'] as const
export type AlarmSound = (typeof AlarmSound)[number]
