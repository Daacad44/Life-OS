import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as communityApi from '../api'

export function useCommunityOptIn() {
  return useQuery({ queryKey: ['community', 'opt-in'], queryFn: communityApi.getOptIn })
}

export function useSetOptIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: communityApi.setOptIn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community'] }),
  })
}

export function useConnections() {
  return useQuery({
    queryKey: ['community', 'connections'],
    queryFn: communityApi.listConnections,
  })
}

export function useConnect() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: communityApi.connect,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['community', 'connections'] }),
  })
}

export function useRespondToConnection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACCEPTED' | 'DECLINED' }) =>
      communityApi.respondToConnection(id, status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['community', 'connections'] }),
  })
}

export function useShareGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: communityApi.shareGoal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community', 'feed'] }),
  })
}

export function useFeed() {
  return useQuery({ queryKey: ['community', 'feed'], queryFn: communityApi.getFeed })
}

export function useReportPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: communityApi.reportPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community', 'feed'] }),
  })
}
