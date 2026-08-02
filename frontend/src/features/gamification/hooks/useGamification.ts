import { useQuery } from '@tanstack/react-query'
import * as gamificationApi from '../api'

export function useGamificationProfile() {
  return useQuery({
    queryKey: ['gamification', 'profile'],
    queryFn: gamificationApi.getProfile,
  })
}

export function useAchievements() {
  return useQuery({
    queryKey: ['gamification', 'achievements'],
    queryFn: gamificationApi.listAchievements,
  })
}
