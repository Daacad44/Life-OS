import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ListRemindersQuery } from '@life-os/shared'
import * as remindersApi from '../api'

export function useReminders(query: Partial<ListRemindersQuery> = {}) {
  return useQuery({
    queryKey: ['reminders', query],
    queryFn: () => remindersApi.listReminders(query),
  })
}

export function useCreateReminder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: remindersApi.createReminder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reminders'] }),
  })
}

export function useDeleteReminder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: remindersApi.deleteReminder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reminders'] }),
  })
}
