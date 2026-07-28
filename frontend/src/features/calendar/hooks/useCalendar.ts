import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateEventInput, UpdateEventInput } from '@life-os/shared'
import * as calendarApi from '../api'

function rangeKey(start: Date, end: Date) {
  return ['events', start.toISOString(), end.toISOString()] as const
}

export function useEvents(start: Date, end: Date) {
  return useQuery({
    queryKey: rangeKey(start, end),
    queryFn: () => calendarApi.listEvents(start, end),
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateEventInput) => calendarApi.createEvent(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateEventInput }) =>
      calendarApi.updateEvent(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: calendarApi.deleteEvent,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })
}
