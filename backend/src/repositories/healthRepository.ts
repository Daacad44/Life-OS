import type { HealthMetricType } from '@prisma/client'
import { prisma } from '../config/db.js'

export function listLogs(userId: string, since?: Date) {
  return prisma.healthLog.findMany({
    where: { userId, ...(since && { date: { gte: since } }) },
    orderBy: { date: 'desc' },
  })
}

export function createLog(
  userId: string,
  type: HealthMetricType,
  value: number,
  date: Date,
) {
  return prisma.healthLog.create({ data: { userId, type, value, date } })
}

export function findLogById(userId: string, id: string) {
  return prisma.healthLog.findFirst({ where: { id, userId } })
}

export function updateLog(id: string, data: { value?: number; date?: Date }) {
  return prisma.healthLog.update({ where: { id }, data })
}

export function deleteLog(id: string) {
  return prisma.healthLog.delete({ where: { id } })
}
