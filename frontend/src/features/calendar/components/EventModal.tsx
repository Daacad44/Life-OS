import { useState, type FormEvent } from 'react'
import type { CalendarEvent } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateEvent, useDeleteEvent, useUpdateEvent } from '../hooks/useCalendar'

function toLocalInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function EventModal({
  initialDate,
  event,
  onClose,
}: {
  initialDate?: Date
  event?: CalendarEvent
  onClose: () => void
}) {
  const start = event ? new Date(event.startTime) : (initialDate ?? new Date())
  const end = event ? new Date(event.endTime) : new Date(start.getTime() + 60 * 60 * 1000)

  const [title, setTitle] = useState(event?.title ?? '')
  const [startTime, setStartTime] = useState(toLocalInput(start))
  const [endTime, setEndTime] = useState(toLocalInput(end))
  const [allDay, setAllDay] = useState(event?.allDay ?? false)
  const [error, setError] = useState<string | null>(null)

  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const deleteEvent = useDeleteEvent()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    const input = {
      title: title.trim(),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      allDay,
    }

    if (input.startTime >= input.endTime) {
      setError('End time must be after start time')
      return
    }
    setError(null)

    if (event) {
      updateEvent.mutate({ id: event.id, input }, { onSuccess: onClose })
    } else {
      createEvent.mutate(input, { onSuccess: onClose })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle>{event ? 'Edit event' : 'New event'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="event-title">Title</Label>
              <Input
                id="event-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-text">
              <input
                type="checkbox"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
              />
              All-day
            </label>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="event-start">Starts</Label>
              <Input
                id="event-start"
                type={allDay ? 'date' : 'datetime-local'}
                value={allDay ? startTime.slice(0, 10) : startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="event-end">Ends</Label>
              <Input
                id="event-end"
                type={allDay ? 'date' : 'datetime-local'}
                value={allDay ? endTime.slice(0, 10) : endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}
            <div className="flex justify-between gap-2">
              <div className="flex gap-2">
                <Button type="submit" disabled={!title.trim()}>
                  {event ? 'Save' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
              {event && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => deleteEvent.mutate(event.id, { onSuccess: onClose })}
                >
                  Delete
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
