import type { HTMLAttributes, Ref } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Pill labels: task priority, tags, due chips, the "Popular" plan flag, and the
 * amber eyebrow above the hero headline.
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap',
  {
    variants: {
      tone: {
        navy: 'bg-navy-50 text-navy-700',
        amber: 'bg-amber-100 text-amber-700',
        emerald: 'bg-accent-emerald-tint text-accent-emerald',
        violet: 'bg-accent-violet-tint text-accent-violet',
        red: 'bg-accent-red-tint text-accent-red',
        slate: 'bg-slate-100 text-slate-400',
        solid: 'bg-amber-500 text-navy-900 font-bold',
        eyebrow:
          'border border-amber-500/25 bg-amber-500/12 text-amber-400 font-bold tracking-[0.02em]',
      },
      size: {
        xs: 'px-[9px] py-1 text-[11px] font-bold',
        sm: 'px-[11px] py-[5px] text-xs',
        md: 'px-3.5 py-[7px] text-[12.5px]',
      },
    },
    defaultVariants: {
      tone: 'slate',
      size: 'sm',
    },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  ref?: Ref<HTMLSpanElement>
}

export function Badge({ className, tone, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, size }), className)} {...props} />
}

export { badgeVariants }
