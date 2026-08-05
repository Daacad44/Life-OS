import { Suspense, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { CommandBarProvider } from '@/components/command/CommandBarProvider'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'

function PageFallback() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-app-raised" />
      <div className="h-40 animate-pulse rounded-2xl bg-app-raised" />
    </div>
  )
}

/**
 * The app frame from the prototype: a fixed navy sidebar on desktop that becomes
 * a scrim-backed drawer on mobile, a sticky topbar, and the light content canvas.
 */
export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: user } = useCurrentUser()

  if (user && !user.onboardedAt) {
    return <Navigate to="/onboarding" replace />
  }

  return (
    <CommandBarProvider>
      <div className="flex min-h-dvh bg-app-canvas font-display text-app-ink">
        {/* Desktop sidebar */}
        <Sidebar className="sticky top-0 hidden h-dvh md:flex" />

        {/* Mobile drawer + scrim */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-slate-900/50"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <Sidebar
              onNavigate={() => setMobileOpen(false)}
              className="absolute inset-y-0 left-0 h-dvh"
            />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onMenuClick={() => setMobileOpen(true)} />
          <main className="mx-auto w-full max-w-[1180px] flex-1 p-5 md:px-5 md:py-6">
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </CommandBarProvider>
  )
}
