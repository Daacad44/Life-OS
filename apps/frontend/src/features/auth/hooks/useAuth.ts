import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as authApi from '../api'

const ME_KEY = ['auth', 'me']

export function useCurrentUser() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: authApi.fetchMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => queryClient.setQueryData(ME_KEY, user),
  })
}

export function useSignup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (user) => queryClient.setQueryData(ME_KEY, user),
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => queryClient.setQueryData(ME_KEY, null),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (user) => queryClient.setQueryData(ME_KEY, user),
  })
}
