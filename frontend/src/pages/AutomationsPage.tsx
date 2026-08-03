import { useState, type FormEvent } from 'react'
import { Plus, Trash2, Zap } from 'lucide-react'
import type { AutomationAction, AutomationTrigger } from '@life-os/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useHabits } from '@/features/habits/hooks/useHabits'
import { useGoals } from '@/features/goals/hooks/useGoals'
import {
  useAutomations,
  useCreateAutomation,
  useDeleteAutomation,
  useUpdateAutomation,
} from '@/features/automations/hooks/useAutomations'

const selectClass =
  'flex h-10 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'

const TRIGGER_LABEL: Record<AutomationTrigger, string> = {
  habit_checkin: 'When I check in a habit',
  goal_progress: 'When a goal reaches a progress %',
  weekly: 'Every week (not yet active — no scheduler)',
}

const ACTION_LABEL: Record<AutomationAction, string> = {
  create_task: 'Create a task',
  notify: 'Send me a notification',
}

export function AutomationsPage() {
  const { data: automations, isLoading, isError, refetch } = useAutomations()
  const { data: habits } = useHabits()
  const { data: goals } = useGoals()
  const createAutomation = useCreateAutomation()
  const updateAutomation = useUpdateAutomation()
  const deleteAutomation = useDeleteAutomation()

  const [name, setName] = useState('')
  const [trigger, setTrigger] = useState<AutomationTrigger>('habit_checkin')
  const [habitId, setHabitId] = useState('')
  const [goalId, setGoalId] = useState('')
  const [threshold, setThreshold] = useState('100')
  const [action, setAction] = useState<AutomationAction>('create_task')
  const [taskTitle, setTaskTitle] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    const triggerConfig =
      trigger === 'habit_checkin'
        ? { habitId }
        : trigger === 'goal_progress'
          ? { goalId, threshold: Number(threshold) }
          : {}
    const actionConfig = action === 'create_task' ? { title: taskTitle } : { message }

    createAutomation.mutate(
      { name: name.trim(), trigger, triggerConfig, action, actionConfig },
      {
        onSuccess: () => {
          setName('')
          setTaskTitle('')
          setMessage('')
        },
      },
    )
  }

  const canSubmit =
    name.trim() &&
    (trigger !== 'habit_checkin' || habitId) &&
    (trigger !== 'goal_progress' || goalId) &&
    (action !== 'create_task' || taskTitle.trim()) &&
    (action !== 'notify' || message.trim())

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Automations</h1>
        <p className="text-text-muted">
          If this, then that — for the things you do by hand.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-md border border-border p-4"
      >
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Automation name"
        />

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-text-muted">When</span>
          <select
            value={trigger}
            onChange={(e) => setTrigger(e.target.value as AutomationTrigger)}
            className={selectClass}
          >
            {(['habit_checkin', 'goal_progress', 'weekly'] as const).map((t) => (
              <option key={t} value={t}>
                {TRIGGER_LABEL[t]}
              </option>
            ))}
          </select>
          {trigger === 'habit_checkin' && (
            <select
              value={habitId}
              onChange={(e) => setHabitId(e.target.value)}
              className={selectClass}
            >
              <option value="">Select a habit...</option>
              {habits?.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.title}
                </option>
              ))}
            </select>
          )}
          {trigger === 'goal_progress' && (
            <>
              <select
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
                className={selectClass}
              >
                <option value="">Select a goal...</option>
                {goals?.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                min="1"
                max="100"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-24"
                aria-label="Threshold %"
              />
              <span className="text-sm text-text-muted">%</span>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-text-muted">Then</span>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as AutomationAction)}
            className={selectClass}
          >
            {(['create_task', 'notify'] as const).map((a) => (
              <option key={a} value={a}>
                {ACTION_LABEL[a]}
              </option>
            ))}
          </select>
          {action === 'create_task' && (
            <Input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task title"
              className="flex-1"
            />
          )}
          {action === 'notify' && (
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Notification message"
              className="flex-1"
            />
          )}
        </div>

        <Button
          type="submit"
          disabled={!canSubmit || createAutomation.isPending}
          className="w-fit"
        >
          <Plus className="size-4" />
          Create automation
        </Button>
      </form>

      {isLoading && <div className="h-24 animate-pulse rounded-md bg-primary-muted" />}
      {isError && (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <p className="text-sm text-danger">Couldn&apos;t load your automations.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}
      {!isLoading && !isError && automations?.length === 0 && (
        <p className="text-sm text-text-muted">No automations yet — create one above.</p>
      )}

      <div className="flex flex-col gap-2">
        {automations?.map((a) => (
          <Card key={a.id}>
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-primary" />
                  <span className="font-medium text-text">{a.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-text-muted">
                    <input
                      type="checkbox"
                      className="size-4"
                      checked={a.enabled}
                      onChange={(e) =>
                        updateAutomation.mutate({
                          id: a.id,
                          input: { enabled: e.target.checked },
                        })
                      }
                    />
                    Enabled
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete automation"
                    onClick={() => deleteAutomation.mutate(a.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-text-muted">
                {TRIGGER_LABEL[a.trigger]} → {ACTION_LABEL[a.action]}
                {a.lastRunAt && ` · last ran ${new Date(a.lastRunAt).toLocaleString()}`}
              </p>
              {a.runs.length > 0 && (
                <div className="flex flex-col gap-1 border-t border-border pt-2">
                  {a.runs.slice(0, 3).map((run) => (
                    <div
                      key={run.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className={run.success ? 'text-success' : 'text-danger'}>
                        {run.success
                          ? 'Ran successfully'
                          : `Failed${run.note ? `: ${run.note}` : ''}`}
                      </span>
                      <span className="text-text-muted">
                        {new Date(run.ranAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
