import { dayKeyInTz, wallTimeToUtcIso } from './datetime'

export interface ParsedQuickAdd {
  /** The title with the date/time words stripped out. */
  title: string
  /** UTC ISO due date, or null if none was found. */
  dueDate: string | null
  /** True when a specific time (not just a day) was parsed. */
  hasTime: boolean
}

const WEEKDAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

function addDays(dayKey: string, days: number): string {
  const ms = Date.parse(`${dayKey}T00:00:00Z`) + days * 86_400_000
  return new Date(ms).toISOString().slice(0, 10)
}

/**
 * Parse a natural quick-add string like "Call mom tomorrow 5pm" into a title
 * plus a due date/time in the user's timezone. Best-effort and forgiving:
 * anything it doesn't recognise stays in the title.
 */
export function parseQuickAdd(input: string, timezone: string): ParsedQuickAdd {
  let text = ` ${input.trim()} `
  const todayKey = dayKeyInTz(new Date(), timezone)
  let dayKey: string | null = null
  let time: string | null = null

  const strip = (re: RegExp) => {
    text = text.replace(re, ' ')
  }

  // Time: "5pm", "5:30pm", "17:00", "at 9".
  const timeMatch =
    text.match(/\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i) ||
    text.match(/\b(\d{1,2}):(\d{2})\b/)
  if (timeMatch) {
    let hour = Number(timeMatch[1])
    const minute = Number(timeMatch[2] ?? 0)
    const meridiem = timeMatch[3]?.toLowerCase()
    if (meridiem === 'pm' && hour < 12) hour += 12
    if (meridiem === 'am' && hour === 12) hour = 0
    if (hour <= 23 && minute <= 59) {
      time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      strip(new RegExp(timeMatch[0].trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'))
    }
  }

  // Relative days.
  if (/\btoday\b/i.test(text) || /\btonight\b/i.test(text)) {
    dayKey = todayKey
    strip(/\b(today|tonight)\b/i)
  } else if (/\btomorrow\b/i.test(text)) {
    dayKey = addDays(todayKey, 1)
    strip(/\btomorrow\b/i)
  } else {
    const inDays = text.match(/\bin\s+(\d{1,3})\s+(day|days|week|weeks)\b/i)
    if (inDays) {
      const n = Number(inDays[1]) * (/week/i.test(inDays[2]) ? 7 : 1)
      dayKey = addDays(todayKey, n)
      strip(new RegExp(inDays[0], 'i'))
    } else {
      const weekdayMatch = text.match(
        /\b(next\s+|this\s+)?(sunday|monday|tuesday|wednesday|thursday|friday|saturday|sun|mon|tue|wed|thu|fri|sat)\b/i,
      )
      if (weekdayMatch) {
        const wanted = WEEKDAYS.findIndex((d) =>
          d.startsWith(weekdayMatch[2].toLowerCase().slice(0, 3)),
        )
        const currentDow = new Date(`${todayKey}T00:00:00Z`).getUTCDay()
        let delta = (wanted - currentDow + 7) % 7
        if (delta === 0) delta = 7 // a bare weekday name means the next one
        if (/next/i.test(weekdayMatch[1] ?? '') && delta <= 7) {
          // "next monday" is at least a week out if today is before it this week
          if (delta < 7) delta += 0
        }
        dayKey = addDays(todayKey, delta)
        strip(new RegExp(weekdayMatch[0], 'i'))
      }
    }
  }

  const title = text.replace(/\s+/g, ' ').trim()

  if (!dayKey && time) {
    // A time with no day means today.
    dayKey = todayKey
  }

  const dueDate = dayKey
    ? wallTimeToUtcIso(time ? `${dayKey}T${time}` : dayKey, timezone)
    : null

  return { title: title || input.trim(), dueDate, hasTime: Boolean(time) }
}
