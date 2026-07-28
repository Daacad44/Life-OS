import { ApiError } from '../middleware/errorHandler.js'
import { embed } from '../ai/embeddings.js'
import * as memoryRepo from '../repositories/memoryRepository.js'

export async function store(userId: string, content: string, type: string) {
  const embedding = await embed(content)
  return memoryRepo.insertMemory(userId, content, type, embedding)
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

// Used internally for RAG (Coach, Reflection). Degrades to no memories rather than
// failing the whole feature — see AI Architecture.md's "graceful fallback" principle.
export async function search(userId: string, query: string, topK = 5) {
  try {
    const embedding = await embed(query)
    return await memoryRepo.searchMemories(userId, embedding, topK)
  } catch (err) {
    console.error('Memory search unavailable:', err instanceof Error ? err.message : err)
    return []
  }
}

// Fire-and-forget store used after Coach/Reflection exchanges — never throws.
export async function storeSafely(userId: string, content: string, type: string) {
  try {
    await store(userId, content, type)
  } catch (err) {
    console.error('Memory store failed:', err instanceof Error ? err.message : err)
  }
}
