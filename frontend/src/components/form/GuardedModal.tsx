import { useState, type ReactNode } from 'react'
import { Modal } from '@/components/ui-kit'
import { ConfirmDialog } from '@/components/ui-kit/ConfirmDialog'

export interface GuardedModalProps {
  open: boolean
  title: string
  description?: string
  children?: ReactNode
  /** ReactNode, or a render fn given `requestClose` so a footer Cancel is guarded too. */
  footer?: ReactNode | ((api: { requestClose: () => void }) => ReactNode)
  className?: string
  /** True when the form has unsaved edits — enables the exit guard. */
  dirty: boolean
  /** Close/discard the flow for real (parent clears state). */
  onDiscard: () => void
  /**
   * "Done" action from the guard prompt — validate & save. When omitted the
   * guard offers only Discard / Keep editing.
   */
  onSave?: () => void
}

/**
 * Modal with the Done/Cancel exit guard (Global Requirement B). Any implicit
 * exit — scrim click, Escape, the X button — is intercepted while the form is
 * dirty and the user is asked to choose Done (save) or Cancel (discard) rather
 * than silently losing their work. When nothing is dirty it closes immediately.
 */
export function GuardedModal({
  open,
  title,
  description,
  children,
  footer,
  className,
  dirty,
  onDiscard,
  onSave,
}: GuardedModalProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  function requestClose() {
    if (dirty) {
      setConfirmOpen(true)
    } else {
      onDiscard()
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={requestClose}
        title={title}
        description={description}
        footer={typeof footer === 'function' ? footer({ requestClose }) : footer}
        className={className}
      >
        {children}
      </Modal>
      <ConfirmDialog
        open={confirmOpen}
        title="Save your changes?"
        description="You have unsaved changes. Choose Done to save them, or Discard to lose them."
        confirmLabel="Done"
        cancelLabel="Discard"
        tertiaryLabel="Keep editing"
        onConfirm={() => {
          setConfirmOpen(false)
          if (onSave) onSave()
          else onDiscard()
        }}
        onCancel={() => {
          setConfirmOpen(false)
          onDiscard()
        }}
        onTertiary={() => setConfirmOpen(false)}
      />
    </>
  )
}
