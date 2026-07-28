export function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function startOfWeek(date: Date) {
  const d = startOfDay(date)
  const day = d.getDay() // 0 = Sunday
  return addDays(d, -day)
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1)
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

// Full weeks (Sun-Sat) covering the month — includes leading/trailing days
// from adjacent months so the grid is always a multiple of 7.
export function monthGrid(anchor: Date) {
  const lastDayOfMonth = addDays(endOfMonth(anchor), -1)
  const gridStart = startOfWeek(startOfMonth(anchor))
  const gridEnd = addDays(startOfWeek(lastDayOfMonth), 6)

  const days: Date[] = []
  for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) {
    days.push(d)
  }
  return days
}
