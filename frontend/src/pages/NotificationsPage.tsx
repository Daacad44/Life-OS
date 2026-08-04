import { useMemo, useState } from 'react'
import { Bot, CheckSquare, Flame, Target, type LucideIcon } from 'lucide-react'
import { Button, Card, Tabs, type TabItem, type Tone } from '@/components/ui-kit'
import { cn } from '@/lib/utils'
import { toneChip } from '@/components/ui-kit'

type NotifTab = 'all' | 'unread' | 'important'

// MOCK — replace with useNotifications(); shape mirrors the prototype's sample data.
interface Notification {
  id: number
  title: string
  desc: string
  time: string
  unread: boolean
  important: boolean
  icon: LucideIcon
  tone: Tone
}
const initial: Notification[] = [
  {
    id: 1,
    title: 'Task Reminder',
    desc: 'Design review in 30 minutes',
    time: '5m ago',
    unread: true,
    important: true,
    icon: CheckSquare,
    tone: 'navy',
  },
  {
    id: 2,
    title: 'Goal Update',
    desc: "You're 75% towards your goal",
    time: '30m ago',
    unread: true,
    important: false,
    icon: Target,
    tone: 'emerald',
  },
  {
    id: 3,
    title: 'Habit Reminder',
    desc: 'Time for your evening workout',
    time: '2h ago',
    unread: false,
    important: false,
    icon: Flame,
    tone: 'amber',
  },
  {
    id: 4,
    title: 'AI Coach Tip',
    desc: "Don't forget to take breaks",
    time: '5h ago',
    unread: false,
    important: false,
    icon: Bot,
    tone: 'violet',
  },
]

const tabs: TabItem<NotifTab>[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'important', label: 'Important' },
]

export function NotificationsPage() {
  const [items, setItems] = useState(initial)
  const [tab, setTab] = useState<NotifTab>('all')

  const visible = useMemo(
    () =>
      items.filter((n) =>
        tab === 'all' ? true : tab === 'unread' ? n.unread : n.important,
      ),
    [items, tab],
  )

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Tabs
          items={tabs}
          value={tab}
          onChange={setTab}
          ariaLabel="Notification filters"
        />
        <Button variant="link" size="bare" onClick={markAllRead}>
          Mark all as read
        </Button>
      </div>

      <Card padding="none" className="px-5 py-2">
        {visible.map((n) => (
          <div
            key={n.id}
            className="flex items-center gap-3.5 border-b border-app-hairline py-[15px] last:border-b-0"
          >
            <span
              className={cn(
                'grid size-[38px] shrink-0 place-items-center rounded-[11px]',
                toneChip[n.tone],
              )}
            >
              <n.icon size={18} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold">{n.title}</div>
              <div className="mt-0.5 text-[13px] font-medium text-app-ink-faint">
                {n.desc}
              </div>
            </div>
            <span className="text-xs font-semibold text-app-ink-faint">{n.time}</span>
            {n.unread ? (
              <span aria-label="Unread" className="size-2 rounded-full bg-amber-500" />
            ) : null}
          </div>
        ))}
      </Card>
    </div>
  )
}
