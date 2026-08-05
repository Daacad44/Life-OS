import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import type { PublicUser } from '@life-os/shared'

vi.mock('../api', () => ({
  fetchMe: vi.fn(),
  login: vi.fn(),
  signup: vi.fn(),
  logout: vi.fn(),
  updateProfile: vi.fn(),
}))

const authApi = await import('../api')
const { useLogin, useLogout } = await import('./useAuth')

const ME_KEY = ['auth', 'me']

function wrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const user: PublicUser = {
  id: 'user-1',
  email: 'a@b.com',
  name: 'A',
  role: 'USER',
  timezone: 'UTC',
  quietHoursStart: null,
  quietHoursEnd: null,
  onboardedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('useLogin', () => {
  it('caches the returned user under the current-user query key on success', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    vi.mocked(authApi.login).mockResolvedValue(user)

    const { result } = renderHook(() => useLogin(), { wrapper: wrapper(queryClient) })

    act(() => {
      result.current.mutate({ email: 'a@b.com', password: 'password123' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(queryClient.getQueryData(ME_KEY)).toEqual(user)
  })
})

describe('useLogout', () => {
  it('clears the current-user cache on success', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    queryClient.setQueryData(ME_KEY, user)
    vi.mocked(authApi.logout).mockResolvedValue(null)

    const { result } = renderHook(() => useLogout(), { wrapper: wrapper(queryClient) })

    act(() => {
      result.current.mutate()
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(queryClient.getQueryData(ME_KEY)).toBeNull()
  })
})
