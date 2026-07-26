import type { Prisma } from '@prisma/client'
import type { ListTasksQuery } from '@life-os/shared'
import { prisma } from '../config/db.js'

function whereFor(userId: string, query: ListTasksQuery): Prisma.TaskWhereInput {
  return {
    userId,
    deletedAt: null,
    ...(query.status && { status: query.status }),
    ...(query.priority && { priority: query.priority }),
    ...(query.goalId && { goalId: query.goalId }),
    ...(query.q && { title: { contains: query.q, mode: 'insensitive' } }),
  }
}

export async function listTasks(userId: string, query: ListTasksQuery) {
  const where = whereFor(userId, query)

  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { [query.sort]: query.order },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.task.count({ where }),
  ])

  return { items, total }
}

export function findTaskById(userId: string, id: string) {
  return prisma.task.findFirst({ where: { id, userId, deletedAt: null } })
}

export function createTask(userId: string, data: Prisma.TaskCreateWithoutUserInput) {
  return prisma.task.create({ data: { ...data, user: { connect: { id: userId } } } })
}

export function updateTask(id: string, data: Prisma.TaskUpdateInput) {
  return prisma.task.update({ where: { id }, data })
}

export function softDeleteTask(id: string) {
  return prisma.task.update({ where: { id }, data: { deletedAt: new Date() } })
}
