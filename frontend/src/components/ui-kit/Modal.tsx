import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from './Button'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  /** Action row pinned to the bottom of the dialog. */
  footer?: ReactNode
  className?: string
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/**
 * Dialog on the prototype's scrim (slate-900 at 50%), used for create/edit
 * flows. Escape and scrim clicks close it, focus is trapped while open and
 * restored to the trigger on close.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = `${titleId}-description`

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)
    ;(first ?? dialogRef.current)?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      )
      if (focusable.length === 0) return

      const firstEl = focusable[0]
      const lastEl = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault()
        lastEl.focus()
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault()
        firstEl.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = overflow
      previouslyFocused?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center p-5">
      <div
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative w-full max-w-lg rounded-2xl border border-app-hairline bg-app-surface p-6',
          'font-display text-app-ink shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)]',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-base font-extrabold">
              {title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className="mt-1 text-sm font-medium text-app-ink-muted"
              >
                {description}
              </p>
            ) : null}
          </div>
          <Button
            variant="surface"
            size="icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} aria-hidden="true" />
          </Button>
        </div>
        {children ? <div className="mt-5">{children}</div> : null}
        {footer ? <div className="mt-6 flex justify-end gap-3">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}
