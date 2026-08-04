import { ArrowDownLeft, Dumbbell, ShoppingCart, type LucideIcon } from 'lucide-react'
import { Card, CardTitle, StatCard, type Tone } from '@/components/ui-kit'
import { cn } from '@/lib/utils'
import { toneChip } from '@/components/ui-kit'

// MOCK — replace with useFinance(); values match the prototype.
const stats: { label: string; value: string; valueTone?: Tone }[] = [
  { label: 'Income', value: '$4,250', valueTone: 'emerald' },
  { label: 'Expenses', value: '$2,180', valueTone: 'red' },
  { label: 'Savings', value: '$2,070' },
  { label: 'Budgets', value: '3' },
]

const spendingLegend = [
  { label: 'Needs 45%', className: 'bg-navy-700' },
  { label: 'Wants 30%', className: 'bg-amber-500' },
  { label: 'Savings 20%', className: 'bg-accent-emerald' },
  { label: 'Invest 5%', className: 'bg-slate-400' },
]

interface Transaction {
  name: string
  amount: string
  positive: boolean
  icon: LucideIcon
  tone: Tone
}
const transactions: Transaction[] = [
  {
    name: 'Salary',
    amount: '+$4,250',
    positive: true,
    icon: ArrowDownLeft,
    tone: 'emerald',
  },
  { name: 'Grocery', amount: '−$85', positive: false, icon: ShoppingCart, tone: 'slate' },
  {
    name: 'Gym Membership',
    amount: '−$45',
    positive: false,
    icon: Dumbbell,
    tone: 'slate',
  },
  {
    name: 'Freelance Project',
    amount: '+$400',
    positive: true,
    icon: ArrowDownLeft,
    tone: 'emerald',
  },
]

export function FinancePage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
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
          <div className="flex items-center gap-5">
            <svg
              viewBox="0 0 120 120"
              className="size-[130px]"
              role="img"
              aria-label="Needs 45%, Wants 30%, Savings 20%, Invest 5%"
            >
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="#1d4e89"
                strokeWidth="16"
                strokeDasharray="130 289"
                transform="rotate(-90 60 60)"
              />
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="16"
                strokeDasharray="87 289"
                strokeDashoffset="-130"
                transform="rotate(-90 60 60)"
              />
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="#059669"
                strokeWidth="16"
                strokeDasharray="58 289"
                strokeDashoffset="-217"
                transform="rotate(-90 60 60)"
              />
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="16"
                strokeDasharray="14 289"
                strokeDashoffset="-275"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="flex flex-col gap-2.5 text-[13px] font-semibold">
              {spendingLegend.map((l) => (
                <span key={l.label} className="flex items-center gap-2">
                  <span className={`size-[11px] rounded-[3px] ${l.className}`} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <Card padding="md">
          <CardTitle className="mb-2">Recent Transactions</CardTitle>
          {transactions.map((tx) => (
            <div
              key={tx.name}
              className="flex items-center justify-between border-b border-slate-100 py-3 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'grid size-9 place-items-center rounded-[10px]',
                    toneChip[tx.tone],
                  )}
                >
                  <tx.icon size={17} aria-hidden="true" />
                </span>
                <span className="text-sm font-bold">{tx.name}</span>
              </div>
              <span
                className={cn(
                  'text-sm font-extrabold tabular-nums',
                  tx.positive ? 'text-accent-emerald' : 'text-slate-700',
                )}
              >
                {tx.amount}
              </span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
