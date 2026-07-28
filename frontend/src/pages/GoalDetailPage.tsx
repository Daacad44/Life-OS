import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Sparkles, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProgressBar } from '@/features/goals/components/ProgressBar'
import { SubGoalList } from '@/features/goals/components/SubGoalList'
import {
  useBreakdownGoal,
  useDeleteGoal,
  useGoal,
  useUpdateGoal,
} from '@/features/goals/hooks/useGoals'

export function GoalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: goal, isLoading, isError } = useGoal(id!)
  const updateGoal = useUpdateGoal(id!)
  const deleteGoal = useDeleteGoal()
  const breakdownGoal = useBreakdownGoal(id!)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')

  if (isLoading) {
    return <div className="h-32 max-w-2xl animate-pulse rounded-md bg-primary-muted" />
  }

  if (isError || !goal) {
    return <p className="text-sm text-danger">Couldn&apos;t load this goal.</p>
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Button
        variant="ghost"
        size="sm"
        className="w-fit"
        onClick={() => navigate('/goals')}
      >
        <ArrowLeft className="size-4" />
        Back to goals
      </Button>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          {editing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                if (title.trim()) updateGoal.mutate({ title: title.trim() })
                setEditing(false)
              }}
              autoFocus
            />
          ) : (
            <h1
              className="cursor-text text-2xl font-semibold text-text"
              onClick={() => {
                setTitle(goal.title)
                setEditing(true)
              }}
            >
              {goal.title}
            </h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete goal"
            onClick={() =>
              deleteGoal.mutate(goal.id, { onSuccess: () => navigate('/goals') })
            }
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        <ProgressBar value={goal.progress} />
        <div className="flex items-center justify-between text-sm text-text-muted">
          <span>{goal.progress}% complete</span>
          {goal.targetDate && (
            <span>Target {new Date(goal.targetDate).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-text-muted">Sub-goals</h2>
          <Button
            variant="outline"
            size="sm"
            disabled={breakdownGoal.isPending}
            onClick={() => breakdownGoal.mutate()}
          >
            <Sparkles className="size-4" />
            {breakdownGoal.isPending ? 'Breaking down...' : 'Break down with AI'}
          </Button>
        </div>
        {breakdownGoal.isError && (
          <p className="text-xs text-danger">
            Couldn&apos;t break this goal down right now — try again shortly.
          </p>
        )}
        {breakdownGoal.isSuccess && (
          <p className="rounded-md border border-border bg-primary-muted px-3 py-2 text-sm text-text">
            {breakdownGoal.data.advice}
          </p>
        )}
        <SubGoalList goalId={goal.id} subGoals={goal.subGoals} />
      </div>

      {goal.tasks.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-text-muted">Linked tasks</h2>
          <div className="flex flex-col gap-2">
            {goal.tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text"
              >
                {task.title}{' '}
                <span className="text-xs text-text-muted">({task.status})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
