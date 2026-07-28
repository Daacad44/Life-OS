import { Plus } from 'lucide-react'
import type { CalendarEvent, Task } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { isSameDay } from '../dateUtils'

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function DayColumn({
  date,
  events,
  taskDeadlines,
  onCreate,
  onSelectEvent,
}: {
  date: Date
  events: CalendarEvent[]
  taskDeadlines: Task[]
  onCreate: (date: Date) => void
  onSelectEvent: (event: CalendarEvent) => void
}) {
  const today = isSameDay(date, new Date())

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <div
        className={cn(
          'flex items-center justify-between rounded-md px-2 py-1',
          today && 'bg-primary-muted',
        )}
      >
        <span className={cn('text-sm font-medium', today ? 'text-primary' : 'text-text')}>
          {date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          aria-label="Add event"
          onClick={() => onCreate(date)}
        >
          <Plus className="size-3.5" />
        </Button>
      </div>

      <div className="flex flex-col gap-1.5">
        {taskDeadlines.map((task) => (
          <div
            key={task.id}
            className="truncate rounded border border-warning/30 bg-warning/10 px-2 py-1 text-xs text-text"
            title={`Due: ${task.title}`}
          >
            📌 {task.title}
          </div>
        ))}
        {events.map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => onSelectEvent(event)}
            className="truncate rounded border border-primary/30 bg-primary-muted px-2 py-1 text-left text-xs text-primary hover:bg-primary/20"
          >
            {!event.allDay && (
              <span className="font-medium">{formatTime(event.startTime)} </span>
            )}
            {event.title}
          </button>
        ))}
        {events.length === 0 && taskDeadlines.length === 0 && (
          <p className="px-2 text-xs text-text-muted">Free</p>
        )}
      </div>
    </div>
  )
}
