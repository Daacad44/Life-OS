import { useMemo, useState, type FormEvent } from 'react'
import { Check, Flame, Plus, Repeat, Trash2 } from 'lucide-react'
import {
  Button,
  Card,
  EmptyState,
  Input,
  Modal,
  Skeleton,
  Tabs,
  type TabItem,
} from '@/components/ui-kit'
import { cn } from '@/lib/utils'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import {
  useHabits,
  useCreateHabit,
  useDeleteHabit,
  useCheckin,
} from '@/features/habits/hooks/useHabits'
import { dayKeyInTz } from '@/lib/datetime'
import { HabitFrequency, type Habit } from '@life-os/shared'

type HabitTab = 'all' | 'daily' | 'weekly'

const tabs: TabItem<HabitTab>[] = [
  { key: 'all', label: 'All' },
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
]

export function HabitsPage() {
  const timezone = useUserTimezone()
  const { data: habits, isLoading, isError, refetch } = useHabits()
  const createHabit = useCreateHabit()
  const deleteHabit = useDeleteHabit()
  const checkin = useCheckin()

  const [tab, setTab] = useState<HabitTab>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [frequency, setFrequency] = useState<(typeof HabitFrequency)[number]>('DAILY')

  const todayKey = dayKeyInTz(new Date(), timezone)

  const visible = useMemo(() => {
    const list = habits ?? []
    return list.filter((h) =>
      tab === 'all'
        ? true
        : tab === 'daily'
          ? h.frequency === 'DAILY'
          : h.frequency === 'WEEKLY',
    )
  }, [habits, tab])

  function doneToday(h: Habit) {
    return h.checkins.some((c) => c.done && dayKeyInTz(c.date, timezone) === todayKey)
  }

  function openCreate() {
    setTitle('')
    setFrequency('DAILY')
    setModalOpen(true)
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    createHabit.mutate(
      { title: trimmed, frequency },
      { onSuccess: () => setModalOpen(false) },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Tabs items={tabs} value={tab} onChange={setTab} ariaLabel="Habit filters" />
        <Button variant="navy" size="sm" className="gap-1.5" onClick={openCreate}>
          <Plus size={15} aria-hidden="true" />
          Add Habit
        </Button>
      </div>

      {isLoading ? (
        <Card padding="none" className="px-5 py-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3.5 py-[15px]">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="size-[34px] rounded-[10px]" />
            </div>
          ))}
        </Card>
      ) : isError ? (
        <Card padding="md">
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-sm font-medium text-accent-red">Couldn't load habits.</p>
            <Button variant="surface" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : visible.length === 0 ? (
        <Card padding="md">
          <EmptyState
            icon={Repeat}
            title="No habits yet"
            description="Build momentum — add a habit and check in each day."
            action={
              <Button variant="navy" size="sm" className="gap-1.5" onClick={openCreate}>
                <Plus size={15} aria-hidden="true" />
                Add Habit
              </Button>
            }
          />
        </Card>
      ) : (
        <Card padding="none" className="px-5 py-2">
          {visible.map((h) => {
            const done = doneToday(h)
            return (
              <div
                key={h.id}
                className="group flex items-center gap-3.5 border-b border-app-hairline py-[15px] last:border-b-0"
              >
                <span className="flex-1 text-[15px] font-bold">{h.title}</span>
                <button
                  type="button"
                  aria-label={`Delete ${h.title}`}
                  onClick={() => deleteHabit.mutate(h.id)}
                  className="text-app-ink-faint opacity-0 transition-opacity hover:text-accent-red group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
                <span className="flex items-center gap-1.5 text-sm font-extrabold tabular-nums text-amber-600">
                  <Flame size={17} className="text-amber-500" aria-hidden="true" />
                  {h.streak} {h.streak === 1 ? 'day' : 'days'}
                </span>
                <button
                  type="button"
                  onClick={() => checkin.mutate(h.id)}
                  disabled={done || checkin.isPending}
                  aria-label={done ? `${h.title} done today` : `Check in ${h.title}`}
                  className={cn(
                    'grid size-[34px] place-items-center rounded-[10px] border-2 pointer-coarse:size-11',
                    done
                      ? 'border-amber-500 bg-amber-500'
                      : 'border-slate-300 hover:border-amber-500',
                  )}
                >
                  <Check
                    size={17}
                    className={done ? 'text-white' : 'text-slate-300'}
                    aria-hidden="true"
                  />
                </button>
              </div>
            )
          })}
        </Card>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New habit"
        footer={
          <>
            <Button variant="surface" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="navy"
              size="sm"
              type="submit"
              form="habit-form"
              disabled={!title.trim() || createHabit.isPending}
            >
              Add habit
            </Button>
          </>
        }
      >
        <form id="habit-form" onSubmit={submit} className="flex flex-col gap-4">
          <Input
            label="Habit"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Morning meditation"
            autoFocus
            required
          />
          <div className="flex flex-col gap-[7px]">
            <label
              htmlFor="habit-frequency"
              className="text-[13px] font-semibold text-app-ink-soft"
            >
              Frequency
            </label>
            <select
              id="habit-frequency"
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value as (typeof HabitFrequency)[number])
              }
              className="w-full rounded-[11px] border border-app-hairline bg-app-canvas px-3.5 py-[13px] font-display text-base text-app-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              {HabitFrequency.map((f) => (
                <option key={f} value={f}>
                  {f.charAt(0) + f.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  )
}
