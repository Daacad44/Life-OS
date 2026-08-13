import { useState, type FormEvent } from 'react'
import { Button, Input, Modal } from '@/components/ui-kit'
import { DateTimeField } from '@/components/form/DateTimeField'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import {
  PaymentMethod,
  TransactionCategory,
  TransactionType,
  type Transaction,
} from '@life-os/shared'
import { useCreateTransaction, useUpdateTransaction } from '../hooks/useFinance'

/**
 * Create or edit a transaction. Category and payment method are free-text inputs
 * backed by a datalist of common presets — the user can type where the money
 * went (any label) OR pick a prepared one. Handles both income and expense, and
 * both create and edit (pass `editing`). Values are held locally until Save.
 */
export function TransactionFormModal({
  open,
  onClose,
  editing,
}: {
  open: boolean
  onClose: () => void
  editing?: Transaction
}) {
  const timezone = useUserTimezone()
  const create = useCreateTransaction()
  const update = useUpdateTransaction(editing?.id ?? '')
  const pending = create.isPending || update.isPending

  const [type, setType] = useState<(typeof TransactionType)[number]>(
    editing?.type ?? 'EXPENSE',
  )
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '')
  const [description, setDescription] = useState(editing?.description ?? '')
  const [category, setCategory] = useState(editing?.category ?? '')
  const [paymentMethod, setPaymentMethod] = useState(editing?.paymentMethod ?? '')
  const [note, setNote] = useState(editing?.note ?? '')
  const [date, setDate] = useState<string | null>(
    editing?.date ?? new Date().toISOString(),
  )

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0 || !date || !category.trim()) return
    const payload = {
      type,
      amount: value,
      category: category.trim(),
      description: description.trim() || undefined,
      paymentMethod: paymentMethod.trim() || undefined,
      note: note.trim() || undefined,
      date: new Date(date),
    }
    const opts = { onSuccess: () => onClose() }
    if (editing) update.mutate(payload, opts)
    else create.mutate(payload, opts)
  }

  const selectClass =
    'w-full rounded-[11px] border border-app-hairline bg-app-canvas px-3.5 py-[13px] font-display text-base text-app-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit transaction' : 'New transaction'}
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
            disabled={!amount || Number(amount) <= 0 || !category.trim() || pending}
          >
            {pending ? 'Saving…' : editing ? 'Save changes' : 'Add transaction'}
          </Button>
        </>
      }
    >
      <form id="transaction-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Where did the money go? (e.g. Groceries)"
          autoFocus
        />
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
            <input
              id="tx-category"
              list="tx-category-presets"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Type or pick a category"
              className={selectClass}
              required
            />
            <datalist id="tx-category-presets">
              {TransactionCategory.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-[7px]">
            <label
              htmlFor="tx-payment"
              className="text-[13px] font-semibold text-app-ink-soft"
            >
              Payment method
            </label>
            <input
              id="tx-payment"
              list="tx-payment-presets"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              placeholder="Optional (cash, card…)"
              className={selectClass}
            />
            <datalist id="tx-payment-presets">
              {PaymentMethod.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>
          <Input
            label="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional"
          />
        </div>
      </form>
    </Modal>
  )
}
