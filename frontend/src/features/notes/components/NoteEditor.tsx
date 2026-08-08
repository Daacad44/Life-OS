import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import type { Note } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/ui-kit'
import { useNavigationGuard } from '@/components/form/useNavigationGuard'
import { useCreateNote, useDeleteNote } from '../hooks/useNotes'
import * as notesApi from '../api'

type SaveState = 'idle' | 'saving' | 'saved'

export function NoteEditor({
  note,
  onSaved,
  onDeleted,
}: {
  note: Note | null
  onSaved: (id: string) => void
  onDeleted: () => void
}) {
  const [title, setTitle] = useState(note?.title ?? '')
  const [content, setContent] = useState(note?.content ?? '')
  const [tagsInput, setTagsInput] = useState(note?.tags.join(', ') ?? '')
  const [folder, setFolder] = useState(note?.folder ?? '')
  const [saveState, setSaveState] = useState<SaveState>('idle')

  const queryClient = useQueryClient()
  const createNote = useCreateNote()
  const deleteNote = useDeleteNote()

  // Reset editor state when switching to a different note.
  useEffect(() => {
    setTitle(note?.title ?? '')
    setContent(note?.content ?? '')
    setTagsInput(note?.tags.join(', ') ?? '')
    setFolder(note?.folder ?? '')
    setSaveState('idle')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.id])

  const tags = tagsInput
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const valid = title.trim().length > 0 && content.trim().length > 0
  const dirty =
    valid &&
    (title.trim() !== (note?.title ?? '') ||
      content.trim() !== (note?.content ?? '') ||
      tags.join(',') !== (note?.tags ?? []).join(',') ||
      (folder.trim() || null) !== (note?.folder ?? null))

  const savingRef = useRef(false)
  // Once this editor instance creates a note, remember its id so a follow-up
  // autosave (before the parent remounts with the new note) updates it in place
  // instead of creating a duplicate.
  const createdIdRef = useRef<string | null>(null)
  useEffect(() => {
    createdIdRef.current = null
  }, [note?.id])

  function save(): Promise<void> {
    if (!valid || savingRef.current) return Promise.resolve()
    savingRef.current = true
    setSaveState('saving')
    const input = {
      title: title.trim(),
      content: content.trim(),
      tags,
      folder: folder.trim() || null,
    }
    const done = (id: string) => {
      savingRef.current = false
      setSaveState('saved')
      onSaved(id)
    }
    const fail = () => {
      savingRef.current = false
      setSaveState('idle')
    }
    const existingId = note?.id ?? createdIdRef.current
    if (existingId) {
      return notesApi
        .updateNote(existingId, input)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['notes'] })
          done(existingId)
        })
        .catch(fail)
    }
    return createNote
      .mutateAsync(input)
      .then((created) => {
        createdIdRef.current = created.id
        done(created.id)
      })
      .catch(fail)
  }

  // Autosave: 1.2s after the user stops typing, if there are unsaved changes.
  useEffect(() => {
    if (!dirty) return
    const id = setTimeout(() => void save(), 1200)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, tagsInput, folder, dirty])

  // Guard navigation away while there are unsaved edits.
  const guard = useNavigationGuard(dirty)

  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        className="text-lg font-medium"
      />
      <div className="flex flex-wrap gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="note-folder">Folder</Label>
          <Input
            id="note-folder"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="e.g. Work"
          />
        </div>
        <div className="flex flex-[2] flex-col gap-1.5">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="idea, work, health"
          />
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your idea..."
        rows={16}
        className="w-full flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button onClick={() => void save()} disabled={!dirty || saveState === 'saving'}>
            {saveState === 'saving' ? 'Saving…' : 'Save'}
          </Button>
          <span className="text-xs text-text-muted">
            {saveState === 'saving'
              ? 'Autosaving…'
              : dirty
                ? 'Unsaved changes'
                : saveState === 'saved' || note
                  ? 'All changes saved'
                  : ''}
          </span>
        </div>
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

      <ConfirmDialog
        open={guard.blocked}
        title="Save your note?"
        description="This note has unsaved changes. Save them before leaving, or discard?"
        confirmLabel="Done (save)"
        cancelLabel="Discard"
        tertiaryLabel="Keep editing"
        onConfirm={() => {
          void save().then(() => guard.proceed())
        }}
        onCancel={() => guard.proceed()}
        onTertiary={() => guard.cancel()}
      />
    </div>
  )
}
