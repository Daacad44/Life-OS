import { Trash2 } from 'lucide-react'
import type { Transaction } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDeleteTransaction } from '../hooks/useFinance'

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const deleteTransaction = useDeleteTransaction()

  if (transactions.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        No transactions yet — add your first one above.
      </p>
    )
  }

  return (
    <div className="flex flex-col divide-y divide-border rounded-md border border-border">
      {transactions.map((t) => (
        <div key={t.id} className="flex items-center justify-between gap-3 px-3 py-2">
          <div className="flex flex-col">
            <span className="text-sm text-text capitalize">{t.category}</span>
            <span className="text-xs text-text-muted">
              {new Date(t.date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-sm font-medium',
                t.type === 'INCOME' ? 'text-success' : 'text-danger',
              )}
            >
              {t.type === 'INCOME' ? '+' : '-'}${t.amount.toFixed(2)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete transaction"
              onClick={() => deleteTransaction.mutate(t.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
