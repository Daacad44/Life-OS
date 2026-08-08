import { useMemo, useState, type FormEvent } from 'react'
import { Plus, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Button,
  Card,
  EmptyState,
  Input,
  ProgressBar,
  Skeleton,
  Tabs,
  type TabItem,
  toneChip,
  type Tone,
} from '@/components/ui-kit'
import { cn } from '@/lib/utils'
import { GuardedModal } from '@/components/form/GuardedModal'
import { DateTimeField } from '@/components/form/DateTimeField'
import {
  ReminderField,
  resolveReminder,
} from '@/features/reminders/components/ReminderField'
import { useCreateReminder } from '@/features/reminders/hooks/useReminders'
import { useUserTimezone } from '@/features/auth/hooks/useTimezone'
import { useGoals, useCreateGoal } from '@/features/goals/hooks/useGoals'
import { formatDate } from '@/lib/datetime'

type GoalTab = 'all' | 'active' | 'completed'

// Real goals carry no icon/colour; assign a stable tone per goal so the row
// keeps the prototype's colour variety without inventing data.
const tones: Tone[] = ['amber', 'navy', 'emerald', 'violet']

const tabs: TabItem<GoalTab>[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
]

export function GoalsPage() {
  const timezone = useUserTimezone()
  const { data: goals, isLoading, isError, refetch } = useGoals()
  const createGoal = useCreateGoal()
  const createReminder = useCreateReminder()

  const [tab, setTab] = useState<GoalTab>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState<string | null>(null)
  const [targetDate, setTargetDate] = useState<string | null>(null)
  const [reminderPreset, setReminderPreset] = useState('none')
  const [reminderCustom, setReminderCustom] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  const visible = useMemo(() => {
    const list = goals ?? []
    return list.filter((g) =>
      tab === 'all' ? true : tab === 'active' ? g.progress < 100 : g.progress >= 100,
    )
  }, [goals, tab])

  function openCreate() {
    setTitle('')
    setDescription('')
    setStartDate(null)
    setTargetDate(null)
    setReminderPreset('none')
    setReminderCustom(null)
    setTouched(false)
    setModalOpen(true)
  }

  function submit(e?: FormEvent) {
    e?.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    createGoal.mutate(
      {
        title: trimmed,
        description: description.trim() || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        targetDate: targetDate ? new Date(targetDate) : undefined,
      },
      {
        onSuccess: (goal) => {
          const reminder = resolveReminder(reminderPreset, targetDate, reminderCustom)
          if (reminder) {
            createReminder.mutate({
              entityType: 'goal',
              entityId: goal.id,
              remindAt: new Date(reminder.remindAt),
              offsetLabel: reminder.offsetLabel,
              message: `The time for "${trimmed}" is up — let's complete it.`,
            })
          }
          setModalOpen(false)
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="mb-1 flex items-center justify-between gap-3">
        <Tabs items={tabs} value={tab} onChange={setTab} ariaLabel="Goal filters" />
        <Button variant="navy" size="sm" className="gap-1.5" onClick={openCreate}>
          <Plus size={15} aria-hidden="true" />
          New Goal
        </Button>
      </div>

      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} padding="md" className="flex items-center gap-[18px]">
            <Skeleton className="size-[46px] shrink-0 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="mt-2 h-3 w-28" />
              <Skeleton className="mt-3 h-2 w-full" />
            </div>
          </Card>
        ))
      ) : isError ? (
        <Card padding="md">
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-sm font-medium text-accent-red">Couldn't load goals.</p>
            <Button variant="surface" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Card>
      ) : visible.length === 0 ? (
        <Card padding="md">
          <EmptyState
            icon={Target}
            title={tab === 'completed' ? 'No completed goals yet' : 'No goals yet'}
            description={
              tab === 'completed'
                ? 'Goals you finish will appear here.'
                : 'What are you working toward? Set your first goal.'
            }
            action={
              <Button variant="navy" size="sm" className="gap-1.5" onClick={openCreate}>
                <Plus size={15} aria-hidden="true" />
                New Goal
              </Button>
            }
          />
        </Card>
      ) : (
        visible.map((g, i) => {
          const tone = tones[i % tones.length]
          return (
            <Link key={g.id} to={`/goals/${g.id}`} className="block">
              <Card
                padding="md"
                className="flex items-center gap-[18px] hover:bg-app-raised"
              >
                <div
                  className={cn(
                    'grid size-[46px] shrink-0 place-items-center rounded-xl',
                    toneChip[tone],
                  )}
                >
                  <Target size={22} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-[15.5px] font-extrabold">
                      {g.title}
                    </span>
                    <span className="ml-3 shrink-0 text-sm font-extrabold tabular-nums">
                      {Math.round(g.progress)}%
                    </span>
                  </div>
                  <div className="mt-[3px] mb-2.5 text-[12.5px] font-semibold text-app-ink-faint">
                    {g.targetDate
                      ? `Target: ${formatDate(g.targetDate, timezone)}`
                      : 'No target date'}
                  </div>
                  <ProgressBar value={g.progress} tone={tone} label={g.title} />
                </div>
              </Card>
            </Link>
          )
        })
      )}

      <GuardedModal
        open={modalOpen}
        onDiscard={() => setModalOpen(false)}
        onSave={submit}
        dirty={touched}
        title="New goal"
        footer={({ requestClose }) => (
          <>
            <Button variant="surface" size="sm" onClick={requestClose}>
              Cancel
            </Button>
            <Button
              variant="navy"
              size="sm"
              onClick={() => submit()}
              disabled={!title.trim() || createGoal.isPending}
            >
              Create goal
            </Button>
          </>
        )}
      >
        <form
          id="goal-form"
          onSubmit={submit}
          onChange={() => setTouched(true)}
          className="flex flex-col gap-4"
        >
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you working toward?"
            autoFocus
            required
          />
          <div className="flex flex-col gap-[7px]">
            <label
              htmlFor="goal-description"
              className="text-[13px] font-semibold text-app-ink-soft"
            >
              Description
            </label>
            <textarea
              id="goal-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why does this matter? (optional)"
              rows={3}
              className="w-full rounded-[11px] border border-app-hairline bg-app-canvas px-3.5 py-[13px] font-display text-base text-app-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <DateTimeField
              label="Start date"
              value={startDate}
              onChange={(v) => {
                setStartDate(v)
                setTouched(true)
              }}
              timezone={timezone}
              mode="date"
            />
            <DateTimeField
              label="Deadline"
              value={targetDate}
              onChange={(v) => {
                setTargetDate(v)
                setTouched(true)
              }}
              timezone={timezone}
              mode="datetime"
            />
          </div>
          <ReminderField
            label="Deadline reminder"
            baseTime={targetDate}
            presetKey={reminderPreset}
            onPresetChange={(k) => {
              setReminderPreset(k)
              setTouched(true)
            }}
            customAt={reminderCustom}
            onCustomChange={setReminderCustom}
            timezone={timezone}
          />
        </form>
      </GuardedModal>
    </div>
  )
}
