import { useState, type FormEvent } from 'react'
import { createGoalSchema } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateGoal } from '../hooks/useGoals'

export function GoalForm({ onCreated }: { onCreated?: () => void }) {
  const [title, setTitle] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const createGoal = useCreateGoal()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const result = createGoalSchema.safeParse({
      title,
      targetDate: targetDate || undefined,
    })
    if (!result.success) return
    createGoal.mutate(result.data, {
      onSuccess: () => {
        setTitle('')
        setTargetDate('')
        onCreated?.()
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <div className="flex flex-1 flex-col gap-1.5">
        <Label htmlFor="goal-title">New goal</Label>
        <Input
          id="goal-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What are you working toward?"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="goal-target">Target date</Label>
        <Input
          id="goal-target"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={!title.trim() || createGoal.isPending}>
        {createGoal.isPending ? 'Creating…' : 'Create goal'}
      </Button>
    </form>
  )
}
