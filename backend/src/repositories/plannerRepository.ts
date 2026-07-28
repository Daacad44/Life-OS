import { prisma } from '../config/db.js'

export function getTasksInRange(userId: string, start: Date, end: Date) {
  return prisma.task.findMany({
    where: { userId, deletedAt: null, dueDate: { gte: start, lt: end } },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  })
}

export function getOverdueTasks(userId: string, before: Date) {
  return prisma.task.findMany({
    where: {
      userId,
      deletedAt: null,
      status: { not: 'DONE' },
      dueDate: { lt: before },
    },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  })
}

export function findOwnedTaskIds(userId: string, taskIds: string[]) {
  return prisma.task.findMany({
    where: { id: { in: taskIds }, userId, deletedAt: null },
    select: { id: true },
  })
}

export function reorderTasks(taskIds: string[]) {
  return prisma.$transaction(
    taskIds.map((id, index) =>
      prisma.task.update({ where: { id }, data: { order: index } }),
    ),
  )
}
