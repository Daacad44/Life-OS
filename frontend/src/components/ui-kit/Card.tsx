import type { HTMLAttributes, Ref } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * The three card surfaces in the prototype: the white in-app card, the navy
 * gradient panel (AI Coach, hero mock, "Go Pro"), and the translucent glass
 * tile used on the dark marketing/auth backgrounds.
 */
const cardVariants = cva('rounded-2xl', {
  variants: {
    variant: {
      surface: 'border border-slate-200/70 bg-white text-slate-900',
      navy: 'bg-linear-160 from-navy-800 to-navy-900 text-white',
      glass: 'border border-white/10 bg-white/5 text-white',
    },
    padding: {
      none: '',
      sm: 'p-[18px]',
      md: 'p-5',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    variant: 'surface',
    padding: 'md',
  },
})

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  ref?: Ref<HTMLDivElement>
}

export function Card({ className, variant, padding, ...props }: CardProps) {
  return <div className={cn(cardVariants({ variant, padding }), className)} {...props} />
}

export interface CardTitleProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>
}

/** The 16px/800 heading that opens every in-app card. */
export function CardTitle({ className, ...props }: CardTitleProps) {
  return <div className={cn('text-base font-extrabold', className)} {...props} />
}

export { cardVariants }
