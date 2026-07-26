import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

// More items are added here as each feature ships (Tasks, Goals, Calendar, Habits, ...)
// — see docs/.../Life OS Development Roadmap.md, Phase 2.
const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
]

export function Sidebar({ className }: { className?: string }) {
  return (
    <nav className={cn('flex flex-col gap-1 p-4', className)}>
      <div className="mb-4 px-2 text-lg font-semibold text-text">Life OS</div>
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-muted text-primary'
                : 'text-text-muted hover:bg-primary-muted hover:text-text',
            )
          }
        >
          <Icon className="size-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
