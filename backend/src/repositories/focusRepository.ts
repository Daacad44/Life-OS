import { prisma } from '../config/db.js'

export function listSessions(userId: string) {
  return prisma.focusSession.findMany({
    where: { userId },
    orderBy: { startedAt: 'desc' },
    take: 50,
  })
}

export function findActiveSession(userId: string) {
  return prisma.focusSession.findFirst({
    where: { userId, endedAt: null },
    orderBy: { startedAt: 'desc' },
  })
}

export function findById(userId: string, id: string) {
  return prisma.focusSession.findFirst({ where: { id, userId } })
}

export function createSession(userId: string, taskId: string | null) {
  return prisma.focusSession.create({ data: { userId, taskId } })
}

export function endSession(id: string, durationSeconds: number) {
  return prisma.focusSession.update({
    where: { id },
    data: { endedAt: new Date(), duration: durationSeconds },
  })
}
