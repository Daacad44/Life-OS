import type { HabitCheckin } from '@life-os/shared'
import { cn } from '@/lib/utils'

const DAYS_SHOWN = 30

export function HabitHeatmap({ checkins }: { checkins: HabitCheckin[] }) {
  const doneDates = new Set(checkins.map((c) => c.date.slice(0, 10)))

  const days = Array.from({ length: DAYS_SHOWN }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (DAYS_SHOWN - 1 - i))
    return d.toISOString().slice(0, 10)
  })

  return (
    <div className="flex gap-0.5">
      {days.map((day) => (
        <div
          key={day}
          title={day}
          className={cn(
            'h-3 w-3 rounded-sm',
            doneDates.has(day) ? 'bg-success' : 'bg-primary-muted',
          )}
        />
      ))}
    </div>
  )
}
