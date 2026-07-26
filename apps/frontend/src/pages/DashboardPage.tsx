import { useCurrentUser } from '@/features/auth/hooks/useAuth'

// Empty container for now — Task/Goal/Habit widgets plug in as those
// features ship (Phase 2). See docs/.../Life OS Development Roadmap.md.
export function DashboardPage() {
  const { data: user } = useCurrentUser()

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold text-text">
        Welcome{user?.name ? `, ${user.name}` : ''}
      </h1>
      <p className="text-text-muted">
        Your dashboard is empty for now — tasks, goals, and habits will show up here as
        they&apos;re built.
      </p>
    </div>
  )
}
