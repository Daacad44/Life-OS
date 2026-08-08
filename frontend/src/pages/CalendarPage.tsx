import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import {
  Button,
  Card,
  EmptyState,
  Skeleton,
  Tabs,
  type TabItem,
} from '@/components/ui-kit'
import { cn } from '@/lib/utils'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import {
  useEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from '@/features/calendar/hooks/useCalendar'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import { EventFormModal } from '@/features/calendar/components/EventFormModal'
import type { ReminderValue } from '@/features/reminders/components/ReminderField'
import * as remindersApi from '@/features/reminders/api'
import { dayKeyInTz, formatTime } from '@/lib/datetime'
import type { CalendarEvent, CreateEventInput, ListTasksQuery } from '@life-os/shared'

type CalView = 'day' | 'week' | 'month'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const tabs: TabItem<CalView>[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
]
const taskFilters: Partial<ListTasksQuery> = { pageSize: 100 }

function pad(n: number) {
  return String(n).padStart(2, '0')
}
function keyOf(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`
}
function startOfWeek(d: Date) {
  const s = new Date(d)
  s.setDate(s.getDate() - s.getDay())
  s.setHours(0, 0, 0, 0)
  return s
}

export function CalendarPage() {
  const timezone = useUserTimezone()
  const [view, setView] = useState<CalView>('month')
  const [anchor, setAnchor] = useState(() => new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CalendarEvent | undefined>(undefined)
  const [defaultDate, setDefaultDate] = useState<string | undefined>(undefined)

  // Query range covers the visible period for the current view.
  const range = useMemo(() => {
    if (view === 'day') {
      const s = new Date(anchor)
      s.setHours(0, 0, 0, 0)
      const e = new Date(s)
      e.setHours(23, 59, 59, 999)
      return { start: s, end: e }
    }
    if (view === 'week') {
      const s = startOfWeek(anchor)
      const e = new Date(s)
      e.setDate(e.getDate() + 6)
      e.setHours(23, 59, 59, 999)
      return { start: s, end: e }
    }
    const s = new Date(anchor.getFullYear(), anchor.getMonth(), 1)
    const e = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0, 23, 59, 59, 999)
    return { start: s, end: e }
  }, [view, anchor])

  const { data: events, isLoading, isError, refetch } = useEvents(range.start, range.end)
  const { data: taskData } = useTasks(taskFilters)
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const deleteEvent = useDeleteEvent()

  // Replace any existing reminders for an event with the chosen one, so editing
  // an event's time doesn't leave a stale reminder or stack duplicates.
  async function syncEventReminder(eventId: string, reminder: ReminderValue | null) {
    const existing = await remindersApi.listReminders({
      entityType: 'event',
      entityId: eventId,
    })
    await Promise.all(existing.map((r) => remindersApi.deleteReminder(r.id)))
    if (reminder) {
      await remindersApi.createReminder({
        entityType: 'event',
        entityId: eventId,
        remindAt: new Date(reminder.remindAt),
        offsetLabel: reminder.offsetLabel,
      })
    }
  }

  // Group events and task deadlines by their day (in the user's timezone).
  const byDay = useMemo(() => {
    const map = new Map<
      string,
      { events: CalendarEvent[]; tasks: { id: string; title: string; dueDate: string }[] }
    >()
    const ensure = (k: string) => {
      if (!map.has(k)) map.set(k, { events: [], tasks: [] })
      return map.get(k)!
    }
    for (const ev of events ?? []) {
      ensure(dayKeyInTz(ev.startTime, timezone)).events.push(ev)
    }
    for (const t of taskData?.data ?? []) {
      if (!t.dueDate || t.status === 'DONE') continue
      const k = dayKeyInTz(t.dueDate, timezone)
      const start = range.start.getTime()
      const end = range.end.getTime()
      const due = new Date(t.dueDate).getTime()
      if (due >= start && due <= end) {
        ensure(k).tasks.push({ id: t.id, title: t.title, dueDate: t.dueDate })
      }
    }
    for (const bucket of map.values()) {
      bucket.events.sort((a, b) => a.startTime.localeCompare(b.startTime))
    }
    return map
  }, [events, taskData, timezone, range])

  const todayKey = dayKeyInTz(new Date(), timezone)

  function shift(delta: number) {
    setAnchor((prev) => {
      const next = new Date(prev)
      if (view === 'day') next.setDate(next.getDate() + delta)
      else if (view === 'week') next.setDate(next.getDate() + delta * 7)
      else next.setMonth(next.getMonth() + delta)
      return next
    })
  }

  function openCreate(dayKey?: string) {
    setEditing(undefined)
    setDefaultDate(dayKey ? `${dayKey}T09:00:00` : undefined)
    setModalOpen(true)
  }
  function openEdit(ev: CalendarEvent) {
    setEditing(ev)
    setDefaultDate(undefined)
    setModalOpen(true)
  }
  function submit(input: CreateEventInput, reminder: ReminderValue | null) {
    if (editing) {
      const id = editing.id
      updateEvent.mutate(
        { id, input },
        {
          onSuccess: async () => {
            await syncEventReminder(id, reminder)
            setModalOpen(false)
          },
        },
      )
    } else {
      createEvent.mutate(input, {
        onSuccess: async (event) => {
          await syncEventReminder(event.id, reminder)
          setModalOpen(false)
        },
      })
    }
  }
  function remove() {
    if (!editing) return
    deleteEvent.mutate(editing.id, { onSuccess: () => setModalOpen(false) })
  }

  const heading = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    month: 'long',
    year: 'numeric',
    ...(view === 'day' ? { day: 'numeric', weekday: 'long' } : {}),
  }).format(anchor)

  // Month grid: leading blanks + each day of the month.
  const monthCells = useMemo(() => {
    const year = anchor.getFullYear()
    const month = anchor.getMonth()
    const leading = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: ({ day: number; key: string } | null)[] = []
    for (let i = 0; i < leading; i += 1) cells.push(null)
    for (let d = 1; d <= daysInMonth; d += 1)
      cells.push({ day: d, key: keyOf(year, month, d) })
    return cells
  }, [anchor])

  // Agenda days (day/week views + mobile month): every day in range, in order.
  const agendaDays = useMemo(() => {
    const days: string[] = []
    const cursor = new Date(range.start)
    while (cursor <= range.end) {
      days.push(dayKeyInTz(cursor, timezone))
      cursor.setDate(cursor.getDate() + 1)
    }
    return [...new Set(days)]
  }, [range, timezone])

  const agenda = (
    <div className="flex flex-col gap-3">
      {agendaDays.map((key) => {
        const bucket = byDay.get(key)
        if (!bucket || (bucket.events.length === 0 && bucket.tasks.length === 0)) {
          return null
        }
        const label = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }).format(new Date(`${key}T12:00:00Z`))
        return (
          <div key={key}>
            <div
              className={cn(
                'mb-1.5 text-[13px] font-bold',
                key === todayKey ? 'text-amber-600' : 'text-app-ink-muted',
              )}
            >
              {label}
              {key === todayKey ? ' · Today' : ''}
            </div>
            <div className="flex flex-col gap-1.5">
              {bucket.events.map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => openEdit(ev)}
                  className="flex items-center gap-3 rounded-[10px] border border-app-hairline bg-app-surface px-3 py-2.5 text-left hover:bg-app-raised"
                >
                  <span className="text-[13px] font-bold tabular-nums text-app-ink-muted">
                    {ev.allDay ? 'All day' : formatTime(ev.startTime, timezone)}
                  </span>
                  <span className="flex-1 text-sm font-semibold">{ev.title}</span>
                </button>
              ))}
              {bucket.tasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-[10px] border border-amber-100 bg-amber-100/40 px-3 py-2.5"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wide text-amber-700">
                    Due
                  </span>
                  <span className="flex-1 text-sm font-semibold text-app-ink-soft">
                    {t.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
      {agendaDays.every((k) => {
        const b = byDay.get(k)
        return !b || (b.events.length === 0 && b.tasks.length === 0)
      }) ? (
        <EmptyState
          icon={CalendarDays}
          title="Nothing scheduled"
          description="Add an event or set a due date on a task."
          action={
            <Button
              variant="navy"
              size="sm"
              className="gap-1.5"
              onClick={() => openCreate()}
            >
              <Plus size={15} aria-hidden="true" />
              New Event
            </Button>
          }
        />
      ) : null}
    </div>
  )

  return (
    <Card padding="md">
      <div className="mb-[18px] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Button
            variant="surface"
            size="icon"
            aria-label="Previous"
            onClick={() => shift(-1)}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </Button>
          <Button
            variant="surface"
            size="icon"
            aria-label="Next"
            onClick={() => shift(1)}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </Button>
          <div className="ml-1.5 text-lg font-extrabold">{heading}</div>
          <Button
            variant="link"
            size="bare"
            className="ml-1.5"
            onClick={() => setAnchor(new Date())}
          >
            Today
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Tabs items={tabs} value={view} onChange={setView} ariaLabel="Calendar view" />
          <Button
            variant="navy"
            size="sm"
            className="gap-1.5"
            onClick={() => openCreate()}
          >
            <Plus size={15} aria-hidden="true" />
            <span className="hidden sm:inline">New Event</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-[420px] w-full" />
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm font-medium text-accent-red">
            Couldn't load your calendar.
          </p>
          <Button variant="surface" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          {/* Month grid — desktop only */}
          {view === 'month' ? (
            <div className="hidden grid-cols-7 gap-1.5 md:grid">
              {weekdays.map((d) => (
                <div
                  key={d}
                  className="pb-1.5 text-center text-xs font-bold text-app-ink-faint"
                >
                  {d}
                </div>
              ))}
              {monthCells.map((cell, i) =>
                cell === null ? (
                  <div
                    key={`blank-${i}`}
                    className="min-h-[92px] rounded-[10px] border border-app-hairline bg-app-raised/60"
                  />
                ) : (
                  <button
                    key={cell.key}
                    type="button"
                    onClick={() => openCreate(cell.key)}
                    className="min-h-[92px] rounded-[10px] border border-app-hairline bg-app-surface p-[7px] text-left hover:bg-app-raised"
                  >
                    <div className="flex justify-end">
                      <span
                        className={cn(
                          'grid size-[22px] place-items-center rounded-full text-[12.5px] font-bold',
                          cell.key === todayKey
                            ? 'bg-amber-500 text-navy-900'
                            : 'text-app-ink-soft',
                        )}
                      >
                        {cell.day}
                      </span>
                    </div>
                    <div className="mt-[5px] flex flex-col gap-1">
                      {byDay
                        .get(cell.key)
                        ?.events.slice(0, 2)
                        .map((ev) => (
                          <span
                            key={ev.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              openEdit(ev)
                            }}
                            className="truncate rounded-md bg-navy-50 px-1.5 py-[3px] text-[10.5px] font-bold text-navy-700"
                          >
                            {ev.title}
                          </span>
                        ))}
                      {byDay
                        .get(cell.key)
                        ?.tasks.slice(0, 1)
                        .map((t) => (
                          <span
                            key={t.id}
                            className="truncate rounded-md bg-amber-100 px-1.5 py-[3px] text-[10.5px] font-bold text-amber-700"
                          >
                            {t.title}
                          </span>
                        ))}
                      {(() => {
                        const b = byDay.get(cell.key)
                        const extra = (b?.events.length ?? 0) + (b?.tasks.length ?? 0) - 3
                        return extra > 0 ? (
                          <span className="px-1.5 text-[10px] font-semibold text-app-ink-faint">
                            +{extra} more
                          </span>
                        ) : null
                      })()}
                    </div>
                  </button>
                ),
              )}
            </div>
          ) : null}

          {/* Agenda — mobile for month, always for day/week */}
          <div className={view === 'month' ? 'md:hidden' : ''}>{agenda}</div>
        </>
      )}

      {modalOpen ? (
        <EventFormModal
          key={editing?.id ?? defaultDate ?? 'new'}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={submit}
          onDelete={editing ? remove : undefined}
          event={editing}
          defaultDate={defaultDate}
          pending={createEvent.isPending || updateEvent.isPending}
        />
      ) : null}
    </Card>
  )
}
