import type {
  NotificationCategory,
  NotificationPreferences,
  UpdateNotificationPreferencesInput,
} from '@life-os/shared'
import { prisma } from '../config/db.js'
import { ApiError } from '../middleware/errorHandler.js'
import * as notificationRepo from '../repositories/notificationRepository.js'
import { logger } from '../config/logger.js'

const DEFAULT_PREFERENCES: NotificationPreferences = {
  habitMilestones: true,
  budgetThreshold: true,
  weeklyReview: true,
  automationRan: true,
  reminders: true,
}

export function listForUser(userId: string) {
  return notificationRepo.listNotifications(userId)
}

export async function markRead(userId: string, id: string) {
  const existing = await notificationRepo.findById(userId, id)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Notification not found')
  }
  return notificationRepo.markRead(id)
}

export function markAllRead(userId: string) {
  return notificationRepo.markAllRead(userId)
}

export async function getPreferences(userId: string): Promise<NotificationPreferences> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { notificationPreferences: true },
  })
  return {
    ...DEFAULT_PREFERENCES,
    ...((user.notificationPreferences as Partial<NotificationPreferences> | null) ?? {}),
  }
}

export async function updatePreferences(
  userId: string,
  input: UpdateNotificationPreferencesInput,
): Promise<NotificationPreferences> {
  const current = await getPreferences(userId)
  const updated = { ...current, ...input }
  await prisma.user.update({
    where: { id: userId },
    data: { notificationPreferences: updated },
  })
  return updated
}

// Called by other feature services after something notification-worthy happens.
// Respects preferences (quiet-hours/opt-out — see Notifications.md Section 9) and
// never throws, since a failed notification must not break the triggering action.
export async function notify(
  userId: string,
  category: NotificationCategory,
  title: string,
  body: string,
) {
  try {
    const prefs = await getPreferences(userId)
    if (!prefs[category]) return
    await notificationRepo.create(userId, title, body)
  } catch (err) {
    logger.error({ err }, 'Notification creation failed')
  }
}
