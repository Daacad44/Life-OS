import { ApiError } from '../middleware/errorHandler.js'
import { embed } from '../ai/embeddings.js'
import * as memoryRepo from '../repositories/memoryRepository.js'
import { logger } from '../config/logger.js'

export async function store(
  userId: string,
  content: string,
  type: string,
  source?: { type: string; id: string },
) {
  const embedding = await embed(content)
  return memoryRepo.insertMemory(
    userId,
    content,
    type,
    embedding,
    source?.type,
    source?.id,
  )
}

export function listForUser(userId: string) {
  return memoryRepo.listMemories(userId)
}

export async function remove(userId: string, id: string) {
  const existing = await memoryRepo.findMemoryById(userId, id)
  if (!existing) {
    throw new ApiError(404, 'NOT_FOUND', 'Memory not found')
  }
  await memoryRepo.deleteMemory(id)
}

// Used internally for RAG (Coach, Reflection, Search). Degrades to no memories rather
// than failing the whole feature — see AI Architecture.md's "graceful fallback" principle.
export async function search(userId: string, query: string, topK = 5) {
  try {
    const embedding = await embed(query)
    return await memoryRepo.searchMemories(userId, embedding, topK)
  } catch (err) {
    logger.error({ err }, 'Memory search unavailable')
    return []
  }
}

// Fire-and-forget store used after Coach/Reflection exchanges — never throws.
export async function storeSafely(userId: string, content: string, type: string) {
  try {
    await store(userId, content, type)
  } catch (err) {
    logger.error({ err }, 'Memory store failed')
  }
}

// Re-embeds a Note as a memory (deleting any stale embedding first) — used by Second
// Brain on create/update so AI Search stays in sync. Fire-and-forget: a note always
// saves even if embedding is unavailable (AI is a layer, not the base).
export async function syncNoteMemory(
  userId: string,
  noteId: string,
  embeddableText: string,
) {
  try {
    await memoryRepo.deleteMemoriesBySource(userId, 'note', noteId)
    await store(userId, embeddableText, 'note', { type: 'note', id: noteId })
  } catch (err) {
    logger.error({ err }, 'Note memory sync failed')
  }
}

export async function removeNoteMemory(userId: string, noteId: string) {
  try {
    await memoryRepo.deleteMemoriesBySource(userId, 'note', noteId)
  } catch (err) {
    logger.error({ err }, 'Note memory cleanup failed')
  }
}
