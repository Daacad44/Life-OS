import type {
  Transaction as PrismaTransaction,
  Budget as PrismaBudget,
} from '@prisma/client'
import type {
  Budget,
  CreateTransactionInput,
  FinanceOverview,
  SetBudgetInput,
  Transaction,
  UpdateTransactionInput,
} from '@life-os/shared'
import { ApiError } from '../middleware/errorHandler.js'
import * as financeRepo from '../repositories/financeRepository.js'

function toTransactionDTO(t: PrismaTransaction): Transaction {
  return {
    id: t.id,
    userId: t.userId,
    type: t.type,
    amount: Number(t.amount),
    category: t.category,
    note: t.note,
    date: t.date.toISOString(),
    goalId: t.goalId,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }
}

function toBudgetDTO(b: PrismaBudget): Budget {
  return {
    id: b.id,
    userId: b.userId,
    category: b.category,
    limit: Number(b.limit),
    period: b.period,
  }
}

function currentMonthRange() {
  const now = new Date()
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))
  return { start, end }
}

export async function listForUser(userId: string): Promise<Transaction[]> {
  const rows = await financeRepo.listTransactions(userId)
  return rows.map(toTransactionDTO)
}

async function getRawOne(userId: string, id: string) {
  const t = await financeRepo.findTransactionById(userId, id)
  if (!t) {
    throw new ApiError(404, 'NOT_FOUND', 'Transaction not found')
  }
  return t
}

export async function create(
  userId: string,
  input: CreateTransactionInput,
): Promise<Transaction> {
  const t = await financeRepo.createTransaction(userId, input)
  return toTransactionDTO(t)
}

export async function update(
  userId: string,
  id: string,
  input: UpdateTransactionInput,
): Promise<Transaction> {
  await getRawOne(userId, id)
  const t = await financeRepo.updateTransaction(id, input)
  return toTransactionDTO(t)
}

export async function remove(userId: string, id: string): Promise<void> {
  await getRawOne(userId, id)
  await financeRepo.softDeleteTransaction(id)
}

export async function setBudget(userId: string, input: SetBudgetInput): Promise<Budget> {
  const b = await financeRepo.upsertBudget(userId, input.category, input.limit)
  return toBudgetDTO(b)
}

// Current calendar month's income/expenses/remaining + per-category budget adherence.
export async function getOverview(userId: string): Promise<FinanceOverview> {
  const { start, end } = currentMonthRange()
  const [transactions, budgets] = await Promise.all([
    financeRepo.listTransactions(userId, { start, end }),
    financeRepo.listBudgets(userId),
  ])

  let income = 0
  let expenses = 0
  const spentByCategory = new Map<string, number>()
  for (const t of transactions) {
    const amount = Number(t.amount)
    if (t.type === 'INCOME') {
      income += amount
    } else {
      expenses += amount
      spentByCategory.set(t.category, (spentByCategory.get(t.category) ?? 0) + amount)
    }
  }

  return {
    period: `${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, '0')}`,
    income,
    expenses,
    remaining: income - expenses,
    budgets: budgets.map((b) => {
      const limit = Number(b.limit)
      const spent = spentByCategory.get(b.category) ?? 0
      return { category: b.category, limit, spent, remaining: limit - spent }
    }),
  }
}
