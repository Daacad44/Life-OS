import { useState, type FormEvent } from 'react'
import { Trash2 } from 'lucide-react'
import { Button, Input, Modal } from '@/components/ui-kit'
import { DateTimeField } from '@/components/form/DateTimeField'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import type { CalendarEvent, CreateEventInput } from '@life-os/shared'

export function EventFormModal({
  open,
  onClose,
  onSubmit,
  onDelete,
  event,
  defaultDate,
  pending,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (input: CreateEventInput) => void
  onDelete?: () => void
  event?: CalendarEvent
  /** ISO day the user clicked, used to seed a new event's times. */
  defaultDate?: string
  pending?: boolean
}) {
  const timezone = useUserTimezone()

  const seedStart = event?.startTime ?? defaultDate ?? new Date().toISOString()
  const seedEnd =
    event?.endTime ??
    new Date(new Date(seedStart).getTime() + 60 * 60 * 1000).toISOString()

  const [title, setTitle] = useState(event?.title ?? '')
  const [allDay, setAllDay] = useState(event?.allDay ?? false)
  const [start, setStart] = useState<string | null>(seedStart)
  const [end, setEnd] = useState<string | null>(seedEnd)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed || !start || !end) return
    if (new Date(start) >= new Date(end)) {
      setError('End time must be after the start time.')
      return
    }
    onSubmit({
      title: trimmed,
      startTime: new Date(start),
      endTime: new Date(end),
      allDay,
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={event ? 'Edit event' : 'New event'}
      footer={
        <>
          {event && onDelete ? (
            <Button
              variant="surface"
              size="sm"
              className="mr-auto gap-1.5 text-accent-red"
              onClick={onDelete}
            >
              <Trash2 size={15} aria-hidden="true" />
              Delete
            </Button>
          ) : null}
          <Button variant="surface" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="navy"
            size="sm"
            type="submit"
            form="event-form"
            disabled={!title.trim() || pending}
          >
            {event ? 'Save changes' : 'Add event'}
          </Button>
        </>
      }
    >
      <form id="event-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's happening?"
          autoFocus
          required
        />
        <label className="flex items-center gap-2.5 text-sm font-semibold text-app-ink-soft">
          <input
            type="checkbox"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
            className="size-4 accent-amber-500"
          />
          All day
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <DateTimeField
            label="Starts"
            value={start}
            onChange={setStart}
            timezone={timezone}
            mode={allDay ? 'date' : 'datetime'}
            required
          />
          <DateTimeField
            label="Ends"
            value={end}
            onChange={setEnd}
            timezone={timezone}
            mode={allDay ? 'date' : 'datetime'}
            required
          />
        </div>
        {error ? (
          <p className="text-[13px] font-semibold text-accent-red">{error}</p>
        ) : null}
      </form>
    </Modal>
  )
}
