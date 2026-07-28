import { Flame } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import type { Habit } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { useCheckin } from '@/features/habits/hooks/useHabits'
import { Widget } from './Widget'

function isCheckedInToday(habit: Habit) {
  const todayKey = new Date().toISOString().slice(0, 10)
  return habit.checkins.some((c) => c.date.slice(0, 10) === todayKey)
}

export function HabitStreaksWidget({ habits }: { habits: Habit[] }) {
  const checkin = useCheckin()
  const queryClient = useQueryClient()

  return (
    <Widget title="Habit Streaks" linkTo="/habits">
      {habits.length === 0 && (
        <p className="text-sm text-text-muted">Start your first habit.</p>
      )}
      {habits.map((habit) => {
        const done = isCheckedInToday(habit)
        return (
          <div key={habit.id} className="flex items-center justify-between gap-2">
            <span className="truncate text-sm text-text">{habit.title}</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-medium text-warning">
                <Flame className="size-3.5" />
                {habit.streak}
              </span>
              <Button
                size="sm"
                variant={done ? 'outline' : 'default'}
                disabled={done}
                onClick={() =>
                  checkin.mutate(habit.id, {
                    onSuccess: () =>
                      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
                  })
                }
              >
                {done ? 'Done' : 'Check in'}
              </Button>
            </div>
          </div>
        )
      })}
    </Widget>
  )
}
