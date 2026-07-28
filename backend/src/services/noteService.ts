import type { CreateNoteInput, ListNotesQuery, UpdateNoteInput } from '@life-os/shared'
import { ApiError } from '../middleware/errorHandler.js'
import * as noteRepo from '../repositories/noteRepository.js'

export function listForUser(userId: string, query: ListNotesQuery) {
  return noteRepo.listNotes(userId, query)
}

export async function getOne(userId: string, id: string) {
  const note = await noteRepo.findNoteById(userId, id)
  if (!note) {
    throw new ApiError(404, 'NOT_FOUND', 'Note not found')
  }
  return note
}

export function create(userId: string, input: CreateNoteInput) {
  return noteRepo.createNote(userId, input)
}

export async function update(userId: string, id: string, input: UpdateNoteInput) {
  await getOne(userId, id)
  return noteRepo.updateNote(id, input)
}

export async function remove(userId: string, id: string) {
  await getOne(userId, id)
  await noteRepo.softDeleteNote(id)
}
