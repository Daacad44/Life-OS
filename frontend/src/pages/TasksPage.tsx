import { useMemo, useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { Badge, Button, Card, CardTitle, Tabs, type TabItem } from '@/components/ui-kit'
import { cn } from '@/lib/utils'

type Priority = 'High' | 'Medium' | 'Low'
type TaskTab = 'today' | 'upcoming' | 'completed'

// MOCK — replace with useTasks(); shape mirrors the prototype's sample data.
interface Task {
  id: number
  title: string
  due: string
  done: boolean
  priority: Priority
}
const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Design new landing page',
    due: 'Today',
    done: false,
    priority: 'High',
  },
  {
    id: 2,
    title: 'Fix mobile navigation bug',
    due: 'Today',
    done: true,
    priority: 'High',
  },
  {
    id: 3,
    title: 'Work on project proposal',
    due: 'Tomorrow',
    done: false,
    priority: 'Medium',
  },
  {
    id: 4,
    title: 'Team stand-up meeting',
    due: 'Tomorrow',
    done: false,
    priority: 'Low',
  },
  { id: 5, title: 'Write blog post', due: 'Jun 2', done: false, priority: 'Medium' },
]

const priorityTone: Record<Priority, 'red' | 'amber' | 'navy'> = {
  High: 'red',
  Medium: 'amber',
  Low: 'navy',
}

const tabs: TabItem<TaskTab>[] = [
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
]

export function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks)
  const [tab, setTab] = useState<TaskTab>('today')
  const [activeId, setActiveId] = useState(1)

  const filtered = useMemo(
    () =>
      tasks.filter((t) =>
        tab === 'today' ? true : tab === 'upcoming' ? !t.done : t.done,
      ),
    [tasks, tab],
  )
  const active = tasks.find((t) => t.id === activeId) ?? tasks[0]

  function toggle(id: number) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Card padding="md">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Tabs items={tabs} value={tab} onChange={setTab} ariaLabel="Task filters" />
          <Button variant="navy" size="sm" className="gap-1.5">
            <Plus size={15} aria-hidden="true" />
            Add Task
          </Button>
        </div>

        <div className="flex flex-col">
          {filtered.map((t) => (
            <div
              key={t.id}
              className={cn(
                'flex items-center gap-3 rounded-[10px] border-b border-app-hairline px-2.5 py-3 last:border-b-0',
                activeId === t.id ? 'bg-app-raised' : 'bg-transparent',
              )}
            >
              <button
                type="button"
                onClick={() => toggle(t.id)}
                aria-label={
                  t.done ? `Mark ${t.title} incomplete` : `Mark ${t.title} done`
                }
                className={cn(
                  'grid size-[22px] shrink-0 place-items-center rounded-[7px] border-2',
                  t.done ? 'border-amber-500 bg-amber-500' : 'border-slate-300',
                )}
              >
                <Check
                  size={13}
                  className={cn('text-white', t.done ? 'opacity-100' : 'opacity-0')}
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                onClick={() => setActiveId(t.id)}
                className={cn(
                  'flex-1 text-left text-[14.5px] font-semibold',
                  t.done ? 'text-app-ink-faint line-through' : 'text-app-ink',
                )}
              >
                {t.title}
              </button>
              <span className="rounded-full bg-app-raised px-2.5 py-1 text-[11px] font-bold text-app-ink-faint">
                {t.due}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="md">
        <CardTitle className="mb-4">Task Details</CardTitle>
        <div className="text-[17px] font-extrabold">{active.title}</div>

        <div className="mt-[18px] flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-app-ink-muted">Priority</span>
            <Badge tone={priorityTone[active.priority]}>{active.priority}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-app-ink-muted">Due Date</span>
            <span className="text-[13.5px] font-bold">
              {active.due === 'Today' ? 'Today, May 19' : active.due}
            </span>
          </div>
          <div>
            <span className="text-[13px] font-semibold text-app-ink-muted">Tags</span>
            <div className="mt-2 flex gap-1.5">
              <Badge tone="amber">Design</Badge>
              <Badge tone="navy">Web</Badge>
            </div>
          </div>
        </div>

        <div className="mt-[22px]">
          <div className="mb-2.5 text-sm font-bold">Subtasks</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5 text-sm font-medium">
              <span className="grid size-[18px] place-items-center rounded-md bg-amber-500">
                <Check size={12} className="text-white" aria-hidden="true" />
              </span>
              Create wireframe
            </div>
            <div className="flex items-center gap-2.5 text-sm font-medium text-app-ink-soft">
              <span className="size-[18px] rounded-md border-2 border-slate-300" />
              Design UI
            </div>
            <div className="flex items-center gap-2.5 text-sm font-medium text-app-ink-soft">
              <span className="size-[18px] rounded-md border-2 border-slate-300" />
              Get feedback
            </div>
          </div>
          <Button variant="link" size="bare" className="mt-3.5 gap-1.5">
            <Plus size={15} aria-hidden="true" />
            Add subtask
          </Button>
        </div>
      </Card>
    </div>
  )
}
