import { Link } from 'react-router-dom'
import type { Goal } from '@life-os/shared'
import { ProgressBar } from '@/features/goals/components/ProgressBar'
import { Widget } from './Widget'

export function GoalProgressWidget({ goals }: { goals: Goal[] }) {
  return (
    <Widget title="Goal Progress" linkTo="/goals">
      {goals.length === 0 && (
        <p className="text-sm text-text-muted">
          No goals yet — what are you working toward?
        </p>
      )}
      {goals.slice(0, 4).map((goal) => (
        <Link key={goal.id} to={`/goals/${goal.id}`} className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <span className="truncate text-text">{goal.title}</span>
            <span className="shrink-0 text-text-muted">{goal.progress}%</span>
          </div>
          <ProgressBar value={goal.progress} />
        </Link>
      ))}
    </Widget>
  )
}
