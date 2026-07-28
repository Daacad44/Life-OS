import type {
  Budget,
  CreateTransactionInput,
  FinanceOverview,
  SetBudgetInput,
  Transaction,
  UpdateTransactionInput,
} from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function listTransactions() {
  return apiFetch<Transaction[]>('/v1/finance/transactions')
}

export function createTransaction(input: CreateTransactionInput) {
  return apiFetch<Transaction>('/v1/finance/transactions', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateTransaction(id: string, input: UpdateTransactionInput) {
  return apiFetch<Transaction>(`/v1/finance/transactions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function deleteTransaction(id: string) {
  await apiFetch<null>(`/v1/finance/transactions/${id}`, { method: 'DELETE' })
}

export function getBudgetOverview() {
  return apiFetch<FinanceOverview>('/v1/finance/budget')
}

export function setBudget(input: SetBudgetInput) {
  return apiFetch<Budget>('/v1/finance/budget', {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}
