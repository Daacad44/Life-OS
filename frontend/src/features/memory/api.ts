import type { MemoryItem } from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function listMemories() {
  return apiFetch<MemoryItem[]>('/v1/memory')
}

export async function deleteMemory(id: string) {
  await apiFetch<null>(`/v1/memory/${id}`, { method: 'DELETE' })
}
