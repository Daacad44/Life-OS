import type { CreateRecurringTaskInput, UpdateRecurringTaskInput } from '@life-os/shared'
import type { RecurringTask } from '@prisma/client'
import { prisma } from '../config/db.js'
import { logger } from '../config/logger.js'
import { ApiError } from '../middleware/errorHandler.js'
import { zonedTimeToUtc, ymdInTz } from '../utils/datetime.js'

// How far ahead occurrences are materialized. Re-run each scheduler tick keeps
// this window full without ever creating an unbounded backlog.
const WINDOW_DAYS = 14
const DAY_MS = 86_400_000

function midnightUtc(y: number, m: number, d: number): number {
  return Date.UTC(y, m - 1, d)
}

function offsetLabelFor(minutes: number): string {
  if (minutes === 0) return 'At time'
  if (minutes % 1440 === 0) return `${minutes / 1440} day before`
  if (minutes % 60 === 0) return `${minutes / 60} hour before`
  return `${minutes} min before`
}

// Does a given calendar day (UTC-midnight ms) satisfy the template's rule?
function dayMatches(template: RecurringTask, dayMs: number, startMs: number): boolean {
  if (dayMs < startMs) return false
  const dayDiff = Math.round((dayMs - startMs) / DAY_MS)
  switch (template.freq) {
    case 'DAILY':
      return dayDiff % template.interval === 0
    case 'WEEKLY': {
      const weekday = new Date(dayMs).getUTCDay()
      const days = template.byWeekday.length
        ? template.byWeekday
        : [new Date(startMs).getUTCDay()]
      if (!days.includes(weekday)) return false
      const weekDiff = Math.floor(dayDiff / 7)
      return weekDiff % template.interval === 0
    }
    case 'MONTHLY': {
      const start = new Date(startMs)
      const day = new Date(dayMs)
      if (day.getUTCDate() !== start.getUTCDate()) return false
      const monthDiff =
        (day.getUTCFullYear() - start.getUTCFullYear()) * 12 +
        (day.getUTCMonth() - start.getUTCMonth())
      return monthDiff >= 0 && monthDiff % template.interval === 0
    }
    default:
      return false
  }
}

/**
 * Materialize concrete Task occurrences (and their reminders) for one template,
 * for every matching day in the rolling window that doesn't already exist.
 * Idempotent — safe to call repeatedly.
 */
export async function generateForTemplate(template: RecurringTask): Promise<number> {
  if (!template.active) return 0
  const user = await prisma.user.findUnique({
    where: { id: template.userId },
    select: { timezone: true },
  })
  const tz = user?.timezone ?? 'UTC'
  const [hh, mm] = template.timeOfDay.split(':').map(Number)

  const startYmd = ymdInTz(template.startDate, tz)
  const startMs = midnightUtc(startYmd.year, startYmd.month, startYmd.day)

  const todayYmd = ymdInTz(new Date(), tz)
  const todayMs = midnightUtc(todayYmd.year, todayYmd.month, todayYmd.day)

  // Resume after the last generated day, but never backfill before today.
  let cursorMs = Math.max(startMs, todayMs)
  if (template.lastGeneratedFor) {
    const lg = ymdInTz(template.lastGeneratedFor, tz)
    cursorMs = Math.max(cursorMs, midnightUtc(lg.year, lg.month, lg.day) + DAY_MS)
  }

  let endMs = todayMs + WINDOW_DAYS * DAY_MS
  if (template.endDate) {
    const e = ymdInTz(template.endDate, tz)
    endMs = Math.min(endMs, midnightUtc(e.year, e.month, e.day))
  }

  let created = 0
  const now = Date.now()
  for (let dayMs = cursorMs; dayMs <= endMs; dayMs += DAY_MS) {
    if (!dayMatches(template, dayMs, startMs)) continue
    const day = new Date(dayMs)
    const dueDate = zonedTimeToUtc(
      day.getUTCFullYear(),
      day.getUTCMonth() + 1,
      day.getUTCDate(),
      hh,
      mm,
      tz,
    )
    const existing = await prisma.task.findFirst({
      where: { recurringTaskId: template.id, dueDate, deletedAt: null },
      select: { id: true },
    })
    if (existing) continue

    const task = await prisma.task.create({
      data: {
        userId: template.userId,
        title: template.title,
        description: template.description,
        priority: template.priority,
        tags: template.tags,
        goalId: template.goalId,
        dueDate,
        recurringTaskId: template.id,
      },
    })
    created++

    if (template.reminderMinutesBefore != null) {
      const remindAt = new Date(
        dueDate.getTime() - template.reminderMinutesBefore * 60_000,
      )
      if (remindAt.getTime() > now) {
        await prisma.reminder.create({
          data: {
            userId: template.userId,
            entityType: 'task',
            entityId: task.id,
            remindAt,
            offsetLabel: offsetLabelFor(template.reminderMinutesBefore),
          },
        })
      }
    }
  }

  await prisma.recurringTask.update({
    where: { id: template.id },
    data: { lastGeneratedFor: new Date(endMs) },
  })
  return created
}

/** Called from the scheduler each tick — top up occurrences for all templates. */
export async function generateDueOccurrences(): Promise<void> {
  const templates = await prisma.recurringTask.findMany({ where: { active: true } })
  for (const template of templates) {
    try {
      await generateForTemplate(template)
    } catch (err) {
      logger.error({ err, templateId: template.id }, 'Recurring generation failed')
    }
  }
}

// --- CRUD -------------------------------------------------------------------

export function listForUser(userId: string) {
  return prisma.recurringTask.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function create(userId: string, input: CreateRecurringTaskInput) {
  if (input.goalId) {
    const goal = await prisma.goal.findFirst({ where: { id: input.goalId, userId } })
    if (!goal)
      throw new ApiError(400, 'VALIDATION_ERROR', 'goalId does not belong to user')
  }
  if (input.freq === 'WEEKLY' && (!input.byWeekday || input.byWeekday.length === 0)) {
    throw new ApiError(
      400,
      'VALIDATION_ERROR',
      'Weekly recurrence needs at least one weekday',
    )
  }
  const template = await prisma.recurringTask.create({
    data: {
      userId,
      title: input.title,
      description: input.description ?? null,
      priority: input.priority,
      tags: input.tags ?? [],
      goalId: input.goalId ?? null,
      freq: input.freq,
      interval: input.interval,
      byWeekday: input.byWeekday ?? [],
      timeOfDay: input.timeOfDay,
      reminderMinutesBefore: input.reminderMinutesBefore ?? null,
      startDate: input.startDate,
      endDate: input.endDate ?? null,
    },
  })
  // Populate the first occurrences right away so the user sees them.
  await generateForTemplate(template)
  return template
}

export async function update(
  userId: string,
  id: string,
  input: UpdateRecurringTaskInput,
) {
  const existing = await prisma.recurringTask.findFirst({ where: { id, userId } })
  if (!existing) throw new ApiError(404, 'NOT_FOUND', 'Recurring task not found')
  const template = await prisma.recurringTask.update({
    where: { id },
    data: {
      ...input,
      description: input.description === undefined ? undefined : input.description,
    },
  })
  if (template.active) await generateForTemplate(template)
  return template
}

export async function remove(userId: string, id: string) {
  const existing = await prisma.recurringTask.findFirst({ where: { id, userId } })
  if (!existing) throw new ApiError(404, 'NOT_FOUND', 'Recurring task not found')
  // Keep already-generated task occurrences; just stop making new ones.
  await prisma.recurringTask.delete({ where: { id } })
}
