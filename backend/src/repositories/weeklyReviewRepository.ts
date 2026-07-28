import { prisma } from '../config/db.js'

export function findByWeek(userId: string, weekStart: Date) {
  return prisma.weeklyReview.findUnique({
    where: { userId_weekStart: { userId, weekStart } },
  })
}

export function listPast(userId: string) {
  return prisma.weeklyReview.findMany({
    where: { userId },
    orderBy: { weekStart: 'desc' },
  })
}

export function upsertReview(
  userId: string,
  weekStart: Date,
  data: {
    summary: string
    wins: string[]
    focusAreas: string[]
    nextWeekPlan: string | null
  },
) {
  return prisma.weeklyReview.upsert({
    where: { userId_weekStart: { userId, weekStart } },
    create: { userId, weekStart, ...data },
    update: data,
  })
}
