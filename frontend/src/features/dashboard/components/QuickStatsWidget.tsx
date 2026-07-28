import type { DashboardResponse } from '@life-os/shared'
import { Card, CardContent } from '@/components/ui/card'

export function QuickStatsWidget({ data }: { data: DashboardResponse }) {
  const tasksDoneToday = data.todayTasks.filter((t) => t.status === 'DONE').length
  const activeGoals = data.goals.filter((g) => g.progress < 100).length
  const habitsOnStreak = data.habits.filter((h) => h.streak > 0).length

  const stats = [
    { label: 'Tasks done today', value: tasksDoneToday },
    { label: 'Active goals', value: activeGoals },
    { label: 'Habits on streak', value: habitsOnStreak },
    { label: 'Overdue tasks', value: data.overdueTasks.length },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex flex-col gap-1 p-4">
            <span className="text-2xl font-semibold text-text">{stat.value}</span>
            <span className="text-xs text-text-muted">{stat.label}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
