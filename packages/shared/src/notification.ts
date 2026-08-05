import { z } from 'zod'

// Trigger categories currently wired up — see Notifications.md Section 6-7.
export const NotificationCategory = [
  'habitMilestones',
  'budgetThreshold',
  'weeklyReview',
  'automationRan',
  'reminders',
] as const
export type NotificationCategory = (typeof NotificationCategory)[number]

export type NotificationPreferences = Record<NotificationCategory, boolean>

export const updateNotificationPreferencesSchema = z.object({
  habitMilestones: z.boolean().optional(),
  budgetThreshold: z.boolean().optional(),
  weeklyReview: z.boolean().optional(),
  automationRan: z.boolean().optional(),
  reminders: z.boolean().optional(),
})
export type UpdateNotificationPreferencesInput = z.infer<
  typeof updateNotificationPreferencesSchema
>

export interface Notification {
  id: string
  userId: string
  title: string
  body: string
  read: boolean
  createdAt: string
}
