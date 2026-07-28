import { prisma } from '../config/db.js'
import { ApiError } from '../middleware/errorHandler.js'
import type { CreateEventInput, ListEventsQuery, UpdateEventInput } from '@life-os/shared'
import * as calendarRepo from '../repositories/calendarRepository.js'

const MAX_RANGE_DAYS = 92 // ~3 months — keeps date-range queries bounded per the PRD.

async function assertTaskOwnership(userId: string, taskId: string) {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } })
  if (!task) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'taskId does not belong to this user')
  }
}

export function listForUser(userId: string, query: ListEventsQuery) {
  const rangeDays = (query.end.getTime() - query.start.getTime()) / (1000 * 60 * 60 * 24)
  if (rangeDays < 0 || rangeDays > MAX_RANGE_DAYS) {
    throw new ApiError(
      400,
      'VALIDATION_ERROR',
      `Date range must be between 0 and ${MAX_RANGE_DAYS} days`,
    )
  }
  return calendarRepo.listEventsInRange(userId, query.start, query.end)
}

export async function getOne(userId: string, id: string) {
  const event = await calendarRepo.findEventById(userId, id)
  if (!event) {
    throw new ApiError(404, 'NOT_FOUND', 'Event not found')
  }
  return event
}

export async function create(userId: string, input: CreateEventInput) {
  if (input.taskId) {
    await assertTaskOwnership(userId, input.taskId)
  }
  return calendarRepo.createEvent(userId, input)
}

export async function update(userId: string, id: string, input: UpdateEventInput) {
  const existing = await getOne(userId, id)
  if (input.taskId) {
    await assertTaskOwnership(userId, input.taskId)
  }

  const startTime = input.startTime ?? existing.startTime
  const endTime = input.endTime ?? existing.endTime
  if (startTime >= endTime) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'startTime must be before endTime')
  }

  return calendarRepo.updateEvent(id, input)
}

export async function remove(userId: string, id: string) {
  await getOne(userId, id)
  await calendarRepo.deleteEvent(id)
}
