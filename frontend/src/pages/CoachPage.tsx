import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowUp, Bot, Mic } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Skeleton } from '@/components/ui-kit'
import { cn } from '@/lib/utils'
import { useCoachHistory, useCoachChat } from '@/features/coach/hooks/useCoach'

const chips = [
  'Help me plan my day',
  'I need motivation',
  'How can I be more productive?',
]

export function CoachPage() {
  const { data: history, isLoading, isError, refetch } = useCoachHistory()
  const { pending, isStreaming, error, send } = useCoachChat()
  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const prefillSent = useRef(false)

  // A prompt handed over from the Dashboard's coach card: send it once.
  useEffect(() => {
    const prefill = (location.state as { prefill?: string } | null)?.prefill
    if (prefill && !prefillSent.current) {
      prefillSent.current = true
      send(prefill)
      navigate(location.pathname, { replace: true })
    }
  }, [location, navigate, send])

  const messages = [...(history ?? []), ...pending]

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages.length, pending])

  function submit(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return
    send(trimmed)
    setDraft('')
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    submit(draft)
  }

  const showEmpty = !isLoading && !isError && messages.length === 0

  return (
    <div className="flex h-[calc(100dvh-150px)] flex-col overflow-hidden rounded-2xl border border-app-hairline/70 bg-app-surface">
      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-4 overflow-y-auto p-[22px]"
      >
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-2/3" />
            <Skeleton className="ml-auto h-10 w-1/2" />
            <Skeleton className="h-20 w-3/4" />
          </>
        ) : isError ? (
          <div className="m-auto flex flex-col items-center gap-3 text-center">
            <p className="text-sm font-medium text-accent-red">
              Couldn't load your conversation.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-full bg-amber-100 px-4 py-2 text-[13px] font-semibold text-amber-700 hover:bg-amber-100/70"
            >
              Retry
            </button>
          </div>
        ) : showEmpty ? (
          <div className="m-auto flex max-w-sm flex-col items-center gap-3 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-amber-100 text-amber-600">
              <Bot size={26} aria-hidden="true" />
            </span>
            <div className="text-base font-extrabold text-app-ink">
              Your AI Coach is ready
            </div>
            <p className="text-sm font-medium text-app-ink-muted">
              Ask about planning your day, staying focused, or building better habits.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isUser = m.role === 'USER'
            return (
              <div
                key={m.id}
                className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3.5 text-[14.5px] font-medium leading-relaxed whitespace-pre-wrap sm:max-w-[72%]',
                    isUser
                      ? 'bg-navy-900 text-white'
                      : 'border border-app-hairline bg-app-raised text-app-ink-soft',
                  )}
                >
                  {m.content || (isStreaming ? '…' : '')}
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="border-t border-app-hairline px-[18px] py-3.5">
        {error ? (
          <p className="mb-2 text-[13px] font-semibold text-accent-red">{error}</p>
        ) : null}
        <div className="mb-3 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => submit(c)}
              disabled={isStreaming}
              className="rounded-full bg-amber-100 px-3.5 py-2 text-[13px] font-semibold text-amber-700 hover:bg-amber-100/70 disabled:opacity-50"
            >
              {c}
            </button>
          ))}
        </div>
        <form
          onSubmit={onSubmit}
          className="flex items-center gap-2 rounded-[13px] border border-app-hairline bg-app-raised py-1.5 pr-1.5 pl-4"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask me anything…"
            aria-label="Message your coach"
            className="flex-1 border-0 bg-transparent text-base text-app-ink-soft outline-none placeholder:text-app-ink-faint sm:text-[15px]"
          />
          <Link
            to="/voice"
            aria-label="Voice input"
            className="grid place-items-center p-2 text-app-ink-faint hover:text-app-ink-muted"
          >
            <Mic size={19} aria-hidden="true" />
          </Link>
          <button
            type="submit"
            aria-label="Send message"
            disabled={isStreaming || !draft.trim()}
            className="grid place-items-center rounded-[10px] bg-amber-500 p-2.5 text-navy-900 hover:bg-amber-600 disabled:opacity-50"
          >
            <ArrowUp size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  )
}
