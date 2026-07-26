import { CheckCircle2, Circle, Trash2 } from 'lucide-react'
import type { ListTasksQuery, Task } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDeleteTask, useUpdateTask } from '../hooks/useTasks'

const PRIORITY_STYLES: Record<Task['priority'], string> = {
  LOW: 'bg-neutral-500/10 text-text-muted',
  MEDIUM: 'bg-info/10 text-info',
  HIGH: 'bg-danger/10 text-danger',
}

export function TaskItem({
  task,
  filters,
}: {
  task: Task
  filters: Partial<ListTasksQuery>
}) {
  const updateTask = useUpdateTask(filters)
  const deleteTask = useDeleteTask(filters)
  const done = task.status === 'DONE'

  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-2.5">
      <button
        type="button"
        aria-label={done ? 'Mark as not done' : 'Mark as done'}
        onClick={() =>
          updateTask.mutate({ id: task.id, input: { status: done ? 'TODO' : 'DONE' } })
        }
        className="text-text-muted hover:text-primary"
      >
        {done ? (
          <CheckCircle2 className="size-5 text-success" />
        ) : (
          <Circle className="size-5" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'truncate text-sm text-text',
            done && 'text-text-muted line-through',
          )}
        >
          {task.title}
        </p>
        {task.dueDate && (
          <p className="text-xs text-text-muted">
            Due {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}
      </div>

      <span
        className={cn(
          'rounded-full px-2 py-0.5 text-xs font-medium',
          PRIORITY_STYLES[task.priority],
        )}
      >
        {task.priority}
      </span>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Delete task"
        onClick={() => deleteTask.mutate(task.id)}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  )
}
