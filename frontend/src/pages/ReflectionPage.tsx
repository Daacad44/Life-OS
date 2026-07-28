import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { ReflectionPeriod } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  useCreateReflection,
  useReflectionPrompt,
  useReflections,
} from '@/features/reflection/hooks/useReflections'

const PERIODS: { value: ReflectionPeriod; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
]

export function ReflectionPage() {
  const [period, setPeriod] = useState<ReflectionPeriod>('daily')
  const { data: promptData, isLoading: promptLoading } = useReflectionPrompt(period)
  const { data: reflections, isLoading: historyLoading } = useReflections()
  const createReflection = useCreateReflection()
  const [answer, setAnswer] = useState('')

  function handleSubmit() {
    if (!answer.trim() || !promptData) return
    createReflection.mutate(
      { period, prompt: promptData.prompt, content: answer.trim() },
      { onSuccess: () => setAnswer('') },
    )
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Reflection</h1>
        <p className="text-text-muted">A short pause to notice how things are going.</p>
      </div>

      <div className="flex gap-2">
        {PERIODS.map((p) => (
          <Button
            key={p.value}
            size="sm"
            variant={period === p.value ? 'default' : 'outline'}
            onClick={() => setPeriod(p.value)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <p className="text-sm font-medium text-text">
            {promptLoading ? 'Thinking of a question...' : promptData?.prompt}
          </p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write as much or as little as you like..."
            rows={4}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <Button
            className="w-fit"
            disabled={!answer.trim() || createReflection.isPending || promptLoading}
            onClick={handleSubmit}
          >
            <Sparkles className="size-4" />
            {createReflection.isPending ? 'Saving...' : 'Save reflection'}
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-text-muted">Past reflections</h2>
        {historyLoading && (
          <div className="h-20 animate-pulse rounded-md bg-primary-muted" />
        )}
        {!historyLoading && reflections?.length === 0 && (
          <p className="text-sm text-text-muted">
            No reflections yet — answer the prompt above to start.
          </p>
        )}
        <div className="flex flex-col gap-3">
          {reflections?.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex flex-col gap-2 p-4">
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>{r.period === 'daily' ? 'Daily' : 'Weekly'}</span>
                  <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm font-medium text-text">{r.prompt}</p>
                <p className="text-sm text-text-muted">{r.content}</p>
                {r.insights && (
                  <p className="rounded-md bg-primary-muted px-3 py-2 text-sm text-text">
                    {r.insights}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
