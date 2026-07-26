import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateTask } from '../hooks/useTasks'
import type { ListTasksQuery } from '@life-os/shared'

export function QuickAdd({ filters }: { filters: Partial<ListTasksQuery> }) {
  const [title, setTitle] = useState('')
  const createTask = useCreateTask(filters)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    createTask.mutate({ title: trimmed, priority: 'MEDIUM', status: 'TODO' })
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task…"
        aria-label="Task title"
      />
      <Button type="submit" disabled={!title.trim()}>
        <Plus className="size-4" />
        Add
      </Button>
    </form>
  )
}
