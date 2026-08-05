import { useMemo, useState } from 'react'
import {
  Bell,
  BarChart3,
  CheckSquare,
  Flame,
  Target,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import {
  Button,
  Card,
  EmptyState,
  Skeleton,
  Tabs,
  type TabItem,
  type Tone,
} from '@/components/ui-kit'
import { cn } from '@/lib/utils'
import { toneChip } from '@/components/ui-kit'
import {
  useNotifications,
  useMarkRead,
  useMarkAllRead,
} from '@/features/notifications/hooks/useNotifications'
import { formatRelativeTime } from '@/lib/datetime'
import type { Notification } from '@life-os/shared'

type NotifTab = 'all' | 'unread'

const tabs: TabItem<NotifTab>[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
]

// Derive an icon/tone from the notification text — real notifications carry no
// icon field, so this keeps the prototype's coloured chips without faking data.
function iconFor(n: Notification): { icon: LucideIcon; tone: Tone } {
  const text = `${n.title} ${n.body}`.toLowerCase()
  if (text.includes('habit') || text.includes('streak'))
    return { icon: Flame, tone: 'amber' }
  if (text.includes('goal')) return { icon: Target, tone: 'emerald' }
  if (text.includes('budget') || text.includes('spent') || text.includes('finance'))
    return { icon: Wallet, tone: 'violet' }
  if (text.includes('review')) return { icon: BarChart3, tone: 'navy' }
  if (text.includes('task') || text.includes('due'))
    return { icon: CheckSquare, tone: 'navy' }
  if (text.includes('automation')) return { icon: Zap, tone: 'amberBright' }
  return { icon: Bell, tone: 'navy' }
}

export function NotificationsPage() {
  const { data, isLoading, isError, refetch } = useNotifications()
  const markRead = useMarkRead()
  const markAllRead = useMarkAllRead()
  const [tab, setTab] = useState<NotifTab>('all')

  const visible = useMemo(() => {
    const list = data ?? []
    return tab === 'all' ? list : list.filter((n) => !n.read)
  }, [data, tab])

  const hasUnread = (data ?? []).some((n) => !n.read)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Tabs
          items={tabs}
          value={tab}
          onChange={setTab}
          ariaLabel="Notification filters"
        />
        <Button
          variant="link"
          size="bare"
          onClick={() => markAllRead.mutate()}
          disabled={!hasUnread || markAllRead.isPending}
        >
          Mark all as read
        </Button>
      </div>

      {isLoading ? (
        <Card padding="none" className="px-5 py-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3.5 py-[15px]">
              <Skeleton className="size-[38px] rounded-[11px]" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-1.5 h-3 w-48" />
              </div>
            </div>
          ))}
        </Card>
      ) : isError ? (
        <Card padding="md">
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-sm font-medium text-accent-red">
              Couldn't load notifications.
            </p>
            <Button variant="surface" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : visible.length === 0 ? (
        <Card padding="md">
          <EmptyState
            icon={Bell}
            title={tab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            description="Reminders and updates from across Life OS will show up here."
          />
        </Card>
      ) : (
        <Card padding="none" className="px-5 py-2">
          {visible.map((n) => {
            const { icon: Icon, tone } = iconFor(n)
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => !n.read && markRead.mutate(n.id)}
                className="flex w-full items-center gap-3.5 border-b border-app-hairline py-[15px] text-left last:border-b-0 hover:bg-app-raised"
              >
                <span
                  className={cn(
                    'grid size-[38px] shrink-0 place-items-center rounded-[11px]',
                    toneChip[tone],
                  )}
                >
                  <Icon size={18} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold">{n.title}</div>
                  <div className="mt-0.5 text-[13px] font-medium text-app-ink-faint">
                    {n.body}
                  </div>
                </div>
                <span className="shrink-0 text-xs font-semibold text-app-ink-faint">
                  {formatRelativeTime(n.createdAt)}
                </span>
                {!n.read ? (
                  <span
                    aria-label="Unread"
                    className="size-2 shrink-0 rounded-full bg-amber-500"
                  />
                ) : null}
              </button>
            )
          })}
        </Card>
      )}
    </div>
  )
}
