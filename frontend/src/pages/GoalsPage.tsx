import { useState } from 'react'
import {
  BookOpen,
  Footprints,
  GraduationCap,
  PiggyBank,
  Plus,
  type LucideIcon,
} from 'lucide-react'
import {
  Button,
  Card,
  ProgressBar,
  Tabs,
  type TabItem,
  type Tone,
} from '@/components/ui-kit'
import { cn } from '@/lib/utils'
import { toneChip } from '@/components/ui-kit'

type GoalTab = 'all' | 'active' | 'completed'

// MOCK — replace with useGoals(); shape mirrors the prototype's sample data.
interface Goal {
  title: string
  target: string
  pct: number
  icon: LucideIcon
  tone: Tone
}
const goals: Goal[] = [
  {
    title: 'Run a Marathon',
    target: 'Dec 31, 2026',
    pct: 75,
    icon: Footprints,
    tone: 'amber',
  },
  {
    title: 'Launch Online Course',
    target: 'Aug 1, 2026',
    pct: 60,
    icon: GraduationCap,
    tone: 'navy',
  },
  {
    title: 'Save $10,000',
    target: 'Dec 31, 2026',
    pct: 40,
    icon: PiggyBank,
    tone: 'emerald',
  },
  {
    title: 'Read 50 Books',
    target: 'Dec 31, 2026',
    pct: 20,
    icon: BookOpen,
    tone: 'violet',
  },
]

const tabs: TabItem<GoalTab>[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
]

export function GoalsPage() {
  const [tab, setTab] = useState<GoalTab>('all')
  const visible = goals.filter((g) =>
    tab === 'all' ? true : tab === 'active' ? g.pct < 100 : g.pct >= 100,
  )

  return (
    <div className="flex flex-col gap-3.5">
      <div className="mb-1 flex items-center justify-between gap-3">
        <Tabs items={tabs} value={tab} onChange={setTab} ariaLabel="Goal filters" />
        <Button variant="navy" size="sm" className="gap-1.5">
          <Plus size={15} aria-hidden="true" />
          New Goal
        </Button>
      </div>

      {visible.map((g) => (
        <Card key={g.title} padding="md" className="flex items-center gap-[18px]">
          <div
            className={cn(
              'grid size-[46px] shrink-0 place-items-center rounded-xl',
              toneChip[g.tone],
            )}
          >
            <g.icon size={22} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[15.5px] font-extrabold">{g.title}</span>
              <span className="text-sm font-extrabold tabular-nums">{g.pct}%</span>
            </div>
            <div className="mt-[3px] mb-2.5 text-[12.5px] font-semibold text-app-ink-faint">
              Target: {g.target}
            </div>
            <ProgressBar value={g.pct} tone={g.tone} label={g.title} />
          </div>
        </Card>
      ))}
    </div>
  )
}
