import type {
  CreateReminderInput,
  ListRemindersQuery,
  PendingAlarm,
  ReminderEntityType,
} from '@life-os/shared'
import { ApiError } from '../middleware/errorHandler.js'
import * as reminderRepo from '../repositories/reminderRepository.js'
import { resolveEntity } from './reminderEntity.js'

// Confirm the target entity exists and belongs to the user before attaching a
// reminder to it — reminders are always user-scoped through their entity.
async function assertEntityOwned(
  userId: string,
  entityType: ReminderEntityType,
  entityId: string,
) {
  const status = await resolveEntity(entityType, entityId, userId)
  if (!status.exists) {
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

// Reminders that have fired but not been dismissed. Resolves each target's
// current title and drops any whose item was completed/deleted in the meantime.
export async function pendingAlarmsForUser(userId: string): Promise<PendingAlarm[]> {
  const pending = await reminderRepo.findPendingAlarms(userId)
  const alarms: PendingAlarm[] = []
  for (const r of pending) {
    const status = await resolveEntity(
      r.entityType as ReminderEntityType,
      r.entityId,
      userId,
    )
    if (!status.exists || status.done) {
      // Underlying item is gone/finished — auto-dismiss so it never nags.
      await reminderRepo.acknowledge(r.id, new Date())
      continue
    }
    alarms.push({
      id: r.id,
      entityType: r.entityType as ReminderEntityType,
      entityId: r.entityId,
      remindAt: r.remindAt.toISOString(),
      message: r.message,
      offsetLabel: r.offsetLabel,
      entityTitle: status.title ?? 'your reminder',
    })
  }
  return alarms
}

export async function acknowledgeForUser(userId: string, id: string) {
  const existing = await reminderRepo.findById(userId, id)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Reminder not found')
  }
  return reminderRepo.acknowledge(id, new Date())
}

export async function snoozeForUser(userId: string, id: string, minutes: number) {
  const existing = await reminderRepo.findById(userId, id)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Reminder not found')
  }
  const remindAt = new Date(Date.now() + minutes * 60_000)
  return reminderRepo.snooze(id, remindAt)
}
