import { useState } from 'react'
import { ArrowUp, Bot, CheckSquare, Flame, Sparkles, Target, Timer } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button, Card, CardTitle, StatCard, type Tone } from '@/components/ui-kit'
import { cn } from '@/lib/utils'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'

// MOCK — replace with useDashboard()/useTasks() hooks; shape mirrors the prototype.
interface Stat {
  label: string
  value: string
  icon: typeof CheckSquare
  tone: Tone
}
const stats: Stat[] = [
  { label: 'Tasks Today', value: '12', icon: CheckSquare, tone: 'navy' },
  { label: 'Focus Time', value: '2h 45m', icon: Timer, tone: 'amber' },
  { label: 'Goals Progress', value: '62%', icon: Target, tone: 'emerald' },
  { label: 'Streak', value: '12', icon: Flame, tone: 'amberBright' },
]

interface PlanTask {
  id: number
  title: string
  due: string
  done: boolean
}
const initialPlan: PlanTask[] = [
  { id: 1, title: 'Design new landing page', due: 'Today', done: false },
  { id: 2, title: 'Fix mobile navigation bug', due: 'Today', done: true },
  { id: 3, title: 'Work on project proposal', due: 'Tomorrow', done: false },
  { id: 4, title: 'Team stand-up meeting', due: 'Tomorrow', done: false },
  { id: 5, title: 'Write blog post', due: 'Jun 2', done: false },
]

export function DashboardPage() {
  const { data: user } = useCurrentUser()
  const firstName = (user?.name ?? 'there').split(' ')[0]
  const [plan, setPlan] = useState(initialPlan)

  function toggle(id: number) {
    setPlan((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Greeting banner */}
      <div className="flex flex-wrap items-center justify-between gap-5 rounded-[20px] bg-linear-120 from-navy-900 to-navy-700 p-[26px] text-white">
        <div>
          <div className="text-[22px] font-extrabold">Good morning, {firstName} 👋</div>
          <div className="mt-1 font-medium text-slate-300">Let's make today amazing.</div>
        </div>
        <Button className="gap-2">
          <Sparkles size={17} aria-hidden="true" />
          Plan my day
        </Button>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
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
          <div className="flex flex-col">
            {plan.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => toggle(t.id)}
                className="flex items-center gap-3 rounded-[10px] border-b border-slate-100 px-2.5 py-3 text-left last:border-b-0 hover:bg-slate-50"
              >
                <span
                  className={cn(
                    'grid size-[22px] shrink-0 place-items-center rounded-[7px] border-2',
                    t.done ? 'border-amber-500 bg-amber-500' : 'border-slate-300',
                  )}
                >
                  <CheckSquare
                    size={13}
                    className={cn('text-white', t.done ? 'opacity-100' : 'opacity-0')}
                    aria-hidden="true"
                  />
                </span>
                <span
                  className={cn(
                    'flex-1 text-[14.5px] font-semibold',
                    t.done ? 'text-slate-400 line-through' : 'text-slate-900',
                  )}
                >
                  {t.title}
                </span>
                <span className="text-xs font-semibold text-slate-400">{t.due}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card variant="navy" padding="md">
          <div className="flex items-center gap-2.5 text-base font-extrabold">
            <span className="grid size-[30px] place-items-center rounded-[9px] bg-amber-500/[0.18] text-amber-500">
              <Bot size={17} aria-hidden="true" />
            </span>
            AI Coach
          </div>
          <p className="mt-3.5 mb-4 text-sm font-medium leading-relaxed text-slate-300">
            You've completed 62% of this week's goals — your best week yet. Block 2 hours
            this afternoon for deep work on "Launch course".
          </p>
          <div className="flex items-center gap-2 rounded-[11px] border border-white/12 bg-white/5 py-1.5 pr-1.5 pl-3.5">
            <input
              placeholder="Ask anything…"
              aria-label="Ask the AI coach"
              className="flex-1 border-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
            />
            <Link
              to="/coach"
              aria-label="Send to coach"
              className="grid place-items-center rounded-[11px] bg-amber-500 p-2.5 text-navy-900 hover:bg-amber-600"
            >
              <ArrowUp size={16} aria-hidden="true" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Productivity chart */}
      <Card padding="md">
        <CardTitle className="mb-4">Productivity Overview</CardTitle>
        <svg
          viewBox="0 0 720 180"
          preserveAspectRatio="none"
          className="h-[180px] w-full"
          role="img"
          aria-label="Productivity trending upward over the week"
        >
          <defs>
            <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(245,158,11,0.25)" />
              <stop offset="1" stopColor="rgba(245,158,11,0)" />
            </linearGradient>
          </defs>
          <path
            d="M0,140 C80,120 120,70 200,84 C280,98 320,40 400,54 C480,68 520,30 600,44 C660,54 690,36 720,42 L720,180 L0,180 Z"
            fill="url(#dash-area)"
          />
          <path
            d="M0,140 C80,120 120,70 200,84 C280,98 320,40 400,54 C480,68 520,30 600,44 C660,54 690,36 720,42"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
          />
        </svg>
      </Card>
    </div>
  )
}
