import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as voiceApi from '../api'

export function useSendVoiceCommand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: voiceApi.sendCommand,
    onSuccess: (result) => {
      if (result.intent === 'create_task') {
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      }
    },
  })
}
