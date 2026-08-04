import { cn } from '@/lib/utils'

export interface LogoProps {
  /** 28px footer, 34px nav/sidebar, 38px auth. */
  size?: 'sm' | 'md' | 'lg'
  /** Hide the "Life OS" wordmark and show the amber mark alone. */
  markOnly?: boolean
  className?: string
}

const markClasses = {
  sm: 'size-7 rounded-lg text-base',
  md: 'size-[34px] rounded-[9px] text-lg',
  lg: 'size-[38px] rounded-[10px] text-[19px]',
} as const

const wordClasses = {
  sm: 'text-base',
  md: 'text-[17px]',
  lg: 'text-[19px]',
} as const

/** The amber "L" mark plus wordmark, repeated across nav, auth, sidebar, and footer. */
export function Logo({ size = 'md', markOnly = false, className }: LogoProps) {
  return (
    <span className={cn('flex shrink-0 items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'grid place-items-center bg-amber-500 font-extrabold text-navy-900',
          markClasses[size],
        )}
      >
        L
      </span>
      {markOnly ? (
        <span className="sr-only">Life OS</span>
      ) : (
        <span
          className={cn(
            'font-extrabold tracking-[-0.01em] whitespace-nowrap',
            wordClasses[size],
          )}
        >
          Life OS
        </span>
      )}
    </span>
  )
}
