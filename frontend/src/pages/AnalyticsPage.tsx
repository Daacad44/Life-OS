import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { AnalyticsRange } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Bar } from '@/features/analytics/components/Bar'
import {
  useAnalyticsInsights,
  useAnalyticsOverview,
} from '@/features/analytics/hooks/useAnalytics'

const RANGES: { value: AnalyticsRange; label: string }[] = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
]

export function AnalyticsPage() {
  const [range, setRange] = useState<AnalyticsRange>('week')
  const { data: overview, isLoading } = useAnalyticsOverview(range)
  const { data: insights, isLoading: insightsLoading } = useAnalyticsInsights(range)

  const stats = overview && [
    { label: 'Tasks completed', value: overview.tasksCompleted },
    {
      label: 'Completion rate',
      value: `${Math.round(overview.taskCompletionRate * 100)}%`,
    },
    { label: 'Focus minutes', value: overview.focusMinutes },
    { label: 'Notes created', value: overview.notesCreated },
    { label: 'Reflections', value: overview.reflectionsLogged },
  ]

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Analytics</h1>
          <p className="text-text-muted">
            See how you actually spend your time and effort.
          </p>
        </div>
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <Button
              key={r.value}
              size="sm"
              variant={range === r.value ? 'default' : 'outline'}
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-md bg-primary-muted" />
          ))}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="flex flex-col gap-1 p-4">
                <span className="text-2xl font-semibold text-text">{s.value}</span>
                <span className="text-xs text-text-muted">{s.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!insightsLoading && insights && insights.insights.length > 0 && (
        <div className="flex flex-col gap-2">
          {insights.insights.map((insight) => (
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

      {overview && overview.habits.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-text-muted">Habit consistency</h2>
          <Card>
            <CardContent className="flex flex-col gap-3 p-4">
              {overview.habits.map((h) => (
                <Bar key={h.title} label={h.title} value={h.checkins} max={h.expected} />
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {overview && overview.goals.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-text-muted">Goal progress</h2>
          <Card>
            <CardContent className="flex flex-col gap-3 p-4">
              {overview.goals.map((g) => (
                <Bar key={g.title} label={g.title} value={g.progress} max={100} />
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
