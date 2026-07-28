import { ApiError } from '../middleware/errorHandler.js'
import {
  getTasksInRange,
  getOverdueTasks,
  findOwnedTaskIds,
  reorderTasks,
} from '../repositories/plannerRepository.js'

function dayRange(dateStr: string) {
  const start = new Date(`${dateStr}T00:00:00.000Z`)
  if (Number.isNaN(start.getTime())) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid date')
  }
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)
  return { start, end }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export async function getPlanForDate(userId: string, dateStr: string) {
  const { start, end } = dayRange(dateStr)
  const isToday = dateStr === todayStr()

  const [tasks, overdue] = await Promise.all([
    getTasksInRange(userId, start, end),
    isToday ? getOverdueTasks(userId, start) : Promise.resolve([]),
  ])

  return { date: dateStr, overdue, tasks }
}

export async function reorder(userId: string, taskIds: string[]) {
  const owned = await findOwnedTaskIds(userId, taskIds)
  if (owned.length !== taskIds.length) {
    throw new ApiError(
      400,
      'VALIDATION_ERROR',
      'One or more tasks do not belong to this user',
    )
  }
  await reorderTasks(taskIds)
}
