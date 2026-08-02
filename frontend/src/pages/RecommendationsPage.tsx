import { Check, Compass, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  useAcceptRecommendation,
  useDismissRecommendation,
  useRecommendations,
} from '@/features/recommendations/hooks/useRecommendations'

export function RecommendationsPage() {
  const { data: recommendations, isLoading } = useRecommendations()
  const accept = useAcceptRecommendation()
  const dismiss = useDismissRecommendation()

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Recommendations</h1>
        <p className="text-text-muted">
          Proactive suggestions from across your tasks, goals, and habits.
        </p>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-md bg-primary-muted" />
          ))}
        </div>
      )}

      {!isLoading && recommendations?.length === 0 && (
        <p className="text-sm text-text-muted">
          Nothing to suggest right now — check back after you've used Life OS a bit more.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {recommendations?.map((rec) => (
          <Card key={rec.id}>
            <CardContent className="flex items-start justify-between gap-3 p-4">
              <div className="flex items-start gap-2">
                <Compass className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="flex flex-col gap-1">
                  <span className="w-fit rounded-full bg-primary-muted px-2 py-0.5 text-[10px] font-medium uppercase text-primary">
                    {rec.type}
                  </span>
                  <p className="text-sm text-text">{rec.content}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Accept"
                  onClick={() => accept.mutate(rec.id)}
                >
                  <Check className="size-4 text-success" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Dismiss"
                  onClick={() => dismiss.mutate(rec.id)}
                >
                  <X className="size-4 text-danger" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
