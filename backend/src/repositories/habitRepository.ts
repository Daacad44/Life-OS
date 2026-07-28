import type { Prisma } from '@prisma/client'
import { prisma } from '../config/db.js'

export function listHabits(userId: string) {
  return prisma.habit.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { checkins: { orderBy: { date: 'desc' }, take: 90 } },
  })
}

export function findHabitById(userId: string, id: string) {
  return prisma.habit.findFirst({
    where: { id, userId },
    include: { checkins: { orderBy: { date: 'desc' }, take: 90 } },
  })
}

export function createHabit(userId: string, data: Prisma.HabitCreateWithoutUserInput) {
  return prisma.habit.create({ data: { ...data, user: { connect: { id: userId } } } })
}

export function updateHabit(id: string, data: Prisma.HabitUpdateInput) {
  return prisma.habit.update({ where: { id }, data })
}

export function deleteHabit(id: string) {
  return prisma.habit.delete({ where: { id } })
}

export function findCheckinInRange(habitId: string, start: Date, end: Date) {
  return prisma.habitCheckin.findFirst({
    where: { habitId, date: { gte: start, lt: end } },
  })
}

export function createCheckin(habitId: string, date: Date) {
  return prisma.habitCheckin.create({ data: { habitId, date } })
}

export function allCheckinDates(habitId: string) {
  return prisma.habitCheckin
    .findMany({ where: { habitId }, select: { date: true } })
    .then((rows) => rows.map((r) => r.date))
}

export function setStreak(habitId: string, streak: number) {
  return prisma.habit.update({ where: { id: habitId }, data: { streak } })
}
