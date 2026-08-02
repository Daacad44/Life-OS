import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import type { Task } from '@life-os/shared'

vi.mock('../api', () => ({
  listTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}))

const tasksApi = await import('../api')
const { useCreateTask } = await import('./useTasks')

function wrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const existingTask: Task = {
  id: 'task-1',
  userId: 'user-1',
  title: 'Existing task',
  description: null,
  status: 'TODO',
  priority: 'MEDIUM',
  dueDate: null,
  order: 0,
  goalId: null,
  projectId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('useCreateTask', () => {
  it('optimistically adds the new task to the cache before the request resolves', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    queryClient.setQueryData(['tasks', {}], { data: [existingTask] })

    let resolveCreate!: (task: Task) => void
    vi.mocked(tasksApi.createTask).mockReturnValue(
      new Promise((resolve) => {
        resolveCreate = resolve
      }),
    )

    const { result } = renderHook(() => useCreateTask({}), {
      wrapper: wrapper(queryClient),
    })

    act(() => {
      result.current.mutate({ title: 'New task', status: 'TODO', priority: 'MEDIUM' })
    })

    await waitFor(() => {
      const cached = queryClient.getQueryData<{ data: Task[] }>(['tasks', {}])
      expect(cached?.data).toHaveLength(2)
      expect(cached?.data[0].title).toBe('New task')
    })

    resolveCreate({ ...existingTask, id: 'task-2', title: 'New task' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('rolls back the optimistic task when the request fails', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    queryClient.setQueryData(['tasks', {}], { data: [existingTask] })
    vi.mocked(tasksApi.createTask).mockRejectedValue(new Error('network error'))

    const { result } = renderHook(() => useCreateTask({}), {
      wrapper: wrapper(queryClient),
    })

    act(() => {
      result.current.mutate({ title: 'Will fail', status: 'TODO', priority: 'MEDIUM' })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    const cached = queryClient.getQueryData<{ data: Task[] }>(['tasks', {}])
    expect(cached?.data).toEqual([existingTask])
  })
})
