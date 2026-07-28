import { Menu, Moon, Search, Sun, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/stores/themeStore'
import { useCurrentUser, useLogout } from '@/features/auth/hooks/useAuth'

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: user } = useCurrentUser()
  const logout = useLogout()
  const { theme, setTheme } = useThemeStore()

  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-4">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </Button>

      <div className="hidden md:block" />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Search" asChild>
          <Link to="/search">
            <Search className="size-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        {user && (
          <span className="hidden text-sm text-text-muted sm:inline">
            {user.name ?? user.email}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Log out"
          onClick={() => logout.mutate()}
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  )
}
