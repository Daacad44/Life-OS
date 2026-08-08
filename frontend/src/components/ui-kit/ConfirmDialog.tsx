import { createPortal } from 'react-dom'
import { Button } from './Button'
import { cn } from '@/lib/utils'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  /** Primary (confirm) button label. */
  confirmLabel: string
  /** Secondary (dismiss) button label. */
  cancelLabel?: string
  /** Optional third, neutral action (e.g. "Keep editing"). */
  tertiaryLabel?: string
  /** Style the confirm button as destructive. */
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
  onTertiary?: () => void
}

/**
 * A small, self-contained confirmation overlay used for irreversible or
 * work-losing actions (e.g. the Done/Cancel exit guard). Rendered above any
 * open Modal; buttons only (no global key handling) so it never fights the
 * parent dialog's focus trap.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  tertiaryLabel,
  destructive,
  onConfirm,
  onCancel,
  onTertiary,
}: ConfirmDialogProps) {
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[70] grid place-items-center p-5">
      <div className="absolute inset-0 bg-slate-900/60" aria-hidden="true" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-sm rounded-2xl border border-app-hairline bg-app-surface p-6 font-display text-app-ink shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)]"
      >
        <h2 className="text-base font-extrabold">{title}</h2>
        {description ? (
          <p className="mt-1.5 text-sm font-medium text-app-ink-muted">{description}</p>
        ) : null}
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          {tertiaryLabel ? (
            <Button variant="surface" size="sm" onClick={onTertiary}>
              {tertiaryLabel}
            </Button>
          ) : null}
          <Button variant="surface" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant="navy"
            size="sm"
            className={cn(destructive && 'bg-accent-red hover:bg-accent-red/90')}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
