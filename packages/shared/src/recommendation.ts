export const RecommendationStatus = ['ACTIVE', 'ACCEPTED', 'DISMISSED'] as const
export type RecommendationStatus = (typeof RecommendationStatus)[number]

export interface Recommendation {
  id: string
  userId: string
  type: string
  content: string
  status: RecommendationStatus
  createdAt: string
}
