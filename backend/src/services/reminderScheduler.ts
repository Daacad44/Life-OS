import type { ReminderEntityType } from '@life-os/shared'
import { prisma } from '../config/db.js'
import { logger } from '../config/logger.js'
import * as reminderRepo from '../repositories/reminderRepository.js'
import { notify } from './notificationService.js'

const INTERVAL_MS = 60_000

interface EntityStatus {
  exists: boolean
  title: string | null
  done: boolean
}

// Look up the reminder's target so we can (a) name it in the notification and
// (b) drop the reminder if the item was completed or deleted.
async function entityStatus(
  entityType: ReminderEntityType,
  entityId: string,
  userId: string,
): Promise<EntityStatus> {
  const where = { id: entityId, userId }
  switch (entityType) {
    case 'task': {
      const t = await prisma.task.findFirst({ where })
      return { exists: !!t, title: t?.title ?? null, done: t?.status === 'DONE' }
    }
    case 'event': {
      const e = await prisma.calendarEvent.findFirst({ where })
      return { exists: !!e, title: e?.title ?? null, done: false }
    }
    case 'habit': {
      const h = await prisma.habit.findFirst({ where })
      return { exists: !!h, title: h?.title ?? null, done: false }
    }
    case 'goal': {
      const g = await prisma.goal.findFirst({ where })
      return { exists: !!g, title: g?.title ?? null, done: (g?.progress ?? 0) >= 100 }
    }
  }
}

// Quiet hours as an hour-of-day window in the user's timezone; may wrap midnight.
function inQuietHours(hour: number, start: number | null, end: number | null): boolean {
  if (start == null || end == null || start === end) return false
  return start < end ? hour >= start && hour < end : hour >= start || hour < end
}

function currentHour(timezone: string): number {
  return Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      hourCycle: 'h23',
    }).format(new Date()),
  )
}

type UserQuiet = {
  timezone: string
  quietHoursStart: number | null
  quietHoursEnd: number | null
} | null

async function tick() {
  const due = await reminderRepo.findDue(new Date())
  if (due.length === 0) return

  const userCache = new Map<string, UserQuiet>()

  for (const reminder of due) {
    try {
      const status = await entityStatus(
        reminder.entityType as ReminderEntityType,
        reminder.entityId,
        reminder.userId,
      )
      // The item was completed or deleted — clear the reminder, don't deliver.
      if (!status.exists || status.done) {
        await reminderRepo.deleteById(reminder.id)
        continue
      }

      if (!userCache.has(reminder.userId)) {
        userCache.set(
          reminder.userId,
          await prisma.user.findUnique({
            where: { id: reminder.userId },
            select: { timezone: true, quietHoursStart: true, quietHoursEnd: true },
          }),
        )
      }
      const user = userCache.get(reminder.userId)
      if (
        user &&
        inQuietHours(currentHour(user.timezone), user.quietHoursStart, user.quietHoursEnd)
      ) {
        // Defer until quiet hours end — leave sentAt null for the next tick.
        continue
      }

      const body = reminder.message || status.title || 'You have a reminder'
      // notify() respects the user's "reminders" preference and never throws.
      await notify(reminder.userId, 'reminders', 'Reminder', body)
      await reminderRepo.markSent(reminder.id, new Date())
    } catch (err) {
      logger.error({ err, reminderId: reminder.id }, 'Reminder delivery failed')
    }
  }
}

let timer: ReturnType<typeof setInterval> | null = null

/** Start the in-process reminder worker. Idempotent. */
export function startReminderScheduler() {
  if (timer) return
  timer = setInterval(() => {
    tick().catch((err) => logger.error({ err }, 'Reminder tick failed'))
  }, INTERVAL_MS)
  logger.info('Reminder scheduler started')
}
