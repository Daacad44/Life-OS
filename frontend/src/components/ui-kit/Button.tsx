import type { ButtonHTMLAttributes, Ref } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Every button style in the prototype, in one place.
 *
 * `primary` (amber on navy text) is the CTA everywhere; `navy` is the solid
 * in-app action ("Add Task", "New Goal"); `outline`/`ghost` sit on the dark
 * marketing and auth surfaces; `surface` is the light in-app chrome button;
 * `link` is the bare amber text action ("Add subtask", "Mark all as read").
 *
 * Padding matches the prototype exactly on fine pointers. On coarse pointers a
 * 44px minimum is enforced so touch targets clear the accessibility floor
 * without shifting the desktop layout.
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 font-display whitespace-nowrap',
    'cursor-pointer transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500',
    'disabled:pointer-events-none disabled:opacity-50',
    'pointer-coarse:min-h-11',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-amber-500 text-navy-900 font-bold hover:bg-amber-600',
        navy: 'bg-navy-900 text-white font-bold hover:bg-navy-800',
        outline:
          'border border-white/20 text-slate-200 font-semibold hover:bg-white/5 hover:text-white',
        ghost: 'text-slate-200 font-semibold hover:bg-white/5 hover:text-white',
        surface:
          'border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50',
        link: 'text-amber-600 font-bold hover:text-amber-700',
      },
      size: {
        sm: 'rounded-[10px] px-[14px] py-[9px] text-[13px]',
        md: 'rounded-[11px] px-5 py-[13px] text-sm',
        lg: 'rounded-xl px-[26px] py-[15px] text-[15px]',
        icon: 'rounded-[11px] p-2.5 pointer-coarse:min-w-11',
        bare: 'rounded-[10px] text-[13px]',
      },
      block: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  ref?: Ref<HTMLButtonElement>
}

export function Button({
  className,
  variant,
  size,
  block,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  )
}

export { buttonVariants }
