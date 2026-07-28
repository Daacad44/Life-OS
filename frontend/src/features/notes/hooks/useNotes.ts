import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ListNotesQuery, UpdateNoteInput } from '@life-os/shared'
import * as notesApi from '../api'

export function useNotes(query: Partial<ListNotesQuery> = {}) {
  return useQuery({
    queryKey: ['notes', query],
    queryFn: () => notesApi.listNotes(query),
  })
}

export function useNote(id: string | null) {
  return useQuery({
    queryKey: ['notes', 'detail', id],
    queryFn: () => notesApi.getNote(id!),
    enabled: !!id,
  })
}

export function useCreateNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notesApi.createNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  })
}

export function useUpdateNote(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateNoteInput) => notesApi.updateNote(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  })
}

export function useDeleteNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notesApi.deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
  })
}
