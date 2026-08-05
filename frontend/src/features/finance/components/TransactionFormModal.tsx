import { useState, type FormEvent } from 'react'
import { Button, Input, Modal } from '@/components/ui-kit'
import { DateTimeField } from '@/components/form/DateTimeField'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import {
  TransactionCategory,
  TransactionType,
  type CreateTransactionInput,
} from '@life-os/shared'

export function TransactionFormModal({
  open,
  onClose,
  onSubmit,
  pending,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (input: CreateTransactionInput) => void
  pending?: boolean
}) {
  const timezone = useUserTimezone()
  const [type, setType] = useState<(typeof TransactionType)[number]>('EXPENSE')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<(typeof TransactionCategory)[number]>('food')
  const [note, setNote] = useState('')
  const [date, setDate] = useState<string | null>(new Date().toISOString())

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0 || !date) return
    onSubmit({
      type,
      amount: value,
      category,
      note: note.trim() || undefined,
      date: new Date(date),
    })
  }

  const selectClass =
    'w-full rounded-[11px] border border-app-hairline bg-app-canvas px-3.5 py-[13px] font-display text-base text-app-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New transaction"
      footer={
        <>
          <Button variant="surface" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="navy"
            size="sm"
            type="submit"
            form="transaction-form"
            disabled={!amount || Number(amount) <= 0 || pending}
          >
            Add transaction
          </Button>
        </>
      }
    >
      <form id="transaction-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-[7px]">
            <label
              htmlFor="tx-type"
              className="text-[13px] font-semibold text-app-ink-soft"
            >
              Type
            </label>
            <select
              id="tx-type"
              value={type}
              onChange={(e) =>
                setType(e.target.value as (typeof TransactionType)[number])
              }
              className={selectClass}
            >
              {TransactionType.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            autoFocus
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-[7px]">
            <label
              htmlFor="tx-category"
              className="text-[13px] font-semibold text-app-ink-soft"
            >
              Category
            </label>
            <select
              id="tx-category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as (typeof TransactionCategory)[number])
              }
              className={selectClass}
            >
              {TransactionCategory.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <DateTimeField
            label="Date"
            value={date}
            onChange={setDate}
            timezone={timezone}
            mode="date"
            required
          />
        </div>
        <Input
          label="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional"
        />
      </form>
    </Modal>
  )
}
