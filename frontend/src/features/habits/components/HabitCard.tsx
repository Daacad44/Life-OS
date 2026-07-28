import { Flame, Trash2 } from 'lucide-react'
import type { Habit } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCheckin, useDeleteHabit } from '../hooks/useHabits'
import { HabitHeatmap } from './HabitHeatmap'

function isCheckedInThisPeriod(habit: Habit) {
  const now = new Date()
  if (habit.frequency === 'DAILY') {
    const todayKey = now.toISOString().slice(0, 10)
    return habit.checkins.some((c) => c.date.slice(0, 10) === todayKey)
  }
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  return habit.checkins.some((c) => new Date(c.date) >= startOfWeek)
}

export function HabitCard({ habit }: { habit: Habit }) {
  const checkin = useCheckin()
  const deleteHabit = useDeleteHabit()
  const checkedIn = isCheckedInThisPeriod(habit)

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-medium text-text">{habit.title}</p>
            <p className="text-xs text-text-muted">
              {habit.frequency === 'DAILY' ? 'Daily' : 'Weekly'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
              <Flame className="size-3.5" />
              {habit.streak}
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete habit"
              onClick={() => deleteHabit.mutate(habit.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>

        <HabitHeatmap checkins={habit.checkins} />

        <Button
          size="sm"
          variant={checkedIn ? 'outline' : 'default'}
          disabled={checkedIn || checkin.isPending}
          onClick={() => checkin.mutate(habit.id)}
          className="w-fit"
        >
          {checkedIn ? 'Checked in' : 'Check in'}
        </Button>
      </CardContent>
    </Card>
  )
}
