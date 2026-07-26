import type { ListTasksQuery } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { useTasks } from '../hooks/useTasks'
import { TaskItem } from './TaskItem'

const STATUS_GROUPS = [
  { status: 'TODO', label: 'To do' },
  { status: 'IN_PROGRESS', label: 'In progress' },
  { status: 'DONE', label: 'Done' },
] as const

export function TaskList({ filters }: { filters: Partial<ListTasksQuery> }) {
  const { data, isLoading, isError, refetch } = useTasks(filters)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-md bg-primary-muted" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-danger">Couldn&apos;t load tasks.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  const tasks = data?.data ?? []

  if (tasks.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-text-muted">
        No tasks yet — add your first one.
      </p>
    )
  }

  // When a status filter is active, the list is already scoped to one status.
  if (filters.status) {
    return (
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} filters={filters} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {STATUS_GROUPS.map(({ status, label }) => {
        const group = tasks.filter((t) => t.status === status)
        if (group.length === 0) return null
        return (
          <div key={status} className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-text-muted">
              {label} ({group.length})
            </h2>
            {group.map((task) => (
              <TaskItem key={task.id} task={task} filters={filters} />
            ))}
          </div>
        )
      })}
    </div>
  )
}
