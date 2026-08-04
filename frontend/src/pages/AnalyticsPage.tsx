import { Card, CardTitle, StatCard } from '@/components/ui-kit'

// MOCK — replace with useAnalytics(); values match the prototype.
const stats = [
  { label: 'Focus Time', value: '18h 30m', delta: undefined },
  { label: 'Tasks Completed', value: '42', delta: '+10%' },
  { label: 'Goals Progress', value: '68%', delta: '+8%' },
  { label: 'Productivity Score', value: '85/100', delta: '+5%' },
]

const priorityLegend = [
  { label: 'High 45%', className: 'bg-accent-red' },
  { label: 'Medium 30%', className: 'bg-amber-500' },
  { label: 'Low 25%', className: 'bg-navy-700' },
]

export function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            delta={s.delta}
            size="md"
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card padding="md">
          <CardTitle className="mb-4">Focus Time Over Time</CardTitle>
          <svg
            viewBox="0 0 480 200"
            className="h-[200px] w-full"
            role="img"
            aria-label="Focus time rising over the last seven periods"
          >
            <polyline
              points="10,160 80,130 150,140 220,90 290,110 360,60 450,40"
              fill="none"
              stroke="#1d4e89"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <g fill="#1d4e89">
              {[
                [10, 160],
                [80, 130],
                [150, 140],
                [220, 90],
                [290, 110],
                [360, 60],
                [450, 40],
              ].map(([cx, cy]) => (
                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" />
              ))}
            </g>
          </svg>
        </Card>

        <Card padding="md">
          <CardTitle className="mb-2">Tasks by Priority</CardTitle>
          <div className="flex items-center gap-5">
            <svg
              viewBox="0 0 120 120"
              className="size-[130px]"
              role="img"
              aria-label="High 45%, Medium 30%, Low 25%"
            >
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="16"
              />
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="#ef4444"
                strokeWidth="16"
                strokeDasharray="130 289"
                transform="rotate(-90 60 60)"
              />
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="16"
                strokeDasharray="87 289"
                strokeDashoffset="-130"
                transform="rotate(-90 60 60)"
              />
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="#1d4e89"
                strokeWidth="16"
                strokeDasharray="58 289"
                strokeDashoffset="-217"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="flex flex-col gap-2.5 text-[13px] font-semibold">
              {priorityLegend.map((l) => (
                <span key={l.label} className="flex items-center gap-2">
                  <span className={`size-[11px] rounded-[3px] ${l.className}`} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
