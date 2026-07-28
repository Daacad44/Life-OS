import { useMutation } from '@tanstack/react-query'
import * as searchApi from '../api'

export function useSearch() {
  return useMutation({ mutationFn: searchApi.search })
}

export function useAiSearch() {
  return useMutation({ mutationFn: searchApi.aiSearch })
}
