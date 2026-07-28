import type { CreateHabitInput, Habit, UpdateHabitInput } from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function listHabits() {
  return apiFetch<Habit[]>('/v1/habits')
}

export function createHabit(input: CreateHabitInput) {
  return apiFetch<Habit>('/v1/habits', { method: 'POST', body: JSON.stringify(input) })
}

export function updateHabit(id: string, input: UpdateHabitInput) {
  return apiFetch<Habit>(`/v1/habits/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function deleteHabit(id: string) {
  await apiFetch<null>(`/v1/habits/${id}`, { method: 'DELETE' })
}

export function checkin(id: string) {
  return apiFetch<{ checkin: { id: string; date: string }; streak: number }>(
    `/v1/habits/${id}/checkin`,
    { method: 'POST' },
  )
}
