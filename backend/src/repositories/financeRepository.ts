import type { Prisma } from '@prisma/client'
import { prisma } from '../config/db.js'

export function listTransactions(userId: string, range?: { start: Date; end: Date }) {
  return prisma.transaction.findMany({
    where: {
      userId,
      deletedAt: null,
      ...(range && { date: { gte: range.start, lt: range.end } }),
    },
    orderBy: { date: 'desc' },
  })
}

export function findTransactionById(userId: string, id: string) {
  return prisma.transaction.findFirst({ where: { id, userId, deletedAt: null } })
}

export function createTransaction(
  userId: string,
  data: Omit<Prisma.TransactionUncheckedCreateInput, 'userId'>,
) {
  return prisma.transaction.create({ data: { ...data, userId } })
}

export function updateTransaction(
  id: string,
  data: Prisma.TransactionUncheckedUpdateInput,
) {
  return prisma.transaction.update({ where: { id }, data })
}

export function softDeleteTransaction(id: string) {
  return prisma.transaction.update({ where: { id }, data: { deletedAt: new Date() } })
}

export function listBudgets(userId: string) {
  return prisma.budget.findMany({ where: { userId }, orderBy: { category: 'asc' } })
}

export function upsertBudget(
  userId: string,
  category: string,
  limit: number,
  period = 'monthly',
) {
  return prisma.budget.upsert({
    where: { userId_category_period: { userId, category, period } },
    create: { userId, category, limit, period },
    update: { limit },
  })
}
