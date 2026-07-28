import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ListTasksQuery, Task } from '@life-os/shared'
import * as tasksApi from '../api'

type Filters = Partial<ListTasksQuery>

function tasksKey(filters: Filters) {
  return ['tasks', filters] as const
}

export function useTasks(filters: Filters) {
  return useQuery({
    queryKey: tasksKey(filters),
    queryFn: () => tasksApi.listTasks(filters),
  })
}

export function useCreateTask(filters: Filters) {
  const queryClient = useQueryClient()
  const key = tasksKey(filters)

  return useMutation({
    mutationFn: tasksApi.createTask,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<{ data: Task[] }>(key)

      const optimisticTask: Task = {
        id: `optimistic-${Date.now()}`,
        userId: '',
        title: input.title,
        description: input.description ?? null,
        status: input.status ?? 'TODO',
        priority: input.priority ?? 'MEDIUM',
        dueDate: input.dueDate ? input.dueDate.toString() : null,
        order: 0,
        goalId: input.goalId ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      queryClient.setQueryData<{ data: Task[] } | undefined>(key, (old) =>
        old ? { ...old, data: [optimisticTask, ...old.data] } : old,
      )

      return { previous }
    },
    onError: (_err, _input, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      // Planner is another view over the same Task rows — keep it in sync.
      queryClient.invalidateQueries({ queryKey: ['planner'] })
    },
  })
}

export function useUpdateTask(filters: Filters) {
  const queryClient = useQueryClient()
  const key = tasksKey(filters)

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string
      input: Parameters<typeof tasksApi.updateTask>[1]
    }) => tasksApi.updateTask(id, input),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<{ data: Task[] }>(key)

      const { dueDate, ...rest } = input
      queryClient.setQueryData<{ data: Task[] } | undefined>(key, (old) =>
        old
          ? {
              ...old,
              data: old.data.map((t) =>
                t.id === id
                  ? {
                      ...t,
                      ...rest,
                      ...(dueDate !== undefined && {
                        dueDate: dueDate ? dueDate.toISOString() : null,
                      }),
                    }
                  : t,
              ),
            }
          : old,
      )

      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      // Planner is another view over the same Task rows — keep it in sync.
      queryClient.invalidateQueries({ queryKey: ['planner'] })
    },
  })
}

export function useDeleteTask(filters: Filters) {
  const queryClient = useQueryClient()
  const key = tasksKey(filters)

  return useMutation({
    mutationFn: tasksApi.deleteTask,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<{ data: Task[] }>(key)

      queryClient.setQueryData<{ data: Task[] } | undefined>(key, (old) =>
        old ? { ...old, data: old.data.filter((t) => t.id !== id) } : old,
      )

      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      // Planner is another view over the same Task rows — keep it in sync.
      queryClient.invalidateQueries({ queryKey: ['planner'] })
    },
  })
}
