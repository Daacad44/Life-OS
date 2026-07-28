import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { TransactionCategory, type TransactionType } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateTransaction } from '../hooks/useFinance'

const selectClass =
  'flex h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'

export function TransactionForm() {
  const [type, setType] = useState<TransactionType>('EXPENSE')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<TransactionCategory>('other')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const createTransaction = useCreateTransaction()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const parsed = Number(amount)
    if (!parsed || parsed <= 0) return
    createTransaction.mutate(
      { type, amount: parsed, category, date: new Date(date) },
      { onSuccess: () => setAmount('') },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <select
        value={type}
        onChange={(e) => setType(e.target.value as TransactionType)}
        className={selectClass}
        aria-label="Type"
      >
        <option value="EXPENSE">Expense</option>
        <option value="INCOME">Income</option>
      </select>
      <Input
        type="number"
        min="0"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="w-28"
        aria-label="Amount"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as TransactionCategory)}
        className={selectClass}
        aria-label="Category"
      >
        {TransactionCategory.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-40"
        aria-label="Date"
      />
      <Button type="submit" disabled={!amount || createTransaction.isPending}>
        <Plus className="size-4" />
        Add
      </Button>
    </form>
  )
}
