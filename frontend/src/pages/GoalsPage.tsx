import { Button } from '@/components/ui/button'
import { GoalCard } from '@/features/goals/components/GoalCard'
import { GoalForm } from '@/features/goals/components/GoalForm'
import { useGoals } from '@/features/goals/hooks/useGoals'

export function GoalsPage() {
  const { data: goals, isLoading, isError, refetch } = useGoals()

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text">Goals</h1>
      <GoalForm />

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-md bg-primary-muted" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-danger">Couldn&apos;t load goals.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {goals && goals.length === 0 && (
        <p className="py-10 text-center text-sm text-text-muted">
          No goals yet — what are you working toward?
        </p>
      )}

      {goals && goals.length > 0 && (
        <div className="flex flex-col gap-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  )
}
