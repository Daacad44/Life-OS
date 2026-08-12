import { useState, type FormEvent } from 'react'
import { Sparkles, Trash2, X } from 'lucide-react'
import type { Subject } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ProgressBar } from '@/features/goals/components/ProgressBar'
import {
  useDeleteStudySession,
  useDeleteSubject,
  useGeneratePlan,
  useUpdateSession,
} from '../hooks/useStudy'

export function SubjectCard({ subject }: { subject: Subject }) {
  const updateSession = useUpdateSession()
  const deleteSession = useDeleteStudySession()
  const deleteSubject = useDeleteSubject()
  const generatePlan = useGeneratePlan()
  const [deadline, setDeadline] = useState('')
  const [hoursPerWeek, setHoursPerWeek] = useState('5')
  const [showPlanForm, setShowPlanForm] = useState(false)

  function handleGenerate(e: FormEvent) {
    e.preventDefault()
    if (!deadline) return
    generatePlan.mutate(
      {
        subjectId: subject.id,
        deadline: new Date(deadline),
        hoursPerWeek: Number(hoursPerWeek),
      },
      { onSuccess: () => setShowPlanForm(false) },
    )
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-text">{subject.title}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">{subject.progress}%</span>
            <button
              type="button"
              aria-label="Delete subject"
              disabled={deleteSubject.isPending}
              onClick={() => deleteSubject.mutate(subject.id)}
              className="rounded p-1 text-text-muted hover:bg-primary-muted hover:text-danger"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
        <ProgressBar value={subject.progress} />

        {subject.studySessions.length > 0 && (
          <div className="flex flex-col gap-1">
            {subject.studySessions.map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4"
                  checked={s.done}
                  onChange={(e) =>
                    updateSession.mutate({ id: s.id, done: e.target.checked })
                  }
                />
                <span className={s.done ? 'text-text-muted line-through' : 'text-text'}>
                  {s.topic || 'Study session'}
                </span>
                <span className="ml-auto text-xs text-text-muted">
                  {new Date(s.scheduledAt).toLocaleDateString()}
                </span>
                <button
                  type="button"
                  aria-label="Delete session"
                  disabled={deleteSession.isPending}
                  onClick={() => deleteSession.mutate(s.id)}
                  className="rounded p-0.5 text-text-muted hover:text-danger"
                >
                  <X className="size-3.5" />
                </button>
              </label>
            ))}
          </div>
        )}

        {showPlanForm ? (
          <form onSubmit={handleGenerate} className="flex flex-wrap items-end gap-2">
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-40"
              aria-label="Deadline"
            />
            <Input
              type="number"
              min="1"
              max="80"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
              className="w-28"
              aria-label="Hours per week"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!deadline || generatePlan.isPending}
            >
              {generatePlan.isPending ? 'Planning...' : 'Generate'}
            </Button>
          </form>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => setShowPlanForm(true)}
          >
            <Sparkles className="size-4" />
            Generate study plan
          </Button>
        )}

        {generatePlan.isError && (
          <p className="text-xs text-danger">
            Couldn&apos;t generate a plan right now — try again shortly.
          </p>
        )}
        {generatePlan.isSuccess && (
          <p className="rounded-md bg-primary-muted px-3 py-2 text-sm text-text">
            {generatePlan.data.advice}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
