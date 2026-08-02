import type { VoiceCommandResult } from '@life-os/shared'
import { apiFetch } from '@/lib/api'

export function sendCommand(text: string) {
  return apiFetch<VoiceCommandResult>('/v1/voice/command', {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
}
