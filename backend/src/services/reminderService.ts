import type {
  CreateReminderInput,
  ListRemindersQuery,
  ReminderEntityType,
} from '@life-os/shared'
import { prisma } from '../config/db.js'
import { ApiError } from '../middleware/errorHandler.js'
import * as reminderRepo from '../repositories/reminderRepository.js'

// Confirm the target entity exists and belongs to the user before attaching a
// reminder to it — reminders are always user-scoped through their entity.
async function assertEntityOwned(
  userId: string,
  entityType: ReminderEntityType,
  entityId: string,
) {
  const where = { id: entityId, userId }
  let found: unknown
  switch (entityType) {
    case 'task':
      found = await prisma.task.findFirst({ where })
      break
    case 'event':
      found = await prisma.calendarEvent.findFirst({ where })
      break
    case 'habit':
      found = await prisma.habit.findFirst({ where })
      break
    case 'goal':
      found = await prisma.goal.findFirst({ where })
      break
  }
  if (!found) {
    throw new ApiError(404, 'NOT_FOUND', `${entityType} not found`)
  }
}

export function listForUser(userId: string, query: ListRemindersQuery) {
  return reminderRepo.listReminders(userId, query)
}

export async function createForUser(userId: string, input: CreateReminderInput) {
  if (input.remindAt.getTime() < Date.now()) {
    throw new ApiError(400, 'INVALID_TIME', 'Reminder time must be in the future')
  }
  await assertEntityOwned(userId, input.entityType, input.entityId)
  return reminderRepo.create(userId, input)
}

export async function deleteForUser(userId: string, id: string) {
  const existing = await reminderRepo.findById(userId, id)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Reminder not found')
  }
  await reminderRepo.deleteById(id)
}
