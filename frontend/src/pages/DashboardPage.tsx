import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'
import { TodayTasksWidget } from '@/features/dashboard/components/TodayTasksWidget'
import { GoalProgressWidget } from '@/features/dashboard/components/GoalProgressWidget'
import { HabitStreaksWidget } from '@/features/dashboard/components/HabitStreaksWidget'
import { QuickStatsWidget } from '@/features/dashboard/components/QuickStatsWidget'

export function DashboardPage() {
  const { data: user } = useCurrentUser()
  const { data, isLoading, isError, refetch } = useDashboard()

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">
          Welcome{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="text-text-muted">{today}</p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-md bg-primary-muted" />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-danger">Couldn&apos;t load your dashboard.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {data && (
        <div className="flex flex-col gap-4">
          <QuickStatsWidget data={data} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TodayTasksWidget
              todayTasks={data.todayTasks}
              overdueTasks={data.overdueTasks}
            />
            <GoalProgressWidget goals={data.goals} />
            <HabitStreaksWidget habits={data.habits} />
          </div>
        </div>
      )}
    </div>
  )
}
