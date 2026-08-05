import { useMemo, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Plus, Wallet } from 'lucide-react'
import {
  Button,
  Card,
  CardTitle,
  EmptyState,
  Skeleton,
  StatCard,
} from '@/components/ui-kit'
import { cn } from '@/lib/utils'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import {
  useTransactions,
  useBudgetOverview,
  useCreateTransaction,
} from '@/features/finance/hooks/useFinance'
import { TransactionFormModal } from '@/features/finance/components/TransactionFormModal'
import { donutArcs } from '@/lib/chart'
import { formatDate } from '@/lib/datetime'
import type { CreateTransactionInput } from '@life-os/shared'

const breakdownColors = ['#1d4e89', '#f59e0b', '#059669', '#8b5cf6', '#94a3b8']

function money(n: number): string {
  const sign = n < 0 ? '-' : ''
  return `${sign}$${Math.abs(Math.round(n)).toLocaleString('en-US')}`
}

export function FinancePage() {
  const timezone = useUserTimezone()
  const {
    data: transactions,
    isLoading: txLoading,
    isError: txError,
    refetch: refetchTx,
  } = useTransactions()
  const { data: overview, isLoading: ovLoading } = useBudgetOverview()
  const createTransaction = useCreateTransaction()
  const [modalOpen, setModalOpen] = useState(false)

  const stats = [
    {
      label: 'Income',
      value: money(overview?.income ?? 0),
      valueTone: 'emerald' as const,
    },
    {
      label: 'Expenses',
      value: money(overview?.expenses ?? 0),
      valueTone: 'red' as const,
    },
    { label: 'Savings', value: money(overview?.remaining ?? 0) },
    { label: 'Budgets', value: String(overview?.budgets.length ?? 0) },
  ]

  // Expense breakdown by category from real transactions: top 4 + "Other".
  const breakdown = useMemo(() => {
    const expenses = (transactions ?? []).filter((t) => t.type === 'EXPENSE')
    const byCat = new Map<string, number>()
    for (const t of expenses)
      byCat.set(t.category, (byCat.get(t.category) ?? 0) + t.amount)
    const sorted = [...byCat.entries()].sort((a, b) => b[1] - a[1])
    const top = sorted.slice(0, 4)
    const otherTotal = sorted.slice(4).reduce((sum, [, v]) => sum + v, 0)
    const segments = otherTotal > 0 ? [...top, ['other', otherTotal] as const] : top
    const total = segments.reduce((sum, [, v]) => sum + v, 0)
    return { segments, total }
  }, [transactions])

  const arcs = donutArcs(breakdown.segments.map(([, v]) => v))

  function submit(input: CreateTransactionInput) {
    createTransaction.mutate(input, { onSuccess: () => setModalOpen(false) })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button
          variant="navy"
          size="sm"
          className="gap-1.5"
          onClick={() => setModalOpen(true)}
        >
          <Plus size={15} aria-hidden="true" />
          Add Transaction
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {ovLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} padding="sm">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="mt-3 h-6 w-24" />
              </Card>
            ))
          : stats.map((s) => (
              <StatCard
                key={s.label}
                label={s.label}
                value={s.value}
                valueTone={s.valueTone}
                size="sm"
              />
            ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <Card padding="md">
          <CardTitle className="mb-4">Spending Breakdown</CardTitle>
          {breakdown.total > 0 ? (
            <div className="flex items-center gap-5">
              <svg
                viewBox="0 0 120 120"
                className="size-[130px]"
                role="img"
                aria-label="Spending by category"
              >
                {breakdown.segments.map(([cat], i) => (
                  <circle
                    key={cat}
                    cx="60"
                    cy="60"
                    r="46"
                    fill="none"
                    stroke={breakdownColors[i % breakdownColors.length]}
                    strokeWidth="16"
                    strokeDasharray={arcs[i].dasharray}
                    strokeDashoffset={arcs[i].offset}
                    transform="rotate(-90 60 60)"
                  />
                ))}
              </svg>
              <div className="flex flex-col gap-2.5 text-[13px] font-semibold">
                {breakdown.segments.map(([cat, value], i) => (
                  <span key={cat} className="flex items-center gap-2">
                    <span
                      className="size-[11px] rounded-[3px]"
                      style={{ background: breakdownColors[i % breakdownColors.length] }}
                    />
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}{' '}
                    {Math.round((value / breakdown.total) * 100)}%
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Wallet}
              title="No spending yet"
              description="Log an expense to see where your money goes."
            />
          )}
        </Card>

        <Card padding="md">
          <CardTitle className="mb-2">Recent Transactions</CardTitle>
          {txLoading ? (
            <div className="flex flex-col gap-2 py-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : txError ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <p className="text-sm font-medium text-accent-red">
                Couldn't load transactions.
              </p>
              <Button variant="surface" size="sm" onClick={() => refetchTx()}>
                Retry
              </Button>
            </div>
          ) : (transactions?.length ?? 0) === 0 ? (
            <EmptyState
              icon={Wallet}
              title="No transactions yet"
              description="Add your income and expenses to track your finances."
              action={
                <Button
                  variant="navy"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setModalOpen(true)}
                >
                  <Plus size={15} aria-hidden="true" />
                  Add Transaction
                </Button>
              }
            />
          ) : (
            transactions!.map((tx) => {
              const positive = tx.type === 'INCOME'
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between border-b border-app-hairline py-3 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'grid size-9 place-items-center rounded-[10px]',
                        positive
                          ? 'bg-accent-emerald-tint text-accent-emerald'
                          : 'bg-slate-100 text-slate-500',
                      )}
                    >
                      {positive ? (
                        <ArrowDownLeft size={17} aria-hidden="true" />
                      ) : (
                        <ArrowUpRight size={17} aria-hidden="true" />
                      )}
                    </span>
                    <div>
                      <div className="text-sm font-bold">
                        {tx.note ||
                          tx.category.charAt(0).toUpperCase() + tx.category.slice(1)}
                      </div>
                      <div className="text-[12px] font-semibold text-app-ink-faint">
                        {formatDate(tx.date, timezone)}
                      </div>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'text-sm font-extrabold tabular-nums',
                      positive ? 'text-accent-emerald' : 'text-app-ink-soft',
                    )}
                  >
                    {positive ? '+' : '−'}
                    {money(tx.amount).replace('-', '')}
                  </span>
                </div>
              )
            })
          )}
        </Card>
      </div>

      {modalOpen ? (
        <TransactionFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={submit}
          pending={createTransaction.isPending}
        />
      ) : null}
    </div>
  )
}
