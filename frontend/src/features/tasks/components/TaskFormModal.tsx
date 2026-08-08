import { useMemo, useState, type FormEvent } from 'react'
import { Button, Input } from '@/components/ui-kit'
import { GuardedModal } from '@/components/form/GuardedModal'
import { DateTimeField } from '@/components/form/DateTimeField'
import {
  ReminderField,
  resolveReminder,
  type ReminderValue,
} from '@/features/reminders/components/ReminderField'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import {
  Priority,
  type CreateRecurringTaskInput,
  type CreateTaskInput,
  type RecurrenceFreq,
  type Task,
} from '@life-os/shared'

export interface TaskFormValues {
  title: string
  description: string
  priority: Priority
  /** Due date/time as UTC ISO, or null. */
  dueDate: string | null
  tags: string[]
  reminder: ReminderValue | null
}

export type RecurringFormValues = CreateRecurringTaskInput

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const REMINDER_BEFORE = [
  { value: '', label: 'No reminder' },
  { value: '0', label: 'At time' },
  { value: '10', label: '10 minutes before' },
  { value: '30', label: '30 minutes before' },
  { value: '60', label: '1 hour before' },
  { value: '1440', label: '1 day before' },
]

const inputClass =
  'w-full rounded-[11px] border border-app-hairline bg-app-canvas px-3.5 py-[13px] font-display text-base text-app-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500'

