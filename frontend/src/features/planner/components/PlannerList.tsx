import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Task } from '@life-os/shared'
import * as tasksApi from '@/features/tasks/api'
import { Button } from '@/components/ui/button'
import { usePlan, useReorder } from '../hooks/usePlanner'
import { SortableTaskItem } from './SortableTaskItem'

export function PlannerList({ date }: { date: string }) {
  const { data, isLoading, isError, refetch } = usePlan(date)
  const reorder = useReorder(date)
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['planner'] })
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  }

  const toggleDone = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Task['status'] }) =>
      tasksApi.updateTask(id, { status }),
    onSuccess: invalidate,
  })
  const deleteTask = useMutation({
    mutationFn: tasksApi.deleteTask,
    onSuccess: invalidate,
  })
  const reschedule = useMutation({
    mutationFn: ({ id, dueDate }: { id: string; dueDate: string }) =>
      tasksApi.updateTask(id, { dueDate: new Date(dueDate) }),
    onSuccess: invalidate,
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[0, 1].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-md bg-primary-muted" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-danger">Couldn&apos;t load the plan.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  const overdue = data?.overdue ?? []
  const tasks = data?.tasks ?? []

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const ids = tasks.map((t) => t.id)
    const oldIndex = ids.indexOf(active.id as string)
    const newIndex = ids.indexOf(over.id as string)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = [...ids]
    reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, active.id as string)
    reorder.mutate(reordered)
  }

  if (overdue.length === 0 && tasks.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-text-muted">
        Nothing planned — add a task below.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {overdue.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-danger">
            Overdue ({overdue.length})
          </h2>
          {overdue.map((task) => (
            <SortableTaskItem
              key={task.id}
              task={task}
              onToggleDone={() =>
                toggleDone.mutate({
                  id: task.id,
                  status: task.status === 'DONE' ? 'TODO' : 'DONE',
                })
              }
              onDelete={() => deleteTask.mutate(task.id)}
              onReschedule={(newDate) =>
                reschedule.mutate({ id: task.id, dueDate: newDate })
              }
            />
          ))}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {tasks.map((task) => (
              <SortableTaskItem
                key={task.id}
                task={task}
                onToggleDone={() =>
                  toggleDone.mutate({
                    id: task.id,
                    status: task.status === 'DONE' ? 'TODO' : 'DONE',
                  })
                }
                onDelete={() => deleteTask.mutate(task.id)}
                onReschedule={(newDate) =>
                  reschedule.mutate({ id: task.id, dueDate: newDate })
                }
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
