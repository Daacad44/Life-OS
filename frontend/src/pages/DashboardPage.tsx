import { useMemo, useState, type FormEvent } from 'react'
import { ArrowUp, Bot, CheckSquare, Flame, Sparkles, Target, Timer } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Card,
  CardTitle,
  EmptyState,
  Skeleton,
  StatCard,
  type Tone,
} from '@/components/ui-kit'
import { cn } from '@/lib/utils'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'
import { useUpdateTask } from '@/features/tasks/hooks/useTasks'
import { useFocusSessions } from '@/features/focus/hooks/useFocus'
import { dayKeyInTz, formatDueLabel, formatMinutes } from '@/lib/datetime'
import type { Task } from '@life-os/shared'

function greeting(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

/** Build an SVG area+line path (viewBox 720×180) from a series of values. */
function areaPaths(values: number[]) {
  const W = 720
  const H = 180
  const pad = 10
  const max = Math.max(1, ...values)
  const step = values.length > 1 ? W / (values.length - 1) : W
  const points = values.map((v, i) => {
    const x = i * step
    const y = H - pad - (v / max) * (H - pad * 2)
    return [x, y] as const
  })
  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')
  const area = `${line} L${W},${H} L0,${H} Z`
  return { line, area }
}

export function DashboardPage() {
  const { data: user } = useCurrentUser()
  const timezone = useUserTimezone()
  const navigate = useNavigate()
  const firstName = (user?.name ?? 'there').split(' ')[0]

  const { data, isLoading, isError, refetch } = useDashboard()
  const { data: sessions } = useFocusSessions()
  const updateTask = useUpdateTask({})
  const [coachDraft, setCoachDraft] = useState('')

  // Today's focus minutes, summed from real sessions in the user's timezone.
  const focusMinutesToday = useMemo(() => {
    if (!sessions) return 0
    const todayKey = dayKeyInTz(new Date(), timezone)
    return sessions
      .filter((s) => s.duration && dayKeyInTz(s.startedAt, timezone) === todayKey)
      .reduce((sum, s) => sum + Math.round((s.duration ?? 0) / 60), 0)
  }, [sessions, timezone])

  const stats = useMemo(() => {
    const goals = data?.goals ?? []
    const habits = data?.habits ?? []
    const goalsProgress = goals.length
      ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
      : 0
    const topStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0)
    return [
      {
        label: 'Tasks Today',
        value: String(data?.todayTasks.length ?? 0),
        icon: CheckSquare,
        tone: 'navy' as Tone,
      },
      {
        label: 'Focus Time',
        value: formatMinutes(focusMinutesToday),
        icon: Timer,
        tone: 'amber' as Tone,
      },
      {
        label: 'Goals Progress',
        value: `${goalsProgress}%`,
        icon: Target,
        tone: 'emerald' as Tone,
      },
      {
        label: 'Streak',
        value: String(topStreak),
        icon: Flame,
        tone: 'amberBright' as Tone,
      },
    ]
  }, [data, focusMinutesToday])

  // Today's plan = today's tasks first, then any overdue tasks still open.
  const plan = useMemo<Task[]>(() => {
    if (!data) return []
    const overdueOpen = data.overdueTasks.filter((t) => t.status !== 'DONE')
    return [...data.todayTasks, ...overdueOpen]
  }, [data])

  const focusSeries = useMemo(() => {
    if (!sessions) return null
    const days: number[] = []
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = dayKeyInTz(d, timezone)
      const minutes = sessions
        .filter((s) => s.duration && dayKeyInTz(s.startedAt, timezone) === key)
        .reduce((sum, s) => sum + Math.round((s.duration ?? 0) / 60), 0)
      days.push(minutes)
    }
    return days
  }, [sessions, timezone])

  function toggle(task: Task) {
    updateTask.mutate({
      id: task.id,
      input: { status: task.status === 'DONE' ? 'TODO' : 'DONE' },
    })
  }

  function submitCoach(e: FormEvent) {
    e.preventDefault()
    const text = coachDraft.trim()
    navigate('/coach', text ? { state: { prefill: text } } : undefined)
  }

  const now = new Date()
  const hourInTz = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    }).format(now),
  )

  const coachBlurb = data
    ? `You have ${data.todayTasks.length} task${
        data.todayTasks.length === 1 ? '' : 's'
      } scheduled today${
        data.overdueTasks.length ? ` and ${data.overdueTasks.length} overdue` : ''
      }. Ask me to plan your day and I'll help you prioritise.`
    : "I'm here to help you plan your day, stay focused, and build better habits."

  return (
    <div className="flex flex-col gap-4">
      {/* Greeting banner */}
      <div className="flex flex-wrap items-center justify-between gap-5 rounded-[20px] bg-linear-120 from-navy-900 to-navy-700 p-[26px] text-white">
        <div>
          <div className="text-[22px] font-extrabold">
            {greeting(hourInTz)}, {firstName} 👋
          </div>
          <div className="mt-1 font-medium text-slate-300">Let's make today amazing.</div>
        </div>
        <Button
          className="gap-2"
          onClick={() =>
            navigate('/coach', { state: { prefill: 'Help me plan my day' } })
          }
        >
          <Sparkles size={17} aria-hidden="true" />
          Plan my day
        </Button>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} padding="sm">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-3 h-7 w-16" />
              </Card>
            ))
          : stats.map((s) => (
              <StatCard
                key={s.label}
                label={s.label}
                value={s.value}
                icon={s.icon}
                tone={s.tone}
              />
            ))}
      </div>

      {/* Plan + coach */}
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card padding="md">
          <CardTitle className="mb-3.5">Today's Plan</CardTitle>
          {isLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <p className="text-sm font-medium text-accent-red">
                Couldn't load your plan.
              </p>
              <Button variant="surface" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : plan.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="Nothing scheduled for today"
              description="Add a task with a due date and it'll show up here."
              action={
                <Button variant="navy" size="sm" onClick={() => navigate('/tasks')}>
                  Go to Tasks
                </Button>
              }
            />
          ) : (
            <div className="flex flex-col">
              {plan.map((t) => {
                const done = t.status === 'DONE'
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggle(t)}
                    className="flex items-center gap-3 rounded-[10px] border-b border-app-hairline px-2.5 py-3 text-left last:border-b-0 hover:bg-app-raised"
                  >
                    <span
                      className={cn(
                        'grid size-[22px] shrink-0 place-items-center rounded-[7px] border-2',
                        done ? 'border-amber-500 bg-amber-500' : 'border-slate-300',
                      )}
                    >
                      <CheckSquare
                        size={13}
                        className={cn('text-white', done ? 'opacity-100' : 'opacity-0')}
                        aria-hidden="true"
                      />
                    </span>
                    <span
                      className={cn(
                        'flex-1 text-[14.5px] font-semibold',
                        done ? 'text-app-ink-faint line-through' : 'text-app-ink',
                      )}
                    >
                      {t.title}
                    </span>
                    <span className="text-xs font-semibold text-app-ink-faint">
                      {formatDueLabel(t.dueDate, timezone)}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </Card>

        <Card variant="navy" padding="md">
          <div className="flex items-center gap-2.5 text-base font-extrabold">
            <span className="grid size-[30px] place-items-center rounded-[9px] bg-amber-500/[0.18] text-amber-500">
              <Bot size={17} aria-hidden="true" />
            </span>
            AI Coach
          </div>
          <p className="mt-3.5 mb-4 text-sm font-medium leading-relaxed text-slate-300">
            {coachBlurb}
          </p>
          <form
            onSubmit={submitCoach}
            className="flex items-center gap-2 rounded-[11px] border border-white/12 bg-white/5 py-1.5 pr-1.5 pl-3.5"
          >
            <input
              value={coachDraft}
              onChange={(e) => setCoachDraft(e.target.value)}
              placeholder="Ask anything…"
              aria-label="Ask the AI coach"
              className="flex-1 border-0 bg-transparent text-base text-white outline-none placeholder:text-app-ink-faint sm:text-sm"
            />
            <button
              type="submit"
              aria-label="Send to coach"
              className="grid place-items-center rounded-[11px] bg-amber-500 p-2.5 text-navy-900 hover:bg-amber-600"
            >
              <ArrowUp size={16} aria-hidden="true" />
            </button>
          </form>
        </Card>
      </div>

      {/* Productivity chart — real focus minutes over the last 7 days */}
      <Card padding="md">
        <CardTitle className="mb-4">Productivity Overview</CardTitle>
        {focusSeries && focusSeries.some((v) => v > 0) ? (
          <svg
            viewBox="0 0 720 180"
            preserveAspectRatio="none"
            className="h-[180px] w-full"
            role="img"
            aria-label="Focus minutes over the last seven days"
          >
            <defs>
              <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="rgba(245,158,11,0.25)" />
                <stop offset="1" stopColor="rgba(245,158,11,0)" />
              </linearGradient>
            </defs>
            <path d={areaPaths(focusSeries).area} fill="url(#dash-area)" />
            <path
              d={areaPaths(focusSeries).line}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
            />
          </svg>
        ) : (
          <EmptyState
            icon={Timer}
            title="No focus sessions yet"
            description="Start a Focus session and your weekly productivity will appear here."
            action={
              <Button variant="navy" size="sm" onClick={() => navigate('/focus')}>
                Start focusing
              </Button>
            }
          />
        )}
      </Card>
    </div>
  )
}
