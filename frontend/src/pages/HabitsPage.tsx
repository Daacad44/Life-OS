import { Button } from '@/components/ui/button'
import { HabitCard } from '@/features/habits/components/HabitCard'
import { HabitForm } from '@/features/habits/components/HabitForm'
import { useHabits } from '@/features/habits/hooks/useHabits'

export function HabitsPage() {
  const { data: habits, isLoading, isError, refetch } = useHabits()

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text">Habits</h1>
      <HabitForm />

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-md bg-primary-muted" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-danger">Couldn&apos;t load habits.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {habits && habits.length === 0 && (
        <p className="py-10 text-center text-sm text-text-muted">
          Start your first habit.
        </p>
      )}

      {habits && habits.length > 0 && (
        <div className="flex flex-col gap-3">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </div>
  )
}
