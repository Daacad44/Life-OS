import { Link } from 'react-router-dom'
import type { Goal } from '@life-os/shared'
import { Card, CardContent } from '@/components/ui/card'
import { ProgressBar } from './ProgressBar'

export function GoalCard({ goal }: { goal: Goal }) {
  const isOverdue =
    goal.targetDate && new Date(goal.targetDate) < new Date() && goal.progress < 100

  return (
    <Link to={`/goals/${goal.id}`}>
      <Card className="transition-colors hover:border-primary">
        <CardContent className="flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-medium text-text">{goal.title}</p>
            <span className="shrink-0 text-sm text-text-muted">{goal.progress}%</span>
          </div>
          <ProgressBar value={goal.progress} />
          {goal.targetDate && (
            <p className={`text-xs ${isOverdue ? 'text-danger' : 'text-text-muted'}`}>
              Target {new Date(goal.targetDate).toLocaleDateString()}
              {isOverdue && ' — overdue'}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
