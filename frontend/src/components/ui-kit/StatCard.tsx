import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card } from './Card'
import { toneChip, toneText, type Tone } from './tones'

export interface StatCardProps {
  label: string
  value: string
  /** Optional tinted icon chip — the Dashboard stat row uses one, Analytics and Finance do not. */
  icon?: LucideIcon
  /** Tint of the icon chip. */
  tone?: Tone
  /** Trailing change note, e.g. "+10%" on Analytics. */
  delta?: string
  /** Colour of the value itself — Finance greens its income and reds its expenses. */
  valueTone?: Tone
  /** 28px on Dashboard, 26px on Analytics, 24px on Finance. */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const valueSize = {
  sm: 'text-2xl',
  md: 'text-[26px]',
  lg: 'text-[28px]',
} as const

/** One metric: label, big tabular value, optional icon chip and delta. */
export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'navy',
  delta,
  valueTone,
  size = 'lg',
  className,
}: StatCardProps) {
  return (
    <Card padding="sm" className={className}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-semibold text-app-ink-muted">{label}</span>
        {Icon ? (
          <span
            className={cn(
              'grid size-[34px] shrink-0 place-items-center rounded-[10px]',
              toneChip[tone],
            )}
          >
            <Icon size={17} aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <div
        className={cn(
          'mt-2.5 font-extrabold tabular-nums',
          valueSize[size],
          valueTone && toneText[valueTone],
        )}
      >
        {value}
      </div>
      {delta ? (
        <div className="mt-1 text-[12.5px] font-bold text-accent-emerald">{delta}</div>
      ) : null}
    </Card>
  )
}
