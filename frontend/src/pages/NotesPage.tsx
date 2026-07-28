import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NoteList } from '@/features/notes/components/NoteList'
import { NoteEditor } from '@/features/notes/components/NoteEditor'
import { useNotes } from '@/features/notes/hooks/useNotes'

export function NotesPage() {
  const { data: notes, isLoading } = useNotes()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const selectedNote = notes?.find((n) => n.id === selectedId) ?? null

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">Notes</h1>
        <Button
          size="sm"
          onClick={() => {
            setSelectedId(null)
            setCreating(true)
          }}
        >
          <Plus className="size-4" />
          New note
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden rounded-md border border-border">
        <div className="w-72 shrink-0 overflow-y-auto border-r border-border">
          {isLoading ? (
            <div className="p-4 text-sm text-text-muted">Loading...</div>
          ) : (
            <NoteList
              notes={notes ?? []}
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id)
                setCreating(false)
              }}
            />
          )}
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          {selectedNote || creating ? (
            <NoteEditor
              key={selectedNote?.id ?? 'new'}
              note={selectedNote}
              onSaved={(id) => {
                setSelectedId(id)
                setCreating(false)
              }}
              onDeleted={() => setSelectedId(null)}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-text-muted">
              Select a note or create a new one.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
