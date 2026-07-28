import { prisma } from '../config/db.js'

export function listNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}

export function findById(userId: string, id: string) {
  return prisma.notification.findFirst({ where: { id, userId } })
}

export function markRead(id: string) {
  return prisma.notification.update({ where: { id }, data: { read: true } })
}

export function markAllRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  })
}

export function create(userId: string, title: string, body: string) {
  return prisma.notification.create({ data: { userId, title, body } })
}
