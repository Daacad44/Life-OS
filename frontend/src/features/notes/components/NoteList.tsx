import type { Note } from '@life-os/shared'
import { cn } from '@/lib/utils'

export function NoteList({
  notes,
  selectedId,
  onSelect,
}: {
  notes: Note[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  if (notes.length === 0) {
    return <p className="p-4 text-sm text-text-muted">Capture your first idea.</p>
  }

  return (
    <div className="flex flex-col divide-y divide-border overflow-y-auto">
      {notes.map((note) => (
        <button
          key={note.id}
          type="button"
          onClick={() => onSelect(note.id)}
          className={cn(
            'flex flex-col gap-1 px-3 py-3 text-left transition-colors hover:bg-primary-muted',
            selectedId === note.id && 'bg-primary-muted',
          )}
        >
          <span className="truncate text-sm font-medium text-text">{note.title}</span>
          <span className="line-clamp-2 text-xs text-text-muted">{note.content}</span>
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary-muted px-2 py-0.5 text-[10px] font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
