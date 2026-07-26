import type {
  CreateTaskInput,
  ListTasksQuery,
  Task,
  UpdateTaskInput,
} from '@life-os/shared'
import { apiFetch, apiFetchList } from '@/lib/api'

export async function listTasks(query: Partial<ListTasksQuery>) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, String(value))
  }
  return apiFetchList<Task[]>(`/v1/tasks?${params.toString()}`)
}

export function createTask(input: CreateTaskInput) {
  return apiFetch<Task>('/v1/tasks', { method: 'POST', body: JSON.stringify(input) })
}

export function updateTask(id: string, input: UpdateTaskInput) {
  return apiFetch<Task>(`/v1/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function deleteTask(id: string) {
  await apiFetch<null>(`/v1/tasks/${id}`, { method: 'DELETE' })
}
