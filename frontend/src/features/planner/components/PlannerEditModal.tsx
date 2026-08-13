import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Task, Priority } from '@life-os/shared'
import { Button, Input, Modal } from '@/components/ui-kit'
import * as tasksApi from '@/features/tasks/api'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import { isoToInputValue, wallTimeToUtcIso } from '@/lib/datetime'

const PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH']

/**
 * Edit a plan item's title, time-of-day and priority (the "U" in the Planner's
 * CRUD). Saves via PATCH /tasks/:id; the field values are held locally until
 * Save, so clicking away never discards the edit (Global Requirement B).
 */
export function PlannerEditModal({
  task,
  date,
  onClose,
}: {
  task: Task
  date: string
  onClose: () => void
}) {
  const timezone = useUserTimezone()
  const queryClient = useQueryClient()

  const [title, setTitle] = useState(task.title)
  const [time, setTime] = useState(
    task.dueDate
      ? (isoToInputValue(task.dueDate, timezone, 'datetime').split('T')[1] ?? '')
      : '',
  )
  const [priority, setPriority] = useState<Priority>(task.priority)

  const save = useMutation({
    mutationFn: () =>
      tasksApi.updateTask(task.id, {
        title: title.trim(),
        priority,
        dueDate: new Date(wallTimeToUtcIso(`${date}T${time || '12:00'}`, timezone)),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      onClose()
    },
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    save.mutate()
  }

  const selectClass =
    'h-10 rounded-md border border-app-hairline bg-app-canvas px-3 text-sm text-app-ink'

  return (
    <Modal
      open
      onClose={onClose}
      title="Edit plan item"
      footer={
        <>
          <Button variant="surface" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="md"
            onClick={handleSubmit}
            disabled={!title.trim() || save.isPending}
          >
            {save.isPending ? 'Saving…' : 'Save'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-[7px]">
            <label
              htmlFor="edit-time"
              className="text-[13px] font-semibold text-app-ink-soft"
            >
              Time
            </label>
            <input
              id="edit-time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={selectClass}
            />
          </div>
          <div className="flex flex-col gap-[7px]">
            <label
              htmlFor="edit-priority"
              className="text-[13px] font-semibold text-app-ink-soft"
            >
              Priority
            </label>
            <select
              id="edit-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className={selectClass}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
        {save.isError ? (
          <p className="text-xs font-semibold text-accent-red">
            Couldn&apos;t save. Please try again.
          </p>
        ) : null}
      </form>
    </Modal>
  )
}
