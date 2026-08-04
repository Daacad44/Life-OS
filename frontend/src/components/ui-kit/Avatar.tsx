import { cn } from '@/lib/utils'

export interface AvatarProps {
  /** Full name — initials are derived from it. */
  name: string
  /** Optional photo; falls back to initials when absent or broken. */
  src?: string
  /** 38px topbar chip, 48px list row, 72px settings header. */
  size?: 'sm' | 'md' | 'lg'
  shape?: 'square' | 'circle'
  className?: string
}

const sizeClasses = {
  sm: 'size-[38px] text-sm',
  md: 'size-12 text-base',
  lg: 'size-[72px] text-2xl',
} as const

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

/** Navy initials chip (square in the topbar, circular in Settings). */
export function Avatar({
  name,
  src,
  size = 'sm',
  shape = 'square',
  className,
}: AvatarProps) {
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-[10px]'

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('object-cover', sizeClasses[size], shapeClass, className)}
      />
    )
  }

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        'grid shrink-0 place-items-center bg-navy-800 font-bold text-white select-none',
        sizeClasses[size],
        shapeClass,
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  )
}
