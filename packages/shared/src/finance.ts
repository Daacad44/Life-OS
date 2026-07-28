import { z } from 'zod'

export const TransactionType = ['INCOME', 'EXPENSE'] as const
export type TransactionType = (typeof TransactionType)[number]

// A single combined set covers both income and expense entries — see
// Finance Planner.md, Section 9 ("category: from a defined set").
export const TransactionCategory = [
  'salary',
  'freelance',
  'investment',
  'gift',
  'food',
  'housing',
  'transport',
  'utilities',
  'health',
  'entertainment',
  'shopping',
  'education',
  'savings',
  'debt',
  'other',
] as const
export type TransactionCategory = (typeof TransactionCategory)[number]

export const createTransactionSchema = z.object({
  type: z.enum(TransactionType),
  amount: z.number().positive(),
  category: z.enum(TransactionCategory),
  note: z.string().max(500).optional(),
  date: z.coerce.date(),
  goalId: z.string().uuid().optional(),
})
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>

export const updateTransactionSchema = z.object({
  type: z.enum(TransactionType).optional(),
  amount: z.number().positive().optional(),
  category: z.enum(TransactionCategory).optional(),
  note: z.string().max(500).nullable().optional(),
  date: z.coerce.date().optional(),
  goalId: z.string().uuid().nullable().optional(),
})
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  amount: number
  category: string
  note: string | null
  date: string
  goalId: string | null
  createdAt: string
  updatedAt: string
}

export const setBudgetSchema = z.object({
  category: z.enum(TransactionCategory),
  limit: z.number().positive(),
})
export type SetBudgetInput = z.infer<typeof setBudgetSchema>

export interface Budget {
  id: string
  userId: string
  category: string
  limit: number
  period: string
}

export interface FinanceOverview {
  period: string
  income: number
  expenses: number
  remaining: number
  budgets: { category: string; limit: number; spent: number; remaining: number }[]
}
