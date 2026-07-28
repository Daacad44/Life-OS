import type { Prisma } from '@prisma/client'
import { prisma } from '../config/db.js'

export function listEventsInRange(userId: string, start: Date, end: Date) {
  // Overlap query — catches events that start before the range but end inside it.
  return prisma.calendarEvent.findMany({
    where: { userId, startTime: { lt: end }, endTime: { gt: start } },
    orderBy: { startTime: 'asc' },
  })
}

export function findEventById(userId: string, id: string) {
  return prisma.calendarEvent.findFirst({ where: { id, userId } })
}

export function createEvent(
  userId: string,
  data: Omit<Prisma.CalendarEventUncheckedCreateInput, 'userId'>,
) {
  return prisma.calendarEvent.create({ data: { ...data, userId } })
}

export function updateEvent(id: string, data: Prisma.CalendarEventUncheckedUpdateInput) {
  return prisma.calendarEvent.update({ where: { id }, data })
}

export function deleteEvent(id: string) {
  return prisma.calendarEvent.delete({ where: { id } })
}
