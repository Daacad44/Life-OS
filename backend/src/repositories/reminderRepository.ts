import type { CreateReminderInput, ListRemindersQuery } from '@life-os/shared'
import { prisma } from '../config/db.js'

export function listReminders(userId: string, query: ListRemindersQuery = {}) {
  return prisma.reminder.findMany({
    where: {
      userId,
      ...(query.entityType ? { entityType: query.entityType } : {}),
      ...(query.entityId ? { entityId: query.entityId } : {}),
    },
    orderBy: { remindAt: 'asc' },
  })
}

export function findById(userId: string, id: string) {
  return prisma.reminder.findFirst({ where: { id, userId } })
}

export function create(userId: string, input: CreateReminderInput) {
  return prisma.reminder.create({
    data: {
      userId,
      entityType: input.entityType,
      entityId: input.entityId,
      remindAt: input.remindAt,
      message: input.message ?? null,
    },
  })
}

export function deleteById(id: string) {
  return prisma.reminder.delete({ where: { id } })
}

export function deleteForEntity(userId: string, entityType: string, entityId: string) {
  return prisma.reminder.deleteMany({ where: { userId, entityType, entityId } })
}

/** Undelivered reminders whose time has arrived, oldest first. */
export function findDue(now: Date, limit = 100) {
  return prisma.reminder.findMany({
    where: { sentAt: null, remindAt: { lte: now } },
    orderBy: { remindAt: 'asc' },
    take: limit,
  })
}

export function markSent(id: string, sentAt: Date) {
  return prisma.reminder.update({ where: { id }, data: { sentAt } })
}
