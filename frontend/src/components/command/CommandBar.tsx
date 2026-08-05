import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  BarChart3,
  Bell,
  Bot,
  Calendar,
  CalendarPlus,
  CheckSquare,
  CornerDownLeft,
  FilePlus2,
  LayoutDashboard,
  NotebookText,
  Repeat,
  Search,
  Settings,
  Target,
  Timer,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import { useCreateTask } from '@/features/tasks/hooks/useTasks'
import { useCreateNote } from '@/features/notes/hooks/useNotes'
import { useCreateHabit } from '@/features/habits/hooks/useHabits'
import { useCreateEvent } from '@/features/calendar/hooks/useCalendar'
import { parseQuickAdd } from '@/lib/quickAdd'
import { formatDueLabel } from '@/lib/datetime'

interface NavTarget {
  label: string
  to: string
  icon: LucideIcon
}

const NAV: NavTarget[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Tasks', to: '/tasks', icon: CheckSquare },
  { label: 'Goals', to: '/goals', icon: Target },
  { label: 'Calendar', to: '/calendar', icon: Calendar },
  { label: 'Habits', to: '/habits', icon: Repeat },
  { label: 'Notes', to: '/notes', icon: NotebookText },
  { label: 'Focus Mode', to: '/focus', icon: Timer },
  { label: 'AI Coach', to: '/coach', icon: Bot },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
  { label: 'Finance', to: '/finance', icon: Wallet },
  { label: 'Notifications', to: '/notifications', icon: Bell },
  { label: 'Settings', to: '/settings', icon: Settings },
]

interface Command {
  id: string
  label: string
  hint?: string
  icon: LucideIcon
  group: 'Create' | 'Go to'
  run: () => void
}

export function CommandBar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const timezone = useUserTimezone()
  const createTask = useCreateTask({})
  const createNote = useCreateNote()
  const createHabit = useCreateHabit()
  const createEvent = useCreateEvent()

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      // Focus after the portal mounts.
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  const trimmed = query.trim()
  const parsed = useMemo(() => parseQuickAdd(query, timezone), [query, timezone])

  const commands = useMemo<Command[]>(() => {
    const list: Command[] = []

    if (trimmed) {
      const dueHint = parsed.dueDate
        ? formatDueLabel(parsed.dueDate, timezone)
        : undefined
      list.push({
        id: 'create-task',
        label: `Add task: ${parsed.title}`,
        hint: dueHint,
        icon: CheckSquare,
        group: 'Create',
        run: () => {
          createTask.mutate({
            title: parsed.title,
            status: 'TODO',
            priority: 'MEDIUM',
            dueDate: parsed.dueDate ? new Date(parsed.dueDate) : undefined,
          })
          navigate('/tasks')
          onClose()
        },
      })
      list.push({
        id: 'create-note',
        label: `New note: ${trimmed}`,
        icon: FilePlus2,
        group: 'Create',
        run: () => {
          createNote.mutate({ title: trimmed, content: trimmed, tags: [] })
          navigate('/notes')
          onClose()
        },
      })
      list.push({
        id: 'create-event',
        label: `New event: ${parsed.title}`,
        hint: parsed.dueDate ? formatDueLabel(parsed.dueDate, timezone) : 'today',
        icon: CalendarPlus,
        group: 'Create',
        run: () => {
          const start = parsed.dueDate ? new Date(parsed.dueDate) : new Date()
          const end = new Date(start.getTime() + 60 * 60 * 1000)
          createEvent.mutate({
            title: parsed.title,
            startTime: start,
            endTime: end,
            allDay: !parsed.hasTime && !parsed.dueDate ? false : !parsed.hasTime,
          })
          navigate('/calendar')
          onClose()
        },
      })
      list.push({
        id: 'create-habit',
        label: `New habit: ${trimmed}`,
        icon: Repeat,
        group: 'Create',
        run: () => {
          createHabit.mutate({ title: trimmed, frequency: 'DAILY' })
          navigate('/habits')
          onClose()
        },
      })
    }

    const q = trimmed.toLowerCase()
    const nav = NAV.filter((n) => !q || n.label.toLowerCase().includes(q))
    for (const n of nav) {
      list.push({
        id: `nav-${n.to}`,
        label: n.label,
        icon: n.icon,
        group: 'Go to',
        run: () => {
          navigate(n.to)
          onClose()
        },
      })
    }
    return list
  }, [
    trimmed,
    parsed,
    timezone,
    createTask,
    createNote,
    createEvent,
    createHabit,
    navigate,
    onClose,
  ])

  useEffect(() => {
    setSelected((s) => Math.min(s, Math.max(0, commands.length - 1)))
  }, [commands.length])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => (s + 1) % Math.max(1, commands.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => (s - 1 + commands.length) % Math.max(1, commands.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      commands[selected]?.run()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${selected}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  if (!open) return null

  let lastGroup = ''

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]">
      <div
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command bar"
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-app-hairline bg-app-surface font-display shadow-[0_30px_60px_-20px_rgba(0,0,0,0.4)]"
      >
        <div className="flex items-center gap-3 border-b border-app-hairline px-4">
          <Search size={18} className="text-app-ink-faint" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a task, note, event… or jump to a screen"
            aria-label="Command bar input"
            className="flex-1 bg-transparent py-4 text-base text-app-ink outline-none placeholder:text-app-ink-faint"
          />
          <kbd className="hidden rounded-md border border-app-hairline bg-app-raised px-1.5 py-0.5 text-[11px] font-semibold text-app-ink-faint sm:block">
            Esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {commands.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm font-medium text-app-ink-muted">
              No matches.
            </div>
          ) : (
            commands.map((c, i) => {
              const showGroup = c.group !== lastGroup
              lastGroup = c.group
              return (
                <div key={c.id}>
                  {showGroup ? (
                    <div className="px-3 pt-3 pb-1 text-[11px] font-bold tracking-[0.06em] text-app-ink-faint uppercase">
                      {c.group}
                    </div>
                  ) : null}
                  <button
                    type="button"
                    data-index={i}
                    onMouseMove={() => setSelected(i)}
                    onClick={() => c.run()}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left',
                      i === selected
                        ? 'bg-amber-100 text-amber-700'
                        : 'text-app-ink-soft',
                    )}
                  >
                    <c.icon size={17} aria-hidden="true" />
                    <span className="flex-1 truncate text-sm font-semibold">
                      {c.label}
                    </span>
                    {c.hint ? (
                      <span className="shrink-0 text-[11px] font-bold text-app-ink-faint">
                        {c.hint}
                      </span>
                    ) : null}
                    {i === selected ? (
                      <CornerDownLeft size={14} className="shrink-0" aria-hidden="true" />
                    ) : null}
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
