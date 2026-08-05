import { useMemo, useState } from 'react'
import { Check, Plus, Trash2, CheckSquare } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardTitle,
  EmptyState,
  Skeleton,
  Tabs,
  type TabItem,
} from '@/components/ui-kit'
import { cn } from '@/lib/utils'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from '@/features/tasks/hooks/useTasks'
import {
  TaskFormModal,
  toCreateInput,
  type TaskFormValues,
} from '@/features/tasks/components/TaskFormModal'
import { dayDiffFromToday, formatDueLabel, formatDateTime } from '@/lib/datetime'
import type { ListTasksQuery, Priority, Task } from '@life-os/shared'

type TaskTab = 'today' | 'upcoming' | 'completed'

const priorityTone: Record<Priority, 'red' | 'amber' | 'navy'> = {
  HIGH: 'red',
  MEDIUM: 'amber',
  LOW: 'navy',
}

const priorityLabel: Record<Priority, string> = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
}

const tabs: TabItem<TaskTab>[] = [
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
]

// One shared filter object → one query key that every mutation targets, so
// optimistic updates land in the same cache entry the list reads from.
const filters: Partial<ListTasksQuery> = {
  sort: 'dueDate',
  order: 'asc',
  pageSize: 100,
}

export function TasksPage() {
  const timezone = useUserTimezone()
  const { data, isLoading, isError, refetch } = useTasks(filters)
  const createTask = useCreateTask(filters)
  const updateTask = useUpdateTask(filters)
  const deleteTask = useDeleteTask(filters)

  const [tab, setTab] = useState<TaskTab>('today')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Task | undefined>(undefined)

  const tasks = useMemo(() => data?.data ?? [], [data])

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (tab === 'completed') return t.status === 'DONE'
      if (t.status === 'DONE') return false
      const diff = t.dueDate ? dayDiffFromToday(t.dueDate, timezone) : null
      if (tab === 'today') return diff !== null && diff <= 0 // today or overdue
      return diff === null || diff > 0 // upcoming: future or undated
    })
  }, [tasks, tab, timezone])

  const active = tasks.find((t) => t.id === activeId) ?? filtered[0] ?? null

  function toggle(task: Task) {
    updateTask.mutate({
      id: task.id,
      input: { status: task.status === 'DONE' ? 'TODO' : 'DONE' },
    })
  }

  function openCreate() {
    setEditing(undefined)
    setModalOpen(true)
  }

  function openEdit(task: Task) {
    setEditing(task)
    setModalOpen(true)
  }

  function submit(values: TaskFormValues) {
    if (editing) {
      updateTask.mutate({
        id: editing.id,
        input: {
          title: values.title,
          description: values.description.trim() || null,
          priority: values.priority,
          dueDate: values.dueDate ? new Date(values.dueDate) : null,
        },
      })
    } else {
      createTask.mutate(toCreateInput(values))
    }
    setModalOpen(false)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Card padding="md">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Tabs items={tabs} value={tab} onChange={setTab} ariaLabel="Task filters" />
          <Button variant="navy" size="sm" className="gap-1.5" onClick={openCreate}>
            <Plus size={15} aria-hidden="true" />
            Add Task
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm font-medium text-accent-red">Couldn't load tasks.</p>
            <Button variant="surface" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title={
              tab === 'completed'
                ? 'Nothing completed yet'
                : tab === 'today'
                  ? 'Nothing due today'
                  : 'No upcoming tasks'
            }
            description={
              tab === 'completed'
                ? 'Finished tasks will collect here.'
                : 'Add your first task to get started.'
            }
            action={
              tab !== 'completed' ? (
                <Button variant="navy" size="sm" className="gap-1.5" onClick={openCreate}>
                  <Plus size={15} aria-hidden="true" />
                  Add Task
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="flex flex-col">
            {filtered.map((t) => {
              const done = t.status === 'DONE'
              return (
                <div
                  key={t.id}
                  className={cn(
                    'flex items-center gap-3 rounded-[10px] border-b border-app-hairline px-2.5 py-3 last:border-b-0',
                    active?.id === t.id ? 'bg-app-raised' : 'bg-transparent',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(t)}
                    aria-label={
                      done ? `Mark ${t.title} incomplete` : `Mark ${t.title} done`
                    }
                    className={cn(
                      'grid size-[22px] shrink-0 place-items-center rounded-[7px] border-2 pointer-coarse:size-11',
                      done ? 'border-amber-500 bg-amber-500' : 'border-slate-300',
                    )}
                  >
                    <Check
                      size={13}
                      className={cn('text-white', done ? 'opacity-100' : 'opacity-0')}
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveId(t.id)}
                    className={cn(
                      'flex-1 text-left text-[14.5px] font-semibold',
                      done ? 'text-app-ink-faint line-through' : 'text-app-ink',
                    )}
                  >
                    {t.title}
                  </button>
                  <span
                    className={cn(
                      'rounded-full bg-app-raised px-2.5 py-1 text-[11px] font-bold',
                      t.dueDate && dayDiffFromToday(t.dueDate, timezone) < 0 && !done
                        ? 'text-accent-red'
                        : 'text-app-ink-faint',
                    )}
                  >
                    {formatDueLabel(t.dueDate, timezone)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Card padding="md">
        <CardTitle className="mb-4">Task Details</CardTitle>
        {active ? (
          <>
            <div className="text-[17px] font-extrabold">{active.title}</div>
            {active.description ? (
              <p className="mt-2 text-sm font-medium leading-relaxed text-app-ink-muted">
                {active.description}
              </p>
            ) : null}

            <div className="mt-[18px] flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-app-ink-muted">
                  Priority
                </span>
                <Badge tone={priorityTone[active.priority]}>
                  {priorityLabel[active.priority]}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-app-ink-muted">
                  Due Date
                </span>
                <span className="text-[13.5px] font-bold">
                  {active.dueDate ? formatDateTime(active.dueDate, timezone) : 'No date'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-app-ink-muted">
                  Status
                </span>
                <span className="text-[13.5px] font-bold">
                  {active.status === 'DONE'
                    ? 'Completed'
                    : active.status === 'IN_PROGRESS'
                      ? 'In progress'
                      : 'To do'}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-2.5">
              <Button variant="navy" size="sm" onClick={() => openEdit(active)}>
                Edit
              </Button>
              <Button
                variant="surface"
                size="sm"
                className="gap-1.5 text-accent-red"
                onClick={() => {
                  deleteTask.mutate(active.id)
                  setActiveId(null)
                }}
              >
                <Trash2 size={15} aria-hidden="true" />
                Delete
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm font-medium text-app-ink-muted">
            Select a task to see its details.
          </p>
        )}
      </Card>

      {modalOpen ? (
        <TaskFormModal
          key={editing?.id ?? 'new'}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={submit}
          task={editing}
          pending={createTask.isPending || updateTask.isPending}
        />
      ) : null}
    </div>
  )
}
