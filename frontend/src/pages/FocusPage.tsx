import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, ConfirmDialog } from '@/components/ui-kit'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'
import { useNavigationGuard } from '@/components/form/useNavigationGuard'
import {
  useFocusSessions,
  useStartFocus,
  useEndFocus,
} from '@/features/focus/hooks/useFocus'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import { dayKeyInTz, formatMinutes } from '@/lib/datetime'
import { playAlarm, unlockAudio, type AlarmSoundName } from '@/lib/alarm'
import type { ListTasksQuery } from '@life-os/shared'

const RING_LENGTH = 785 // 2π·125, matching the prototype's r=125 ring
const taskFilters: Partial<ListTasksQuery> = { pageSize: 100 }
type Mode = 'work' | 'break'

export function FocusPage() {
  const timezone = useUserTimezone()
  const { data: user } = useCurrentUser()
  const { data: sessions } = useFocusSessions()
  const { data: taskData } = useTasks(taskFilters)
  const startFocus = useStartFocus()
  const endFocus = useEndFocus()

  const [workMin, setWorkMin] = useState(25)
  const [breakMin, setBreakMin] = useState(5)
  const [taskId, setTaskId] = useState('')
  const [mode, setMode] = useState<Mode>('work')
  const [seconds, setSeconds] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

  const totalSeconds = (mode === 'work' ? workMin : breakMin) * 60

  const activeTasks = useMemo(
    () => (taskData?.data ?? []).filter((t) => t.status !== 'DONE'),
    [taskData],
  )

  function chime() {
    playAlarm((user?.alarmSound as AlarmSoundName) ?? 'chime', user?.alarmVolume ?? 70, 2)
  }

  // Ref indirection keeps the 1s interval free of stale state closures.
  const onComplete = useRef<() => void>(() => {})
  onComplete.current = () => {
    if (user?.soundEnabled ?? true) chime()
    if (mode === 'work') {
      if (activeSessionId) endFocus.mutate(activeSessionId)
      setActiveSessionId(null)
      setMode('break')
      setSeconds(breakMin * 60)
      // Break auto-starts; user can end anytime.
    } else {
      setMode('work')
      setSeconds(workMin * 60)
      setRunning(false)
    }
  }

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id)
          onComplete.current()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  function startWork() {
    unlockAudio()
    setMode('work')
    setSeconds(workMin * 60)
    startFocus.mutate(
      { taskId: taskId || undefined },
      {
        onSuccess: (session) => {
          setActiveSessionId(session.id)
          setRunning(true)
        },
      },
    )
  }

  function endNow() {
    if (mode === 'work' && activeSessionId) endFocus.mutate(activeSessionId)
    setActiveSessionId(null)
    setRunning(false)
    setMode('work')
    setSeconds(workMin * 60)
  }

  // Exit guard: leaving a running session prompts Done (save) / Discard.
  const guard = useNavigationGuard(running)

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
  const dashoffset = RING_LENGTH - RING_LENGTH * (seconds / totalSeconds)
  const activeTaskTitle = activeTasks.find((t) => t.id === taskId)?.title

  return (
    <div className="grid place-items-center py-[30px]">
      <div className="text-lg font-extrabold text-app-ink-muted">
        Focus Mode {running ? (mode === 'work' ? '· Focus' : '· Break') : ''}
      </div>

      {!running ? (
        <div className="mt-5 flex w-full max-w-md flex-col gap-3">
          <div className="flex flex-col gap-[7px]">
            <label
              htmlFor="focus-task"
              className="text-[13px] font-semibold text-app-ink-soft"
            >
              Focus on a task (optional)
            </label>
            <select
              id="focus-task"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-full rounded-[11px] border border-app-hairline bg-app-canvas px-3.5 py-[13px] font-display text-base text-app-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              <option value="">No specific task</option>
              {activeTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-[7px]">
              <label
                htmlFor="work-min"
                className="text-[13px] font-semibold text-app-ink-soft"
              >
                Focus (min)
              </label>
              <input
                id="work-min"
                type="number"
                min={1}
                max={120}
                value={workMin}
                onChange={(e) => {
                  const v = Math.max(1, Number(e.target.value))
                  setWorkMin(v)
                  if (mode === 'work') setSeconds(v * 60)
                }}
                className="w-full rounded-[11px] border border-app-hairline bg-app-canvas px-3.5 py-[13px] font-display text-base text-app-ink"
              />
            </div>
            <div className="flex flex-col gap-[7px]">
              <label
                htmlFor="break-min"
                className="text-[13px] font-semibold text-app-ink-soft"
              >
                Break (min)
              </label>
              <input
                id="break-min"
                type="number"
                min={1}
                max={60}
                value={breakMin}
                onChange={(e) => setBreakMin(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-[11px] border border-app-hairline bg-app-canvas px-3.5 py-[13px] font-display text-base text-app-ink"
              />
            </div>
          </div>
        </div>
      ) : activeTaskTitle ? (
        <div className="mt-3 text-sm font-semibold text-app-ink-muted">
          Working on: <span className="text-app-ink">{activeTaskTitle}</span>
        </div>
      ) : null}

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
            stroke={mode === 'break' ? '#10b981' : '#f59e0b'}
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

      <div className="flex gap-3">
        <Button
          size="lg"
          onClick={running ? endNow : startWork}
          disabled={startFocus.isPending}
        >
          {running ? 'End Focus' : 'Start Focus'}
        </Button>
      </div>

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

      <ConfirmDialog
        open={guard.blocked}
        title="End your focus session?"
        description="You have a focus session running. Save the time you've focused so far, or discard it?"
        confirmLabel="Done (save)"
        cancelLabel="Discard"
        tertiaryLabel="Keep focusing"
        onConfirm={() => {
          if (mode === 'work' && activeSessionId) endFocus.mutate(activeSessionId)
          setActiveSessionId(null)
          setRunning(false)
          guard.proceed()
        }}
        onCancel={() => {
          setActiveSessionId(null)
          setRunning(false)
          guard.proceed()
        }}
        onTertiary={() => guard.cancel()}
      />
    </div>
  )
}
