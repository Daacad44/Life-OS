import type { CommunityPost, Connection, ShareGoalInput } from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function getOptIn() {
  return apiFetch<{ optIn: boolean }>('/v1/community/opt-in')
}

export function setOptIn(optIn: boolean) {
  return apiFetch<{ optIn: boolean }>('/v1/community/opt-in', {
    method: 'PATCH',
    body: JSON.stringify({ optIn }),
  })
}

export function listConnections() {
  return apiFetch<Connection[]>('/v1/community/connections')
}

export function connect(partnerEmail: string) {
  return apiFetch<Connection>('/v1/community/connect', {
    method: 'POST',
    body: JSON.stringify({ partnerEmail }),
  })
}

export function respondToConnection(id: string, status: 'ACCEPTED' | 'DECLINED') {
  return apiFetch<Connection>(`/v1/community/connect/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export function shareGoal(input: ShareGoalInput) {
  return apiFetch<CommunityPost>('/v1/community/share', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function getFeed() {
  return apiFetch<CommunityPost[]>('/v1/community/feed')
}

export async function reportPost(id: string) {
  await apiFetch<null>(`/v1/community/posts/${id}/report`, { method: 'POST' })
}
