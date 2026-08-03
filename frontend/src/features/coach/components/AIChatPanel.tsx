import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useCoachChat, useCoachHistory } from '../hooks/useCoach'

export function AIChatPanel({ compact = false }: { compact?: boolean }) {
  const { data: history, isLoading, isError, refetch } = useCoachHistory()
  const { pending, isStreaming, error, send } = useCoachChat()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const messages = [...(history ?? []), ...pending]
  const lastContent = messages[messages.length - 1]?.content

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, lastContent])

  function handleSend() {
    const trimmed = input.trim()
    if (!trimmed || isStreaming) return
    setInput('')
    void send(trimmed)
  }

  return (
    <div className={cn('flex flex-col', compact ? 'h-80' : 'h-[calc(100vh-11rem)]')}>
      <div className="flex-1 overflow-y-auto rounded-md border border-border bg-surface p-4">
        {isLoading && <p className="text-sm text-text-muted">Loading...</p>}
        {isError && (
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm text-danger">Couldn&apos;t load chat history.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}
        {!isLoading && !isError && messages.length === 0 && (
          <p className="text-sm text-text-muted">
            Ask your coach about your goals, tasks, or how your day is going.
          </p>
        )}
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                'max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm',
                m.role === 'USER'
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'bg-primary-muted text-text',
              )}
            >
              {m.content || (m.role === 'ASSISTANT' && isStreaming ? '…' : '')}
            </div>
          ))}
        </div>
        <div ref={bottomRef} />
      </div>

      {error && <p className="mt-2 text-xs text-danger">{error}</p>}

      <div className="mt-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend()
          }}
          placeholder="Message your coach..."
          disabled={isStreaming}
        />
        <Button
          onClick={handleSend}
          disabled={isStreaming || !input.trim()}
          aria-label="Send"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  )
}
