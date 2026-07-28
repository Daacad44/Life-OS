import { Card, CardContent } from '@/components/ui/card'
import { Bar } from '@/features/analytics/components/Bar'
import { BudgetForm } from '@/features/finance/components/BudgetForm'
import { TransactionForm } from '@/features/finance/components/TransactionForm'
import { TransactionList } from '@/features/finance/components/TransactionList'
import { useBudgetOverview, useTransactions } from '@/features/finance/hooks/useFinance'

export function FinancePage() {
  const { data: overview, isLoading: overviewLoading } = useBudgetOverview()
  const { data: transactions, isLoading: transactionsLoading } = useTransactions()

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Finance</h1>
        <p className="text-text-muted">Income, expenses, and budgets — this month.</p>
      </div>

      {overviewLoading && (
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-md bg-primary-muted" />
          ))}
        </div>
      )}

      {overview && (
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="flex flex-col gap-1 p-4">
              <span className="text-2xl font-semibold text-success">
                ${overview.income.toFixed(2)}
              </span>
              <span className="text-xs text-text-muted">Income</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-1 p-4">
              <span className="text-2xl font-semibold text-danger">
                ${overview.expenses.toFixed(2)}
              </span>
              <span className="text-xs text-text-muted">Expenses</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-1 p-4">
              <span className="text-2xl font-semibold text-text">
                ${overview.remaining.toFixed(2)}
              </span>
              <span className="text-xs text-text-muted">Remaining</span>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text-muted">Budgets</h2>
        <BudgetForm />
        {overview && overview.budgets.length > 0 && (
          <Card>
            <CardContent className="flex flex-col gap-3 p-4">
              {overview.budgets.map((b) => (
                <Bar
                  key={b.category}
                  label={b.category}
                  value={Math.round(b.spent)}
                  max={Math.round(b.limit)}
                />
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text-muted">Transactions</h2>
        <TransactionForm />
        {transactionsLoading ? (
          <div className="h-24 animate-pulse rounded-md bg-primary-muted" />
        ) : (
          <TransactionList transactions={transactions ?? []} />
        )}
      </div>
    </div>
  )
}
