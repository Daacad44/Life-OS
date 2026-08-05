import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui-kit'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import {
  useFocusSessions,
  useStartFocus,
  useEndFocus,
} from '@/features/focus/hooks/useFocus'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import { dayKeyInTz, formatMinutes } from '@/lib/datetime'
import type { ListTasksQuery } from '@life-os/shared'

const TOTAL_SECONDS = 45 * 60
const RING_LENGTH = 785 // 2π·125, matching the prototype's r=125 ring
const taskFilters: Partial<ListTasksQuery> = { pageSize: 100 }

export function FocusPage() {
  const timezone = useUserTimezone()
  const { data: sessions } = useFocusSessions()
  const { data: taskData } = useTasks(taskFilters)
  const startFocus = useStartFocus()
  const endFocus = useEndFocus()

  const [seconds, setSeconds] = useState(TOTAL_SECONDS)
  const [running, setRunning] = useState(false)
  const sessionId = useRef<string | null>(null)

  const stop = useRef<() => void>(() => {})
  stop.current = () => {
    if (sessionId.current) {
      endFocus.mutate(sessionId.current)
      sessionId.current = null
    }
    setRunning(false)
  }

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id)
          stop.current()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  function toggle() {
    if (running) {
      stop.current()
      return
    }
    if (seconds === 0) setSeconds(TOTAL_SECONDS)
    startFocus.mutate(
      {},
      {
        onSuccess: (session) => {
          sessionId.current = session.id
          setRunning(true)
        },
      },
    )
  }

  const summary = useMemo(() => {
    const todayKey = dayKeyInTz(new Date(), timezone)
    const todays = (sessions ?? []).filter(
      (s) => dayKeyInTz(s.startedAt, timezone) === todayKey,
    )
    const minutes = todays.reduce((sum, s) => sum + Math.round((s.duration ?? 0) / 60), 0)
    const tasksDone = (taskData?.data ?? []).filter(
      (t) => t.status === 'DONE' && dayKeyInTz(t.updatedAt, timezone) === todayKey,
    ).length
    return [
      { value: formatMinutes(minutes), label: "Today's Focus" },
      { value: String(todays.length), label: 'Sessions' },
      { value: String(tasksDone), label: 'Tasks Done' },
    ]
  }, [sessions, taskData, timezone])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  const dashoffset = RING_LENGTH - RING_LENGTH * (seconds / TOTAL_SECONDS)

  return (
    <div className="grid place-items-center py-[30px]">
      <div className="text-lg font-extrabold text-app-ink-muted">Focus Mode</div>

      <div className="relative my-[26px] size-[280px]">
        <svg viewBox="0 0 280 280" className="size-[280px] -rotate-90">
          <circle
            cx="140"
            cy="140"
            r="125"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="14"
          />
          <circle
            cx="140"
            cy="140"
            r="125"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={RING_LENGTH}
            strokeDashoffset={dashoffset}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-[56px] font-extrabold tracking-[-0.02em] tabular-nums">
            {mm}:{ss}
          </div>
        </div>
      </div>

      <Button size="lg" onClick={toggle} disabled={startFocus.isPending}>
        {running ? 'End Focus' : 'Start Focus'}
      </Button>

      <div className="mt-9 flex gap-10 text-center">
        {summary.map((s) => (
          <div key={s.label}>
            <div className="text-[22px] font-extrabold tabular-nums">{s.value}</div>
            <div className="mt-[3px] text-[13px] font-semibold text-app-ink-muted">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
