import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  useCurrentReview,
  useGenerateReview,
  usePastReviews,
} from '@/features/reviews/hooks/useWeeklyReview'

function formatWeek(weekStart: string) {
  const start = new Date(weekStart)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
}

export function WeeklyReviewPage() {
  const { data: current, isLoading } = useCurrentReview()
  const { data: past, isLoading: pastLoading } = usePastReviews()
  const generate = useGenerateReview()

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Weekly Review</h1>
          <p className="text-text-muted">Step back and see the bigger picture.</p>
        </div>
        <Button onClick={() => generate.mutate()} disabled={generate.isPending}>
          <Sparkles className="size-4" />
          {generate.isPending
            ? 'Generating...'
            : current
              ? 'Regenerate'
              : 'Generate this week'}
        </Button>
      </div>

      {isLoading && <div className="h-40 animate-pulse rounded-md bg-primary-muted" />}

      {!isLoading && !current && !generate.isPending && (
        <p className="text-sm text-text-muted">
          No review yet for this week — generate one to see how you're doing.
        </p>
      )}

      {current && (
        <Card>
          <CardContent className="flex flex-col gap-4 p-4">
            <div className="text-xs font-medium text-text-muted">
              Week of {formatWeek(current.weekStart)}
            </div>
            <p className="text-sm text-text">{current.summary}</p>

            {current.wins.length > 0 && (
              <div className="flex flex-col gap-1">
                <h3 className="text-xs font-semibold text-text-muted">Wins</h3>
                <ul className="list-inside list-disc text-sm text-text">
                  {current.wins.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {current.focusAreas.length > 0 && (
              <div className="flex flex-col gap-1">
                <h3 className="text-xs font-semibold text-text-muted">Focus areas</h3>
                <ul className="list-inside list-disc text-sm text-text">
                  {current.focusAreas.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {current.nextWeekPlan && (
              <div className="rounded-md bg-primary-muted px-3 py-2 text-sm text-text">
                <span className="font-medium">Next week: </span>
                {current.nextWeekPlan}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-text-muted">Past reviews</h2>
        {pastLoading && (
          <div className="h-20 animate-pulse rounded-md bg-primary-muted" />
        )}
        {!pastLoading && (past?.length ?? 0) <= 1 && (
          <p className="text-sm text-text-muted">Past weeks will show up here.</p>
        )}
        <div className="flex flex-col gap-2">
          {past
            ?.filter((r) => r.id !== current?.id)
            .map((r) => (
              <Card key={r.id}>
                <CardContent className="flex flex-col gap-1 p-4">
                  <div className="text-xs font-medium text-text-muted">
                    Week of {formatWeek(r.weekStart)}
                  </div>
                  <p className="text-sm text-text-muted">{r.summary}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}
