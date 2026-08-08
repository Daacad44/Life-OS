import { useState, type FormEvent } from 'react'
import type { HabitFrequency } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateHabit } from '../hooks/useHabits'

export function HabitForm() {
  const [title, setTitle] = useState('')
  const [frequency, setFrequency] = useState<HabitFrequency>('DAILY')
  const [timeOfDay, setTimeOfDay] = useState('')
  const createHabit = useCreateHabit()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    createHabit.mutate(
      { title: trimmed, frequency, timeOfDay: timeOfDay || null },
      {
        onSuccess: () => {
          setTitle('')
          setTimeOfDay('')
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="habit-title">New habit</Label>
          <Input
            id="habit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Read for 20 minutes"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="habit-time">Time</Label>
          <input
            id="habit-time"
            type="time"
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
            className="h-10 rounded-md border border-border bg-surface px-2 text-sm text-text"
          />
        </div>
        <div className="flex gap-1">
          {(['DAILY', 'WEEKLY'] as const).map((f) => (
            <Button
              key={f}
              type="button"
              size="sm"
              variant={frequency === f ? 'default' : 'outline'}
              onClick={() => setFrequency(f)}
            >
              {f === 'DAILY' ? 'Daily' : 'Weekly'}
            </Button>
          ))}
        </div>
        <Button type="submit" disabled={!title.trim() || createHabit.isPending}>
          {createHabit.isPending ? 'Creating…' : 'Create habit'}
        </Button>
      </div>
      {timeOfDay ? (
        <p className="text-xs text-text-muted">
          You&apos;ll get an audible reminder at {timeOfDay} each{' '}
          {frequency === 'DAILY' ? 'day' : 'week'}.
        </p>
      ) : null}
    </form>
  )
}