export function TaskFormModal({
  open,
  onClose,
  onSubmit,
  onSubmitRecurring,
  task,
  pending,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (values: TaskFormValues) => void
  onSubmitRecurring?: (values: RecurringFormValues) => void
  task?: Task
  pending?: boolean
}) {
  const timezone = useUserTimezone()
  const isEdit = !!task

  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'MEDIUM')
  const [dueDate, setDueDate] = useState<string | null>(task?.dueDate ?? null)
  const [tagsText, setTagsText] = useState((task?.tags ?? []).join(', '))
  const [reminderPreset, setReminderPreset] = useState('none')
  const [reminderCustom, setReminderCustom] = useState<string | null>(null)

  // Recurrence (create-only)
  const [repeat, setRepeat] = useState<'none' | RecurrenceFreq>('none')
  const [interval, setInterval] = useState(1)
  const [byWeekday, setByWeekday] = useState<number[]>([new Date().getDay()])
  const [timeOfDay, setTimeOfDay] = useState('12:00')

  const [touched, setTouched] = useState(false)

  const tags = useMemo(
    () =>
      tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    [tagsText],
  )

  function toggleWeekday(day: number) {
    setTouched(true)
    setByWeekday((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort(),
    )
  }

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    if (!isEdit && repeat !== 'none' && onSubmitRecurring) {
      const minutes =
        reminderPreset === 'none' || reminderPreset === 'custom'
          ? null
          : ({ at: 0, m10: 10, m30: 30, h1: 60, d1: 1440 }[reminderPreset] ?? null)
      onSubmitRecurring({
        title: trimmed,
        description: description.trim() || undefined,
        priority,
        tags,
        freq: repeat,
        interval,
        byWeekday: repeat === 'WEEKLY' ? byWeekday : undefined,
        timeOfDay,
        reminderMinutesBefore: minutes,
        startDate: new Date(),
      })
      return
    }

    onSubmit({
      title: trimmed,
      description,
      priority,
      dueDate,
      tags,
      reminder: resolveReminder(reminderPreset, dueDate, reminderCustom),
    })
  }

  const canRepeat = !isEdit && !!onSubmitRecurring

  return (
    <GuardedModal
      open={open}
      onDiscard={onClose}
      onSave={handleSubmit}
      dirty={touched}
      title={task ? 'Edit task' : 'New task'}
      footer={({ requestClose }) => (
        <>
          <Button variant="surface" size="sm" onClick={requestClose}>
            Cancel
          </Button>
          <Button
            variant="navy"
            size="sm"
            onClick={() => handleSubmit()}
            disabled={!title.trim() || pending}
          >
            {task ? 'Save changes' : repeat !== 'none' ? 'Create recurring' : 'Add task'}
          </Button>
        </>
      )}
    >
      <form
        onSubmit={handleSubmit}
        onChange={() => setTouched(true)}
        className="flex flex-col gap-4"
      >
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          autoFocus
          required
        />
        <div className="flex flex-col gap-[7px]">
          <label
            htmlFor="task-description"
            className="text-[13px] font-semibold text-app-ink-soft"
          >
            Description
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add detail (optional)"
            rows={2}
            className={inputClass}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-[7px]">
            <label
              htmlFor="task-priority"
              className="text-[13px] font-semibold text-app-ink-soft"
            >
              Priority
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className={inputClass}
            >
              {Priority.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0) + p.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Tags (comma-separated)"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="work, health"
          />
        </div>

        {canRepeat ? (
          <div className="flex flex-col gap-[7px]">
            <label
              htmlFor="task-repeat"
              className="text-[13px] font-semibold text-app-ink-soft"
            >
              Repeat
            </label>
            <select
              id="task-repeat"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value as 'none' | RecurrenceFreq)}
              className={inputClass}
            >
              <option value="none">Does not repeat</option>
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>
        ) : null}

        {repeat === 'none' ? (
          <>
            <DateTimeField
              label="Due date & time"
              value={dueDate}
              onChange={setDueDate}
              timezone={timezone}
              mode="datetime"
            />
            <ReminderField
              baseTime={dueDate}
              presetKey={reminderPreset}
              onPresetChange={setReminderPreset}
              customAt={reminderCustom}
              onCustomChange={setReminderCustom}
              timezone={timezone}
            />
          </>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-[7px]">
                <label
                  htmlFor="task-time"
                  className="text-[13px] font-semibold text-app-ink-soft"
                >
                  Time of day
                </label>
                <input
                  id="task-time"
                  type="time"
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-[7px]">
                <label
                  htmlFor="task-interval"
                  className="text-[13px] font-semibold text-app-ink-soft"
                >
                  Every
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="task-interval"
                    type="number"
                    min={1}
                    max={52}
                    value={interval}
                    onChange={(e) => setInterval(Math.max(1, Number(e.target.value)))}
                    className={inputClass}
                  />
                  <span className="text-sm font-semibold text-app-ink-muted">
                    {repeat === 'DAILY'
                      ? 'day(s)'
                      : repeat === 'WEEKLY'
                        ? 'week(s)'
                        : 'month(s)'}
                  </span>
                </div>
              </div>
            </div>
            {repeat === 'WEEKLY' ? (
              <div className="flex flex-col gap-[7px]">
                <span className="text-[13px] font-semibold text-app-ink-soft">
                  On days
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {WEEKDAYS.map((label, day) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleWeekday(day)}
                      className={
                        'rounded-[9px] border px-3 py-1.5 text-[13px] font-semibold ' +
                        (byWeekday.includes(day)
                          ? 'border-amber-500 bg-amber-100 text-amber-700'
                          : 'border-app-hairline bg-app-surface text-app-ink-soft hover:bg-app-raised')
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="flex flex-col gap-[7px]">
              <label
                htmlFor="task-recur-reminder"
                className="text-[13px] font-semibold text-app-ink-soft"
              >
                Reminder
              </label>
              <select
                id="task-recur-reminder"
                value={reminderPreset === 'none' ? '' : reminderPreset}
                onChange={(e) => {
                  const v = e.target.value
                  const map: Record<string, string> = {
                    '': 'none',
                    '0': 'at',
                    '10': 'm10',
                    '30': 'm30',
                    '60': 'h1',
                    '1440': 'd1',
                  }
                  setReminderPreset(map[v] ?? 'none')
                }}
                className={inputClass}
              >
                {REMINDER_BEFORE.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <p className="text-xs font-medium text-app-ink-muted">
                Occurrences and their reminders are generated automatically.
              </p>
            </div>
          </>
        )}
      </form>
    </GuardedModal>
  )
}

/** Map form values to the create-task API input. */
export function toCreateInput(values: TaskFormValues): CreateTaskInput {
  return {
    title: values.title,
    description: values.description.trim() || undefined,
    priority: values.priority,
    status: 'TODO',
    dueDate: values.dueDate ? new Date(values.dueDate) : undefined,
    tags: values.tags.length ? values.tags : undefined,
  }
}
