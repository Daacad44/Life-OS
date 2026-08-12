import { z } from 'zod'

export const TransactionType = ['INCOME', 'EXPENSE'] as const
export type TransactionType = (typeof TransactionType)[number]

// A single combined set covers both income and expense entries — see
// Finance Planner.md, Section 9 ("category: from a defined set").
// Preset categories offered as quick-pick chips in the UI. The stored category
// is free text (see the schema below), so the user can also type their own —
// these are convenience suggestions, plus the set budgets group by.
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

// Optional payment methods offered as a quick-pick; also free text.
export const PaymentMethod = [
  'cash',
  'card',
  'bank transfer',
  'mobile money',
  'other',
] as const
export type PaymentMethod = (typeof PaymentMethod)[number]

// Category accepts any label so the user can record spending anywhere their
// money went; the preset list above is only a convenience for quick entry.
const categoryField = z.string().min(1).max(50)

export const createTransactionSchema = z.object({
  type: z.enum(TransactionType),
  amount: z.number().positive(),
  category: categoryField,
  // Free-text label — "where did the money go?" (e.g. "Groceries at Xawaash").
  description: z.string().max(200).optional(),
  paymentMethod: z.string().max(50).optional(),
  note: z.string().max(500).optional(),
  date: z.coerce.date(),
  goalId: z.string().uuid().optional(),
})
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>

export const updateTransactionSchema = z.object({
  type: z.enum(TransactionType).optional(),
  amount: z.number().positive().optional(),
  category: categoryField.optional(),
  description: z.string().max(200).nullable().optional(),
  paymentMethod: z.string().max(50).nullable().optional(),
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
  description: string | null
  paymentMethod: string | null
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
