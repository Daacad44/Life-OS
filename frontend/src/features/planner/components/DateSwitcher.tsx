import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

function shiftDate(date: string, days: number) {
  const d = new Date(`${date}T12:00:00.000Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function DateSwitcher({
  date,
  onChange,
}: {
  date: string
  onChange: (date: string) => void
}) {
  const isToday = date === todayStr()
  const label = new Date(`${date}T12:00:00.000Z`).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        aria-label="Previous day"
        onClick={() => onChange(shiftDate(date, -1))}
      >
        <ChevronLeft className="size-4" />
      </Button>

      <div className="min-w-40 text-center">
        <p className="text-sm font-medium text-text">{isToday ? 'Today' : label}</p>
        {isToday && <p className="text-xs text-text-muted">{label}</p>}
      </div>

      <Button
        variant="outline"
        size="icon"
        aria-label="Next day"
        onClick={() => onChange(shiftDate(date, 1))}
      >
        <ChevronRight className="size-4" />
      </Button>

      {!isToday && (
        <Button variant="ghost" size="sm" onClick={() => onChange(todayStr())}>
          Today
        </Button>
      )}
    </div>
  )
}
