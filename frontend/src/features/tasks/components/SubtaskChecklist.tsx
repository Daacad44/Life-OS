import { useState, type FormEvent } from 'react'
import { Check, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Subtask } from '@life-os/shared'

export function SubtaskChecklist({
  subtasks,
  onAdd,
  onToggle,
  onDelete,
}: {
  subtasks: Subtask[]
  onAdd: (title: string) => void
  onToggle: (subtaskId: string, done: boolean) => void
  onDelete: (subtaskId: string) => void
}) {
  const [title, setTitle] = useState('')
  const done = subtasks.filter((s) => s.done).length

  function submit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setTitle('')
  }

  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-app-ink-muted">Subtasks</span>
        {subtasks.length > 0 ? (
          <span className="text-[12px] font-bold text-app-ink-faint">
            {done}/{subtasks.length}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        {subtasks.map((s) => (
          <div key={s.id} className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onToggle(s.id, !s.done)}
              aria-label={s.done ? `Mark ${s.title} incomplete` : `Mark ${s.title} done`}
              className={cn(
                'grid size-[18px] shrink-0 place-items-center rounded-[6px] border-2',
                s.done ? 'border-amber-500 bg-amber-500' : 'border-slate-300',
              )}
            >
              <Check
                size={11}
                className={cn('text-white', s.done ? 'opacity-100' : 'opacity-0')}
                aria-hidden="true"
              />
            </button>
            <span
              className={cn(
                'flex-1 text-[13.5px] font-medium',
                s.done ? 'text-app-ink-faint line-through' : 'text-app-ink',
              )}
            >
              {s.title}
            </span>
            <button
              type="button"
              onClick={() => onDelete(s.id)}
              aria-label={`Delete ${s.title}`}
              className="shrink-0 text-app-ink-faint hover:text-accent-red"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="mt-2 flex items-center gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a subtask"
          className="flex-1 rounded-[9px] border border-app-hairline bg-app-canvas px-3 py-2 text-[13.5px] text-app-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          aria-label="Add subtask"
          className="grid size-8 shrink-0 place-items-center rounded-[9px] bg-navy-900 text-white disabled:opacity-40"
        >
          <Plus size={15} aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}
