import { useState, type FormEvent } from 'react'
import { CheckCircle2, Circle, Clock, Plus, Trash2 } from 'lucide-react'
import type { SubGoal } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { DateTimeField } from '@/components/form/DateTimeField'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import { useCreateReminder } from '@/features/reminders/hooks/useReminders'
import { formatDateTime } from '@/lib/datetime'
import { useAddSubGoal, useDeleteSubGoal, useUpdateSubGoal } from '../hooks/useGoals'

export function SubGoalList({
  goalId,
  subGoals,
}: {
  goalId: string
  subGoals: SubGoal[]
}) {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState<string | null>(null)
  const [remind, setRemind] = useState(false)
  const timezone = useUserTimezone()
  const addSubGoal = useAddSubGoal(goalId)
  const updateSubGoal = useUpdateSubGoal(goalId)
  const deleteSubGoal = useDeleteSubGoal(goalId)
  const createReminder = useCreateReminder()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    addSubGoal.mutate(
      { title: trimmed, dueDate: dueDate ? new Date(dueDate) : null },
      {
        onSuccess: (created) => {
          const sg = created as SubGoal
          if (remind && dueDate && sg?.id) {
            createReminder.mutate({
              entityType: 'subgoal',
              entityId: sg.id,
              remindAt: new Date(dueDate),
              offsetLabel: 'At time',
              message: `The time for "${trimmed}" is up — please complete it.`,
            })
          }
          setTitle('')
          setDueDate(null)
          setRemind(false)
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {subGoals.length === 0 && (
        <p className="text-sm text-text-muted">No sub-goals yet.</p>
      )}
      {subGoals.map((sg) => (
        <div
          key={sg.id}
          className="flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-2"
        >
          <button
            type="button"
            aria-label={sg.done ? 'Mark as not done' : 'Mark as done'}
            onClick={() =>
              updateSubGoal.mutate({ subGoalId: sg.id, input: { done: !sg.done } })
            }
            className="text-text-muted hover:text-primary"
          >
            {sg.done ? (
              <CheckCircle2 className="size-5 text-success" />
            ) : (
              <Circle className="size-5" />
            )}
          </button>
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                'truncate text-sm text-text',
                sg.done && 'text-text-muted line-through',
              )}
            >
              {sg.title}
            </p>
            {sg.dueDate ? (
              <p className="flex items-center gap-1 text-xs text-text-muted">
                <Clock className="size-3" />
                {formatDateTime(sg.dueDate, timezone)}
              </p>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete sub-goal"
            onClick={() => deleteSubGoal.mutate(sg.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a sub-goal…"
            aria-label="Sub-goal title"
            className="flex-1"
          />
          <Button type="submit" disabled={!title.trim()}>
            <Plus className="size-4" />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <DateTimeField
            label="Deadline (optional)"
            value={dueDate}
            onChange={setDueDate}
            timezone={timezone}
            mode="datetime"
            wrapperClassName="flex-1 min-w-[220px]"
          />
          <label className="flex items-center gap-2 pb-3 text-sm font-medium text-text-muted">
            <input
              type="checkbox"
              checked={remind}
              disabled={!dueDate}
              onChange={(e) => setRemind(e.target.checked)}
              className="size-4 accent-amber-500"
            />
            Remind me
          </label>
        </div>
      </form>
    </div>
  )
}
