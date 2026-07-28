import type { Prisma } from '@prisma/client'
import { prisma } from '../config/db.js'

export function listReflections(userId: string) {
  return prisma.reflection.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
}

export function createReflection(
  userId: string,
  data: Omit<Prisma.ReflectionUncheckedCreateInput, 'userId'>,
) {
  return prisma.reflection.create({ data: { ...data, userId } })
}

export function updateReflectionInsights(id: string, insights: string) {
  return prisma.reflection.update({ where: { id }, data: { insights } })
}
