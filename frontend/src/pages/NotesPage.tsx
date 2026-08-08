import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NoteList } from '@/features/notes/components/NoteList'
import { NoteEditor } from '@/features/notes/components/NoteEditor'
import { useNotes } from '@/features/notes/hooks/useNotes'

export function NotesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState('')
  const [folder, setFolder] = useState('')

  // Unfiltered list drives the folder dropdown so it doesn't collapse on filter.
  const { data: allNotes } = useNotes()
  const query = useMemo(
    () => ({ q: search.trim() || undefined, folder: folder || undefined }),
    [search, folder],
  )
  const { data: notes, isLoading, isError, refetch } = useNotes(query)

  const folders = useMemo(() => {
    const set = new Set<string>()
    for (const n of allNotes ?? []) if (n.folder) set.add(n.folder)
    return [...set].sort()
  }, [allNotes])

  const selectedNote = notes?.find((n) => n.id === selectedId) ?? null

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-text">Notes</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes…"
              aria-label="Search notes"
              className="h-9 w-48 pl-8"
            />
          </div>
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            aria-label="Filter by folder"
            className="h-9 rounded-md border border-border bg-surface px-2 text-sm text-text"
          >
            <option value="">All folders</option>
            {folders.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
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
      </div>

      <div className="flex flex-1 overflow-hidden rounded-md border border-border">
        <div className="w-72 shrink-0 overflow-y-auto border-r border-border">
          {isLoading ? (
            <div className="p-4 text-sm text-text-muted">Loading...</div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <p className="text-sm text-danger">Couldn&apos;t load notes.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : (notes ?? []).length === 0 ? (
            <div className="p-4 text-sm text-text-muted">
              {search || folder ? 'No notes match your search.' : 'No notes yet.'}
            </div>
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
