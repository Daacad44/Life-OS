import { Award, Lock, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  useAchievements,
  useGamificationProfile,
} from '@/features/gamification/hooks/useGamification'

const ACHIEVEMENT_META: Record<string, { label: string; description: string }> = {
  first_task: { label: 'First Task', description: 'Completed your first task' },
  first_habit_streak_7: {
    label: 'Week Streak',
    description: 'Kept a habit for 7 in a row',
  },
  first_goal_completed: {
    label: 'Goal Getter',
    description: 'Completed your first goal',
  },
  level_5: { label: 'Level 5', description: 'Reached level 5' },
  points_1000: { label: '1,000 Points', description: 'Earned 1,000 points' },
}

export function AchievementsPage() {
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useGamificationProfile()
  const {
    data: achievements,
    isLoading: achievementsLoading,
    isError: achievementsError,
    refetch: refetchAchievements,
  } = useAchievements()

  const unlockedTypes = new Set(achievements?.map((a) => a.type))

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-semibold text-text">Achievements</h1>

      {profileLoading && (
        <div className="h-24 animate-pulse rounded-md bg-primary-muted" />
      )}
      {profileError && (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <p className="text-sm text-danger">Couldn&apos;t load your progress.</p>
          <Button variant="outline" size="sm" onClick={() => refetchProfile()}>
            Retry
          </Button>
        </div>
      )}
      {profile && (
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Trophy className="size-8 text-primary" />
            <div>
              <p className="text-lg font-semibold text-text">Level {profile.level}</p>
              <p className="text-sm text-text-muted">{profile.points} points earned</p>
            </div>
          </CardContent>
        </Card>
      )}

      {achievementsError && (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <p className="text-sm text-danger">Couldn&apos;t load your achievements.</p>
          <Button variant="outline" size="sm" onClick={() => refetchAchievements()}>
            Retry
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {!achievementsLoading &&
          !achievementsError &&
          Object.entries(ACHIEVEMENT_META).map(([type, meta]) => {
            const unlocked = unlockedTypes.has(type)
            return (
              <Card key={type} className={unlocked ? '' : 'opacity-50'}>
                <CardContent className="flex items-center gap-3 p-4">
                  {unlocked ? (
                    <Award className="size-6 shrink-0 text-primary" />
                  ) : (
                    <Lock className="size-6 shrink-0 text-text-muted" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-text">{meta.label}</p>
                    <p className="text-xs text-text-muted">{meta.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
      </div>
    </div>
  )
}
