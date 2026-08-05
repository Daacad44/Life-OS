import { Bell, LogOut, Menu, Moon, Search, Sun } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Avatar } from '@/components/ui-kit'
import { useThemeStore } from '@/stores/themeStore'
import { useCurrentUser, useLogout } from '@/features/auth/hooks/useAuth'
import { useNotifications } from '@/features/notifications/hooks/useNotifications'
import { useCommandBar } from '@/components/command/CommandBarProvider'

/** Route → screen title for the topbar heading. Covers every workspace route. */
const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/planner': 'Planner',
  '/tasks': 'Tasks',
  '/goals': 'Goals',
  '/calendar': 'Calendar',
  '/habits': 'Habits',
  '/notes': 'Notes',
  '/focus': 'Focus Mode',
  '/coach': 'AI Coach',
  '/reflection': 'Reflection',
  '/weekly-review': 'Weekly Review',
  '/analytics': 'Analytics',
  '/recommendations': 'Recommendations',
  '/voice': 'Voice Assistant',
  '/health': 'Health',
  '/finance': 'Finance',
  '/study': 'Study',
  '/career': 'Career',
  '/business': 'Business',
  '/automations': 'Automations',
  '/achievements': 'Achievements',
  '/community': 'Community',
  '/search': 'Search',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
}

export interface TopBarProps {
  onMenuClick: () => void
}

/** Sticky light topbar: hamburger (mobile), screen title, search, bell, theme, avatar, logout. */
export function TopBar({ onMenuClick }: TopBarProps) {
  const { data: user } = useCurrentUser()
  const logout = useLogout()
  const { theme, setTheme } = useThemeStore()
  const { pathname } = useLocation()
  const { data: notifications } = useNotifications()
  const { open: openCommandBar } = useCommandBar()
  const title = titles[pathname] ?? 'Life OS'
  const name = user?.name ?? user?.email ?? 'Guest'
  const hasUnread = (notifications ?? []).some((n) => !n.read)

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3.5 border-b border-app-hairline bg-app-canvas/85 px-5 py-3.5 font-display backdrop-blur-md">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="grid place-items-center text-app-ink-soft md:hidden"
      >
        <Menu size={22} aria-hidden="true" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="text-[22px] font-extrabold tracking-[-0.01em] text-app-ink">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={openCommandBar}
          aria-label="Open command bar"
          className="hidden items-center gap-2 rounded-[11px] border border-app-hairline bg-app-surface px-3 py-2.5 text-app-ink-faint hover:bg-app-raised sm:flex"
        >
          <Search size={16} aria-hidden="true" />
          <span className="text-sm">Search or create…</span>
          <kbd className="ml-1 rounded-md border border-app-hairline bg-app-raised px-1.5 py-0.5 text-[11px] font-semibold">
            ⌘K
          </kbd>
        </button>
        <button
          type="button"
          onClick={openCommandBar}
          aria-label="Open command bar"
          className="grid place-items-center rounded-[11px] border border-app-hairline bg-app-surface p-2.5 text-app-ink-soft hover:bg-app-raised sm:hidden"
        >
          <Search size={18} aria-hidden="true" />
        </button>

        <Link
          to="/notifications"
          aria-label="Notifications"
          className="relative grid place-items-center rounded-[11px] border border-app-hairline bg-app-surface p-2.5 text-app-ink-soft hover:bg-app-raised"
        >
          <Bell size={18} aria-hidden="true" />
          {hasUnread ? (
            <span
              aria-label="Unread notifications"
              className="absolute top-2 right-2 size-[7px] rounded-full bg-amber-500"
            />
          ) : null}
        </Link>

        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
          className="grid place-items-center rounded-[11px] border border-app-hairline bg-app-surface p-2.5 text-app-ink-soft hover:bg-app-raised"
        >
          {theme === 'dark' ? (
            <Sun size={18} aria-hidden="true" />
          ) : (
            <Moon size={18} aria-hidden="true" />
          )}
        </button>

        <Avatar name={name} size="sm" />

        <button
          type="button"
          onClick={() => logout.mutate()}
          aria-label="Log out"
          className="grid place-items-center rounded-[11px] border border-app-hairline bg-app-surface p-2.5 text-app-ink-soft hover:bg-app-raised"
        >
          <LogOut size={18} aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
