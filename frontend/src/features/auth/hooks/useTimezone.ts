import { useCurrentUser } from './useAuth'
import { browserTimezone } from '@/lib/datetime'

/**
 * The timezone all dates should be displayed in: the user's saved preference,
 * falling back to the browser's zone until the profile loads.
 */
export function useUserTimezone(): string {
  const { data: user } = useCurrentUser()
  return user?.timezone || browserTimezone()
}
