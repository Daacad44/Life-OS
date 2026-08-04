import { useState } from 'react'
import { Check, Flame, Plus } from 'lucide-react'
import { Button, Card, Tabs, type TabItem } from '@/components/ui-kit'
import { cn } from '@/lib/utils'

type HabitTab = 'all' | 'daily' | 'weekly'

// MOCK — replace with useHabits(); shape mirrors the prototype's sample data.
interface Habit {
  id: number
  name: string
  streak: number
  doneToday: boolean
}
const initialHabits: Habit[] = [
  { id: 1, name: 'Morning Meditation', streak: 12, doneToday: true },
  { id: 2, name: 'Workout', streak: 8, doneToday: false },
  { id: 3, name: 'No Sugar', streak: 15, doneToday: true },
  { id: 4, name: 'Read 20 Pages', streak: 10, doneToday: false },
  { id: 5, name: 'Drink 2L Water', streak: 7, doneToday: false },
]

const tabs: TabItem<HabitTab>[] = [
  { key: 'all', label: 'All' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
]

export function HabitsPage() {
  const [habits, setHabits] = useState(initialHabits)
  const [tab, setTab] = useState<HabitTab>('all')

  function toggle(id: number) {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              doneToday: !h.doneToday,
              streak: h.doneToday ? h.streak - 1 : h.streak + 1,
            }
          : h,
      ),
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Tabs items={tabs} value={tab} onChange={setTab} ariaLabel="Habit filters" />
        <Button variant="navy" size="sm" className="gap-1.5">
          <Plus size={15} aria-hidden="true" />
          Add Habit
        </Button>
      </div>

      <Card padding="none" className="px-5 py-2">
        {habits.map((h) => (
          <div
            key={h.id}
            className="flex items-center gap-3.5 border-b border-slate-100 py-[15px] last:border-b-0"
          >
            <span className="flex-1 text-[15px] font-bold">{h.name}</span>
            <span className="flex items-center gap-1.5 text-sm font-extrabold tabular-nums text-amber-600">
              <Flame size={17} className="text-amber-500" aria-hidden="true" />
              {h.streak} days
            </span>
            <button
              type="button"
              onClick={() => toggle(h.id)}
              aria-label={h.doneToday ? `Mark ${h.name} not done` : `Mark ${h.name} done`}
              className={cn(
                'grid size-[34px] place-items-center rounded-[10px] border-2',
                h.doneToday ? 'border-amber-500 bg-amber-500' : 'border-slate-300',
              )}
            >
              <Check
                size={17}
                className={h.doneToday ? 'text-white' : 'text-slate-300'}
                aria-hidden="true"
              />
            </button>
          </div>
        ))}
      </Card>
    </div>
  )
}
