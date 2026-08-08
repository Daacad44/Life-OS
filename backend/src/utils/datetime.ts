/**
 * Backend timezone helpers. All datetimes are stored in UTC; recurring-task and
 * reminder generation needs to turn a wall-clock time of day in the user's
 * timezone into the correct UTC instant (handling DST).
 */

/** The timezone's offset from UTC, in ms, at the given instant. */
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
 * The UTC instant for a wall-clock date + time in the given timezone.
 * `year`/`month`(1-12)/`day` and `hh`/`mm` are interpreted in `timezone`.
 */
export function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hh: number,
  mm: number,
  timezone: string,
): Date {
  const guessUtc = Date.UTC(year, month - 1, day, hh, mm)
  const offset = tzOffsetMs(new Date(guessUtc), timezone)
  return new Date(guessUtc - offset)
}

/** Year/month/day of an instant, as seen in the given timezone. */
export function ymdInTz(
  date: Date,
  timezone: string,
): { year: number; month: number; day: number } {
  const dtf = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const map: Record<string, number> = {}
  for (const part of dtf.formatToParts(date)) {
    if (part.type !== 'literal') map[part.type] = Number(part.value)
  }
  return { year: map.year, month: map.month, day: map.day }
}
