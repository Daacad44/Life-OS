import { useState, type FormEvent } from 'react'
import { TransactionCategory } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSetBudget } from '../hooks/useFinance'

const selectClass =
  'flex h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'

export function BudgetForm() {
  const [category, setCategory] = useState<TransactionCategory>('food')
  const [limit, setLimit] = useState('')
  const setBudget = useSetBudget()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const parsed = Number(limit)
    if (!parsed || parsed <= 0) return
    setBudget.mutate({ category, limit: parsed }, { onSuccess: () => setLimit('') })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as TransactionCategory)}
        className={selectClass}
        aria-label="Budget category"
      >
        {TransactionCategory.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <Input
        type="number"
        min="0"
        step="0.01"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        placeholder="Monthly limit"
        className="w-36"
        aria-label="Monthly limit"
      />
      <Button type="submit" disabled={!limit || setBudget.isPending} variant="outline">
        Set budget
      </Button>
    </form>
  )
}
