import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useMarkAllRead, useMarkRead, useNotifications } from '../hooks/useNotifications'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { data: notifications, isLoading, isError } = useNotifications()
  const markRead = useMarkRead()
  const markAllRead = useMarkAllRead()

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        onClick={() => setOpen((o) => !o)}
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-danger text-[10px] font-medium text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-md border border-border bg-surface shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <span className="text-sm font-medium text-text">Notifications</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => markAllRead.mutate()}
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {isLoading && <p className="p-4 text-sm text-text-muted">Loading...</p>}
              {isError && (
                <p className="p-4 text-sm text-danger">
                  Couldn&apos;t load notifications.
                </p>
              )}
              {!isLoading && !isError && (notifications?.length ?? 0) === 0 && (
                <p className="p-4 text-sm text-text-muted">You&apos;re all caught up.</p>
              )}
              {notifications?.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => !n.read && markRead.mutate(n.id)}
                  className={cn(
                    'flex w-full flex-col gap-0.5 border-b border-border px-3 py-2 text-left last:border-0 hover:bg-primary-muted',
                    !n.read && 'bg-primary-muted/50',
                  )}
                >
                  <span className="text-sm font-medium text-text">{n.title}</span>
                  <span className="text-xs text-text-muted">{n.body}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
