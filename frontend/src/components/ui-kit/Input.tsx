import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Rendered above the field, matching the prototype's 13px/600 label. */
  label?: string
  /**
   * `dark` is the translucent field on the auth cards; `light` is the slate
   * field used in Settings.
   */
  tone?: 'light' | 'dark'
  /** Control pinned inside the field, e.g. the password visibility toggle. */
  endAdornment?: ReactNode
  /** Helper or error text below the field. */
  hint?: string
  wrapperClassName?: string
  ref?: Ref<HTMLInputElement>
}

const toneClasses = {
  light: 'border-app-hairline bg-app-canvas text-app-ink placeholder:text-app-ink-faint',
  dark: 'border-white/12 bg-white/6 text-white placeholder:text-slate-400',
} as const

const labelClasses = {
  light: 'text-app-ink-soft',
  dark: 'text-slate-300',
} as const

export function Input({
  label,
  tone = 'light',
  endAdornment,
  hint,
  className,
  wrapperClassName,
  id,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined

  return (
    <div className={cn('flex flex-col gap-[7px]', wrapperClassName)}>
      {label ? (
        <label
          htmlFor={inputId}
          className={cn('text-[13px] font-semibold', labelClasses[tone])}
        >
          {label}
        </label>
      ) : null}
      <div className="relative flex items-center">
        <input
          id={inputId}
          aria-describedby={hintId}
          className={cn(
            // 16px (text-base) so iOS Safari doesn't zoom the viewport on focus.
            'w-full rounded-[11px] border px-3.5 py-[13px] font-display text-base',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
            toneClasses[tone],
            endAdornment && 'pr-11',
            className,
          )}
          {...props}
        />
        {endAdornment ? (
          <span className="absolute right-2 flex items-center">{endAdornment}</span>
        ) : null}
      </div>
      {hint ? (
        <span id={hintId} className="text-xs font-medium text-slate-400">
          {hint}
        </span>
      ) : null}
    </div>
  )
}
