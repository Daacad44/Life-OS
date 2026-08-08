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
      offsetLabel: input.offsetLabel ?? null,
    },
  })
}

export function deleteById(id: string) {
  return prisma.reminder.delete({ where: { id } })
}

export function deleteForEntity(userId: string, entityType: string, entityId: string) {
  return prisma.reminder.deleteMany({ where: { userId, entityType, entityId } })
}

/** Reminders that have fired but the user hasn't dismissed yet, oldest first. */
export function findPendingAlarms(userId: string, limit = 20) {
  return prisma.reminder.findMany({
    where: { userId, sentAt: { not: null }, acknowledgedAt: null },
    orderBy: { remindAt: 'asc' },
    take: limit,
  })
}

/** Mark a fired reminder as dismissed so it stops surfacing as an alarm. */
export function acknowledge(id: string, at: Date) {
  return prisma.reminder.update({ where: { id }, data: { acknowledgedAt: at } })
}

/** Re-arm a reminder for a later time (snooze): clears sent/ack, pushes remindAt. */
export function snooze(id: string, remindAt: Date) {
  return prisma.reminder.update({
    where: { id },
    data: { remindAt, sentAt: null, acknowledgedAt: null },
  })
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
