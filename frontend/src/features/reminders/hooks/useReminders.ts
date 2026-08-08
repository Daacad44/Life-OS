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

const ALARMS_KEY = ['reminders', 'alarms']

// Poll for fired reminders. 20s keeps the alarm close to "on time" without a
// websocket; the backend scheduler ticks every 60s and marks them sent.
export function usePendingAlarms(enabled = true) {
  return useQuery({
    queryKey: ALARMS_KEY,
    queryFn: remindersApi.listPendingAlarms,
    refetchInterval: 20_000,
    refetchIntervalInBackground: true,
    enabled,
  })
}

export function useAcknowledgeReminder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: remindersApi.acknowledgeReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALARMS_KEY })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useSnoozeReminder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, minutes }: { id: string; minutes: number }) =>
      remindersApi.snoozeReminder(id, minutes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ALARMS_KEY }),
  })
}
