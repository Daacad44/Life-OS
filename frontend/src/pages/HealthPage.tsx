import { useState, type FormEvent } from 'react'
import { Plus, Sparkles } from 'lucide-react'
import { HealthMetricType } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { TrendChart } from '@/features/health/components/TrendChart'
import { useCreateHealthLog, useHealthTrends } from '@/features/health/hooks/useHealth'

const METRIC_LABEL: Record<string, string> = {
  SLEEP: 'Sleep (hrs)',
  WATER: 'Water (glasses)',
  EXERCISE: 'Exercise (min)',
  MOOD: 'Mood (1-10)',
  WEIGHT: 'Weight (kg)',
}

const selectClass =
  'flex h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'

export function HealthPage() {
  const [range, setRange] = useState<'week' | 'month'>('week')
  const { data, isLoading } = useHealthTrends(range)
  const createLog = useCreateHealthLog()

  const [type, setType] = useState<HealthMetricType>('SLEEP')
  const [value, setValue] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const parsed = Number(value)
    if (Number.isNaN(parsed)) return
    createLog.mutate(
      { type, value: parsed, date: new Date(date) },
      { onSuccess: () => setValue('') },
    )
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Health</h1>
          <p className="text-text-muted">
            Sleep, water, exercise, mood, and weight — in one place.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={range === 'week' ? 'default' : 'outline'}
            onClick={() => setRange('week')}
          >
            Week
          </Button>
          <Button
            size="sm"
            variant={range === 'month' ? 'default' : 'outline'}
            onClick={() => setRange('month')}
          >
            Month
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as HealthMetricType)}
          className={selectClass}
          aria-label="Metric"
        >
          {HealthMetricType.map((t) => (
            <option key={t} value={t}>
              {METRIC_LABEL[t]}
            </option>
          ))}
        </select>
        <Input
          type="number"
          step="0.1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value"
          className="w-28"
          aria-label="Value"
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-40"
          aria-label="Date"
        />
        <Button type="submit" disabled={!value || createLog.isPending}>
          <Plus className="size-4" />
          Log
        </Button>
      </form>

      {isLoading && <div className="h-40 animate-pulse rounded-md bg-primary-muted" />}

      {data && data.insights.length > 0 && (
        <div className="flex flex-col gap-2">
          {data.insights.map((insight) => (
            <div
              key={insight}
              className="flex items-start gap-2 rounded-md border border-border bg-primary-muted px-3 py-2 text-sm text-text"
            >
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
              {insight}
            </div>
          ))}
        </div>
      )}

      {data && (
        <Card>
          <CardContent className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            {data.trends.map((t) => (
              <TrendChart key={t.type} label={METRIC_LABEL[t.type]} points={t.points} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
