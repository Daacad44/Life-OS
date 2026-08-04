import { cn } from '@/lib/utils'
import { toneFill, type Tone } from './tones'

export interface ProgressBarProps {
  /** 0–100. Values outside the range are clamped. */
  value: number
  /** Colour of the filled portion — goals colour-code by category. */
  tone?: Tone
  /** Accessible name, e.g. the goal title this bar belongs to. */
  label?: string
  className?: string
}

/** The 8px rounded track used by goals, habits, and budgets. */
export function ProgressBar({
  value,
  tone = 'amber',
  label,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, Math.round(value)))

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn('h-2 overflow-hidden rounded-full bg-slate-100', className)}
    >
      <div
        className={cn('h-full rounded-full transition-[width]', toneFill[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
