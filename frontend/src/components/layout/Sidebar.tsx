import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  Bot,
  Calendar,
  CheckSquare,
  LayoutDashboard,
  Repeat,
  Settings,
  Target,
  Timer,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, Logo } from '@/components/ui-kit'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

/** The prototype's eleven-item navigation, in order. */
const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/habits', label: 'Habits', icon: Repeat },
  { to: '/coach', label: 'AI Coach', icon: Bot },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/finance', label: 'Finance', icon: Wallet },
  { to: '/focus', label: 'Focus Mode', icon: Timer },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export interface SidebarProps {
  /** Called after a nav item is chosen, so the mobile drawer can close itself. */
  onNavigate?: () => void
  className?: string
}

/** The navy sidebar: logo, the eleven nav items with an amber active rail, and the Go Pro card. */
export function Sidebar({ onNavigate, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex w-64 shrink-0 flex-col bg-navy-900 font-display text-white',
        className,
      )}
    >
      <div className="flex items-center gap-2.5 px-5 pt-[22px] pb-3.5">
        <Logo size="md" />
      </div>

      <nav className="flex flex-1 flex-col gap-[3px] overflow-y-auto p-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-3 rounded-[11px] px-3.5 py-[11px] text-sm transition-colors',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500',
                'pointer-coarse:min-h-11',
                isActive
                  ? 'bg-navy-700 font-bold text-white'
                  : 'font-semibold text-slate-400 hover:bg-white/5 hover:text-white',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute top-2 bottom-2 left-0 w-[3px] rounded-r-[3px]',
                    isActive ? 'bg-amber-500' : 'bg-transparent',
                  )}
                />
                <Icon size={18} aria-hidden="true" />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mx-3 mb-3.5 rounded-2xl bg-linear-150 from-navy-700 to-navy-800 p-3.5">
        <div className="text-sm font-extrabold">Go Pro</div>
        <p className="mt-1 mb-3 text-[12.5px] font-medium leading-snug text-slate-300">
          Unlock unlimited goals &amp; AI insights.
        </p>
        <Button size="sm" block className="py-2.5">
          Upgrade
        </Button>
      </div>
    </aside>
  )
}
