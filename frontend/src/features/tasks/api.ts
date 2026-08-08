import type {
  CreateRecurringTaskInput,
  CreateSubtaskInput,
  CreateTaskInput,
  ListTasksQuery,
  RecurringTask,
  Subtask,
  Task,
  UpdateRecurringTaskInput,
  UpdateSubtaskInput,
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

// --- Subtasks ---------------------------------------------------------------

export function addSubtask(taskId: string, input: CreateSubtaskInput) {
  return apiFetch<Subtask>(`/v1/tasks/${taskId}/subtasks`, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateSubtask(subtaskId: string, input: UpdateSubtaskInput) {
  return apiFetch<Subtask>(`/v1/tasks/subtasks/${subtaskId}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function deleteSubtask(subtaskId: string) {
  await apiFetch<null>(`/v1/tasks/subtasks/${subtaskId}`, { method: 'DELETE' })
}

// --- Recurring tasks --------------------------------------------------------

export function listRecurringTasks() {
  return apiFetch<RecurringTask[]>('/v1/tasks/recurring')
}

export function createRecurringTask(input: CreateRecurringTaskInput) {
  return apiFetch<RecurringTask>('/v1/tasks/recurring', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateRecurringTask(id: string, input: UpdateRecurringTaskInput) {
  return apiFetch<RecurringTask>(`/v1/tasks/recurring/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function deleteRecurringTask(id: string) {
  await apiFetch<null>(`/v1/tasks/recurring/${id}`, { method: 'DELETE' })
}
