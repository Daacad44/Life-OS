import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // Avoids a refetch storm on every navigation/remount across 25+ pages —
      // mutations already invalidate the relevant keys, so data stays fresh
      // right after an action; this only skips redundant re-fetches of
      // otherwise-unchanged data within a short window.
      staleTime: 30_000,
    },
  },
})

export function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
