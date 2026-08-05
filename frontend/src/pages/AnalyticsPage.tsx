import { useMemo, useState } from 'react'
import { BarChart3 } from 'lucide-react'
import { Card, CardTitle, EmptyState, Skeleton, StatCard } from '@/components/ui-kit'
import { Tabs, type TabItem } from '@/components/ui-kit'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import {
  useAnalyticsOverview,
  useAnalyticsInsights,
} from '@/features/analytics/hooks/useAnalytics'
import { useFocusSessions } from '@/features/focus/hooks/useFocus'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import { dayKeyInTz, formatMinutes } from '@/lib/datetime'
import { donutArcs, polylinePoints } from '@/lib/chart'
import type { AnalyticsRange, ListTasksQuery } from '@life-os/shared'

const rangeTabs: TabItem<AnalyticsRange>[] = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
]
const taskFilters: Partial<ListTasksQuery> = { pageSize: 100 }

const priorityColors = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#1d4e89' }

export function AnalyticsPage() {
  const timezone = useUserTimezone()
  const [range, setRange] = useState<AnalyticsRange>('week')
  const { data, isLoading, isError, refetch } = useAnalyticsOverview(range)
  const { data: insights } = useAnalyticsInsights(range)
  const { data: sessions } = useFocusSessions()
  const { data: taskData } = useTasks(taskFilters)

  // Focus-minutes series over the selected range, from real sessions.
  const series = useMemo(() => {
    const buckets = range === 'year' ? 12 : range === 'month' ? 30 : 7
    const out: number[] = []
    for (let i = buckets - 1; i >= 0; i -= 1) {
      const d = new Date()
      if (range === 'year') {
        d.setMonth(d.getMonth() - i)
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        out.push(
          (sessions ?? [])
            .filter((s) => s.duration && dayKeyInTz(s.startedAt, timezone).startsWith(ym))
            .reduce((sum, s) => sum + Math.round((s.duration ?? 0) / 60), 0),
        )
      } else {
        d.setDate(d.getDate() - i)
        const key = dayKeyInTz(d, timezone)
        out.push(
          (sessions ?? [])
            .filter((s) => s.duration && dayKeyInTz(s.startedAt, timezone) === key)
            .reduce((sum, s) => sum + Math.round((s.duration ?? 0) / 60), 0),
        )
      }
    }
    return out
  }, [sessions, range, timezone])

  const priority = useMemo(() => {
    const tasks = taskData?.data ?? []
    const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 }
    for (const t of tasks) counts[t.priority] += 1
    const total = counts.HIGH + counts.MEDIUM + counts.LOW
    return { counts, total }
  }, [taskData])

  const goalsProgress = data?.goals.length
    ? Math.round(data.goals.reduce((s, g) => s + g.progress, 0) / data.goals.length)
    : 0

  const stats = [
    { label: 'Focus Time', value: formatMinutes(data?.focusMinutes ?? 0) },
    { label: 'Tasks Completed', value: String(data?.tasksCompleted ?? 0) },
    {
      label: 'Completion Rate',
      value: `${Math.round((data?.taskCompletionRate ?? 0) * 100)}%`,
    },
    { label: 'Goals Progress', value: `${goalsProgress}%` },
  ]

  const arcs = donutArcs([
    priority.counts.HIGH,
    priority.counts.MEDIUM,
    priority.counts.LOW,
  ])
  const pct = (n: number) => (priority.total ? Math.round((n / priority.total) * 100) : 0)

  if (isError) {
    return (
      <Card padding="md">
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm font-medium text-accent-red">Couldn't load analytics.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-[10px] border border-app-hairline bg-app-surface px-4 py-2 text-[13px] font-semibold text-app-ink-soft hover:bg-app-raised"
          >
            Retry
          </button>
        </div>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Tabs
          items={rangeTabs}
          value={range}
          onChange={setRange}
          ariaLabel="Analytics range"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} padding="sm">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-3 h-6 w-16" />
              </Card>
            ))
          : stats.map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} size="md" />
            ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card padding="md">
          <CardTitle className="mb-4">Focus Time Over Time</CardTitle>
          {series.some((v) => v > 0) ? (
            <svg
              viewBox="0 0 480 200"
              className="h-[200px] w-full"
              preserveAspectRatio="none"
              role="img"
              aria-label="Focus minutes across the selected range"
            >
              <polyline
                points={polylinePoints(series, 480, 200)}
                fill="none"
                stroke="#1d4e89"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <EmptyState
              icon={BarChart3}
              title="No focus data yet"
              description="Run some Focus sessions and your trend appears here."
            />
          )}
        </Card>

        <Card padding="md">
          <CardTitle className="mb-2">Tasks by Priority</CardTitle>
          {priority.total > 0 ? (
            <div className="flex items-center gap-5">
              <svg
                viewBox="0 0 120 120"
                className="size-[130px]"
                role="img"
                aria-label="Task priority split"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="16"
                />
                {(['HIGH', 'MEDIUM', 'LOW'] as const).map((p, i) => (
                  <circle
                    key={p}
                    cx="60"
                    cy="60"
                    r="46"
                    fill="none"
                    stroke={priorityColors[p]}
                    strokeWidth="16"
                    strokeDasharray={arcs[i].dasharray}
                    strokeDashoffset={arcs[i].offset}
                    transform="rotate(-90 60 60)"
                  />
                ))}
              </svg>
              <div className="flex flex-col gap-2.5 text-[13px] font-semibold">
                <span className="flex items-center gap-2">
                  <span className="size-[11px] rounded-[3px] bg-accent-red" />
                  High {pct(priority.counts.HIGH)}%
                </span>
                <span className="flex items-center gap-2">
                  <span className="size-[11px] rounded-[3px] bg-amber-500" />
                  Medium {pct(priority.counts.MEDIUM)}%
                </span>
                <span className="flex items-center gap-2">
                  <span className="size-[11px] rounded-[3px] bg-navy-700" />
                  Low {pct(priority.counts.LOW)}%
                </span>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={BarChart3}
              title="No tasks yet"
              description="Add tasks to see the split."
            />
          )}
        </Card>
      </div>

      {insights?.insights.length ? (
        <Card padding="md">
          <CardTitle className="mb-3">Insights</CardTitle>
          <ul className="flex flex-col gap-2.5">
            {insights.insights.map((text, i) => (
              <li key={i} className="flex gap-2.5 text-sm font-medium text-app-ink-soft">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />
                {text}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  )
}
