import { useState, type FormEvent } from 'react'
import { Trash2 } from 'lucide-react'
import { Button, Input } from '@/components/ui-kit'
import { GuardedModal } from '@/components/form/GuardedModal'
import { DateTimeField } from '@/components/form/DateTimeField'
import {
  ReminderField,
  resolveReminder,
  type ReminderValue,
} from '@/features/reminders/components/ReminderField'
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
  onSubmit: (input: CreateEventInput, reminder: ReminderValue | null) => void
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
  const [reminderPreset, setReminderPreset] = useState('none')
  const [reminderCustom, setReminderCustom] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault()
    const trimmed = title.trim()
    if (!trimmed || !start || !end) return
    if (new Date(start) >= new Date(end)) {
      setError('End time must be after the start time.')
      return
    }
    onSubmit(
      { title: trimmed, startTime: new Date(start), endTime: new Date(end), allDay },
      resolveReminder(reminderPreset, start, reminderCustom),
    )
  }

  return (
    <GuardedModal
      open={open}
      onDiscard={onClose}
      onSave={handleSubmit}
      dirty={touched}
      title={event ? 'Edit event' : 'New event'}
      footer={({ requestClose }) => (
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
          <Button variant="surface" size="sm" onClick={requestClose}>
            Cancel
          </Button>
          <Button
            variant="navy"
            size="sm"
            onClick={() => handleSubmit()}
            disabled={!title.trim() || pending}
          >
            {event ? 'Save changes' : 'Add event'}
          </Button>
        </>
      )}
    >
      <form
        id="event-form"
        onSubmit={handleSubmit}
        onChange={() => setTouched(true)}
        className="flex flex-col gap-4"
      >
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
            onChange={(e) => {
              setAllDay(e.target.checked)
              setTouched(true)
            }}
            className="size-4 accent-amber-500"
          />
          All day
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <DateTimeField
            label="Starts"
            value={start}
            onChange={(v) => {
              setStart(v)
              setTouched(true)
            }}
            timezone={timezone}
            mode={allDay ? 'date' : 'datetime'}
            required
          />
          <DateTimeField
            label="Ends"
            value={end}
            onChange={(v) => {
              setEnd(v)
              setTouched(true)
            }}
            timezone={timezone}
            mode={allDay ? 'date' : 'datetime'}
            required
          />
        </div>
        <ReminderField
          baseTime={start}
          presetKey={reminderPreset}
          onPresetChange={(k) => {
            setReminderPreset(k)
            setTouched(true)
          }}
          customAt={reminderCustom}
          onCustomChange={setReminderCustom}
          timezone={timezone}
        />
        {error ? (
          <p className="text-[13px] font-semibold text-accent-red">{error}</p>
        ) : null}
      </form>
    </GuardedModal>
  )
}
