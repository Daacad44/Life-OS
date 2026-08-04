import { Bell, LogOut, Menu, Moon, Search, Sun } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Avatar } from '@/components/ui-kit'
import { useThemeStore } from '@/stores/themeStore'
import { useCurrentUser, useLogout } from '@/features/auth/hooks/useAuth'

/** Route → screen title, matching the prototype's topbar heading. */
const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/tasks': 'Tasks',
  '/goals': 'Goals',
  '/calendar': 'Calendar',
  '/habits': 'Habits',
  '/coach': 'AI Coach',
  '/analytics': 'Analytics',
  '/finance': 'Finance',
  '/focus': 'Focus Mode',
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
  const title = titles[pathname] ?? 'Life OS'
  const name = user?.name ?? user?.email ?? 'Guest'

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3.5 border-b border-slate-200 bg-slate-50/85 px-5 py-3.5 font-display backdrop-blur-md">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="grid place-items-center text-slate-700 md:hidden"
      >
        <Menu size={22} aria-hidden="true" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="text-[22px] font-extrabold tracking-[-0.01em] text-slate-900">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="hidden items-center gap-2 rounded-[11px] border border-slate-200 bg-white px-3 py-2.5 text-slate-400 sm:flex">
          <Search size={16} aria-hidden="true" />
          <input
            placeholder="Search…"
            aria-label="Search"
            className="w-[120px] border-0 bg-transparent text-sm text-slate-700 outline-none"
          />
        </div>

        <Link
          to="/notifications"
          aria-label="Notifications"
          className="relative grid place-items-center rounded-[11px] border border-slate-200 bg-white p-2.5 text-slate-700 hover:bg-slate-50"
        >
          <Bell size={18} aria-hidden="true" />
          <span
            aria-hidden="true"
            className="absolute top-2 right-2 size-[7px] rounded-full bg-amber-500"
          />
        </Link>

        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
          className="grid place-items-center rounded-[11px] border border-slate-200 bg-white p-2.5 text-slate-700 hover:bg-slate-50"
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
          className="grid place-items-center rounded-[11px] border border-slate-200 bg-white p-2.5 text-slate-700 hover:bg-slate-50"
        >
          <LogOut size={18} aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
