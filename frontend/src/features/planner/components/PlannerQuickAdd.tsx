import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import * as tasksApi from '@/features/tasks/api'
import * as remindersApi from '@/features/reminders/api'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import { wallTimeToUtcIso } from '@/lib/datetime'

const REMINDER_OPTIONS: { value: string; label: string; minutes: number }[] = [
  { value: '', label: 'No reminder', minutes: 0 },
  { value: '0', label: 'At time', minutes: 0 },
  { value: '10', label: '10 min before', minutes: 10 },
  { value: '60', label: '1 hour before', minutes: 60 },
]

/**
 * Add a plan item for the day with an optional time and reminder. Each item is
 * a real Task; a time makes it show on the day's schedule, and a reminder fires
 * the audible alarm. Typed input is kept in the inline form until submitted, so
 * clicking elsewhere never discards it (Global Requirement B).
 */
export function PlannerQuickAdd({ date }: { date: string }) {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [reminder, setReminder] = useState('')
  const timezone = useUserTimezone()
  const queryClient = useQueryClient()

  const createTask = useMutation({
    mutationFn: async () => {
      const dueIso = wallTimeToUtcIso(`${date}T${time || '12:00'}`, timezone)
      const task = await tasksApi.createTask({
        title: title.trim(),
        priority: 'MEDIUM',
        status: 'TODO',
        dueDate: new Date(dueIso),
      })
      if (reminder !== '' && time) {
        const opt = REMINDER_OPTIONS.find((o) => o.value === reminder)
        const remindAt = new Date(
          new Date(dueIso).getTime() - (opt?.minutes ?? 0) * 60_000,
        )
        if (remindAt.getTime() > Date.now()) {
          await remindersApi.createReminder({
            entityType: 'task',
            entityId: task.id,
            remindAt,
            offsetLabel: opt?.label,
          })
        }
      }
      return task
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setTitle('')
      setTime('')
      setReminder('')
    },
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    createTask.mutate()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task for this day…"
        aria-label="Task title"
        className="flex-1"
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        aria-label="Time"
        className="h-10 rounded-md border border-border bg-surface px-2 text-sm text-text"
      />
      <select
        value={reminder}
        onChange={(e) => setReminder(e.target.value)}
        aria-label="Reminder"
        disabled={!time}
        className="h-10 rounded-md border border-border bg-surface px-2 text-sm text-text disabled:opacity-50"
      >
        {REMINDER_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Button type="submit" disabled={!title.trim() || createTask.isPending}>
        <Plus className="size-4" />
        Add
      </Button>
    </form>
  )
}
