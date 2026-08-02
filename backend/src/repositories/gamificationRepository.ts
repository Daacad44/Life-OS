import { prisma } from '../config/db.js'

export async function getOrCreateProgress(userId: string) {
  return prisma.userProgress.upsert({
    where: { userId },
    create: { userId },
    update: {},
  })
}

export function setProgress(userId: string, points: number, level: number) {
  return prisma.userProgress.upsert({
    where: { userId },
    create: { userId, points, level },
    update: { points, level },
  })
}

export function listAchievements(userId: string) {
  return prisma.achievement.findMany({
    where: { userId },
    orderBy: { unlockedAt: 'desc' },
  })
}

export function unlockAchievement(userId: string, type: string) {
  // @@unique([userId, type]) makes this a no-op (throws, caught by the caller)
  // if already unlocked — achievements only ever unlock once.
  return prisma.achievement.create({ data: { userId, type } })
}
