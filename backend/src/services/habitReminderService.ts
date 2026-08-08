import { prisma } from '../config/db.js'
import { logger } from '../config/logger.js'
import { zonedTimeToUtc, ymdInTz } from '../utils/datetime.js'

// Small rolling horizon — the scheduler runs every minute, so today + the next
// couple of days is plenty and keeps reminders fresh without a big backlog.
const HORIZON_DAYS = 2
const DAY_MS = 86_400_000

/**
 * Keep a reminder queued for each timed habit at its time of day, so the user
 * is alerted (with the audible alarm) when it's time to practice it. DAILY
 * habits fire every day; WEEKLY habits fire on the weekday they were created.
 * Today's reminder is skipped once the habit is checked in for the day.
 */
export async function generateHabitReminders(): Promise<void> {
  const habits = await prisma.habit.findMany({ where: { NOT: { timeOfDay: null } } })
  if (habits.length === 0) return

  const now = Date.now()
  const userTz = new Map<string, string>()

  for (const habit of habits) {
    try {
      if (!habit.timeOfDay) continue
      if (!userTz.has(habit.userId)) {
        const u = await prisma.user.findUnique({
          where: { id: habit.userId },
          select: { timezone: true },
        })
        userTz.set(habit.userId, u?.timezone ?? 'UTC')
      }
      const tz = userTz.get(habit.userId)!
      const [hh, mm] = habit.timeOfDay.split(':').map(Number)

      const today = ymdInTz(new Date(), tz)
      const todayMs = Date.UTC(today.year, today.month - 1, today.day)
      const createdWeekday = new Date(
        Date.UTC(
          ymdInTz(habit.createdAt, tz).year,
          ymdInTz(habit.createdAt, tz).month - 1,
          ymdInTz(habit.createdAt, tz).day,
        ),
      ).getUTCDay()

      for (let i = 0; i <= HORIZON_DAYS; i++) {
        const dayMs = todayMs + i * DAY_MS
        const day = new Date(dayMs)
        if (habit.frequency === 'WEEKLY' && day.getUTCDay() !== createdWeekday) continue

        const remindAt = zonedTimeToUtc(
          day.getUTCFullYear(),
          day.getUTCMonth() + 1,
          day.getUTCDate(),
          hh,
          mm,
          tz,
        )
        if (remindAt.getTime() <= now) continue

        // Skip today if already checked in for the current day.
        if (i === 0) {
          const dayStart = new Date(dayMs)
          const dayEnd = new Date(dayMs + DAY_MS)
          const done = await prisma.habitCheckin.findFirst({
            where: { habitId: habit.id, date: { gte: dayStart, lt: dayEnd } },
          })
          if (done) continue
        }

        const existing = await prisma.reminder.findFirst({
          where: { entityType: 'habit', entityId: habit.id, remindAt },
          select: { id: true },
        })
        if (existing) continue

        await prisma.reminder.create({
          data: {
            userId: habit.userId,
            entityType: 'habit',
            entityId: habit.id,
            remindAt,
            offsetLabel: 'At time',
            message: `It's time for "${habit.title}" — keep your streak going.`,
          },
        })
      }
    } catch (err) {
      logger.error({ err, habitId: habit.id }, 'Habit reminder generation failed')
    }
  }
}
