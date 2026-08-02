export interface Achievement {
  id: string
  type: string
  unlockedAt: string
}

export interface GamificationProfile {
  points: number
  level: number
  achievements: Achievement[]
}
