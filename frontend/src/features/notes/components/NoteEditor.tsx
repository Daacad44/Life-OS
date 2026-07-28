import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { Note } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateNote, useDeleteNote, useUpdateNote } from '../hooks/useNotes'

export function NoteEditor({
  note,
  onSaved,
  onDeleted,
}: {
  note: Note | null
  onSaved: (id: string) => void
  onDeleted: () => void
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  const createNote = useCreateNote()
  const updateNote = useUpdateNote(note?.id ?? '')
  const deleteNote = useDeleteNote()

  useEffect(() => {
    setTitle(note?.title ?? '')
    setContent(note?.content ?? '')
    setTagsInput(note?.tags.join(', ') ?? '')
  }, [note?.id])

  function handleSave() {
    if (!title.trim() || !content.trim()) return
    const input = {
      title: title.trim(),
      content: content.trim(),
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }
    if (note) {
      updateNote.mutate(input, { onSuccess: () => onSaved(note.id) })
    } else {
      createNote.mutate(input, { onSuccess: (created) => onSaved(created.id) })
    }
  }

  const isSaving = createNote.isPending || updateNote.isPending

  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        className="text-lg font-medium"
      />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="idea, work, health"
        />
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your idea..."
        rows={16}
        className="w-full flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
      <div className="flex items-center justify-between">
        <Button
          onClick={handleSave}
          disabled={!title.trim() || !content.trim() || isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        {note && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete note"
            onClick={() => deleteNote.mutate(note.id, { onSuccess: onDeleted })}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
