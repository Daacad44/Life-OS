import type { CreateNoteInput, ListNotesQuery, UpdateNoteInput } from '@life-os/shared'
import { ApiError } from '../middleware/errorHandler.js'
import * as noteRepo from '../repositories/noteRepository.js'
import * as memoryService from './memoryService.js'

// Notes are embedded for AI Search — see Second Brain.md Section 6. Large notes are
// truncated before embedding rather than chunked (a simplification for MVP scale).
function embeddableText(title: string, content: string) {
  return `${title}\n\n${content}`.slice(0, 4000)
}

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

export async function create(userId: string, input: CreateNoteInput) {
  const note = await noteRepo.createNote(userId, input)
  void memoryService.syncNoteMemory(
    userId,
    note.id,
    embeddableText(note.title, note.content),
  )
  return note
}

export async function update(userId: string, id: string, input: UpdateNoteInput) {
  const existing = await getOne(userId, id)
  const note = await noteRepo.updateNote(id, input)
  void memoryService.syncNoteMemory(
    userId,
    note.id,
    embeddableText(input.title ?? existing.title, input.content ?? existing.content),
  )
  return note
}

export async function remove(userId: string, id: string) {
  await getOne(userId, id)
  await noteRepo.softDeleteNote(id)
  void memoryService.removeNoteMemory(userId, id)
}
