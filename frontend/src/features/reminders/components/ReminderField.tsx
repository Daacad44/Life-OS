import { useId } from 'react'
import { DateTimeField } from '@/components/form/DateTimeField'

export interface ReminderValue {
  /** UTC ISO string the reminder should fire at. */
  remindAt: string
  /** Human label, e.g. "At time", "10 min before". */
  offsetLabel: string
}

interface Preset {
  key: string
  label: string
  /** Minutes before the base time; undefined = "custom" (pick an explicit time). */
  minutesBefore?: number
}

const PRESETS: Preset[] = [
  { key: 'none', label: 'No reminder' },
  { key: 'at', label: 'At time', minutesBefore: 0 },
  { key: 'm10', label: '10 minutes before', minutesBefore: 10 },
  { key: 'm30', label: '30 minutes before', minutesBefore: 30 },
  { key: 'h1', label: '1 hour before', minutesBefore: 60 },
  { key: 'd1', label: '1 day before', minutesBefore: 1440 },
  { key: 'custom', label: 'Custom time…' },
]

const SHORT: Record<string, string> = {
  at: 'At time',
  m10: '10 min before',
  m30: '30 min before',
  h1: '1 hour before',
  d1: '1 day before',
  custom: 'Custom',
}

export interface ReminderFieldProps {
  /** The item's scheduled time (UTC ISO). Offsets are relative to this. */
  baseTime: string | null
  /** Currently selected preset key. */
  presetKey: string
  onPresetChange: (key: string) => void
  /** Custom reminder time (UTC ISO), used only when preset is "custom". */
  customAt: string | null
  onCustomChange: (iso: string | null) => void
  timezone: string
  label?: string
}

/** Resolve the chosen preset + custom value into a concrete reminder, or null. */
export function resolveReminder(
  presetKey: string,
  baseTime: string | null,
  customAt: string | null,
): ReminderValue | null {
  if (presetKey === 'none') return null
  if (presetKey === 'custom') {
    if (!customAt) return null
    return { remindAt: customAt, offsetLabel: 'Custom' }
  }
  const preset = PRESETS.find((p) => p.key === presetKey)
  if (!preset || preset.minutesBefore === undefined || !baseTime) return null
  const remindAt = new Date(
    new Date(baseTime).getTime() - preset.minutesBefore * 60_000,
  ).toISOString()
  return { remindAt, offsetLabel: SHORT[presetKey] ?? preset.label }
}

/**
 * Shared reminder picker (Global Requirement A). Offers "at time / N before"
 * presets relative to the item's scheduled time, plus a custom datetime. Presets
 * that need a base time are disabled until one is set.
 */
export function ReminderField({
  baseTime,
  presetKey,
  onPresetChange,
  customAt,
  onCustomChange,
  timezone,
  label = 'Reminder',
}: ReminderFieldProps) {
  const selectId = useId()
  return (
    <div className="flex flex-col gap-[7px]">
      <label htmlFor={selectId} className="text-[13px] font-semibold text-app-ink-soft">
        {label}
      </label>
      <select
        id={selectId}
        value={presetKey}
        onChange={(e) => onPresetChange(e.target.value)}
        className="w-full rounded-[11px] border border-app-hairline bg-app-canvas px-3.5 py-[13px] font-display text-base text-app-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
      >
        {PRESETS.map((p) => (
          <option
            key={p.key}
            value={p.key}
            disabled={p.minutesBefore !== undefined && !baseTime}
          >
            {p.label}
            {p.minutesBefore !== undefined && !baseTime ? ' (set a time first)' : ''}
          </option>
        ))}
      </select>
      {presetKey === 'custom' ? (
        <DateTimeField
          value={customAt}
          onChange={onCustomChange}
          timezone={timezone}
          mode="datetime"
        />
      ) : null}
    </div>
  )
}
