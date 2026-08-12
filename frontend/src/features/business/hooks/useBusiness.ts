import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UpdateProjectInput } from '@life-os/shared'
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

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProjectInput }) =>
      businessApi.updateProject(id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['business', 'projects'] }),
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: businessApi.deleteProject,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['business', 'projects'] }),
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: businessApi.deleteClient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['business', 'clients'] }),
  })
}
