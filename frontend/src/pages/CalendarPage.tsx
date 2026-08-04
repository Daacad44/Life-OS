import { useState } from 'react'
import { Card, Tabs, type TabItem } from '@/components/ui-kit'
import { cn } from '@/lib/utils'

type CalView = 'day' | 'week' | 'month'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// MOCK — replace with useCalendar(); events keyed by day-of-month per the prototype.
interface EventStyle {
  label: string
  className: string
}
const events: Record<number, EventStyle> = {
  6: { label: 'Team Meeting', className: 'bg-navy-50 text-navy-700' },
  12: { label: 'Project Deadline', className: 'bg-accent-red-tint text-accent-red' },
  15: { label: 'Design Review', className: 'bg-accent-violet-tint text-accent-violet' },
  19: { label: 'Client Call', className: 'bg-accent-emerald-tint text-accent-emerald' },
  23: { label: 'Sprint Planning', className: 'bg-amber-100 text-amber-600' },
}
const TODAY = 19
const LEADING_BLANKS = 4 // May 1, 2026 falls on a Thursday

const tabs: TabItem<CalView>[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
]

export function CalendarPage() {
  const [view, setView] = useState<CalView>('month')

  return (
    <Card padding="md">
      <div className="mb-[18px] flex items-center justify-between">
        <div className="text-lg font-extrabold">May 2026</div>
        <Tabs items={tabs} value={view} onChange={setView} ariaLabel="Calendar view" />
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {weekdays.map((d) => (
          <div
            key={d}
            className="pb-1.5 text-center text-xs font-bold text-app-ink-faint"
          >
            {d}
          </div>
        ))}

        {Array.from({ length: LEADING_BLANKS }).map((_, i) => (
          <div
            key={`blank-${i}`}
            className="min-h-[78px] rounded-[10px] border border-app-hairline bg-app-raised/60"
          />
        ))}

        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
          const ev = events[day]
          const isToday = day === TODAY
          return (
            <div
              key={day}
              className="min-h-[78px] rounded-[10px] border border-app-hairline bg-app-surface p-[7px]"
            >
              <div className="flex justify-end">
                <span
                  className={cn(
                    'grid size-[22px] place-items-center rounded-full text-[12.5px] font-bold',
                    isToday ? 'bg-amber-500 text-navy-900' : 'text-app-ink-soft',
                  )}
                >
                  {day}
                </span>
              </div>
              {ev ? (
                <div
                  className={cn(
                    'mt-[5px] truncate rounded-md px-1.5 py-[3px] text-[10.5px] font-bold',
                    ev.className,
                  )}
                >
                  {ev.label}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
