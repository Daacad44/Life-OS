import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import type { Task } from '@life-os/shared'
import { TaskItem } from '@/features/tasks/components/TaskItem'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import { isoToInputValue, wallTimeToUtcIso } from '@/lib/datetime'

export function SortableTaskItem({
  task,
  onToggleDone,
  onDelete,
  onReschedule,
}: {
  task: Task
  onToggleDone: () => void
  onDelete: () => void
  onReschedule: (iso: string) => void
}) {
  const timezone = useUserTimezone()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: task.id,
    })

  // Preserve the item's time-of-day when moving it to another day.
  function moveToDay(newDate: string) {
    const currentTime = task.dueDate
      ? (isoToInputValue(task.dueDate, timezone, 'datetime').split('T')[1] ?? '12:00')
      : '12:00'
    onReschedule(wallTimeToUtcIso(`${newDate}T${currentTime}`, timezone))
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? 'opacity-50' : undefined}
    >
      <div className="flex items-center gap-1">
        <TaskItem
          task={task}
          onToggleDone={onToggleDone}
          onDelete={onDelete}
          dragHandle={
            <button
              type="button"
              className="cursor-grab touch-none text-text-muted active:cursor-grabbing"
              aria-label="Drag to reorder"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="size-4" />
            </button>
          }
        />
        <input
          type="date"
          aria-label="Move to another day"
          className="h-9 w-9 shrink-0 rounded-md border border-border bg-surface text-xs text-transparent [color-scheme:light] [&::-webkit-calendar-picker-indicator]:opacity-100"
          value={task.dueDate?.slice(0, 10) ?? ''}
          onChange={(e) => e.target.value && moveToDay(e.target.value)}
        />
      </div>
    </div>
  )
}
