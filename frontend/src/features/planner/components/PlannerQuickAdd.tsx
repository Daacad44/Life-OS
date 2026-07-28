import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import * as tasksApi from '@/features/tasks/api'

export function PlannerQuickAdd({ date }: { date: string }) {
  const [title, setTitle] = useState('')
  const queryClient = useQueryClient()

  const createTask = useMutation({
    mutationFn: () =>
      tasksApi.createTask({
        title: title.trim(),
        priority: 'MEDIUM',
        status: 'TODO',
        dueDate: new Date(`${date}T12:00:00.000Z`),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setTitle('')
    },
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    createTask.mutate()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task for this day…"
        aria-label="Task title"
      />
      <Button type="submit" disabled={!title.trim()}>
        <Plus className="size-4" />
        Add
      </Button>
    </form>
  )
}
