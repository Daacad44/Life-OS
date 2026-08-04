import { useEffect, useState } from 'react'
import { Button } from '@/components/ui-kit'

const TOTAL_SECONDS = 45 * 60
const RING_LENGTH = 785 // 2π·125, matching the prototype's r=125 ring

const summary = [
  { value: '2h 15m', label: "Today's Focus" },
  { value: '4', label: 'Sessions' },
  { value: '8', label: 'Tasks Done' },
]

export function FocusPage() {
  const [seconds, setSeconds] = useState(TOTAL_SECONDS)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  const dashoffset = RING_LENGTH - RING_LENGTH * (seconds / TOTAL_SECONDS)

  return (
    <div className="grid place-items-center py-[30px]">
      <div className="text-lg font-extrabold text-slate-500">Focus Mode</div>

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

      <Button size="lg" onClick={() => setRunning((r) => !r)}>
        {running ? 'Pause' : 'Start Focus'}
      </Button>

      <div className="mt-9 flex gap-10 text-center">
        {summary.map((s) => (
          <div key={s.label}>
            <div className="text-[22px] font-extrabold tabular-nums">{s.value}</div>
            <div className="mt-[3px] text-[13px] font-semibold text-slate-500">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
