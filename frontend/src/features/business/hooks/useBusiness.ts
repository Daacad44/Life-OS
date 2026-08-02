import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as businessApi from '../api'

export function useProjects() {
  return useQuery({
    queryKey: ['business', 'projects'],
    queryFn: businessApi.listProjects,
  })
}

export function useClients() {
  return useQuery({ queryKey: ['business', 'clients'], queryFn: businessApi.listClients })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: businessApi.createProject,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['business', 'projects'] }),
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: businessApi.createClient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['business', 'clients'] }),
  })
}
