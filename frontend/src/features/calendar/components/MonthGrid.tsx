import type { CalendarEvent, Task } from '@life-os/shared'
import { cn } from '@/lib/utils'
import { isSameDay, monthGrid } from '../dateUtils'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function MonthGrid({
  anchor,
  events,
  tasks,
  onSelectDay,
}: {
  anchor: Date
  events: CalendarEvent[]
  tasks: Task[]
  onSelectDay: (date: Date) => void
}) {
  const days = monthGrid(anchor)
  const today = new Date()

  return (
    <div className="grid grid-cols-7 gap-1">
      {WEEKDAY_LABELS.map((label) => (
        <div key={label} className="px-1 text-center text-xs font-medium text-text-muted">
          {label}
        </div>
      ))}
      {days.map((day) => {
        const dayEvents = events.filter((e) => isSameDay(new Date(e.startTime), day))
        const dayTasks = tasks.filter(
          (t) => t.dueDate && isSameDay(new Date(t.dueDate), day),
        )
        const inMonth = day.getMonth() === anchor.getMonth()

        return (
          <button
            key={day.toISOString()}
            type="button"
            onClick={() => onSelectDay(day)}
            className={cn(
              'flex min-h-16 flex-col items-start gap-0.5 rounded-md border border-border p-1.5 text-left',
              !inMonth && 'opacity-40',
              isSameDay(day, today) && 'border-primary bg-primary-muted',
            )}
          >
            <span className="text-xs font-medium text-text">{day.getDate()}</span>
            {(dayEvents.length > 0 || dayTasks.length > 0) && (
              <span className="text-[10px] text-text-muted">
                {dayEvents.length + dayTasks.length} item
                {dayEvents.length + dayTasks.length > 1 ? 's' : ''}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
