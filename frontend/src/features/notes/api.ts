import type {
  CreateNoteInput,
  ListNotesQuery,
  Note,
  UpdateNoteInput,
} from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function listNotes(query: Partial<ListNotesQuery> = {}) {
  const params = new URLSearchParams()
  if (query.tag) params.set('tag', query.tag)
  const qs = params.toString()
  return apiFetch<Note[]>(`/v1/notes${qs ? `?${qs}` : ''}`)
}

export function getNote(id: string) {
  return apiFetch<Note>(`/v1/notes/${id}`)
}

export function createNote(input: CreateNoteInput) {
  return apiFetch<Note>('/v1/notes', { method: 'POST', body: JSON.stringify(input) })
}

export function updateNote(id: string, input: UpdateNoteInput) {
  return apiFetch<Note>(`/v1/notes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export async function deleteNote(id: string) {
  await apiFetch<null>(`/v1/notes/${id}`, { method: 'DELETE' })
}
