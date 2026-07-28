import type { CoachRole } from '@prisma/client'
import { prisma } from '../config/db.js'

export function createMessage(userId: string, role: CoachRole, content: string) {
  return prisma.coachMessage.create({ data: { userId, role, content } })
}

// Returns the most recent `limit` messages in chronological (oldest-first) order.
export async function listRecentMessages(userId: string, limit: number) {
  const rows = await prisma.coachMessage.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
  return rows.reverse()
}
