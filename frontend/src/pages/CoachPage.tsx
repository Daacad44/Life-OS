import { useState, type FormEvent } from 'react'
import { ArrowUp, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'

// MOCK — replace with useCoach(); the conversation seed matches the prototype.
interface Message {
  role: 'coach' | 'user'
  text: string
}
const seed: Message[] = [
  {
    role: 'coach',
    text: "Hey Alex! I'm here to help you achieve your goals and become the best version of yourself. I can help you plan your day, stay focused, overcome challenges, and build better habits.",
  },
  { role: 'user', text: 'Help me plan my day' },
  {
    role: 'coach',
    text: "Let's start with your top 3 priorities. You have a landing page design due today — I'd tackle that first thing while your energy is high, then batch your meetings after lunch.",
  },
]

const chips = [
  'Help me plan my day',
  'I need motivation',
  'How can I be more productive?',
]

const COACH_REPLY =
  "Great question — let me put together a plan for that. I'll break it into small, achievable steps you can start today."

export function CoachPage() {
  const [messages, setMessages] = useState(seed)
  const [draft, setDraft] = useState('')

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: trimmed },
      { role: 'coach', text: COACH_REPLY },
    ])
    setDraft('')
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    send(draft)
  }

  return (
    <div className="flex h-[calc(100dvh-150px)] flex-col overflow-hidden rounded-2xl border border-app-hairline/70 bg-app-surface">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-[22px]">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[72%] rounded-2xl px-4 py-3.5 text-[14.5px] font-medium leading-relaxed',
                m.role === 'user'
                  ? 'bg-navy-900 text-white'
                  : 'border border-app-hairline bg-app-raised text-app-ink-soft',
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-app-hairline px-[18px] py-3.5">
        <div className="mb-3 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => send(c)}
              className="rounded-full bg-amber-100 px-3.5 py-2 text-[13px] font-semibold text-amber-700 hover:bg-amber-100/70"
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
            className="flex-1 border-0 bg-transparent text-[15px] text-app-ink-soft outline-none placeholder:text-app-ink-faint"
          />
          <button
            type="button"
            aria-label="Voice input"
            className="grid place-items-center p-2 text-app-ink-faint hover:text-app-ink-muted"
          >
            <Mic size={19} aria-hidden="true" />
          </button>
          <button
            type="submit"
            aria-label="Send message"
            className="grid place-items-center rounded-[10px] bg-amber-500 p-2.5 text-navy-900 hover:bg-amber-600"
          >
            <ArrowUp size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  )
}
