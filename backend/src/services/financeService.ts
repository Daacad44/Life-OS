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
import * as notificationService from './notificationService.js'

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
  if (t.type === 'EXPENSE') {
    void checkBudgetThreshold(userId, t.category, Number(t.amount))
  }
  return toTransactionDTO(t)
}

// Notifies the first time a category's spending crosses its monthly limit —
// see Finance Planner.md Section 10 ("Budget threshold reached").
async function checkBudgetThreshold(userId: string, category: string, newAmount: number) {
  const budget = await financeRepo.findBudget(userId, category)
  if (!budget) return

  const { start, end } = currentMonthRange()
  const monthTransactions = await financeRepo.listTransactions(userId, { start, end })
  const spentAfter = monthTransactions
    .filter((t) => t.type === 'EXPENSE' && t.category === category)
    .reduce((sum, t) => sum + Number(t.amount), 0)
  const spentBefore = spentAfter - newAmount
  const limit = Number(budget.limit)

  if (spentBefore < limit && spentAfter >= limit) {
    void notificationService.notify(
      userId,
      'budgetThreshold',
      `${category} budget reached`,
      `You've spent $${spentAfter.toFixed(2)} of your $${limit.toFixed(2)} ${category} budget this month.`,
    )
  }
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
