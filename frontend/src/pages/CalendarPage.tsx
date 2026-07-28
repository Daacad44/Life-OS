import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CalendarEvent } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { DayColumn } from '@/features/calendar/components/DayColumn'
import { MonthGrid } from '@/features/calendar/components/MonthGrid'
import { EventModal } from '@/features/calendar/components/EventModal'
import { useEvents } from '@/features/calendar/hooks/useCalendar'
import {
  addDays,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from '@/features/calendar/dateUtils'
import * as tasksApi from '@/features/tasks/api'
import { useQuery } from '@tanstack/react-query'

type View = 'day' | 'week' | 'month'

export function CalendarPage() {
  const [view, setView] = useState<View>('week')
  const [anchor, setAnchor] = useState(() => startOfDay(new Date()))
  const [modal, setModal] = useState<{ date?: Date; event?: CalendarEvent } | null>(null)

  const { rangeStart, rangeEnd, days } = useMemo(() => {
    if (view === 'day') {
      return { rangeStart: anchor, rangeEnd: addDays(anchor, 1), days: [anchor] }
    }
    if (view === 'week') {
      const start = startOfWeek(anchor)
      return {
        rangeStart: start,
        rangeEnd: addDays(start, 7),
        days: Array.from({ length: 7 }, (_, i) => addDays(start, i)),
      }
    }
    const start = startOfWeek(startOfMonth(anchor))
    return { rangeStart: start, rangeEnd: addDays(start, 42), days: [] }
  }, [view, anchor])

  const { data: events, isLoading, isError, refetch } = useEvents(rangeStart, rangeEnd)
  const { data: taskData } = useQuery({
    queryKey: ['tasks', { sort: 'dueDate', pageSize: 100 }],
    queryFn: () => tasksApi.listTasks({ sort: 'dueDate', order: 'asc', pageSize: 100 }),
  })
  const tasksWithDeadlines = (taskData?.data ?? []).filter((t) => t.dueDate)

  function shift(amount: number) {
    if (view === 'day') setAnchor((a) => addDays(a, amount))
    else if (view === 'week') setAnchor((a) => addDays(a, amount * 7))
    else setAnchor((a) => new Date(a.getFullYear(), a.getMonth() + amount, 1))
  }

  const title =
    view === 'month'
      ? anchor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
      : view === 'day'
        ? anchor.toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })
        : `${rangeStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${addDays(rangeStart, 6).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-text">Calendar</h1>
        <div className="flex items-center gap-1">
          {(['day', 'week', 'month'] as const).map((v) => (
            <Button
              key={v}
              size="sm"
              variant={view === v ? 'default' : 'outline'}
              onClick={() => setView(v)}
            >
              {v[0].toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous"
          onClick={() => shift(-1)}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <p className="min-w-48 text-sm font-medium text-text">{title}</p>
        <Button variant="outline" size="icon" aria-label="Next" onClick={() => shift(1)}>
          <ChevronRight className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAnchor(startOfDay(new Date()))}
        >
          Today
        </Button>
      </div>

      {isLoading && <div className="h-40 animate-pulse rounded-md bg-primary-muted" />}

      {isError && (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-danger">Couldn&apos;t load the calendar.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && view !== 'month' && (
        <div className="flex gap-3 overflow-x-auto">
          {days.map((day) => (
            <DayColumn
              key={day.toISOString()}
              date={day}
              events={(events ?? []).filter((e) => isSameDay(new Date(e.startTime), day))}
              taskDeadlines={tasksWithDeadlines.filter(
                (t) => t.dueDate && isSameDay(new Date(t.dueDate), day),
              )}
              onCreate={(date) => setModal({ date })}
              onSelectEvent={(event) => setModal({ event })}
            />
          ))}
        </div>
      )}

      {!isLoading && !isError && view === 'month' && (
        <MonthGrid
          anchor={anchor}
          events={events ?? []}
          tasks={tasksWithDeadlines}
          onSelectDay={(date) => setModal({ date })}
        />
      )}

      {modal && (
        <EventModal
          initialDate={modal.date}
          event={modal.event}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
