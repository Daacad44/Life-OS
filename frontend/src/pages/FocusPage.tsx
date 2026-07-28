import { useEffect, useState } from 'react'
import { Pause, Play, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import {
  useEndFocus,
  useFocusSessions,
  useStartFocus,
} from '@/features/focus/hooks/useFocus'

const WORK_SECONDS = 25 * 60
const BREAK_SECONDS = 5 * 60

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0')
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0')
  return `${m}:${s}`
}

export function FocusPage() {
  const { data: tasks } = useTasks({ status: 'TODO' })
  const { data: sessions } = useFocusSessions()
  const startFocus = useStartFocus()
  const endFocus = useEndFocus()

  const [taskId, setTaskId] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [phase, setPhase] = useState<'work' | 'break'>('work')
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS)
  const [running, setRunning] = useState(false)
  const [lastEnded, setLastEnded] = useState<{ duration: number } | null>(null)

  // Restores an in-progress session across a page refresh — the exact countdown
  // position isn't persisted server-side, so the local timer restarts from the
  // top of the current phase while the session itself keeps accumulating time.
  useEffect(() => {
    if (sessionId) return
    const active = sessions?.find((s) => !s.endedAt)
    if (active) {
      setSessionId(active.id)
      setTaskId(active.taskId ?? '')
      setRunning(true)
    }
  }, [sessions, sessionId])

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setPhase((p) => (p === 'work' ? 'break' : 'work'))
          return phase === 'work' ? BREAK_SECONDS : WORK_SECONDS
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [running, phase])

  function handleStart() {
    setLastEnded(null)
    setPhase('work')
    setSecondsLeft(WORK_SECONDS)
    startFocus.mutate(
      { taskId: taskId || undefined },
      {
        onSuccess: (session) => {
          setSessionId(session.id)
          setRunning(true)
        },
      },
    )
  }

  function handleStop() {
    if (!sessionId) return
    endFocus.mutate(sessionId, {
      onSuccess: (session) => {
        setLastEnded({ duration: session.duration ?? 0 })
        setSessionId(null)
        setRunning(false)
        setPhase('work')
        setSecondsLeft(WORK_SECONDS)
      },
    })
  }

  const activeTask = tasks?.data.find((t) => t.id === taskId)

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-6">
      {!sessionId ? (
        <>
          <h1 className="text-2xl font-semibold text-text">Focus Mode</h1>
          <p className="max-w-sm text-center text-text-muted">
            Pick a task (optional) and start a distraction-free session.
          </p>
          <select
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            className="w-72 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="">No specific task</option>
            {tasks?.data.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
          <Button size="lg" onClick={handleStart} disabled={startFocus.isPending}>
            <Play className="size-4" />
            Start Focus Session
          </Button>
          {lastEnded && (
            <p className="text-sm text-text-muted">
              Last session: {Math.round(lastEnded.duration / 60)} min focused.
            </p>
          )}
        </>
      ) : (
        <>
          <span className="text-sm font-medium uppercase tracking-wide text-text-muted">
            {phase === 'work' ? 'Focus' : 'Break'}
          </span>
          <span className="text-7xl font-semibold tabular-nums text-text">
            {formatTime(secondsLeft)}
          </span>
          {activeTask && (
            <p className="text-text-muted">Working on: {activeTask.title}</p>
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="lg" onClick={() => setRunning((r) => !r)}>
              {running ? <Pause className="size-4" /> : <Play className="size-4" />}
              {running ? 'Pause' : 'Resume'}
            </Button>
            <Button variant="destructive" size="lg" onClick={handleStop}>
              <Square className="size-4" />
              End Session
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
