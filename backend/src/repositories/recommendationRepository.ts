import { prisma } from '../config/db.js'

export function listActive(userId: string) {
  return prisma.recommendation.findMany({
    where: { userId, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
  })
}

export function findById(userId: string, id: string) {
  return prisma.recommendation.findFirst({ where: { id, userId } })
}

export function create(userId: string, type: string, content: string) {
  return prisma.recommendation.create({ data: { userId, type, content } })
}

export function updateStatus(id: string, status: 'ACCEPTED' | 'DISMISSED') {
  return prisma.recommendation.update({ where: { id }, data: { status } })
}
