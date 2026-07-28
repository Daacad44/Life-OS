import { useState, type FormEvent } from 'react'
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react'
import type { SubGoal } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAddSubGoal, useDeleteSubGoal, useUpdateSubGoal } from '../hooks/useGoals'

export function SubGoalList({
  goalId,
  subGoals,
}: {
  goalId: string
  subGoals: SubGoal[]
}) {
  const [title, setTitle] = useState('')
  const addSubGoal = useAddSubGoal(goalId)
  const updateSubGoal = useUpdateSubGoal(goalId)
  const deleteSubGoal = useDeleteSubGoal(goalId)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    addSubGoal.mutate({ title: trimmed }, { onSuccess: () => setTitle('') })
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
          <p
            className={cn(
              'flex-1 text-sm text-text',
              sg.done && 'text-text-muted line-through',
            )}
          >
            {sg.title}
          </p>
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

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a sub-goal…"
          aria-label="Sub-goal title"
        />
        <Button type="submit" disabled={!title.trim()}>
          <Plus className="size-4" />
          Add
        </Button>
      </form>
    </div>
  )
}
