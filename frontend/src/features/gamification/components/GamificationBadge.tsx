import { Trophy } from 'lucide-react'
import { useGamificationProfile } from '../hooks/useGamification'

export function GamificationBadge() {
  const { data: profile } = useGamificationProfile()
  if (!profile) return null

  return (
    <span className="flex items-center gap-1 rounded-full bg-primary-muted px-2 py-1 text-xs font-medium text-primary">
      <Trophy className="size-3.5" />
      Lvl {profile.level} · {profile.points} pts
    </span>
  )
}
