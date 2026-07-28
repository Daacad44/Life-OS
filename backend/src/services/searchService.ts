import { prisma } from '../config/db.js'
import * as memoryService from './memoryService.js'
import * as aiService from '../ai/service.js'

export interface SearchResultItem {
  type: 'note' | 'task' | 'goal' | 'reflection' | 'memory'
  id: string
  title: string
  snippet: string
}

// Notes get real semantic search (they're embedded on write — see noteService).
// Tasks, goals, and reflections use keyword matching: short, structured records where
// exact/partial title matches are more useful than embedding every row would be.
// See AI Search.md Section 6-7.
export async function search(userId: string, query: string): Promise<SearchResultItem[]> {
  const [memoryHits, noteHits, taskHits, goalHits, reflectionHits] = await Promise.all([
    memoryService.search(userId, query, 8),
    prisma.note.findMany({
      where: {
        userId,
        deletedAt: null,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 5,
    }),
    prisma.task.findMany({
      where: { userId, deletedAt: null, title: { contains: query, mode: 'insensitive' } },
      take: 5,
    }),
    prisma.goal.findMany({
      where: {
        userId,
        deletedAt: null,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 5,
    }),
    prisma.reflection.findMany({
      where: {
        userId,
        OR: [
          { prompt: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 5,
    }),
  ])

  const results: SearchResultItem[] = []
  const seenNoteIds = new Set<string>()

  for (const hit of memoryHits) {
    if (hit.sourceType === 'note' && hit.sourceId) {
      if (seenNoteIds.has(hit.sourceId)) continue
      seenNoteIds.add(hit.sourceId)
      const [firstLine, ...rest] = hit.content.split('\n\n')
      results.push({
        type: 'note',
        id: hit.sourceId,
        title: firstLine || 'Note',
        snippet: rest.join(' ').slice(0, 200),
      })
    } else if (!hit.sourceType) {
      results.push({
        type: 'memory',
        id: hit.id,
        title: 'What I remember',
        snippet: hit.content,
      })
    }
  }

  for (const note of noteHits) {
    if (seenNoteIds.has(note.id)) continue
    seenNoteIds.add(note.id)
    results.push({
      type: 'note',
      id: note.id,
      title: note.title,
      snippet: note.content.slice(0, 200),
    })
  }

  for (const task of taskHits) {
    results.push({
      type: 'task',
      id: task.id,
      title: task.title,
      snippet: task.description ?? '',
    })
  }
  for (const goal of goalHits) {
    results.push({
      type: 'goal',
      id: goal.id,
      title: goal.title,
      snippet: goal.description ?? '',
    })
  }
  for (const reflection of reflectionHits) {
    results.push({
      type: 'reflection',
      id: reflection.id,
      title: reflection.prompt,
      snippet: reflection.content.slice(0, 200),
    })
  }

  return results
}

// Adds an AI-synthesized answer on top of raw results (RAG) — degrades to raw results
// if the AI call fails, per AI Search.md's edge case: "AI answer fails → still show raw results."
export async function searchWithAnswer(
  userId: string,
  query: string,
): Promise<{ results: SearchResultItem[]; answer: string | null }> {
  const results = await search(userId, query)
  if (results.length === 0) return { results, answer: null }

  try {
    const context = results.map((r) => `[${r.type}] ${r.title}: ${r.snippet}`).join('\n')
    const answer = await aiService.generateText({
      userId,
      feature: 'search',
      system:
        "Answer the user's question using ONLY the provided context from their own data. If the context doesn't contain the answer, say so honestly and briefly. Keep the answer concise.",
      messages: [{ role: 'user', content: `Context:\n${context}\n\nQuestion: ${query}` }],
      maxTokens: 500,
    })
    return { results, answer }
  } catch (err) {
    console.error('AI search answer failed:', err instanceof Error ? err.message : err)
    return { results, answer: null }
  }
}
