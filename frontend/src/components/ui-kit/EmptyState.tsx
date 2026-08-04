import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { toneChip, type Tone } from './tones'

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  /** Usually the same primary Button the populated screen offers. */
  action?: ReactNode
  tone?: Tone
  className?: string
}

/** Shown when a list has nothing in it yet — same card language as the screens. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = 'amber',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-12 text-center',
        className,
      )}
    >
      <span className={cn('grid size-12 place-items-center rounded-xl', toneChip[tone])}>
        <Icon size={22} aria-hidden="true" />
      </span>
      <div className="mt-4 text-base font-extrabold text-slate-900">{title}</div>
      {description ? (
        <p className="mt-1.5 max-w-sm text-sm font-medium text-slate-500">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
