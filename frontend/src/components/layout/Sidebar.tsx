import { NavLink } from 'react-router-dom'
import {
  Award,
  BarChart3,
  Briefcase,
  Calendar,
  CalendarDays,
  Compass,
  Flame,
  GraduationCap,
  HeartPulse,
  LayoutDashboard,
  ListTodo,
  Mic,
  NotebookText,
  Settings,
  Sparkles,
  SunMoon,
  Target,
  Timer,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navGroups = [
  {
    label: 'Core',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/planner', label: 'Planner', icon: CalendarDays, end: false },
      { to: '/tasks', label: 'Tasks', icon: ListTodo, end: false },
      { to: '/goals', label: 'Goals', icon: Target, end: false },
      { to: '/calendar', label: 'Calendar', icon: Calendar, end: false },
      { to: '/habits', label: 'Habits', icon: Flame, end: false },
      { to: '/notes', label: 'Notes', icon: NotebookText, end: false },
      { to: '/focus', label: 'Focus Mode', icon: Timer, end: false },
    ],
  },
  {
    label: 'AI',
    items: [
      { to: '/coach', label: 'AI Coach', icon: Sparkles, end: false },
      { to: '/reflection', label: 'Reflection', icon: SunMoon, end: false },
      { to: '/weekly-review', label: 'Weekly Review', icon: TrendingUp, end: false },
      { to: '/analytics', label: 'Analytics', icon: BarChart3, end: false },
      { to: '/recommendations', label: 'Recommendations', icon: Compass, end: false },
      { to: '/voice', label: 'Voice Assistant', icon: Mic, end: false },
    ],
  },
  {
    label: 'Life',
    items: [
      { to: '/health', label: 'Health', icon: HeartPulse, end: false },
      { to: '/finance', label: 'Finance', icon: Wallet, end: false },
      { to: '/study', label: 'Study', icon: GraduationCap, end: false },
      { to: '/career', label: 'Career', icon: Briefcase, end: false },
    ],
  },
  {
    label: 'Growth',
    items: [
      { to: '/business', label: 'Business', icon: Briefcase, end: false },
      { to: '/automations', label: 'Automations', icon: Zap, end: false },
      { to: '/achievements', label: 'Achievements', icon: Award, end: false },
      { to: '/community', label: 'Community', icon: Users, end: false },
    ],
  },
  {
    label: '',
    items: [{ to: '/settings', label: 'Settings', icon: Settings, end: false }],
  },
]

export function Sidebar({ className }: { className?: string }) {
  return (
    <nav className={cn('flex flex-col gap-1 overflow-y-auto p-4', className)}>
      <div className="mb-4 px-2 text-lg font-semibold text-text">Life OS</div>
      {navGroups.map((group) => (
        <div key={group.label || 'ungrouped'} className="mb-2">
          {group.label && (
            <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted/70">
              {group.label}
            </div>
          )}
          {group.items.map(({ to, label, icon: Icon, end }) => (
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
        </div>
      ))}
    </nav>
  )
}
