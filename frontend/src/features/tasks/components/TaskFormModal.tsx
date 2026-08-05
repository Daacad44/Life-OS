import { useState, type FormEvent } from 'react'
import { Button, Input, Modal } from '@/components/ui-kit'
import { DateTimeField } from '@/components/form/DateTimeField'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import { Priority, type CreateTaskInput, type Task } from '@life-os/shared'

export interface TaskFormValues {
  title: string
  description: string
  priority: Priority
  dueDate: string | null
  /** Optional reminder time (UTC ISO); creates a reminder for this task. */
  reminderAt: string | null
}

export function TaskFormModal({
  open,
  onClose,
  onSubmit,
  task,
  pending,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (values: TaskFormValues) => void
  /** Present when editing; absent when creating. */
  task?: Task
  pending?: boolean
}) {
  const timezone = useUserTimezone()
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'MEDIUM')
  const [dueDate, setDueDate] = useState<string | null>(task?.dueDate ?? null)
  const [reminderAt, setReminderAt] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onSubmit({ title: trimmed, description, priority, dueDate, reminderAt })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task ? 'Edit task' : 'New task'}
      footer={
        <>
          <Button variant="surface" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="navy"
            size="sm"
            form="task-form"
            type="submit"
            disabled={!title.trim() || pending}
          >
            {task ? 'Save changes' : 'Add task'}
          </Button>
        </>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          autoFocus
          required
        />
        <div className="flex flex-col gap-[7px]">
          <label
            htmlFor="task-description"
            className="text-[13px] font-semibold text-app-ink-soft"
          >
            Description
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add detail (optional)"
            rows={3}
            className="w-full rounded-[11px] border border-app-hairline bg-app-canvas px-3.5 py-[13px] font-display text-base text-app-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-[7px]">
            <label
              htmlFor="task-priority"
              className="text-[13px] font-semibold text-app-ink-soft"
            >
              Priority
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full rounded-[11px] border border-app-hairline bg-app-canvas px-3.5 py-[13px] font-display text-base text-app-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              {Priority.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0) + p.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <DateTimeField
            label="Due date"
            value={dueDate}
            onChange={setDueDate}
            timezone={timezone}
            mode="date"
          />
        </div>
        <DateTimeField
          label="Remind me (optional)"
          value={reminderAt}
          onChange={setReminderAt}
          timezone={timezone}
          mode="datetime"
        />
      </form>
    </Modal>
  )
}

/** Map form values to the create-task API input. */
export function toCreateInput(values: TaskFormValues): CreateTaskInput {
  return {
    title: values.title,
    description: values.description.trim() || undefined,
    priority: values.priority,
    status: 'TODO',
    dueDate: values.dueDate ? new Date(values.dueDate) : undefined,
  }
}
