import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UpdateTransactionInput } from '@life-os/shared'
import * as financeApi from '../api'

export function useTransactions() {
  return useQuery({
    queryKey: ['finance', 'transactions'],
    queryFn: financeApi.listTransactions,
  })
}

export function useBudgetOverview() {
  return useQuery({
    queryKey: ['finance', 'budget'],
    queryFn: financeApi.getBudgetOverview,
  })
}

function useInvalidateFinance() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['finance'] })
  }
}

export function useCreateTransaction() {
  const invalidate = useInvalidateFinance()
  return useMutation({
    mutationFn: financeApi.createTransaction,
    onSuccess: invalidate,
  })
}

export function useUpdateTransaction(id: string) {
  const invalidate = useInvalidateFinance()
  return useMutation({
    mutationFn: (input: UpdateTransactionInput) =>
      financeApi.updateTransaction(id, input),
    onSuccess: invalidate,
  })
}

export function useDeleteTransaction() {
  const invalidate = useInvalidateFinance()
  return useMutation({
    mutationFn: financeApi.deleteTransaction,
    onSuccess: invalidate,
  })
}

export function useSetBudget() {
  const invalidate = useInvalidateFinance()
  return useMutation({
    mutationFn: financeApi.setBudget,
    onSuccess: invalidate,
  })
}
