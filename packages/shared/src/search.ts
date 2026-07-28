import { z } from 'zod'

// AI Search — see docs/.../02-PRD/AI Search.md
export const searchQuerySchema = z.object({
  query: z.string().min(1).max(500),
})
export type SearchQueryInput = z.infer<typeof searchQuerySchema>

export const SearchResultType = ['note', 'task', 'goal', 'reflection', 'memory'] as const
export type SearchResultType = (typeof SearchResultType)[number]

export interface SearchResultItem {
  type: SearchResultType
  id: string
  title: string
  snippet: string
}

export interface SearchResponse {
  results: SearchResultItem[]
  answer: string | null
}
