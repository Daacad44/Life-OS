/**
 * Timezone-aware date/time helpers.
 *
 * All datetimes are stored in UTC on the backend and arrive as ISO strings.
 * These helpers render and compare them in the user's timezone (from Settings),
 * so "Today / Tomorrow / Overdue" is correct regardless of where the server runs.
 */

/** The browser's timezone, used as a fallback before the user's profile loads. */
export function browserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

/** The calendar day (YYYY-MM-DD) that an instant falls on, in the given timezone. */
export function dayKeyInTz(value: Date | string, timezone: string): string {
  const date = typeof value === 'string' ? new Date(value) : value
  // en-CA formats as YYYY-MM-DD, which sorts and compares as a plain string.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/** Whole-day difference (target − today) in the given timezone. Negative = past. */
export function dayDiffFromToday(value: Date | string, timezone: string): number {
  const targetKey = dayKeyInTz(value, timezone)
  const todayKey = dayKeyInTz(new Date(), timezone)
  const target = Date.parse(`${targetKey}T00:00:00Z`)
  const today = Date.parse(`${todayKey}T00:00:00Z`)
  return Math.round((target - today) / 86_400_000)
}

export function isToday(value: Date | string, timezone: string): boolean {
  return dayDiffFromToday(value, timezone) === 0
}

export function isOverdue(value: Date | string, timezone: string): boolean {
  return dayDiffFromToday(value, timezone) < 0
}

/**
 * Short, human due label used on task rows, plan items and chips:
 * "Overdue", "Today", "Tomorrow", "Yesterday", weekday within a week, else "Jun 2".
 */
export function formatDueLabel(value: string | null, timezone: string): string {
  if (!value) return 'No date'
  const diff = dayDiffFromToday(value, timezone)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  if (diff < 0) return 'Overdue'
  if (diff > 1 && diff < 7) {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
    }).format(new Date(value))
  }
  return formatDate(value, timezone)
}

/** "Jun 2" (adds the year only when it isn't the current one). */
export function formatDate(value: string | null, timezone: string): string {
  if (!value) return ''
  const date = new Date(value)
  const sameYear =
    dayKeyInTz(date, timezone).slice(0, 4) ===
    dayKeyInTz(new Date(), timezone).slice(0, 4)
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  }).format(date)
}

/** "3:30 PM" in the user's timezone. */
export function formatTime(value: string | null, timezone: string): string {
  if (!value) return ''
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

/** "Mon, Jun 2, 3:30 PM" — full context for detail panels. */
export function formatDateTime(value: string | null, timezone: string): string {
  if (!value) return ''
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

/** The timezone's offset from UTC, in ms, at the given instant (handles DST). */
function tzOffsetMs(date: Date, timezone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const map: Record<string, number> = {}
  for (const part of dtf.formatToParts(date)) {
    if (part.type !== 'literal') map[part.type] = Number(part.value)
  }
  const asUtc = Date.UTC(
    map.year,
    map.month - 1,
    map.day,
    map.hour,
    map.minute,
    map.second,
  )
  return asUtc - date.getTime()
}

/**
 * Convert a wall-clock value the user picked (interpreted in their timezone)
 * into a UTC ISO string for storage. `input` is a native date/datetime-local
 * value: "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm". Date-only values default to 09:00
 * local so they land squarely inside the intended calendar day in every zone.
 */
export function wallTimeToUtcIso(input: string, timezone: string): string {
  const [datePart, timePart] = input.split('T')
  const [y, m, d] = datePart.split('-').map(Number)
  const [hh, mm] = (timePart ?? '09:00').split(':').map(Number)
  const guessUtc = Date.UTC(y, m - 1, d, hh, mm)
  const offset = tzOffsetMs(new Date(guessUtc), timezone)
  return new Date(guessUtc - offset).toISOString()
}

/**
 * Format a stored UTC ISO string as a native input value in the user's zone:
 * "YYYY-MM-DD" for `date`, "YYYY-MM-DDTHH:mm" for `datetime`.
 */
export function isoToInputValue(
  iso: string | null,
  timezone: string,
  mode: 'date' | 'datetime',
): string {
  if (!iso) return ''
  const dtf = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(mode === 'datetime' ? { hour: '2-digit', minute: '2-digit' } : {}),
  })
  const map: Record<string, string> = {}
  for (const part of dtf.formatToParts(new Date(iso))) {
    if (part.type !== 'literal') map[part.type] = part.value
  }
  const date = `${map.year}-${map.month}-${map.day}`
  return mode === 'date' ? date : `${date}T${map.hour}:${map.minute}`
}

/** "2h 45m", "45m", or "0m" from a whole number of minutes. */
export function formatMinutes(totalMinutes: number): string {
  const minutes = Math.max(0, Math.round(totalMinutes))
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest}m`
  if (rest === 0) return `${hours}h`
  return `${hours}h ${rest}m`
}

/** Compact relative-past label for notification timestamps: "5m ago", "2h ago", "3d ago". */
export function formatRelativeTime(value: string): string {
  const then = new Date(value).getTime()
  const seconds = Math.round((Date.now() - then) / 1000)
  if (seconds < 45) return 'just now'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.round(days / 7)
  if (weeks < 5) return `${weeks}w ago`
  const months = Math.round(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.round(days / 365)}y ago`
}
