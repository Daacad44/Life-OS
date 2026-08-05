import type { NotificationCategory } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useNotificationPreferences,
  useUpdatePreferences,
} from '../hooks/useNotifications'

const LABELS: Record<NotificationCategory, string> = {
  habitMilestones: 'Habit streak milestones',
  budgetThreshold: 'Budget threshold reached',
  weeklyReview: 'Weekly review ready',
  automationRan: 'Automation ran',
  reminders: 'Reminders',
}

export function NotificationPreferencesCard() {
  const { data: preferences, isLoading, isError, refetch } = useNotificationPreferences()
  const updatePreferences = useUpdatePreferences()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isLoading && <div className="h-16 animate-pulse rounded-md bg-primary-muted" />}
        {isError && (
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm text-danger">Couldn&apos;t load your preferences.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}
        {preferences &&
          (Object.keys(LABELS) as NotificationCategory[]).map((category) => (
            <label
              key={category}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="text-text">{LABELS[category]}</span>
              <input
                type="checkbox"
                className="size-4"
                checked={preferences[category]}
                onChange={(e) =>
                  updatePreferences.mutate({ [category]: e.target.checked })
                }
              />
            </label>
          ))}
      </CardContent>
    </Card>
  )
}
