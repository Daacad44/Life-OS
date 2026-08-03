import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SubjectCard } from '@/features/study/components/SubjectCard'
import { useCreateSubject, useSubjects } from '@/features/study/hooks/useStudy'

export function StudyPage() {
  const { data: subjects, isLoading, isError, refetch } = useSubjects()
  const createSubject = useCreateSubject()
  const [title, setTitle] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    createSubject.mutate({ title: trimmed }, { onSuccess: () => setTitle('') })
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text">Study</h1>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a subject..."
          aria-label="Subject title"
        />
        <Button type="submit" disabled={!title.trim()}>
          <Plus className="size-4" />
          Add
        </Button>
      </form>

      {isLoading && <div className="h-40 animate-pulse rounded-md bg-primary-muted" />}

      {isError && (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <p className="text-sm text-danger">Couldn&apos;t load your subjects.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && subjects?.length === 0 && (
        <p className="text-sm text-text-muted">
          No subjects yet — add one to get started.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {subjects?.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  )
}
