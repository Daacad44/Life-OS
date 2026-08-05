import { useId } from 'react'
import { cn } from '@/lib/utils'
import { isoToInputValue, wallTimeToUtcIso } from '@/lib/datetime'

export interface DateTimeFieldProps {
  label?: string
  /** Stored value as a UTC ISO string, or null when unset. */
  value: string | null
  /** Called with a UTC ISO string, or null when the field is cleared. */
  onChange: (iso: string | null) => void
  /** The user's timezone — the picked wall time is interpreted in this zone. */
  timezone: string
  /** `date` for due/target dates, `datetime` for event/reminder times. */
  mode?: 'date' | 'datetime'
  className?: string
  wrapperClassName?: string
  required?: boolean
  id?: string
}

/**
 * The single, shared date & time picker used everywhere a date/time is set —
 * task due dates, event start/end, goal targets, habit schedules, reminders.
 *
 * Values are stored in UTC and displayed/edited in the user's timezone. The
 * control is a native date / datetime-local input styled to match the app's
 * fields, at 16px so iOS doesn't zoom on focus.
 */
export function DateTimeField({
  label,
  value,
  onChange,
  timezone,
  mode = 'date',
  className,
  wrapperClassName,
  required,
  id,
}: DateTimeFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const inputValue = isoToInputValue(value, timezone, mode)

  return (
    <div className={cn('flex flex-col gap-[7px]', wrapperClassName)}>
      {label ? (
        <label htmlFor={inputId} className="text-[13px] font-semibold text-app-ink-soft">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        type={mode === 'date' ? 'date' : 'datetime-local'}
        value={inputValue}
        required={required}
        onChange={(e) => {
          const raw = e.target.value
          onChange(raw ? wallTimeToUtcIso(raw, timezone) : null)
        }}
        className={cn(
          'w-full rounded-[11px] border border-app-hairline bg-app-canvas px-3.5 py-[13px]',
          'font-display text-base text-app-ink',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      />
    </div>
  )
}
