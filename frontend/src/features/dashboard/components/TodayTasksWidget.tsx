import { CheckCircle2, Circle } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Task } from '@life-os/shared'
import * as tasksApi from '@/features/tasks/api'
import { cn } from '@/lib/utils'
import { Widget } from './Widget'

export function TodayTasksWidget({
  todayTasks,
  overdueTasks,
}: {
  todayTasks: Task[]
  overdueTasks: Task[]
}) {
  const queryClient = useQueryClient()
  const toggleDone = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Task['status'] }) =>
      tasksApi.updateTask(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['planner'] })
    },
  })

  const items = [...overdueTasks, ...todayTasks]

  return (
    <Widget title="Today's Tasks" linkTo="/planner">
      {items.length === 0 && (
        <p className="text-sm text-text-muted">Nothing due today.</p>
      )}
      {items.map((task) => {
        const done = task.status === 'DONE'
        const overdue = overdueTasks.some((t) => t.id === task.id)
        return (
          <button
            key={task.id}
            type="button"
            onClick={() =>
              toggleDone.mutate({ id: task.id, status: done ? 'TODO' : 'DONE' })
            }
            className="flex items-center gap-2 text-left"
          >
            {done ? (
              <CheckCircle2 className="size-4 shrink-0 text-success" />
            ) : (
              <Circle className="size-4 shrink-0 text-text-muted" />
            )}
            <span
              className={cn(
                'truncate text-sm text-text',
                done && 'text-text-muted line-through',
                overdue && !done && 'text-danger',
              )}
            >
              {task.title}
            </span>
          </button>
        )
      })}
    </Widget>
  )
}
