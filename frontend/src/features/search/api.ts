import type { SearchResponse } from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function search(query: string) {
  return apiFetch<SearchResponse>('/v1/search', {
    method: 'POST',
    body: JSON.stringify({ query }),
  })
}

export function aiSearch(query: string) {
  return apiFetch<SearchResponse>('/v1/ai/search', {
    method: 'POST',
    body: JSON.stringify({ query }),
  })
}
